"use client";
import { useModel } from "@/context/DashboardData";
import { weekFacts } from "@/lib/model";
import { KpiRow } from "./KpiRow";
import { UnscoredNote } from "./UnscoredNote";
import { WorkersByTaluk } from "./WorkersByTaluk";
import { TopReasonsRail } from "./TopReasonsRail";

/* Health Check: the period's KPIs, workers by taluk, and the top reasons for poor quality
 * (data: gap 16px). */
export function HealthCheckView() {
  const { m, k } = useModel();
  const now = weekFacts(m, k);
  const before = k > 0 ? weekFacts(m, k - 1) : null;
  return (
    <div className="grid flex-1 grid-cols-1 gap-4 xl:min-h-0 xl:grid-cols-[minmax(0,1fr)_theme(width.rail)] xl:grid-rows-[minmax(0,1fr)]">
      <div className="flex min-w-0 flex-col gap-4 xl:min-h-0">
        <h2 className="text-balance text-mobile-title-md text-base-default">Program Health Check</h2>
        <KpiRow now={now} before={before} />
        <UnscoredNote count={now.insufficient} minimum={m.settings.n_min} period={m.period} />
        <WorkersByTaluk m={m} k={k} facts={now} />
      </div>
      <TopReasonsRail m={m} k={k} facts={now} />
    </div>
  );
}
