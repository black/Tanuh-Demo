import { Suspense } from "react";
import type { Metadata } from "next";
import { DataGate } from "@/components/data/DataGate";
import { QualityDimensionsView } from "@/components/dimensions/QualityDimensionsView";

export const metadata: Metadata = { title: "Quality Dimensions" };

/* The view reads ?rule= and ?taluk=, so it renders inside Suspense for the static export. */
export default function QualityDimensionsPage() {
  return (
    <DataGate>
      <Suspense>
        <QualityDimensionsView />
      </Suspense>
    </DataGate>
  );
}
