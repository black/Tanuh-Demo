/** Figma: "label" with key/value (e.g. Enrolled · date, Exited · date) */
export function KeyValueLabel({ label, value }: { label: string; value: string }) {
  return (
    <span className="type-body-sm inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-surface-muted px-3 py-1">
      <span className="text-content-helper">{label}</span>
      <span className="text-content-primary">{value}</span>
    </span>
  );
}
