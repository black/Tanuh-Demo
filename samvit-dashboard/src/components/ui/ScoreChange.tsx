import { f2 } from "@/lib/format";
import type { Score } from "@/lib/types";
import { Triangle } from "./Triangle";

/*
 * A DQ score (TrustIndex) with an arrow for its change on the worker's previous scored week:
 * up in fg/base/default, down in fg/danger/default. The arrow compares two stored scores.
 */
export function ScoreChange({ score, previous }: { score: Score; previous: Score | null }) {
  const dir = !previous || Math.abs(score.scale - previous.scale) < 5e-4 ? null : score.scale > previous.scale ? "up" : "down";
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap">
      <span className="inline-flex size-icon-sm items-center justify-center">
        {dir === "up" && <span className="text-base-default"><Triangle up /></span>}
        {dir === "down" && <span className="text-danger-default"><Triangle up={false} /></span>}
        {dir && <span className="sr-only">{dir === "up" ? "up from" : "down from"} {f2(previous!.scale)}</span>}
      </span>
      {f2(score.scale)}
    </span>
  );
}
