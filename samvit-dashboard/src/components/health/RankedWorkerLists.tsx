import { f2 } from "@/lib/format";
import type { Model, WeekFacts } from "@/lib/model";
import { RANK_LIST_SIZE } from "@/lib/thresholds";
import { Separator } from "@/components/shadcn/separator";
import { RankedWorkerTable } from "./RankedWorkerTable";

/*
 * List View: the five lowest DQ scores among the period's Low-band workers and the five
 * highest among its High-band workers, side by side (content-data: gap-x 16px; each side
 * gap web/gap/gap-6). Titles in Mobile/Title/Medium, fg/danger/default and
 * fg/success/default.
 */
export function RankedWorkerLists({ m, k, facts }: { m: Model; k: number; facts: WeekFacts }) {
  const scored = facts.scored.map((w) => ({ w, t: w.w[k]!.scores.trust! }));
  const low = scored.filter((x) => x.t.band === "low").sort((a, b) => a.t.scale - b.t.scale).slice(0, RANK_LIST_SIZE).map((x) => x.w);
  const high = scored.filter((x) => x.t.band === "high").sort((a, b) => b.t.scale - a.t.scale).slice(0, RANK_LIST_SIZE).map((x) => x.w);
  const { band_low_scale: lo, band_high_scale: hi } = m.settings;
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_1px_minmax(0,1fr)]">
      <section className="flex min-w-0 flex-col gap-6">
        <h3 className="text-balance text-mobile-title-md text-danger-default">Workers with Lowest Score</h3>
        <RankedWorkerTable m={m} k={k} workers={low} empty={`No worker scored below ${f2(lo)} this ${m.period}.`} />
      </section>
      <Separator orientation="vertical" className="hidden md:block" />
      <section className="flex min-w-0 flex-col gap-6">
        <h3 className="text-balance text-mobile-title-md text-success-default">Workers with Highest Score</h3>
        <RankedWorkerTable m={m} k={k} workers={high} empty={`No worker scored ${f2(hi)} or above this ${m.period}.`} />
      </section>
    </div>
  );
}
