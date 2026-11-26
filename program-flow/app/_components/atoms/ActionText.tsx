import type { ReactNode } from "react";

/** Card action text button (title/sm). */
export function ActionText({
  children,
  primary,
  onClick,
}: {
  children: ReactNode;
  primary?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`type-action cursor-pointer whitespace-nowrap ${
        primary ? "text-brand-primary" : "text-text-secondary"
      }`}
    >
      {children}
    </button>
  );
}
