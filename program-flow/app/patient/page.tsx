"use client";

import { useState } from "react";
import { TopNavbar } from "../_components/organisms/TopNavbar";
import { AvailableProgramCard } from "../_components/organisms/AvailableProgramCard";
import { PatientSummaryCard } from "../_components/organisms/PatientSummaryCard";
import { RegisteredProgramCard } from "../_components/organisms/RegisteredProgramCard";
import { Chip } from "../_components/atoms/Chip";
import { SectionHeader } from "../_components/atoms/SectionHeader";

type Tab = "registered" | "available";

export default function PatientDashboardPage() {
  const [tab, setTab] = useState<Tab>("registered");

  return (
    <main className="min-h-screen bg-surface-l1">
      <TopNavbar label="Patient Dashboard" />

      <div className="flex flex-col px-4 pt-4 pb-6">
        <PatientSummaryCard />

        <div className="mt-4">
          <SectionHeader variant="brand">Programs</SectionHeader>
        </div>

        <div className="mt-[15px] flex gap-4">
          <Chip
            title="Regsitered"
            selected={tab === "registered"}
            onClick={() => setTab("registered")}
          />
          <Chip
            title="Available"
            selected={tab === "available"}
            onClick={() => setTab("available")}
          />
        </div>

        <div className="mt-8 flex flex-col gap-4">
          {tab === "registered" ? (
            <RegisteredProgramCard href="/program" />
          ) : (
            Array.from({ length: 5 }, (_, i) => <AvailableProgramCard key={i} />)
          )}
        </div>
      </div>
    </main>
  );
}
