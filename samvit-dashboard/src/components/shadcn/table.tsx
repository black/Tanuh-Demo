import * as React from "react";
import { cn } from "@/lib/utils";

/*
 * shadcn/ui Table: Web/Body/Small throughout; headers in fg/base/subtle; rows divided by
 * border/base/muted. A row with data-state="selected" is bg/brand/subtle.
 */
function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div data-slot="table-container" className="min-w-0 overflow-x-auto">
      <table data-slot="table" className={cn("w-full border-collapse text-web-body-sm text-base-default", className)} {...props} />
    </div>
  );
}

function TableHeader(props: React.ComponentProps<"thead">) {
  return <thead data-slot="table-header" {...props} />;
}

function TableBody(props: React.ComponentProps<"tbody">) {
  return <tbody data-slot="table-body" {...props} />;
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn("focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-default data-[state=selected]:bg-brand-subtle", className)}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      scope="col"
      className={cn("whitespace-nowrap border-b border-base-muted py-3 pr-2 text-left font-normal text-base-subtle last:pr-0", className)}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return <td data-slot="table-cell" className={cn("border-b border-base-muted py-2 pr-2 align-middle last:pr-0", className)} {...props} />;
}

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };
