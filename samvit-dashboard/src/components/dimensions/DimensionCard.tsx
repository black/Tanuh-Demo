import { f2 } from "@/lib/format";
import { QUESTION, type GateGroup } from "@/lib/labels";
import type { Score } from "@/lib/types";
import { Badge } from "@/components/shadcn/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card";
import { ChangeNote } from "@/components/ui/ChangeNote";

/*
 * A dimension card (the Figma "Additional-Info": gap web/gap/gap-2, padding
 * web/padding/p-4): the change on the previous period, the name in Mobile/Title/Small, its
 * question in Mobile/Body/Small fg/base/muted, and the score in Web/Headline/Large. The
 * weakest dimension carries a warning Label.
 */
export function DimensionCard({ group, score, previous, empty, weakest, note }: { group: GateGroup; score: Score | null; previous: Score | null; empty: string; weakest: boolean; note?: string | null }) {
  return (
    <Card className="relative flex min-h-kpi flex-col gap-2">
      {weakest && <Badge variant="warning" className="absolute right-2 top-4">Weakest dimension</Badge>}
      <CardHeader className="gap-2">
        <ChangeNote change={score && previous ? score.scale - previous.scale : null} goodWhenUp format={(v) => v.toFixed(2)} />
        <div className="flex flex-col gap-1">
          <CardTitle asChild className="text-mobile-title-sm"><h3>{group}</h3></CardTitle>
          <CardDescription className="text-base-muted">{QUESTION[group]}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="mt-auto">
        <p className="flex flex-wrap items-baseline gap-2 text-web-headline-lg text-base-default">
          {score ? f2(score.scale) : <span className="text-web-title-md text-base-disabled">{empty}</span>}
          {note && <span className="text-mobile-body-sm text-base-subtle">{note}</span>}
        </p>
      </CardContent>
    </Card>
  );
}
