/** Figma: "chip" — selected / unselected segmented filter. */
export function Chip({
  title,
  selected,
  onClick,
}: {
  title: string;
  selected: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`flex h-10 min-w-[88px] cursor-pointer items-center justify-center rounded-full px-4 py-2 ${
        selected ? "bg-selection-selected" : "bg-surface-brand"
      }`}
    >
      <span
        className={`type-body-sm whitespace-nowrap text-center ${
          selected ? "text-fg-selection-selected" : "text-text-brand"
        }`}
      >
        {title}
      </span>
    </button>
  );
}
