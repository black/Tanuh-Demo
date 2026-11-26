import type { ReactNode } from "react";

/** Figma: "Section Header" */
export function SectionHeader({
  children,
  variant,
}: {
  children: ReactNode;
  variant: "brand" | "tertiary";
}) {
  return variant === "brand" ? (
    <h2 className="type-title-sm text-text-brand">{children}</h2>
  ) : (
    <h2 className="type-title-xs text-icon-tertiary">{children}</h2>
  );
}
