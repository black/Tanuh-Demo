import { Suspense } from "react";
import type { Metadata } from "next";
import { DataGate } from "@/components/data/DataGate";
import { WorkersView } from "@/components/workers/WorkersView";

export const metadata: Metadata = { title: "Workers" };

/* The view reads ?worker=, ?taluk= and ?status=, so it renders inside Suspense for the static export. */
export default function WorkersPage() {
  return (
    <DataGate>
      <Suspense>
        <WorkersView />
      </Suspense>
    </DataGate>
  );
}
