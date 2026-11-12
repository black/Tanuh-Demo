"use client";
import { Fragment, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useDashboardData } from "@/context/DashboardData";
import { int } from "@/lib/format";
import type { MapShapes } from "@/lib/map";
import type { Model, WeekFacts } from "@/lib/model";
import { largestCount, mapVillageCount, shadeRanges, unmatchedRecords, villageCounts } from "@/lib/villages";
import { Alert, AlertDescription, AlertTitle } from "@/components/shadcn/alert";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/shadcn/breadcrumb";
import { Button } from "@/components/shadcn/button";
import { Card, CardTitle } from "@/components/shadcn/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/shadcn/toggle-group";
import { Legend } from "@/components/ui/Legend";
import { ROUTES } from "@/components/layout/routes";
import { DrillMap, SHADES, type MapLevel } from "./DrillMap";
import { RankedWorkerLists } from "./RankedWorkerLists";

type Layout = "map" | "list";
type Nav = { level: MapLevel; talukId: string | null };

/* The Figma "map-view" card (gap web/gap/gap-4, padding web/gap/gap-4, web/rounded/lg):
 * the map from India down to a taluk's villages, or the lowest and highest scores as lists. */
export function WorkersByTaluk({ m, k, facts }: { m: Model; k: number; facts: WeekFacts }) {
  const router = useRouter();
  const [layout, setLayout] = useState<Layout>("map");
  const { map } = useDashboardData();
  const shapes = map.status === "ready" ? map.value : null;
  // The map starts at India when the states are there, otherwise at the state or the district.
  const start: MapLevel = shapes?.states && shapes.state ? "india" : shapes?.districts && shapes.district ? "state" : "district";
  const [nav, setNav] = useState<Nav | null>(null);
  const at: Nav = nav ?? { level: start, talukId: null };
  const go = (level: MapLevel, talukId?: string) => setNav({ level, talukId: talukId ?? null });

  return (
    <Card className="flex flex-1 flex-col gap-4 xl:min-h-0">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <CardTitle>Workers by Taluk</CardTitle>
          {layout === "map" && shapes && <Crumbs m={m} shapes={shapes} at={at} start={start} go={go} />}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {layout === "map" && at.level === "taluk" && at.talukId && (
            <Button variant="link" size="link" onClick={() => router.push(`${ROUTES.workers}?taluk=${encodeURIComponent(at.talukId!)}`)}>
              See {m.taluk[at.talukId]?.name ?? "this taluk"}&apos;s workers →
            </Button>
          )}
          <ToggleGroup type="single" aria-label="Layout" className="bg-surface-muted" value={layout} onValueChange={(v) => v && setLayout(v as Layout)}>
            <ToggleGroupItem value="map">Map View</ToggleGroupItem>
            <ToggleGroupItem value="list">List View</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
      {layout === "list" ? (
        <div className="xl:min-h-0 xl:flex-1 xl:overflow-y-auto"><RankedWorkerLists m={m} k={k} facts={facts} /></div>
      ) : map.status === "loading" ? (
        <p className="flex min-h-control flex-1 items-center text-mobile-body-md text-base-subtle">Loading the map…</p>
      ) : map.status === "missing" ? (
        <Alert>
          <AlertTitle>No map to show</AlertTitle>
          <AlertDescription>
            <p>The map reads <code>map.json</code> from the site&apos;s root, and {map.reason}.</p>
            <p>The command that writes <code>dashboard.json</code> writes it beside that file, once the tenant&apos;s village boundaries have been imported with <code>dqs locations import</code>:</p>
            <pre>{"dqs dashboard export --tenant <tenant key> --out <site folder>/dashboard.json \\\n  --outline <district outline file>"}</pre>
            <p className="text-base-subtle">Switch to List View to see the workers without the map.</p>
          </AlertDescription>
        </Alert>
      ) : (
        <DrillMap m={m} k={k} shapes={map.value} level={at.level} talukId={at.talukId} onDrill={go} />
      )}
      <div className="mt-auto flex flex-wrap items-end justify-between gap-3">
        {layout === "list" || !shapes ? (
          <Legend high={m.settings.band_high_scale} low={m.settings.band_low_scale} />
        ) : (
          <MapFooter m={m} k={k} shapes={shapes} at={at} />
        )}
      </div>
    </Card>
  );
}

/* India › Karnataka › Bangalore Rural › Devanahalli: each place above the current one goes back to it. */
function Crumbs({ m, shapes, at, start, go }: { m: Model; shapes: MapShapes; at: Nav; start: MapLevel; go: (l: MapLevel, t?: string) => void }) {
  const stateName = shapes.states?.regions.find((r) => r.id === shapes.state)?.name ?? "State";
  const all: { level: MapLevel; label: string }[] = [
    { level: "india", label: "India" },
    { level: "state", label: stateName },
    { level: "district", label: shapes.district ?? `${m.taluks.length} taluk${m.taluks.length === 1 ? "" : "s"}` },
    { level: "taluk", label: at.talukId ? m.taluk[at.talukId]?.name ?? at.talukId : "" },
  ];
  const order: MapLevel[] = ["india", "state", "district", "taluk"];
  const items = all.slice(order.indexOf(start), order.indexOf(at.level) + 1);
  return (
    <Breadcrumb aria-label="Place on the map">
      <BreadcrumbList>
        {items.map((c, i) => (
          <Fragment key={c.level}>
            {i > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {i === items.length - 1 ? <BreadcrumbPage>{c.label}</BreadcrumbPage> : <BreadcrumbLink onClick={() => go(c.level)}>{c.label}</BreadcrumbLink>}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

/* Under the map: what the colours mean at this level, and the outlines' credit. */
function MapFooter({ m, k, shapes, at }: { m: Model; k: number; shapes: MapShapes; at: Nav }) {
  const counts = useMemo(() => villageCounts(m, k), [m, k]);
  const max = useMemo(() => largestCount(m), [m]);
  const credit = at.level === "india" ? shapes.statesLicence : at.level === "state" || at.level === "district" ? shapes.licence : null;
  const creditLabel = at.level === "india" ? "State data: geoBoundaries, ODbL 1.0" : "District data: geoBoundaries, ODbL 1.0";
  const note = "text-mobile-label-lg text-base-subtle";

  let left: React.ReactNode;
  if (at.level === "india") left = <p className={note}>Select {shapes.states?.regions.find((r) => r.id === shapes.state)?.name ?? "the highlighted state"} to see its districts. Scroll to zoom, drag to move.</p>;
  else if (at.level === "state") left = <p className={note}>Select {shapes.district ?? "the highlighted district"} to see its taluks. Scroll to zoom, drag to move.</p>;
  else if (at.level === "district") left = <Legend high={m.settings.band_high_scale} low={m.settings.band_low_scale} withMid />;
  else {
    const villages = shapes.villages.filter((v) => v.taluk_id === at.talukId);
    const onMap = villages.reduce((s, v) => s + mapVillageCount(counts, v).records, 0);
    const off = at.talukId ? unmatchedRecords(m, counts, villages, at.talukId) : 0;
    const ranges = shadeRanges(max);
    left = (
      <div className="flex flex-col gap-2">
        <div className={`flex flex-wrap items-center gap-4 ${note}`}>
          {SHADES.map((c, i) => (
            <span key={c} className="inline-flex items-center gap-2">
              <i className="inline-block size-icon-sm rounded" style={{ background: c }} aria-hidden="true" />
              {ranges[i]} records
            </span>
          ))}
          <span className="inline-flex items-center gap-2">
            <i className="inline-block size-icon-sm rounded border border-base-default bg-surface-default" aria-hidden="true" />
            No records
          </span>
        </div>
        <p className={note}>
          Villages are shaded by the records filed in them this {m.period}, not by score. {int(onMap)} record{onMap === 1 ? "" : "s"} in villages on the map
          {off > 0 ? `; ${int(off)} filed under a village with no outline.` : "."} Select a village to keep its details open.
        </p>
      </div>
    );
  }
  return (
    <>
      {left}
      {credit && (
        <a href={credit.url ?? undefined} target="_blank" rel="noopener noreferrer" title={credit.text} className="text-mobile-label-sm text-base-subtle hover:underline">
          {creditLabel}
        </a>
      )}
    </>
  );
}
