"use client";
import { useRouter } from "next/navigation";
import { GATE_GROUP, dimensionName, shortRuleId } from "@/lib/labels";
import { int, periodName, periodWord } from "@/lib/format";
import { ruleTitle, type Model, type WeekFacts } from "@/lib/model";
import { Button } from "@/components/shadcn/button";
import { ReasonCard } from "@/components/ui/ReasonCard";
import { ROUTES } from "@/components/layout/routes";

/*
 * "Top Reason for Poor Quality" beside the Health Check (typestack gap mobile/gap/xs): the
 * three rules with the most failures across all workers in the period, each with its failure
 * rate over the records it checked.
 */
export function TopReasonsRail({ m, k, facts }: { m: Model; k: number; facts: WeekFacts }) {
  const router = useRouter();
  const top = facts.reasons.filter((q) => q.failures > 0).slice(0, 3);
  const open = (ruleId: string) => router.push(`${ROUTES.dimensions}?rule=${encodeURIComponent(ruleId)}`);
  return (
    <aside aria-label="Top reasons for poor quality" className="flex flex-col gap-2 xl:min-h-0 xl:overflow-y-auto xl:border-l xl:border-base-muted xl:pl-4">
      <h2 className="text-balance text-mobile-title-lg text-base-default">Top Reason for Poor Quality</h2>
      <p className="text-mobile-body-sm text-base-muted">Across all workers · {periodName(m, k)}</p>
      {top.length ? (
        top.map((q) => (
          <ReasonCard
            key={q.rule.rule_id}
            title={ruleTitle(m, q.rule.rule_id)}
            group={GATE_GROUP[q.rule.feeds] ?? dimensionName(q.rule.dimension)}
            records={q.checked}
            rate={q.checked ? q.failures / q.checked : null}
            hint={`${shortRuleId(q.rule.rule_id)}: ${int(q.failures)} of ${int(q.checked)} records failed`}
            onClick={() => open(q.rule.rule_id)}
          />
        ))
      ) : (
        <p className="text-mobile-body-md text-base-subtle">No rule failures this {periodWord(m)}.</p>
      )}
      {top.length > 0 && (
        <Button variant="link" size="link" className="mt-4 justify-start border-b border-base-muted pb-6" onClick={() => open(top[0].rule.rule_id)}>
          Click to view workers who need training
        </Button>
      )}
    </aside>
  );
}
