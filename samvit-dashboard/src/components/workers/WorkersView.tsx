"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useModel } from "@/context/DashboardData";
import { statusOf, talukOf } from "@/lib/model";
import { PAGE_SIZE } from "@/lib/thresholds";
import { pageList, paginate } from "@/lib/utils";
import { Card } from "@/components/shadcn/card";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/shadcn/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select";
import { Legend } from "@/components/ui/Legend";
import { StatusFilter, type StatusFilterValue } from "./StatusFilter";
import { WorkersTable } from "./WorkersTable";
import { WorkerPanel } from "./WorkerPanel";

const STATUSES: StatusFilterValue[] = ["all", "low", "high", "slip", "ins"];

/*
 * Workers: every worker for the period, filtered by taluk and status, ten to a page, with the
 * selected worker beside the table (data: gap 24px). Opened from another view with
 * ?worker=, ?taluk= or ?status=.
 */
export function WorkersView() {
  const { m, k } = useModel();
  const params = useSearchParams();
  const asked = params.get("worker");
  const [taluk, setTaluk] = useState(() => (params.get("taluk") && m.taluk[params.get("taluk")!] ? params.get("taluk")! : "all"));
  const [status, setStatus] = useState<StatusFilterValue>(() => {
    const s = params.get("status") as StatusFilterValue | null;
    return s && STATUSES.includes(s) ? s : "all";
  });
  const all = m.workers
    .filter((w) => taluk === "all" || talukOf(w, k) === taluk)
    .filter((w) => status === "all" || statusOf(w.w[k]) === status);
  const [page, setPage] = useState(() => {
    const i = asked ? all.findIndex((w) => w.key === asked) : -1;
    return i < 0 ? 1 : Math.floor(i / PAGE_SIZE) + 1;
  });
  const [selected, setSelected] = useState<string | null>(asked && m.worker[asked] ? asked : null);
  const view = paginate(all, page, PAGE_SIZE);
  const current = selected && view.rows.some((w) => w.key === selected) ? selected : view.rows[0]?.key ?? null;

  const reset = () => { setPage(1); setSelected(null); };
  const go = (p: number) => { setPage(p); setSelected(null); };
  return (
    <div className="flex flex-1 flex-col gap-4 xl:min-h-0">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-balance text-mobile-title-md text-base-default">Workers Performance</h2>
        <Select value={taluk} onValueChange={(v) => { setTaluk(v); reset(); }}>
          <SelectTrigger id="taluk" aria-label="Taluk"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Select Taluk</SelectItem>
            {m.taluks.map((t) => <SelectItem key={t.unit_id} value={t.unit_id}>{t.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="grid flex-1 grid-cols-1 items-stretch gap-6 xl:min-h-0 xl:grid-cols-[minmax(0,1fr)_theme(width.panel)] xl:grid-rows-[minmax(0,1fr)]">
        <Card className="flex min-w-0 flex-col gap-4 xl:min-h-0">
          <StatusFilter value={status} onChange={(v) => { setStatus(v); reset(); }} />
          <div className="xl:min-h-0 xl:flex-1 xl:overflow-y-auto">
            <WorkersTable m={m} k={k} workers={view.rows} selected={current} onSelect={setSelected} />
          </div>
          <div className="mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-base-muted pt-6">
            <Legend high={m.settings.band_high_scale} low={m.settings.band_low_scale} />
            {view.pages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem><PaginationPrevious disabled={view.page <= 1} onClick={() => go(view.page - 1)} /></PaginationItem>
                  {pageList(view.page, view.pages).map((n, i) => (
                    <PaginationItem key={n === "…" ? `gap${i}` : n}>
                      {n === "…" ? <PaginationEllipsis /> : <PaginationLink isActive={n === view.page} onClick={() => go(n)}>{n}</PaginationLink>}
                    </PaginationItem>
                  ))}
                  <PaginationItem><PaginationNext disabled={view.page >= view.pages} onClick={() => go(view.page + 1)} /></PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </Card>
        {current ? <WorkerPanel m={m} k={k} w={m.worker[current]} /> : <Card className="self-start"><p className="text-mobile-body-md text-base-subtle">Select a worker to see their scores.</p></Card>}
      </div>
    </div>
  );
}
