import * as React from "react";
import { Slot } from "radix-ui";
import { cn } from "@/lib/utils";

/*
 * shadcn/ui Card: a white surface (bg/surface/default) with the design's card radius
 * (web/rounded/lg) and padding (web/padding/p-4). asChild renders it as another element, such
 * as a section. CardTitle is the Figma "Section Header" at its large size (Mobile/Title/Large).
 */
function Card({ className, asChild = false, ...props }: React.ComponentProps<"div"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "div";
  return <Comp data-slot="card" className={cn("min-w-0 rounded-lg bg-surface-default p-4 text-base-default", className)} {...props} />;
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-header" className={cn("flex flex-col gap-1", className)} {...props} />;
}

function CardTitle({ className, asChild = false, ...props }: React.ComponentProps<"h2"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "h2";
  return <Comp data-slot="card-title" className={cn("text-balance text-mobile-title-lg text-base-default", className)} {...props} />;
}

function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="card-description" className={cn("text-mobile-body-sm text-base-subtle", className)} {...props} />;
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-content" className={className} {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-footer" className={cn("flex items-center", className)} {...props} />;
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
