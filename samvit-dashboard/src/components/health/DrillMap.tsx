"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { init, registerMap, use, type ComposeOption, type ECharts } from "echarts/core";
import { ScatterChart, type ScatterSeriesOption } from "echarts/charts";
import { AriaComponent, GeoComponent, type AriaComponentOption, type GeoComponentOption } from "echarts/components";
import { SVGRenderer } from "echarts/renderers";
import { int } from "@/lib/format";
import { layerOf, type Layer, type MapShapes, type MapVillage } from "@/lib/map";
import { talukBand, type Model } from "@/lib/model";
import { bg, border, fg } from "@/lib/tokens";
import { largestCount, mapVillageCount, shadeOf, villageCounts, type VillageCount } from "@/lib/villages";
import { Button } from "@/components/shadcn/button";
import { Card } from "@/components/shadcn/card";
import { ROUTES } from "@/components/layout/routes";
import { MapTooltip } from "./MapTooltip";

/*
 * The Health Check map, drawn with Apache ECharts (SVG), from India down to a taluk's
 * villages. Every level can be zoomed and panned; pointing at a place names it, and selecting
 * a highlighted place goes down a level (the breadcrumb above goes back up).
 *   india     the states; the tenant's state is bg/brand/subtle-hover and selectable
 *   state     its districts; the district holding the villages is selectable
 *   district  the taluks, each with a marker coloured by its TrustIndex band (bg/brand/default
 *             High, bg/danger/default Low, a border/base/strong ring Mid, dashed with no score);
 *             pointing at one lists its workers, selecting it shows its villages
 *   taluk     the villages, shaded by the records filed in them in the period (lib/villages.ts);
 *             pointing at one shows its records and workers, selecting it pins that
 */
use([ScatterChart, GeoComponent, AriaComponent, SVGRenderer]);

export type MapLevel = "india" | "state" | "district" | "taluk";

type Option = ComposeOption<ScatterSeriesOption | GeoComponentOption | AriaComponentOption>;
type Tip = { kind: "region" | "taluk" | "village"; id: string; x: number; y: number };

const R = 10; // taluk marker radius, px
const TIP_W = 226; // w-tooltip
const ring = { color: bg["surface-default"], borderColor: border["base-strong"], borderWidth: 2 };
const MARKER: Record<string, object> = {
  high: { color: bg["brand-default"] },
  low: { color: bg["danger-default"] },
  mid: ring,
  ins: { ...ring, borderType: [3, 3] },
  none: { ...ring, borderType: [3, 3] },
};
/** Village shades from few records to many. */
export const SHADES = [bg["brand-subtle"], bg["brand-subtle-hover"], bg["brand-default"], fg["brand-pressed"]];

const PAD_X = 48, PAD_Y = 64; // room for markers and names around the map

/** The map's longer side, in px, so that it fits a w × h box at its own proportions. */
function fitSize(ratio: number, w: number, h: number) {
  const width = Math.min(w - PAD_X, (h - PAD_Y) * ratio);
  return Math.max(0, ratio >= 1 ? width : width / ratio);
}

const ACTION: Record<MapLevel, string> = { india: "see its districts", state: "see its taluks", district: "see its villages", taluk: "" };

