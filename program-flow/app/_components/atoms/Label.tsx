export type LabelTone = "positive" | "warning" | "danger";

const labelTone: Record<LabelTone, string> = {
  positive: "bg-surface-brand text-text-brand",
  warning: "bg-warning-subtle text-fg-warning",
  danger: "bg-danger-subtle text-fg-danger",
};

/** Figma: "label" (only label) */
export function Label({ title, tone }: { title: string; tone: LabelTone }) {
  return (
    <span
      className={`type-body-sm inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-3 py-1 ${labelTone[tone]}`}
    >
      {title}
    </span>
  );
}
