import { int, pct } from "@/lib/format";
import type { WeekFacts } from "@/lib/model";
import { KpiCard } from "./KpiCard";

/* The period's four headline counts, each with its change on the previous period. */
export function KpiRow({ now, before }: { now: WeekFacts; before: WeekFacts | null }) {
  const growth = (a: number, b: number) => (b ? (a - b) / b : null);
  const share = (n: number, of: number) => (of ? n / of : null);
  const shareChange = (f: (x: WeekFacts) => number) =>
    before && before.scored.length && now.scored.length ? f(now) / now.scored.length - f(before) / before.scored.length : null;
  const pts = (v: number) => `${(v * 100).toFixed(1)} pts`;
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard label="Records Assessed" value={int(now.records)} suffix="records" change={{ change: before && growth(now.records, before.records), goodWhenUp: null, format: (v) => pct(v) }} />
      <KpiCard label="Workers Assessed" value={int(now.scored.length)} suffix={`of ${int(now.present.length)}`} change={{ change: before && now.scored.length - before.scored.length, goodWhenUp: true, format: (v) => int(v) }} />
      <KpiCard label="Workers with Low Scores" value={int(now.low)} suffix={`(${pct(share(now.low, now.scored.length))})`} change={{ change: shareChange((x) => x.low), goodWhenUp: false, format: pts }} />
      <KpiCard label="Workers with High Scores" value={int(now.high)} suffix={`(${pct(share(now.high, now.scored.length))})`} change={{ change: shareChange((x) => x.high), goodWhenUp: true, format: pts }} />
    </div>
  );
}
