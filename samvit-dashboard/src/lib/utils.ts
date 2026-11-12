import type { KeyboardEvent } from "react";
import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/*
 * shadcn/ui's class joiner. tailwind-merge is told about the design's text styles
 * (text-web-*, text-mobile-*, text-icon*) so it treats them as font sizes; otherwise it would
 * read them as text colours and drop them in favour of a later text-{colour} class.
 */
const twMerge = extendTailwindMerge({
  extend: { classGroups: { "font-size": [{ text: [(v: string) => /^(web-|mobile-|icon)/.test(v)] }] } },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/*
 * Props that make a shadcn TableRow selectable by click or keyboard: it highlights with
 * bg/surface/subtle on hover and bg/brand/subtle (data-state="selected") when selected.
 */
export function selectableRow(onSelect: () => void, selected?: boolean) {
  return {
    tabIndex: 0,
    "aria-selected": !!selected,
    "data-state": selected ? "selected" : undefined,
    onClick: onSelect,
    onKeyDown: (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect(); }
    },
    className: cn("cursor-pointer", !selected && "hover:bg-surface-subtle"),
  };
}

/** One page of rows, with the page clamped to those that exist. */
export const paginate = <T,>(rows: T[], page: number, size: number) => {
  const pages = Math.max(1, Math.ceil(rows.length / size));
  const p = Math.min(Math.max(1, page), pages);
  return { page: p, pages, rows: rows.slice((p - 1) * size, p * size) };
};

/** The page numbers to offer: the first, the last and those beside the current one, with "…" for gaps. */
export function pageList(page: number, pages: number) {
  const nums: (number | "…")[] = [];
  for (let i = 1; i <= pages; i++) {
    if (i === 1 || i === pages || Math.abs(i - page) <= 1) nums.push(i);
    else if (nums[nums.length - 1] !== "…") nums.push("…");
  }
  return nums;
}
