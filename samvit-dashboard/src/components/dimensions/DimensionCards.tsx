import type { Model, TalukView } from "@/lib/model";
import type { GateGroup } from "@/lib/labels";
import type { Score } from "@/lib/types";
import { DimensionCard } from "./DimensionCard";

const KEYS: [GateGroup, "sufficiency" | "provenance_confidence" | "quality"][] = [
  ["Sufficiency", "sufficiency"],
  ["Genuineness", "provenance_confidence"],
  ["Fidelity", "quality"],
];

/* The taluk's Sufficiency, Genuineness (provenance confidence) and Fidelity for the period,
 * as the first row of the Quality Dimensions grid. The lowest of them is marked the weakest. */
export function DimensionCards({ m, k, taluk }: { m: Model; k: number; taluk: TalukView }) {
  const now = taluk.w[k];
  const before = k > 0 ? taluk.w[k - 1] : null;
  const pick = (w: typeof now, key: (typeof KEYS)[number][1]): Score | null => (w && !w.insufficient ? w.scores[key] : null);
  const cards = KEYS.map(([group, key]) => ({ group, score: pick(now, key), previous: pick(before, key) }));
  const measured = cards.filter((c) => c.score);
  const weakest = measured.length > 1 ? measured.reduce((a, b) => (b.score!.value < a.score!.value ? b : a)) : null;
  const empty = !now ? `No records this ${m.period}` : now.insufficient ? "Insufficient data" : "Not measured";
  const fab = now && !now.insufficient && now.scores.fabrication_suspicion ? `Fabrication suspicion ${now.scores.fabrication_suspicion.value.toFixed(0)}/100` : null;
  return (
    <>
      {cards.map((c) => (
        <DimensionCard key={c.group} group={c.group} score={c.score} previous={c.previous} empty={empty} weakest={c === weakest} note={c.group === "Genuineness" ? fab : null} />
      ))}
    </>
  );
}