export function DrillMap({ m, k, shapes, level, talukId, onDrill }: { m: Model; k: number; shapes: MapShapes; level: MapLevel; talukId: string | null; onDrill: (level: MapLevel, talukId?: string) => void }) {
  const router = useRouter();
  const wrap = useRef<HTMLDivElement>(null);
  const el = useRef<HTMLDivElement>(null);
  const chart = useRef<ECharts | null>(null);
  const [size, setSize] = useState<[number, number]>([0, 0]);
  const [tip, setTip] = useState<Tip | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  // Pixel positions of the places that have a marker, a keyboard button or a pinned card.
  const [pos, setPos] = useState<Record<string, [number, number]>>({});

  const layer: Layer = useMemo(() => {
    if (level === "india" && shapes.states) return shapes.states;
    if (level === "state" && shapes.districts) return shapes.districts;
    if (level === "taluk") return layerOf(shapes.villages.filter((v) => v.taluk_id === talukId));
    return shapes.taluks;
  }, [level, talukId, shapes]);
  const name = useMemo(() => Object.fromEntries(layer.regions.map((r) => [r.id, r.name])), [layer]);
  const target = level === "india" ? shapes.state : level === "state" ? shapes.district : null;
  const selectable = (id: string) => level === "district" || id === target;

  const counts = useMemo(() => villageCounts(m, k), [m, k]);
  const max = useMemo(() => largestCount(m), [m]);
  const villageCount = useMemo(() => {
    const out: Record<string, VillageCount> = {};
    if (level === "taluk") (layer.regions as MapVillage[]).forEach((v) => (out[v.id] = mapVillageCount(counts, v)));
    return out;
  }, [level, layer, counts]);

  // Places to keep pixel positions for.
  const anchors = useMemo(() => {
    const ids = level === "district" ? layer.regions.map((r) => r.id) : level === "taluk" ? (pinned ? [pinned] : []) : target ? [target] : [];
    return layer.regions.filter((r) => ids.includes(r.id));
  }, [level, layer, target, pinned]);

  const mapName = `samvit-${level}-${talukId ?? ""}`;
  const option = useMemo<Option | null>(() => {
    if (!size[0]) return null;
    const base = { borderColor: bg["surface-default"], borderWidth: 1 };
    const regions = layer.regions.map((r) => {
      if (level === "taluk") {
        const s = shadeOf(villageCount[r.id]?.records ?? 0, max);
        const fill = s == null ? bg["surface-default"] : SHADES[s];
        const line = r.id === pinned ? { borderColor: bg["surface-inverse"], borderWidth: 2 } : { borderColor: border["base-default"], borderWidth: 0.5 };
        return { name: r.id, itemStyle: { areaColor: fill, ...line }, emphasis: { itemStyle: { areaColor: fill, borderColor: bg["surface-inverse"], borderWidth: 1.5 } } };
      }
      const on = selectable(r.id);
      return {
        name: r.id,
        itemStyle: { ...base, areaColor: on ? bg["brand-subtle-hover"] : bg["surface-muted"] },
        emphasis: { itemStyle: on ? { areaColor: bg["brand-subtle-hover"], borderColor: bg["surface-inverse"], borderWidth: 2 } : { areaColor: bg["surface-disabled"] } },
        label: r.id === target ? { show: true, formatter: () => r.name, color: fg["brand-pressed"], fontSize: 12, fontFamily: "Poppins, system-ui, sans-serif" } : undefined,
      };
    });
    return {
      animation: false,
      aria: { enabled: true, label: { description: `Map of ${level === "india" ? "India's states" : level === "state" ? "the state's districts" : level === "district" ? "the taluks" : "the taluk's villages"}` } },
      geo: {
        map: mapName,
        roam: true,
        scaleLimit: { min: 1, max: 12 },
        aspectScale: layer.aspect,
        // layoutCenter and layoutSize keep the map's proportions; left/right/top/bottom would stretch it to the box.
        layoutCenter: ["50%", "48%"],
        layoutSize: fitSize(layer.ratio, size[0], size[1]),
        triggerEvent: true,
        selectedMode: false,
        label: { show: false },
        itemStyle: { ...base, areaColor: bg["surface-muted"] },
        emphasis: { label: { show: false } },
        regions,
      },
      series: level === "district" ? [{
        type: "scatter",
        coordinateSystem: "geo",
        symbolSize: R * 2,
        cursor: "pointer",
        label: { show: true, position: "bottom", distance: 6, formatter: "{b}", color: fg["brand-pressed"], fontSize: 12, fontFamily: "Poppins, system-ui, sans-serif" },
        emphasis: { scale: false, itemStyle: { borderColor: bg["surface-inverse"], borderWidth: 3 } },
        data: layer.regions.map((t) => ({ id: t.id, name: t.name, value: t.center, itemStyle: MARKER[talukBand(m, t.id, k)] })),
      }] : [],
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size, layer, level, target, pinned, villageCount, max, m, k, mapName]);

  /* ---------- pointing and selecting ---------- */

  const hideTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const show = (t: Tip) => { clearTimeout(hideTimer.current); setTip(t); };
  // A tooltip closes a moment after the pointer leaves, so the pointer can move onto it.
  const hideSoon = () => { clearTimeout(hideTimer.current); hideTimer.current = setTimeout(() => setTip(null), 200); };
  const select = (id: string) => {
    if (level === "taluk") { setPinned((p) => (p === id ? null : id)); return; }
    if (!selectable(id)) return;
    setTip(null);
    if (level === "india") onDrill("state");
    else if (level === "state") onDrill("district");
    else onDrill("taluk", id);
  };
  const handlers = useRef({ show, hideSoon, select, level, pos });
  handlers.current = { show, hideSoon, select, level, pos };

  useEffect(() => {
    if (!el.current) return;
    const c = init(el.current, null, { renderer: "svg" });
    chart.current = c;
    type Ev = { componentType?: string; name?: string; data?: unknown; event?: { offsetX?: number; offsetY?: number } };
    const idOf = (e: Ev) => (e.componentType === "geo" ? e.name ?? null : (e.data as { id?: string } | undefined)?.id ?? null);
    c.on("mouseover", (e) => {
      const ev = e as Ev, id = idOf(ev), h = handlers.current;
      if (!id) return;
      const at: [number, number] = h.level === "district" && h.pos[id] ? h.pos[id] : [ev.event?.offsetX ?? 0, ev.event?.offsetY ?? 0];
      h.show({ kind: h.level === "district" ? "taluk" : h.level === "taluk" ? "village" : "region", id, x: at[0], y: at[1] });
    });
    c.on("mouseout", () => handlers.current.hideSoon());
    c.on("click", (e) => { const id = idOf(e as Ev); if (id) handlers.current.select(id); });
    const ro = new ResizeObserver(([e]) => { c.resize(); setSize([e.contentRect.width, e.contentRect.height]); });
    ro.observe(el.current);
    return () => { ro.disconnect(); c.dispose(); chart.current = null; clearTimeout(hideTimer.current); };
  }, []);

  // Positions follow zooming and panning: "finished" fires after every render.
  const anchorsRef = useRef(anchors);
  anchorsRef.current = anchors;
  useEffect(() => {
    const c = chart.current;
    if (!c) return;
    const place = () => {
      if (!(c.getOption() as { geo?: unknown[] } | undefined)?.geo?.length) return;
      const next: Record<string, [number, number]> = {};
      anchorsRef.current.forEach((r) => {
        const p = c.convertToPixel({ geoIndex: 0 }, r.center);
        if (p) next[r.id] = [p[0], p[1]];
      });
      setPos((prev) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next));
    };
    c.on("finished", place);
    place();
    return () => { if (!c.isDisposed()) c.off("finished", place); };
  }, [anchors]);

  useEffect(() => {
    if (!option) return;
    registerMap(mapName, layer.geo as Parameters<typeof registerMap>[1]);
    chart.current?.setOption(option, { notMerge: true });
  }, [option, mapName, layer]);

  // A new level starts with nothing pointed at or pinned.
  useEffect(() => { setTip(null); setPinned(null); }, [level, talukId]);

  /* ---------- tooltips ---------- */

  const box = { w: wrap.current?.clientWidth ?? Infinity, h: wrap.current?.clientHeight ?? Infinity };
  const place = (x: number, y: number, gap: number) => {
    let left = x + gap;
    if (left + TIP_W > box.w) left = x - gap - TIP_W;
    return { left: Math.max(0, left), top: Math.max(0, Math.min(y - 24, box.h - 120)) };
  };
  const shown: Tip | null = tip ?? (pinned && pos[pinned] ? { kind: "village", id: pinned, x: pos[pinned][0], y: pos[pinned][1] } : null);

  let card: React.ReactNode = null;
  if (shown?.kind === "taluk") {
    const at = place(shown.x, shown.y, R + 12);
    card = <MapTooltip m={m} k={k} talukId={shown.id} x={at.left} y={Math.max(0, shown.y - 60)} onMouseEnter={() => show(shown)} onMouseLeave={hideSoon} />;
  } else if (shown) {
    const at = place(shown.x, shown.y, 16);
    const keep = { onMouseEnter: () => show(shown), onMouseLeave: hideSoon };
    card = (
      <Card role="tooltip" style={at} {...keep} className="absolute z-10 flex w-tooltip flex-col gap-2 rounded shadow-tooltip">
        {shown.kind === "region" ? (
          <>
            <span className="text-web-title-md text-base-default">{name[shown.id] ?? shown.id}</span>
            <span className="text-web-label-sm text-base-subtle">{selectable(shown.id) ? `Select to ${ACTION[level]}` : "No data here"}</span>
          </>
        ) : (
          <VillageCard m={m} name={name[shown.id] ?? shown.id} taluk={talukId ? m.taluk[talukId]?.name ?? null : null} count={villageCount[shown.id]} onWorker={(key) => router.push(`${ROUTES.workers}?worker=${encodeURIComponent(key)}`)} />
        )}
      </Card>
    );
  }

  return (
    <div ref={wrap} className="relative flex min-h-control flex-1 xl:min-h-0">
      <div ref={el} className="h-map w-full xl:h-full" />
      {level !== "taluk" && anchors.filter((r) => pos[r.id]).map((r) => (
        <button
          key={r.id}
          type="button"
          aria-label={`${r.name}: ${ACTION[level]}`}
          style={{ left: pos[r.id][0] - R, top: pos[r.id][1] - R }}
          className="pointer-events-none absolute size-icon rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-default"
          onFocus={() => show({ kind: level === "district" ? "taluk" : "region", id: r.id, x: pos[r.id][0], y: pos[r.id][1] })}
          onBlur={hideSoon}
          onClick={() => select(r.id)}
        />
      ))}
      {card}
    </div>
  );
}

