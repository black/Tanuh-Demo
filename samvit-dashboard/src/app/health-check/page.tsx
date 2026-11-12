import type { Metadata } from "next";
import { DataGate } from "@/components/data/DataGate";
import { HealthCheckView } from "@/components/health/HealthCheckView";

export const metadata: Metadata = { title: "Health Check" };

export default function HealthCheckPage() {
  return (
    <DataGate>
      <HealthCheckView />
    </DataGate>
  );
}
