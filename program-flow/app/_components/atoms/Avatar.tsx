/** Figma: "Avatar" (size=lg, type=initials) */
export function Avatar({ initials }: { initials: string }) {
  return (
    <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-surface-brand">
      <span className="type-avatar text-text-brand">{initials}</span>
    </div>
  );
}
