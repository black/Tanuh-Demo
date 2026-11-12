import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn/card";
import { ChangeNote } from "@/components/ui/ChangeNote";

/*
 * The Figma "Additional-Info" KPI card: gap web/gap/gap-2, padding web/padding/p-4,
 * radius web/gap/gap-2. Label in Mobile/Title/Small; value in Web/Headline/Large
 * fg/base/default with its suffix in Web/Title/Medium fg/base/subtle.
 */
export function KpiCard({ label, value, suffix, change }: { label: string; value: string; suffix: string; change: React.ComponentProps<typeof ChangeNote> }) {
  return (
    <Card className="flex min-h-kpi flex-col gap-2">
      <CardHeader className="gap-2">
        <ChangeNote {...change} />
        <CardTitle asChild className="text-mobile-title-sm"><h3>{label}</h3></CardTitle>
      </CardHeader>
      <CardContent className="mt-auto">
        <p className="text-web-headline-lg text-base-default">
          {value} <span className="text-web-title-md text-base-subtle">{suffix}</span>
        </p>
      </CardContent>
    </Card>
  );
}
