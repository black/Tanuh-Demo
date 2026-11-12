"use client";
import { ComposedChart, Line, ReferenceArea, ReferenceLine, Scatter, XAxis, YAxis } from "recharts";
import { periodTick } from "@/lib/format";
import type { Model, WorkerView } from "@/lib/model";
import { bg, border } from "@/lib/tokens";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn/card";
import { ChartContainer, type ChartConfig } from "@/components/shadcn/chart";

/*
 * "DQ Score Over Time" (the Figma "Chart": padding web/padding/p-4, web/rounded/rounded,
 * bg/surface/subtle, border/base/muted), a shadcn Card holding a shadcn Chart (Recharts). The
 * High zone is bg/brand/subtle, Mid bg/surface/default and Low bg/danger/subtle; the line and
 * points are bg/surface/inverse. The High and Low thresholds are labelled in
 * Mobile/Title/Small. A dashed ring at the foot marks a period with too few records to score.
 * The colours are the Tailwind tokens, passed to the chart as --color-* variables.
 */
const config = {
  score: { label: "DQ Score", color: bg["surface-inverse"] },
  ins: { label: "Insufficient", color: border["base-strong"] },
  high: { label: "High", color: bg["brand-subtle"] },
  mid: { label: "Mid", color: bg["surface-default"] },
  low: { label: "Low", color: bg["danger-subtle"] },
  week: { label: "Selected period", color: border["base-default"] },
} satisfies ChartConfig;

type Point = { i: number; score: number | null; ins: number | null };
type DotProps = { cx?: number; cy?: number; index?: number; payload?: Point };

export function DqScoreChart({ m, w, k }: { m: Model; w: WorkerView; k: number }) {
  const n = m.weeks.length;
  const hi = m.settings.band_high_scale, lo = m.settings.band_low_scale;
  const data: Point[] = m.weeks.map((_, i) => {
    const x = w.w[i];
    return { i, score: x && !x.insufficient && x.scores.trust ? x.scores.trust.scale : null, ins: x?.insufficient ? 1.25 : null };
  });
  const ticks = [0, Math.floor((n - 1) / 3), Math.floor((2 * (n - 1)) / 3), n - 1].filter((v, i, a) => a.indexOf(v) === i);
  const week = (i: unknown) => (typeof i === "number" && m.weeks[i] ? periodTick(m, i) : "");

  return (
    <Card className="flex flex-col gap-2 rounded border border-base-muted bg-surface-subtle">
      <CardHeader>
        <CardTitle asChild className="text-mobile-title-sm"><h3>DQ Score Over Time</h3></CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} role="img" aria-label={`DQ score by ${m.period}`} className="h-chart w-full">
          <ComposedChart data={data} margin={{ top: 8, right: 10, bottom: 0, left: 0 }}>
            {hi != null && lo != null && (
              <>
                <ReferenceArea y1={hi} y2={5} fill="var(--color-high)" fillOpacity={1} stroke="none" ifOverflow="hidden" />
                <ReferenceArea y1={lo} y2={hi} fill="var(--color-mid)" fillOpacity={1} stroke="none" ifOverflow="hidden" />
                <ReferenceArea y1={1} y2={lo} fill="var(--color-low)" fillOpacity={1} stroke="none" ifOverflow="hidden" />
              </>
            )}
            <XAxis dataKey="i" type="number" domain={[0, Math.max(0, n - 1)]} ticks={ticks} tickFormatter={week} tickLine={false} axisLine={false} tickMargin={6} />
            <YAxis
              domain={[1, 5]}
              ticks={hi != null && lo != null ? [lo, hi] : []}
              tickFormatter={(v: number) => v.toFixed(1)}
              tick={{ fill: "var(--color-score)", fontSize: 14, fontWeight: 500 }}
              tickLine={false}
              axisLine={false}
              width={34}
            />
            <ReferenceLine x={k} stroke="var(--color-week)" strokeDasharray="3 3" />
            <Line
              dataKey="score"
              type="linear"
              stroke="var(--color-score)"
              strokeWidth={1.5}
              connectNulls={false}
              isAnimationActive={false}
              dot={({ cx, cy, index, payload }: DotProps) =>
                payload?.score == null || cx == null || cy == null ? <g key={index} /> : <circle key={index} cx={cx} cy={cy} r={index === k ? 4 : 3} fill="var(--color-score)" />
              }
              activeDot={false}
            />
            <Scatter
              dataKey="ins"
              isAnimationActive={false}
              shape={({ cx, cy, payload }: DotProps) => (payload?.ins == null ? <g /> : <circle cx={cx} cy={cy} r={3.5} fill="none" stroke="var(--color-ins)" strokeDasharray="2 2" />)}
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
