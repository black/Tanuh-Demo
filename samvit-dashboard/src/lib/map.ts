/*
 * The Health Check map's levels, as GeoJSON for ECharts:
 *   India     the states, from india-states.json (optional)
 *   State     the state's districts, from map.json's inset (optional)
 *   District  the tenant's taluks, from map.json
 *   Taluk     the taluk's villages, from map.json
 * The tenant's state is the one holding its taluks, and its district the one map.json marks
 * as holding the villages.
 */
import type { MapDoc, Rings, StatesDoc } from "./types";

type Feature = { type: "Feature"; properties: { name: string }; geometry: { type: "MultiPolygon"; coordinates: [number, number][][][] } };

export interface Region {
  /** The region's id; also its feature name in the layer's GeoJSON. */
  id: string;
  name: string;
  rings: Rings;
  /** Where its marker, label or keyboard button goes. */
  center: [number, number];
}

export interface Layer {
  regions: Region[];
  geo: { type: "FeatureCollection"; features: Feature[] };
  /** East-west over north-south scale (the cosine of the middle latitude), so that distances
   *  east-west and north-south match. */
  aspect: number;
  /** Width over height of the drawn layer, after `aspect`. */
  ratio: number;
}

export interface MapVillage extends Region {
  /** The village id and its aliases: dashboard.json's records match any of them. */
  ids: string[];
  taluk_id: string | null;
}

export interface MapShapes {
  states: Layer | null;
  /** The id of the state holding the tenant's taluks. */
  state: string | null;
  districts: Layer | null;
  /** The id of the district holding the tenant's villages. */
  district: string | null;
  taluks: Layer;
  villages: MapVillage[];
  /** Credits for the outlines drawn at the state and India levels. */
  licence: { text: string; url: string | null } | null;
  statesLicence: { text: string; url: string | null } | null;
}

/** "Karnātaka" → "Karnataka". */
const plain = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "");

const ringArea = (r: [number, number][]) =>
  r.reduce((s, [x, y], i) => { const [x2, y2] = r[(i + 1) % r.length]; return s + x * y2 - x2 * y; }, 0) / 2;

/** The centroid of the largest ring. */
function centerOf(rings: Rings): [number, number] {
  const r = rings.reduce((a, b) => (Math.abs(ringArea(b)) > Math.abs(ringArea(a)) ? b : a), rings[0]);
  const A = ringArea(r);
  if (!A) return r[0];
  let cx = 0, cy = 0;
  r.forEach(([x, y], i) => {
    const [x2, y2] = r[(i + 1) % r.length];
    const f = x * y2 - x2 * y;
    cx += (x + x2) * f;
    cy += (y + y2) * f;
  });
  return [cx / (6 * A), cy / (6 * A)];
}

function inside([px, py]: [number, number], rings: Rings) {
  let hit = false;
  rings.forEach((r) => {
    for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
      const [xi, yi] = r[i], [xj, yj] = r[j];
      if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) hit = !hit;
    }
  });
  return hit;
}

/** A level's GeoJSON and proportions. */
export function layerOf(regions: Region[]): Layer {
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  regions.forEach((g) => g.rings.forEach((r) => r.forEach(([x, y]) => {
    x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y);
  })));
  const aspect = isFinite(y0) ? Math.cos((((y0 + y1) / 2) * Math.PI) / 180) : 1;
  return {
    regions,
    geo: {
      type: "FeatureCollection",
      features: regions.map((g) => ({ type: "Feature", properties: { name: g.id }, geometry: { type: "MultiPolygon", coordinates: g.rings.map((r) => [r]) } })),
    },
    aspect,
    ratio: isFinite(x0) && y1 > y0 ? ((x1 - x0) * aspect) / (y1 - y0) : 1,
  };
}

const credit = (text: string | null | undefined, url: string | null | undefined) =>
  text ? { text, url: /^https?:\/\//.test(url ?? "") ? url! : null } : null;

export function buildMapShapes(doc: MapDoc, statesDoc: StatesDoc | null): MapShapes {
  const taluks = layerOf(doc.taluks.map((t) => ({ id: t.unit_id, name: t.name || t.unit_id, rings: t.rings, center: Array.isArray(t.label) ? t.label : centerOf(t.rings) })));
  const anchor = taluks.regions[0]?.center ?? null;

  const inset = doc.inset;
  const districts = inset?.districts.length ? layerOf(inset.districts.map((d) => ({ id: d.name, name: d.name, rings: d.rings, center: centerOf(d.rings) }))) : null;
  const district = inset?.districts.find((d) => d.holds_villages)?.name ?? null;

  const states = statesDoc?.states.length ? layerOf(statesDoc.states.map((s) => ({ id: s.name, name: plain(s.name), rings: s.rings, center: centerOf(s.rings) }))) : null;
  const state = states && anchor ? states.regions.find((s) => inside(anchor, s.rings))?.id ?? null : null;

  return {
    states,
    state,
    districts,
    district,
    taluks,
    villages: (doc.villages ?? []).map((v) => ({
      id: v.village_id,
      name: v.name || v.village_id,
      rings: v.rings,
      center: centerOf(v.rings),
      ids: [v.village_id, ...(v.aliases ?? [])],
      taluk_id: v.taluk_id,
    })),
    licence: credit(inset?.licence, inset?.licence_url),
    statesLicence: credit(statesDoc?.licence, statesDoc?.licence_url),
  };
}
