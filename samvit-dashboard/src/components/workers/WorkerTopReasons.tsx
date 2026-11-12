"use client";
import { useRouter } from "next/navigation";
import { GATE_GROUP, dimensionName, shortRuleId } from "@/lib/labels";
import { ruleTitle, type Model } from "@/lib/model";
import type { WorkerWeek } from "@/lib/types";
import { Card, CardTitle } from "@/components/shadcn/card";
import { ReasonCard } from "@/components/ui/ReasonCard";
import { ROUTES } from "@/components/layout/routes";

/* The worker's three most-failed rules in the period, on bg/surface/subtle with padding
 * web/padding/p-4 and items mobile/gap/xs apart. */
export function WorkerTopReasons({ m, wk, talukId }: { m: Model; wk: WorkerWeek | null; talukId: string | null }) {
  const router = useRouter();
  const top = (wk?.rules ?? [])
    .filter((q) => q.n_violations > 0 && m.rule[q.rule_id]?.scored !== false)
    .sort((a, b) => b.n_violations - a.n_violations)
    .slice(0, 3);
  return (
    <Card asChild className="flex flex-col gap-2 rounded bg-surface-subtle">
      <section>
        <CardTitle asChild className="text-mobile-title-sm"><h3>Top Reason for Poor Quality</h3></CardTitle>
        {top.length ? top.map((q) => (
          <ReasonCard
            key={q.rule_id}
            title={ruleTitle(m, q.rule_id)}
            group={GATE_GROUP[q.feeds] ?? dimensionName(q.dimension)}
            records={q.n_evaluated}
            rate={q.rate}
            hint={`${shortRuleId(q.rule_id)}: ${q.n_violations} of ${q.n_evaluated} records failed`}
            onClick={() => router.push(`${ROUTES.dimensions}?rule=${encodeURIComponent(q.rule_id)}${talukId ? `&taluk=${encodeURIComponent(talukId)}` : ""}`)}
          />
        )) : <p className="text-mobile-body-md text-base-subtle">{wk ? `No rule failures this ${m.period}.` : "—"}</p>}
      </section>
    </Card>
  );
}
