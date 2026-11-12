import { cn } from "@/lib/utils";

const SIZE = { lg: "text-icon", md: "text-icon-md", sm: "text-icon-sm" } as const;

/** A Material Symbols Outlined glyph at weight 300 (see globals.css). `name` is the icon's
 *  ligature, such as "download". */
export function Icon({ name, size = "lg", className }: { name: string; size?: keyof typeof SIZE; className?: string }) {
  return (
    <span aria-hidden="true" className={cn("material-symbols-outlined select-none", SIZE[size], className)}>
      {name}
    </span>
  );
}
