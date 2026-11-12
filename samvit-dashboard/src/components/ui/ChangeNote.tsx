import { cn } from "@/lib/utils";
import { useDashboardData } from "@/context/DashboardData";
import { Triangle } from "./Triangle";

/*
 * "▲ 1.1% vs Previous Week" (or Month) above a KPI: Mobile/Label/Small in fg/base/disabled,
 * with the arrow in fg/success/default when the change is good and fg/danger/default when it
 * is bad.
 */
export function ChangeNote({ change, goodWhenUp, format }: { change: number | null; goodWhenUp: boolean | null; format: (abs: number) => string }) {
  const { period } = useDashboardData();
  const unit = period === "month" ? "Month" : "Week";
  let body: React.ReactNode;
  if (change == null || !isFinite(change)) body = `No previous ${unit.toLowerCase()}`;
  else if (Math.abs(change) < 5e-4) body = `No change vs Previous ${unit}`;
  else {
    const up = change > 0;
    const tone = goodWhenUp == null ? "text-base-disabled" : up === goodWhenUp ? "text-success-default" : "text-danger-default";
    body = (
      <>
        <span className={cn("inline-flex size-icon-sm items-center justify-center", tone)}>
          <Triangle up={up} size="sm" />
        </span>
        {format(Math.abs(change))} vs Previous {unit}
      </>
    );
  }
  return <p className="flex items-center gap-1 text-mobile-label-sm text-base-disabled">{body}</p>;
}
