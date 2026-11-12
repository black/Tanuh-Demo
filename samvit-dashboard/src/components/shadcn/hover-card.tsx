"use client";
import * as React from "react";
import { HoverCard as HoverCardPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

/*
 * shadcn/ui HoverCard, on the map tooltip's surface: bg/surface/default, padding
 * web/padding/p-4, gap web/gap/gap-2, web/rounded/rounded and the tooltip shadow. container
 * portals the card into another element, so that pointing at it still counts as pointing
 * at that element.
 */
function HoverCard(props: React.ComponentProps<typeof HoverCardPrimitive.Root>) {
  return <HoverCardPrimitive.Root data-slot="hover-card" {...props} />;
}

function HoverCardTrigger(props: React.ComponentProps<typeof HoverCardPrimitive.Trigger>) {
  return <HoverCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />;
}

function HoverCardContent({
  className,
  align = "center",
  sideOffset = 4,
  container,
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Content> & { container?: HTMLElement | null }) {
  return (
    <HoverCardPrimitive.Portal container={container}>
      <HoverCardPrimitive.Content
        data-slot="hover-card-content"
        align={align}
        sideOffset={sideOffset}
        className={cn("z-50 flex w-tooltip flex-col gap-2 rounded bg-surface-default p-4 text-base-default shadow-tooltip outline-none", className)}
        {...props}
      />
    </HoverCardPrimitive.Portal>
  );
}

export { HoverCard, HoverCardTrigger, HoverCardContent };
