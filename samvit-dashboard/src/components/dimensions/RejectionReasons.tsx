import { cn } from "@/lib/utils";
import { int } from "@/lib/format";
import { GATE_GROUPS, dimensionName, shortRuleId, type GateGroup } from "@/lib/labels";
import { ruleTitle, type Model, type ReasonCount } from "@/lib/model";
import { Button } from "@/components/shadcn/button";
import { Card, CardTitle } from "@/components/shadcn/card";
import { Toggle } from "@/components/shadcn/toggle";

/*
 * "Rejection Reasons" (map-view: px web/padding/p-0, py web/gap/gap-4, gap web/gap/gap-4):
 * the dimension chips, then the dimension's rules by failures in the period. Each row is
 * Mobile/Title/Medium with padding web/padding/p-4; the count is fg/brand/default and the
 * selected row bg/brand/subtle.
 */
export function RejectionReasons({ m, gate, onGate, failing, other, selected, onSelect }: { m: Model; gate: GateGroup; onGate: (g: GateGroup) => void; failing: ReasonCount[]; other: ReasonCount[]; selected: string | null; onSelect: (id: string) => void }) {
  const row = "flex w-full items-center justify-between gap-4 p-4 text-left text-mobile-title-md";
  return (
    <Card className="flex flex-col gap-4 px-0 py-4 xl:min-h-0">
      <div className="px-4">
        <CardTitle className="border-b border-base-muted pb-4">Rejection Reasons</CardTitle>
      </div>
      <div role="group" aria-label="Dimension" className="flex flex-wrap gap-4 px-4">
        {GATE_GROUPS.map((g) => (
          <Toggle key={g} pressed={gate === g} onPressedChange={() => onGate(g)}>{g}</Toggle>
        ))}
      </div>
      <div className="flex flex-col xl:min-h-0 xl:overflow-y-auto">
        {failing.map((q) => (
          <Button
            key={q.rule.rule_id}
            variant="ghost"
            aria-pressed={q.rule.rule_id === selected}
            title={`${shortRuleId(q.rule.rule_id)} · ${dimensionName(q.rule.dimension)}`}
            onClick={() => onSelect(q.rule.rule_id)}
            className={cn(row, "h-auto rounded-none whitespace-normal text-base-default", q.rule.rule_id === selected && "bg-brand-subtle hover:bg-brand-subtle")}
          >
            <span>{ruleTitle(m, q.rule.rule_id)}</span>
            <span className="text-brand-default">{int(q.failures)}</span>
          </Button>
        ))}
        {other.map((q) => (
          <div key={q.rule.rule_id} className={cn(row, "text-base-subtle")}>
            <span>{ruleTitle(m, q.rule.rule_id)}</span>
            <span className="whitespace-nowrap text-mobile-label-lg text-base-disabled">{q.rule.scored === false ? "Not scored" : "Not measured"}</span>
          </div>
        ))}
        {!failing.length && !other.length && <p className="px-4 text-mobile-body-md text-base-subtle">No rules in this dimension.</p>}
      </div>
    </Card>
  );
}