/* A village: its name and taluk, its records in the period, and the workers who filed them.
 * A worker in dashboard.json opens their profile; any other worker is shown by id. */
function VillageCard({ m, name, taluk, count, onWorker }: { m: Model; name: string; taluk: string | null; count: VillageCount | undefined; onWorker: (key: string) => void }) {
  const records = count?.records ?? 0;
  return (
    <>
      <div className="flex items-baseline justify-between gap-2 text-web-title-md text-base-default">
        <span className="min-w-0">{name}</span>
        <span className="whitespace-nowrap">{int(records)}</span>
      </div>
      <p className="text-web-label-sm text-base-subtle">{[taluk, `${int(records)} record${records === 1 ? "" : "s"} this ${m.period}`].filter(Boolean).join(" · ")}</p>
      {count && count.workers.length > 0 && (
        <div className="flex flex-col gap-1 border-t border-base-muted pt-2">
          <span className="text-web-label-sm text-base-subtle">Workers</span>
          <span className="flex flex-wrap gap-x-2 gap-y-1">
            {count.workers.map((key) => {
              const w = m.worker[key];
              return w ? (
                <Button key={key} variant="link" size="link" onClick={() => onWorker(key)}>{w.name || w.worker_id}</Button>
              ) : (
                <span key={key} className="text-web-label-sm text-base-default">{key.replace(/@\d+$/, "")}</span>
              );
            })}
          </span>
        </div>
      )}
    </>
  );
}
