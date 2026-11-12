"use client";
import { useDashboardData } from "@/context/DashboardData";
import { periodTitle } from "@/lib/format";
import type { Period } from "@/lib/model";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/shadcn/toggle-group";

/*
 * The period: the design's Daily / Week / Month tabs and a picker for the week or month.
 * Week shows the stored weekly scores; Month groups them by calendar month (lib/months.ts).
 * No daily scores are stored, so Daily is shown but cannot be chosen.
 */
export function PeriodControls() {
  const { view, setK, period, setPeriod } = useDashboardData();
  if (!view) return null;
  const { m, k } = view;
  const options = m.weeks.map((_, i) => ({ value: String(i), label: `${periodTitle(m, i)}${i === m.weeks.length - 1 ? " (latest)" : ""}` })).reverse();
  const label = period === "month" ? "Month" : "Week";
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select value={String(k)} onValueChange={(v) => setK(Number(v))}>
        <SelectTrigger id="period" aria-label={label}><SelectValue /></SelectTrigger>
        <SelectContent>
          {options.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
        </SelectContent>
      </Select>
      <ToggleGroup type="single" aria-label="Period" value={period} onValueChange={(v) => v && setPeriod(v as Period)}>
        <ToggleGroupItem value="day" disabled title="No daily scores are stored">Daily</ToggleGroupItem>
        <ToggleGroupItem value="week">Week</ToggleGroupItem>
        <ToggleGroupItem value="month" title="Each month is the average of its weekly scores">Month</ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
