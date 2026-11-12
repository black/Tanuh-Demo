"use client";
import * as React from "react";
import { Toggle as TogglePrimitive } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/*
 * shadcn/ui Toggle as the Figma "Chip": 40px high, at least 88px wide, px mobile/gap/md,
 * py mobile/padding/xs, fully rounded, Mobile/Body/Small. On is bg/brand/default with
 * fg/on/brand; off is bg/brand/subtle with fg/brand/default.
 */
const toggleVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-default disabled:pointer-events-none disabled:text-base-disabled",
  {
    variants: {
      variant: {
        chip: "h-control min-w-chip-min rounded-full bg-brand-subtle px-4 py-2 text-mobile-body-sm text-brand-default hover:bg-brand-subtle-hover data-[state=on]:bg-brand-default data-[state=on]:text-on-brand",
      },
    },
    defaultVariants: { variant: "chip" },
  },
);

function Toggle({ className, variant, ...props }: React.ComponentProps<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>) {
  return <TogglePrimitive.Root data-slot="toggle" className={cn(toggleVariants({ variant, className }))} {...props} />;
}

export { Toggle, toggleVariants };
