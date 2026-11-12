import type { Status } from "@/lib/labels";
import { Toggle } from "@/components/shadcn/toggle";

export type StatusFilterValue = Status | "all";

const OPTIONS: [StatusFilterValue, string][] = [
  ["all", "All"],
  ["low", "Consistently Low"],
  ["high", "Consistently High"],
  ["slip", "Recent Slip"],
  ["ins", "Insufficient"],
];

/* The status chips above the Workers table, web/gap/gap-2 apart. */
export function StatusFilter({ value, onChange }: { value: StatusFilterValue; onChange: (v: StatusFilterValue) => void }) {
  return (
    <div role="group" aria-label="Status" className="flex flex-wrap gap-2">
      {OPTIONS.map(([v, label]) => (
        <Toggle key={v} pressed={value === v} onPressedChange={() => onChange(v)}>{label}</Toggle>
      ))}
    </div>
  );
}
