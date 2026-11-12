import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/*
 * shadcn/ui Button, restyled with the Figma tokens. default is the brand fill, ghost the
 * "icon-button" hover (bg/surface/subtle) and link an in-page action in fg/link/default.
 */
const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-1 whitespace-nowrap focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-default disabled:pointer-events-none disabled:text-base-disabled",
  {
    variants: {
      variant: {
        default: "bg-brand-default text-on-brand",
        ghost: "text-base-default hover:bg-surface-subtle",
        link: "text-left text-link-default hover:underline",
      },
      size: {
        default: "h-control rounded px-4 py-2 text-web-button-md",
        sm: "rounded px-2 text-web-button-md",
        icon: "size-control rounded p-2",
        link: "text-web-label-sm",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "button";
  return <Comp data-slot="button" type={asChild ? undefined : "button"} className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
