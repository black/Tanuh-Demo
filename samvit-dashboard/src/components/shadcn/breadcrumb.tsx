import * as React from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";

/*
 * shadcn/ui Breadcrumb as the Figma "bread-crumb": Web/Label/Small, gap web/gap/gap-0-5,
 * items px web/gap/gap-1. A place you can go back to is a link in fg/link/default; the place
 * you are at is fg/base/disabled. BreadcrumbLink is a button here, since the map's levels are
 * not pages.
 */
function Breadcrumb(props: React.ComponentProps<"nav">) {
  return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...props} />;
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return <ol data-slot="breadcrumb-list" className={cn("flex flex-wrap items-center gap-0.5 text-web-label-sm", className)} {...props} />;
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return <li data-slot="breadcrumb-item" className={cn("inline-flex items-center gap-0.5 px-1 first:pl-0", className)} {...props} />;
}

function BreadcrumbLink({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      data-slot="breadcrumb-link"
      className={cn("text-link-default hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-default", className)}
      {...props}
    />
  );
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="breadcrumb-page" aria-current="page" className={cn("text-base-disabled", className)} {...props} />;
}

function BreadcrumbSeparator({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li data-slot="breadcrumb-separator" role="presentation" aria-hidden="true" className={cn("inline-flex text-base-default", className)} {...props}>
      <Icon name="chevron_right" size="sm" />
    </li>
  );
}

export { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator };
