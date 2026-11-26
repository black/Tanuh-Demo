"use client";

import { useState } from "react";
import { TopNavbar } from "../_components/organisms/TopNavbar";
import { EncounterTypeCard, type EncounterIcon } from "../_components/organisms/EncounterTypeCard";
import { ProgramSummaryCard } from "../_components/organisms/ProgramSummaryCard";
import { VisitCard } from "../_components/organisms/VisitCard";
import { ConfirmDialog } from "../_components/molecules/ConfirmDialog";
import { Chip } from "../_components/atoms/Chip";
import { SectionHeader } from "../_components/atoms/SectionHeader";

type Tab = "unplanned" | "planned" | "completed";

const neutralTint = "rgba(200,200,200,0.2)";

const unplanned: { title: string; subtitle: string; icon: EncounterIcon }[] = [
  {
    title: "Breast Cancer Screening",
    subtitle: "PinkShieldAI",
    icon: { kind: "icon", src: "/figma/mindfulness.svg", size: 40, tint: neutralTint },
  },
  {
    title: "Oral Cancer Screening",
    subtitle: "Aarogya Aarohan",
    icon: { kind: "image", src: "/figma/aarogya-aarohan.png", overlay: true, size: 48 },
  },
  {
    title: "Mental Health Screening",
    subtitle: "Module Name",
    icon: { kind: "icon", src: "/figma/mindfulness.svg", size: 40, tint: neutralTint },
  },
  {
    title: "Hypertension Screening",
    subtitle: "Module Name",
    icon: {
      kind: "icon",
      src: "/figma/anatomical-heart.svg",
      size: 36,
      tint: "rgba(244,171,186,0.15)",
    },
  },
  {
    title: "NCD Follow Up",
    subtitle: "Breast Cancer Screening",
    icon: { kind: "image", src: "/figma/ncd-follow-up.png", overlay: false, size: 47 },
  },
];

export default function ProgramDashboardPage() {
  const [tab, setTab] = useState<Tab>("unplanned");
  const [confirmExit, setConfirmExit] = useState(false);
  const [exitedOn, setExitedOn] = useState<string>();

  return (
    <main className="min-h-screen bg-surface-l1">
      <TopNavbar
        label="Program Dashboard"
        sublabel="Non-Communicatable Disease"
      />

      <div className="flex flex-col px-4 pt-4 pb-6">
        <ProgramSummaryCard
          exitedOn={exitedOn}
          onExit={() => setConfirmExit(true)}
        />

        <div className="mt-6">
          <SectionHeader variant="tertiary">Encounters</SectionHeader>
        </div>

        <div className="mt-4 flex gap-4">
          <Chip
            title="Unplanned"
            selected={tab === "unplanned"}
            onClick={() => setTab("unplanned")}
          />
          <Chip
            title="Planned"
            selected={tab === "planned"}
            onClick={() => setTab("planned")}
          />
          <Chip
            title="Completed"
            selected={tab === "completed"}
            onClick={() => setTab("completed")}
          />
        </div>

        <div className="mt-6 flex flex-col gap-4">
          {tab === "unplanned" &&
            unplanned.map((e) => <EncounterTypeCard key={e.title} {...e} />)}

          {tab === "planned" && (
            <>
              <VisitCard
                title="High Risk Referral"
                date="19 May, 2026"
                status={{ title: "Overdue", tone: "danger" }}
                actions={["Cancel", "Start"]}
              />
              <VisitCard
                title="Referral Slip"
                date="19 May, 2026"
                status={{ title: "Overdue", tone: "danger" }}
                actions={["Cancel", "Start"]}
              />
            </>
          )}

          {tab === "completed" && (
            <VisitCard
              title="Breast Screening"
              date="19 May, 2026"
              actions={["Edit", "Share"]}
            />
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirmExit}
        title="Exit program?"
        message="Are you sure you want to exit Non-Communicable Disease (NCD)?"
        confirmLabel="Exit"
        onCancel={() => setConfirmExit(false)}
        onConfirm={() => {
          setExitedOn("17 June, 2026");
          setConfirmExit(false);
        }}
      />
    </main>
  );
}
