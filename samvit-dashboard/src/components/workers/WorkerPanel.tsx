import { int, monthName, periodName, shortDate } from "@/lib/format";
import { STATUS_LABEL, STATUS_VARIANT } from "@/lib/labels";
import { groupOf, lastActiveWeek, statusOf, type Model, type WorkerView } from "@/lib/model";
import { Badge } from "@/components/shadcn/badge";
import { Card, CardTitle } from "@/components/shadcn/card";
import { ScoreTile } from "./ScoreTile";
import { WorkerTopReasons } from "./WorkerTopReasons";
import { DqScoreChart } from "./DqScoreChart";

/*
 * The selected worker beside the table (the Figma "map-view" panel: gap web/gap/gap-4,
 * padding web/gap/gap-4, web/rounded/lg). The design's "Supervisor" tag shows the taluk,
 * as the data has no supervisors.
 */
export function WorkerPanel({ m, k, w }: { m: Model; k: number; w: WorkerView }) {
  const wk = w.w[k];
  const s = wk && !wk.insufficient ? wk.scores : null;
  const talukId = groupOf(m, w, k);
  const taluk = talukId ? m.taluk[talukId].name : null;
  const last = lastActiveWeek(w, k);
  const status = statusOf(wk);
  const fab = s?.fabrication_suspicion ? `Fabrication suspicion ${s.fabrication_suspicion.value.toFixed(0)}/100` : null;
  const empty = wk && !wk.insufficient ? "Not measured" : "—";
  return (
    <Card asChild className="flex flex-col gap-4 self-start xl:max-h-full xl:overflow-y-auto">
      <section aria-live="polite">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <CardTitle>{w.name || w.worker_id}</CardTitle>
          {taluk && <Badge variant="positive"><span className="text-base-disabled">Taluk</span>{taluk}</Badge>}
        </div>
        <p className="flex flex-wrap gap-2 text-web-label-sm">
          <span className="text-base-subtle">{w.worker_id}</span>
          <span className="text-base-default">{[w.village_name ?? "No village on file", taluk].filter(Boolean).join(", ")}</span>
        </p>
        <div className="flex flex-wrap items-center gap-4 border-b border-base-muted pb-4">
          <Badge variant="muted"><span className="text-base-disabled">Volume</span>{int(wk?.n_records ?? 0)}</Badge>
          <Badge variant="muted">
            <span className="text-base-disabled">Last Activity</span>
            {last == null ? "—" : m.period === "month" ? monthName(m.weeks[last].start) : `Week of ${shortDate(m.weeks[last].start)}`}
          </Badge>
          {status ? <Badge variant={STATUS_VARIANT[status]}>{STATUS_LABEL[status]}</Badge> : <span className="whitespace-nowrap text-mobile-label-lg text-base-disabled">No status</span>}
        </div>
        {!wk && <p className="text-mobile-body-md text-base-subtle">No records in the {periodName(m, k)}.</p>}
        {wk?.insufficient && (
          <p className="text-mobile-body-md text-base-subtle">
            {wk.n_records} record{wk.n_records === 1 ? "" : "s"} this {m.period}
            {m.settings.n_min != null ? (m.period === "month" ? `; no week had the ${m.settings.n_min} needed to score` : `; ${m.settings.n_min} are needed to score`) : ""}. No score is stored.
          </p>
        )}
        <div className="grid grid-cols-2 gap-2">
          <ScoreTile label="DQ Score" score={s?.trust ?? null} empty={empty} />
          <ScoreTile label="Sufficiency" score={s?.sufficiency ?? null} empty={empty} />
          <ScoreTile label="Genuineness" score={s?.provenance_confidence ?? null} empty={empty} note={fab} />
          <ScoreTile label="Fidelity" score={s?.quality ?? null} empty={empty} />
        </div>
        <WorkerTopReasons m={m} wk={wk} talukId={talukId} />
        <DqScoreChart m={m} w={w} k={k} />
      </section>
    </Card>
  );
}
