"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { f2, int, pct } from "@/lib/format";
import { shortRuleId } from "@/lib/labels";
import { groupOf, placeOf, ruleTitle, type Model, type TalukView, type WorkerView } from "@/lib/model";
import { CONCENTRATED_SHARE, HEAVY_FAILURE_RATE, PAGE_SIZE, TOP_WORKERS_SHARE } from "@/lib/thresholds";
import type { RuleOutcome } from "@/lib/types";
import { pageList, paginate, selectableRow } from "@/lib/utils";
import { Card, CardTitle } from "@/components/shadcn/card";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/shadcn/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";
import { BandDot } from "@/components/ui/BandDot";
import { Legend } from "@/components/ui/Legend";
import { WorkerName } from "@/components/workers/WorkerName";
import { ROUTES } from "@/components/layout/routes";

/*
 * "Areas with the most failures": the taluk's workers who failed the selected rule in the
 * period, most failures first, with the share of their records that failed and their DQ score.
 * The note under the table uses the display thresholds in lib/thresholds.ts.
 */
export function FailureAreas({ m, k, taluk, ruleId }: { m: Model; k: number; taluk: TalukView; ruleId: string | null }) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [forRule, setForRule] = useState(ruleId);
  if (forRule !== ruleId) { setForRule(ruleId); setPage(1); }

  const rows: { w: WorkerView; q: RuleOutcome }[] = ruleId
    ? m.workers
        .filter((w) => w.w[k] && groupOf(m, w, k) === taluk.unit_id)
        .map((w) => ({ w, q: w.w[k]!.rules.find((r) => r.rule_id === ruleId)! }))
        .filter((x) => x.q && x.q.n_violations > 0)
        .sort((a, b) => b.q.n_violations - a.q.n_violations || a.w.idx - b.w.idx)
    : [];
  const total = rows.reduce((s, x) => s + x.q.n_violations, 0);
  const heavy = rows.filter((x) => (m.settings.rule_n_min == null || x.q.n_evaluated >= m.settings.rule_n_min) && x.q.rate != null && x.q.rate >= HEAVY_FAILURE_RATE).length;
  const topN = Math.max(1, Math.round(rows.length * TOP_WORKERS_SHARE));
  const topShare = total ? rows.slice(0, topN).reduce((s, x) => s + x.q.n_violations, 0) / total : 0;
  const view = paginate(rows, page, PAGE_SIZE);

  return (
    <Card className="flex min-w-0 flex-col gap-2 md:col-span-2 xl:min-h-0">
      <CardTitle>Areas with the most failures</CardTitle>
      {ruleId ? (
        <>
          <p className="text-mobile-title-sm text-danger-default">
            {ruleTitle(m, ruleId)} <span className="text-mobile-label-lg text-base-subtle">· {shortRuleId(ruleId)} · {taluk.name}</span>
          </p>
          <div className="xl:min-h-0 xl:flex-1 xl:overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow><TableHead>Worker</TableHead><TableHead>Location</TableHead><TableHead className="text-right">Failures</TableHead><TableHead className="text-right">Of Their Records</TableHead><TableHead className="text-right">DQ Score</TableHead></TableRow>
              </TableHeader>
              <TableBody>
                {view.rows.length ? view.rows.map(({ w, q }) => {
                  const t = w.w[k]!.insufficient ? null : w.w[k]!.scores.trust;
                  return (
                    <TableRow key={w.key} {...selectableRow(() => router.push(`${ROUTES.workers}?worker=${encodeURIComponent(w.key)}`))}>
                      <TableCell className="py-3"><WorkerName w={w} /></TableCell>
                      <TableCell className="py-3">{placeOf(m, w, k)}</TableCell>
                      <TableCell className="py-3 text-right">{int(q.n_violations)}</TableCell>
                      <TableCell className="py-3 text-right">{pct(q.rate)}</TableCell>
                      <TableCell className="py-3 text-right">
                        <span className="inline-flex items-center gap-2">
                          <BandDot band={t ? (t.band === "high" ? "success" : t.band) : "ins"} size="sm" />
                          {t ? f2(t.scale) : "—"}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                }) : <TableRow><TableCell colSpan={5} className="py-3 text-base-subtle">No worker in {taluk.name} failed this rule this {m.period}.</TableCell></TableRow>}
              </TableBody>
            </Table>
          </div>
          {rows.length > 0 && (
            <p className="text-mobile-body-sm text-base-subtle">
              {heavy} worker{heavy === 1 ? "" : "s"} failed it on {pct(HEAVY_FAILURE_RATE, 0)} or more of their records. The top {topN} worker{topN > 1 ? "s account" : " accounts"} for {pct(topShare, 0)} of the failures: {topShare >= CONCENTRATED_SHARE ? "concentrated in a few workers." : "spread across many workers."}
            </p>
          )}
          <div className="mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-base-muted pt-6">
            <Legend high={m.settings.band_high_scale} low={m.settings.band_low_scale} withMid />
            {view.pages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem><PaginationPrevious disabled={view.page <= 1} onClick={() => setPage(view.page - 1)} /></PaginationItem>
                  {pageList(view.page, view.pages).map((n, i) => (
                    <PaginationItem key={n === "…" ? `gap${i}` : n}>
                      {n === "…" ? <PaginationEllipsis /> : <PaginationLink isActive={n === view.page} onClick={() => setPage(n)}>{n}</PaginationLink>}
                    </PaginationItem>
                  ))}
                  <PaginationItem><PaginationNext disabled={view.page >= view.pages} onClick={() => setPage(view.page + 1)} /></PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </>
      ) : (
        <p className="text-mobile-body-md text-base-subtle">No rule in this dimension was measured for this taluk this {m.period}.</p>
      )}
    </Card>
  );
}
