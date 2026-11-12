import { int } from "@/lib/format";
import { Card, CardTitle } from "@/components/shadcn/card";
import { Separator } from "@/components/shadcn/separator";

/*
 * The Figma "quality-reason-card", a shadcn Card: gap 8px, padding web/padding/p-2,
 * web/rounded/rounded on bg/surface/default. Title in Mobile/Body/Medium; meta in
 * Mobile/Label/Small fg/base/subtle, split by a 3px dot; a 48px separator; the failure rate in
 * Mobile/Title/Large fg/danger/default, its "%" in Web/Label/Small fg/base/subtle and
 * "Failure" in Mobile/Label/Small fg/danger/default.
 */
export function ReasonCard({ title, group, records, rate, onClick, hint }: { title: string; group: string; records: number; rate: number | null; onClick?: () => void; hint?: string }) {
  return (
    <Card asChild className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded p-2 text-left hover:bg-surface-subtle focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-default">
      <button type="button" onClick={onClick} title={hint}>
        <span className="flex min-w-0 flex-col">
          <CardTitle asChild className="text-mobile-body-md"><span>{title}</span></CardTitle>
          <span className="flex flex-wrap items-center gap-1.5 text-mobile-label-sm text-base-subtle">
            {group}
            <i className="size-bullet rounded-full bg-surface-disabled" aria-hidden="true" />
            {int(records)} Records
          </span>
        </span>
        <span className="flex items-center gap-2">
          <Separator orientation="vertical" className="h-separator self-auto" />
          <span className="flex flex-col py-1">
            <span className="whitespace-nowrap">
              <span className="text-mobile-title-lg text-danger-default">{rate == null ? "—" : (rate * 100).toFixed(1)}</span>
              {rate != null && <span className="align-top text-web-label-sm text-base-subtle">%</span>}
            </span>
            <span className="text-mobile-label-sm text-danger-default">Failure</span>
          </span>
        </span>
      </button>
    </Card>
  );
}
