"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toggleVariants } from "@/components/shadcn/toggle";
import { VIEW_TABS, isRoute } from "./routes";

/* The three Data Quality views as Figma "Chip"s (the shadcn Toggle's chip style on links),
 * web/gap/gap-4 apart. */
export function ViewTabs() {
  const path = usePathname();
  return (
    <nav aria-label="Views" className="flex flex-wrap gap-2 sm:gap-4">
      {VIEW_TABS.map((t) => {
        const on = isRoute(path, t.href);
        return (
          <Link key={t.href} href={t.href} aria-current={on ? "page" : undefined} data-state={on ? "on" : "off"} className={toggleVariants()}>
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
