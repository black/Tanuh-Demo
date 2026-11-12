"use client";
import * as React from "react";
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

/*
 * shadcn/ui ToggleGroup as the Figma "Tabs": 40px high, radius web/gap/gap-2, each item
 * px web/padding/p-4 and py web/padding/p-2 in Web/Button/Medium. The item that is on is
 * bg/brand/default with fg/on/brand; the others fg/base/subtle.
 */
function ToggleGroup({ className, ...props }: React.ComponentProps<typeof ToggleGroupPrimitive.Root>) {
  return <ToggleGroupPrimitive.Root data-slot="toggle-group" className={cn("flex h-control items-center overflow-hidden rounded-lg bg-surface-default", className)} {...props} />;
}

function ToggleGroupItem({ className, ...props }: React.ComponentProps<typeof ToggleGroupPrimitive.Item>) {
  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      className={cn(
        "flex h-full items-center justify-center whitespace-nowrap px-4 py-2 text-web-button-md text-base-subtle focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-default enabled:hover:bg-surface-disabled disabled:cursor-default disabled:text-base-disabled data-[state=on]:bg-brand-default data-[state=on]:text-on-brand data-[state=on]:hover:bg-brand-default",
        className,
      )}
      {...props}
    />
  );
}

export { ToggleGroup, ToggleGroupItem };
