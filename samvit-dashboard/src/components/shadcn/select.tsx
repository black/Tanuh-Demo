"use client";
import * as React from "react";
import { Select as SelectPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";

/*
 * shadcn/ui Select. The trigger is the Figma "dropdown-unbounded" ("Select District"):
 * Web/Button/Large in fg/brand/pressed with a chevron, gap web/gap/gap-2, on the page
 * background with no border. The list is bg/surface/default with the overlay shadow; the
 * highlighted option is bg/surface/subtle and the chosen one is marked with a check.
 */
function Select(props: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

function SelectValue(props: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

function SelectTrigger({ className, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn(
        "inline-flex max-w-full items-center gap-2 rounded py-1 pl-2 pr-1 text-left text-web-button-lg text-brand-pressed hover:bg-surface-default focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-default [&>span]:truncate",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon className="inline-flex text-base-default">
        <Icon name="expand_more" size="md" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({ className, children, position = "popper", ...props }: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        position={position}
        sideOffset={4}
        className={cn("relative z-50 max-h-[var(--radix-select-content-available-height)] min-w-[var(--radix-select-trigger-width)] overflow-y-auto rounded bg-surface-default p-1 text-base-default shadow-overlay", className)}
        {...props}
      >
        <SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectItem({ className, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center gap-2 rounded py-2 pl-2 pr-8 text-web-body-md outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-surface-subtle data-[state=checked]:text-brand-default data-[disabled]:text-base-disabled",
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <span className="absolute right-2 flex size-icon-sm items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Icon name="check" size="sm" />
        </SelectPrimitive.ItemIndicator>
      </span>
    </SelectPrimitive.Item>
  );
}

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue };
