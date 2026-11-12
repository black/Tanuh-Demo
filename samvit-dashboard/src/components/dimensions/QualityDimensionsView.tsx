"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useModel } from "@/context/DashboardData";
import { GATE_GROUP, GROUP_FEEDS, type GateGroup } from "@/lib/labels";
import { failuresOf, groupOf } from "@/lib/model";
import { Card } from "@/components/shadcn/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select";
import { DimensionCards } from "./DimensionCards";
import { RejectionReasons } from "./RejectionReasons";
import { FailureAreas } from "./FailureAreas";

/*
 * Quality Dimensions for one taluk: its three dimension scores, the chosen dimension's rules
 * by failures, and the workers failing the chosen rule, on a 3 × 2 grid (data: gap 24px).
 * Opened from another view with ?rule= and ?taluk=.
 */
export function QualityDimensionsView() {
  const { m, k } = useModel();
  const params = useSearchParams();
  const askedRule = params.get("rule");
  const [talukId, setTalukId] = useState(() => {
    const t = params.get("taluk");
    return t && m.taluk[t] ? t : m.taluks[0]?.unit_id ?? null;
  });
  const [gate, setGate] = useState<GateGroup>(() => (askedRule && m.rule[askedRule] ? GATE_GROUP[m.rule[askedRule].feeds] : "Sufficiency"));
  const [picked, setPicked] = useState<string | null>(askedRule);

  const title = <h2 className="text-balance text-mobile-title-md text-base-default">Quality Dimensions</h2>;
  if (!talukId)
    return (
      <div className="flex flex-col gap-4">
        {title}
        <Card><p className="text-mobile-body-md text-base-subtle">No taluk scores are stored. They need the location and worker master files loaded before <code>dqs etl run</code>.</p></Card>
      </div>
    );

  const taluk = m.taluk[talukId];
  const inTaluk = (w: Parameters<typeof groupOf>[1]) => groupOf(m, w, k) === talukId;
  const counts = m.rules.filter((r) => GROUP_FEEDS[gate].includes(r.feeds)).map((r) => ({ rule: r, ...failuresOf(m, r.rule_id, k, inTaluk) }));
  const failing = counts.filter((q) => q.measured && q.rule.scored !== false).sort((a, b) => b.failures - a.failures || a.rule.rule_id.localeCompare(b.rule.rule_id));
  const other = counts.filter((q) => !q.measured || q.rule.scored === false);
  const ruleId = picked && failing.some((q) => q.rule.rule_id === picked) ? picked : failing[0]?.rule.rule_id ?? null;

  return (
    <div className="flex flex-1 flex-col gap-4 xl:min-h-0">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {title}
        <Select value={talukId} onValueChange={(v) => { setTalukId(v); setPicked(null); }}>
          <SelectTrigger id="dim-taluk" aria-label="Taluk"><SelectValue /></SelectTrigger>
          <SelectContent>
            {m.taluks.map((t) => <SelectItem key={t.unit_id} value={t.unit_id}>{t.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="grid flex-1 grid-cols-1 items-stretch gap-6 md:grid-cols-3 md:grid-rows-[auto_1fr] xl:min-h-0 xl:grid-rows-[auto_minmax(0,1fr)]">
        <DimensionCards m={m} k={k} taluk={taluk} />
        <RejectionReasons m={m} gate={gate} onGate={(g) => { setGate(g); setPicked(null); }} failing={failing} other={other} selected={ruleId} onSelect={setPicked} />
        <FailureAreas m={m} k={k} taluk={taluk} ruleId={ruleId} />
      </div>
    </div>
  );
}
