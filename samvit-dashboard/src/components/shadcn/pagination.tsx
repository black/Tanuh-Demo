import * as React from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";

/*
 * shadcn/ui Pagination as the Figma "Pagination": Web/Button/Medium, gap web/gap/gap-2; the
 * current page is bg/brand/subtle with fg/brand/default and web/rounded/rounded. The pages
 * here are buttons, since the tables page in place rather than by URL.
 */
function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return <nav role="navigation" aria-label="Pages" data-slot="pagination" className={cn("flex", className)} {...props} />;
}

function PaginationContent({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul data-slot="pagination-content" className={cn("flex items-center gap-2", className)} {...props} />;
}

function PaginationItem(props: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = { isActive?: boolean } & React.ComponentProps<"button">;

function PaginationLink({ className, isActive, ...props }: PaginationLinkProps) {
  return (
    <button
      type="button"
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        "inline-flex items-center gap-1 rounded px-2 text-web-button-md text-base-default focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-default disabled:text-base-disabled",
        isActive && "bg-brand-subtle text-brand-default",
        className,
      )}
      {...props}
    />
  );
}

function PaginationPrevious(props: Omit<PaginationLinkProps, "children">) {
  return (
    <PaginationLink aria-label="Go to previous page" {...props}>
      <Icon name="chevron_left" size="md" />Previous
    </PaginationLink>
  );
}

function PaginationNext(props: Omit<PaginationLinkProps, "children">) {
  return (
    <PaginationLink aria-label="Go to next page" {...props}>
      Next<Icon name="chevron_right" size="md" />
    </PaginationLink>
  );
}

function PaginationEllipsis({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span aria-hidden data-slot="pagination-ellipsis" className={cn("text-web-button-md text-base-default", className)} {...props}>
      …
    </span>
  );
}

export { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis };
