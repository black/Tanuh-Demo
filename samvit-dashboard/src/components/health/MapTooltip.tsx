"use client";
import { useState } from "react";
import { f2, int } from "@/lib/format";
import { STATUS_LABEL, STATUS_VARIANT } from "@/lib/labels";
import { placeOf, statusOf, talukWorkers, type Model, type WorkerView } from "@/lib/model";
import { Badge } from "@/components/shadcn/badge";
import { Card } from "@/components/shadcn/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/shadcn/hover-card";
import { BandDot } from "@/components/ui/BandDot";
import { WorkerName } from "@/components/workers/WorkerName";

/*
 * The map tooltip: padding web/padding/p-4, gap web/gap/gap-2, web/rounded/rounded,
 * shadow 0 0 2px. Taluk and score in Web/Title/Medium; counts in Web/Label/Small; one 12px
 * dot per worker, 4px apart. It stays open while pointed at, and pointing at a worker's dot
 * shows that worker in a hover card above it.
 */
export function MapTooltip({ m, k, talukId, x, y, onMouseEnter, onMouseLeave }: { m: Model; k: number; talukId: string; x: number; y: number; onMouseEnter?: () => void; onMouseLeave?: () => void }) {
  const [box, setBox] = useState<HTMLDivElement | null>(null);
  const t = m.taluk[talukId];
  const week = t?.w[k];
  const tw = talukWorkers(m, talukId, k);
  const score = !week ? "—" : week.insufficient ? "Insufficient" : week.scores.trust ? f2(week.scores.trust.scale) : "—";
  return (
    <Card ref={setBox} role="tooltip" style={{ left: x, top: y }} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} className="absolute z-10 flex w-tooltip flex-col gap-2 rounded shadow-tooltip">
      <div className="flex items-baseline justify-between gap-2 text-web-title-md text-base-default">
        <span>{t?.name ?? talukId}</span>
        <span>{score}</span>
      </div>
      <p className="flex flex-wrap items-center gap-1 text-web-label-sm text-base-default">
        <span>{tw.list.length} Worker{tw.list.length === 1 ? "" : "s"}</span>
        <i className="size-bullet rounded-full bg-surface-disabled" aria-hidden="true" />
        <span>{tw.high} High</span>
        <i className="size-bullet rounded-full bg-surface-disabled" aria-hidden="true" />
        <span>{tw.low} Low</span>
      </p>
      <div className="flex flex-wrap gap-1">
        {tw.list.map((x) => (
          <HoverCard key={x.worker.key} openDelay={100} closeDelay={100}>
            <HoverCardTrigger asChild>
              <span tabIndex={0} aria-label={x.worker.label} className="inline-flex rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-default">
                <BandDot band={x.band} />
              </span>
            </HoverCardTrigger>
            <HoverCardContent side="top" container={box}>
              <WorkerDetails m={m} k={k} w={x.worker} />
            </HoverCardContent>
          </HoverCard>
        ))}
      </div>
    </Card>
  );
}

/* A worker in the hover card: name and ID, location, DQ score, records in the period and status. */
function WorkerDetails({ m, k, w }: { m: Model; k: number; w: WorkerView }) {
  const wk = w.w[k];
  const trust = wk && !wk.insufficient ? wk.scores.trust : null;
  const status = statusOf(wk);
  return (
    <>
      <div className="flex items-baseline justify-between gap-2 text-web-title-md text-base-default">
        <span className="min-w-0"><WorkerName w={w} /></span>
        <span className="inline-flex items-center gap-2">
          <BandDot band={trust ? trust.band : "ins"} />
          {trust ? f2(trust.scale) : wk?.insufficient ? "Insufficient" : "—"}
        </span>
      </div>
      <p className="flex flex-wrap items-center gap-1 text-web-label-sm text-base-default">
        <span>{placeOf(m, w, k)}</span>
        <i className="size-bullet rounded-full bg-surface-disabled" aria-hidden="true" />
        <span>{int(wk?.n_records ?? 0)} Records</span>
      </p>
      {status && <Badge variant={STATUS_VARIANT[status]} className="self-start">{STATUS_LABEL[status]}</Badge>}
    </>
  );
}
