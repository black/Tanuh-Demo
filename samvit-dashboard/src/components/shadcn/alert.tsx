import * as React from "react";
import { cn } from "@/lib/utils";

/*
 * shadcn/ui Alert: a message in place of content that could not be shown. A card surface
 * (bg/surface/default, web/rounded/lg, web/padding/p-4) with its title in Mobile/Title/Large
 * and body in Mobile/Body/Medium.
 */
function Alert({ className, ...props }: React.ComponentProps<"div">) {
  return <div role="alert" data-slot="alert" className={cn("flex max-w-prose flex-col gap-2 rounded-lg bg-surface-default p-4 text-mobile-body-md text-base-default", className)} {...props} />;
}

function AlertTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return <h2 data-slot="alert-title" className={cn("text-balance text-mobile-title-lg text-base-default", className)} {...props} />;
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="alert-description" className={cn("flex flex-col gap-2 [&_pre]:overflow-x-auto [&_pre]:rounded [&_pre]:border [&_pre]:border-base-muted [&_pre]:bg-surface-subtle [&_pre]:p-3 [&_pre]:text-web-body-sm", className)} {...props} />;
}

export { Alert, AlertTitle, AlertDescription };
