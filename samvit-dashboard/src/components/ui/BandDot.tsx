import { cn } from "@/lib/utils";

/*
 * A score band as a dot. On the map and in its tooltip, High is bg/brand/default; in legends
 * and tables it is bg/success/default. Low is bg/danger/default. Mid is a hollow ring and
 * Insufficient a dashed ring, both border/base/strong.
 */
export type DotBand = "high" | "success" | "low" | "mid" | "ins" | "none";

const FILL: Record<DotBand, string> = {
  high: "bg-brand-default",
  success: "bg-success-default",
  low: "bg-danger-default",
  mid: "border border-base-strong bg-surface-default",
  ins: "border border-dashed border-base-strong bg-surface-default",
  none: "border border-dashed border-base-strong bg-surface-default",
};
const SIZE = { sm: "size-dot-sm", md: "size-dot", lg: "size-icon-sm" } as const;

export function BandDot({ band, size = "md", title }: { band: DotBand; size?: keyof typeof SIZE; title?: string }) {
  return <i title={title} aria-hidden={title ? undefined : true} className={cn("inline-block shrink-0 rounded-full", SIZE[size], FILL[band])} />;
}
