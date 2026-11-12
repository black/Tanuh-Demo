import { cn } from "@/lib/utils";

/* A small up or down triangle drawn in the current text colour. */
export function Triangle({ up, size = "md" }: { up: boolean; size?: "sm" | "md" }) {
  const w = size === "sm" ? 6 : 8;
  const h = size === "sm" ? 4 : 5;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true" className={cn("shrink-0 fill-current", !up && "rotate-180")}>
      <path d={`M0 ${h}L${w / 2} 0L${w} ${h}Z`} />
    </svg>
  );
}
