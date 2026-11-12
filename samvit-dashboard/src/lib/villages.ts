/*
 * Village record counts for the map's taluk level (DASHBOARD.md, "Map"): each village is
 * shaded by the records filed in it in the selected period, of every record type, in four
 * shades from few to many. The shades are fixed from the largest village count of any period
 * of the same kind (week or month) in the file, so a shade means the same counts in every
 * period. A village with no records in the period is left unshaded. The shading is a count,
 * never a score.
 */
import type { Model } from "./model";
import type { MapVillage } from "./map";
import type { Village } from "./types";

export interface VillageCount {
  records: number;
  /** Worker keys, as dashboard.json gives them. */
  workers: string[];
}

/** The week starting `start` counts in period k: that week, or the month its Thursday falls in. */
function inPeriod(m: Model, k: number, start: string) {
  const p = m.weeks[k];
  if (m.period === "week") return start === p.start;
  const d = new Date(`${start}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 3);
  const thu = d.toISOString().slice(0, 10);
  return thu >= p.start && thu <= p.end;
}

function count(m: Model, k: number, v: Village): VillageCount {
  const weeks = v.weeks.filter((w) => inPeriod(m, k, w.start));
  return { records: weeks.reduce((s, w) => s + w.n_records, 0), workers: [...new Set(weeks.flatMap((w) => w.workers))] };
}

/** Each dashboard village's count in period k, by village id. */
export function villageCounts(m: Model, k: number) {
  return new Map(m.villages.map((v) => [v.village_id, count(m, k, v)]));
}

/** A map village's count: the records filed under its id or any of its aliases. */
export function mapVillageCount(counts: Map<string, VillageCount>, v: MapVillage): VillageCount {
  const hits = v.ids.map((id) => counts.get(id)).filter((x): x is VillageCount => !!x);
  return { records: hits.reduce((s, c) => s + c.records, 0), workers: [...new Set(hits.flatMap((c) => c.workers))] };
}

/** The largest village count of any period of the model's kind, for the shade scale. */
export function largestCount(m: Model) {
  let max = 0;
  m.weeks.forEach((_, k) => m.villages.forEach((v) => (max = Math.max(max, count(m, k, v).records))));
  return max;
}

/** The shade, 0 to 3, of a count on a scale up to `max`; null for no records. */
export const shadeOf = (records: number, max: number) => (records <= 0 || max <= 0 ? null : Math.min(3, Math.ceil((records / max) * 4) - 1));

/** The record range each shade covers, for the legend: "1–9". */
export function shadeRanges(max: number) {
  return [0, 1, 2, 3].map((s) => {
    const lo = Math.floor((s * max) / 4) + 1;
    const hi = Math.floor(((s + 1) * max) / 4);
    return lo >= hi ? `${hi}` : `${lo}–${hi}`;
  });
}

/** Records in the taluk's dashboard villages that no map village outline matches. */
export function unmatchedRecords(m: Model, counts: Map<string, VillageCount>, mapVillages: MapVillage[], talukId: string) {
  const known = new Set(mapVillages.flatMap((v) => v.ids));
  return m.villages.filter((v) => v.taluk_id === talukId && !known.has(v.village_id)).reduce((s, v) => s + (counts.get(v.village_id)?.records ?? 0), 0);
}
