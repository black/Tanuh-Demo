import { cn } from "@/lib/utils";
import { f2 } from "@/lib/format";
import type { Score } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/shadcn/card";

/*
 * The Figma "stats-card": gap web/gap/gap-2, px web/padding/p-4, py web/gap/gap-4,
 * web/rounded/rounded, bg/surface/subtle with a border/base/muted border. Label in
 * Web/Body/Medium, fg/danger/default for a Low score and fg/brand/default for a High one;
 * value in Web/Title/Large fg/base/muted.
 */
export function ScoreTile({ label, score, empty, note }: { label: string; score: Score | null; empty?: string; note?: string | null }) {
  const tone = score?.band === "low" ? "text-danger-default" : score?.band === "high" ? "text-brand-default" : "text-base-default";
  return (
    <Card className="flex flex-col gap-2 rounded border border-base-muted bg-surface-subtle">
      <CardHeader>
        <CardTitle asChild className={cn("text-web-body-md", tone)}><p>{label}</p></CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-web-title-lg text-base-muted">{score ? f2(score.scale) : <span className="text-web-body-md text-base-disabled">{empty ?? "—"}</span>}</p>
      </CardContent>
      <CardFooter>
        <p className="text-mobile-label-sm text-base-subtle">{note ?? (score ? `Range ${f2(score.low_scale)} – ${f2(score.high_scale)}` : " ")}</p>
      </CardFooter>
    </Card>
  );
}
