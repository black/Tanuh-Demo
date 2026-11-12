"use client";
import type { ReactNode } from "react";
import { useDashboardData } from "@/context/DashboardData";
import { Alert, AlertDescription, AlertTitle } from "@/components/shadcn/alert";

/* Renders its children once dashboard.json has loaded; until then a loading line, and if
 * the file cannot be read, what went wrong and the command that writes it. */
export function DataGate({ children }: { children: ReactNode }) {
  const { data } = useDashboardData();
  if (data.status === "loading") return <p className="text-mobile-body-md text-base-subtle">Loading scores…</p>;
  if (data.status === "missing")
    return (
      <Alert>
        <AlertTitle>No scores to show</AlertTitle>
        <AlertDescription>
          <p>This page reads <code>dashboard.json</code> from the site&apos;s root, and {data.reason}.</p>
          <p>Write the file from the stored scores with</p>
          <pre>dqs dashboard export --tenant &lt;tenant key&gt; --out &lt;site folder&gt;/dashboard.json</pre>
          <p className="text-base-subtle">The command needs the scores to have been computed by <code>dqs etl run</code>. DASHBOARD.md describes the file.</p>
        </AlertDescription>
      </Alert>
    );
  return <>{children}</>;
}
