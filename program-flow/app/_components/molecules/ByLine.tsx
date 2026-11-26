import { Dot } from "../atoms/Dot";

/** "By · Name" meta used in summary cards. */
export function ByLine({ name }: { name: string }) {
  return (
    <div className="type-body-sm flex shrink-0 items-center gap-1 whitespace-nowrap">
      <span className="text-fg-subtle">By</span>
      <Dot variant="divider" />
      <span className="text-fg-brand">{name}</span>
    </div>
  );
}
