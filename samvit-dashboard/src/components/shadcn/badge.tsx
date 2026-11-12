import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/*
 * shadcn/ui Badge as the Figma "Label": gap spacing/mobile/small, px mobile/padding/sm,
 * py mobile/padding/xss, fully rounded, Mobile/Label/Large. positive is brand, danger danger,
 * warning warning; muted is the "Volume" / "Last Activity" tag on bg/surface/muted.
 */
const badgeVariants = cva("inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-1 text-mobile-label-lg", {
  variants: {
    variant: {
      positive: "bg-brand-subtle text-brand-default",
      danger: "bg-danger-subtle text-danger-default",
      warning: "bg-warning-subtle text-warning-default",
      neutral: "bg-surface-disabled text-base-muted",
      muted: "bg-surface-muted text-base-default",
    },
  },
  defaultVariants: { variant: "neutral" },
});

function Badge({ className, variant, ...props }: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
