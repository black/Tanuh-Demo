import { f2 } from "@/lib/format";
import { BandDot } from "./BandDot";

/* The score legend under a table or the map: Mobile/Label/Large in fg/base/subtle. */
export function Legend({ high, low, withMid = false }: { high?: number; low?: number; withMid?: boolean }) {
  const hi = high != null ? f2(high) : "the High threshold";
  const lo = low != null ? f2(low) : "the Low threshold";
  const Item = ({ children }: { children: React.ReactNode }) => <span className="inline-flex items-center gap-2">{children}</span>;
  return (
    <div className="flex flex-wrap items-center gap-4 text-mobile-label-lg text-base-subtle">
      <Item><BandDot band="success" size="lg" />High {hi} and above</Item>
      <Item><BandDot band="low" size="lg" />Low below {lo}</Item>
      {withMid && (
        <>
          <Item><BandDot band="mid" size="lg" />Mid {lo} – {hi}</Item>
          <Item><BandDot band="ins" size="lg" />Insufficient data</Item>
        </>
      )}
    </div>
  );
}
