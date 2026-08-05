"use client";

import React from "react";
import TopNavbar from "./TopNavbar";
import Button from "./Button";
import type { ReferralDetails } from "@/lib/types";

const HABITS = [
  { label: "Cigarettes/Bidi usage", value: "Never" },
  { label: "Smokeless Tobacco Usage", value: "Never" },
  { label: "Areca Nut Consumption", value: "Never" },
  { label: "Alcohol Consumption", value: "Never" },
];

interface Props {
  referral: ReferralDetails;
  onBack: () => void;
  onFinish: () => void;
}

const SummaryScreen = (props: Props) => {
  const { referral, onBack, onFinish } = props;

  const referralText =
    referral.referToDentist === "yes" && referral.hospital
      ? `${referral.hospital}${referral.district ? `, ${referral.district}` : ""}`
      : "Not referred";

  return (
    <div className="relative flex h-[800px] w-[360px] flex-col overflow-hidden bg-surface-primary shadow-xl">
      <TopNavbar
        label="Summary & Recommendation"
        sublabel="Oral Screening"
        onBack={onBack}
      />

      <div className="no-scrollbar flex-1 overflow-y-auto px-4 pb-24 pt-4">
        <div className="flex items-center gap-3">
          <div className="flex size-14 items-center justify-center rounded-full bg-brand-primary">
            <span className="text-title-md text-text-positive">PN</span>
          </div>
          <div>
            <p className="text-title-md text-text-primary">Patient Name</p>
            <p className="flex items-center gap-2 text-body-md text-text-primary">
              Female <span className="size-1 rounded-full bg-text-secondary" /> 24 Years
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-sm bg-surface-white px-md py-sm">
          <p className="text-label-sm text-text-primary opacity-70">Location</p>
          <p className="text-body-md text-brand-primary opacity-70">
            Belgavi Chikodi, Ankali ...
          </p>
        </div>

        <div className="mt-4 overflow-hidden rounded-lg bg-surface-white shadow-[0px_0px_2px_rgba(0,0,0,0.15)]">
          <div className="flex flex-col gap-4 bg-brand-primary-light px-md py-md">
            <div className="flex items-center justify-between">
              <p className="text-title-md text-brand-primary-dark">
                ORAL SCREENING
              </p>
            </div>
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-2 text-body-sm">
                <p>
                  <span className="text-text-secondary">Visited </span>
                  <span className="text-brand-primary">21 May, 2026</span>
                </p>
                <p>
                  <span className="text-text-secondary">By </span>
                  <span className="text-brand-primary">Person Name</span>
                </p>
              </div>
              <p className="text-body-sm">
                <span className="text-text-secondary">Scheduled </span>
                <span className="text-brand-primary">19 May, 2026</span>
              </p>
            </div>
          </div>

          <div className="px-md pt-md">
            <p className="text-body-md text-text-primary">Habit Questionnaire</p>
            <div className="mt-4 flex flex-col gap-4">
              {HABITS.map((habit) => (
                <div key={habit.label} className="flex items-start justify-between">
                  <p className="text-body-sm text-text-secondary">{habit.label}</p>
                  <p className="text-body-sm text-text-primary">{habit.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 border-t border-border px-md py-sm">
            <div className="flex items-start justify-between">
              <p className="text-body-sm text-text-secondary">Referral</p>
              <p className="max-w-[180px] text-right text-body-sm text-text-primary">
                {referralText}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-lg bg-surface-white px-md py-md">
          <p className="text-title-md text-brand-primary-dark">
            Visits Being Scheduled
          </p>
          <div className="mt-2 flex items-start justify-between gap-2 text-body-sm">
            <div className="flex-1">
              <p className="text-text-secondary">Visit Name</p>
              <p className="text-brand-primary">Clinician Review Form</p>
            </div>
            <div className="flex-1">
              <p className="text-text-secondary">Scheduled</p>
              <p className="text-brand-primary">09 May, 2026</p>
            </div>
            <div className="flex-1">
              <p className="text-text-secondary">Overdue</p>
              <p className="text-brand-primary">19 May, 2026</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-border bg-surface-primary px-4 py-4">
        <Button label="Back" variant="secondary" onClick={onBack} />
        <Button label="Finish" variant="primary" onClick={onFinish} />
      </div>
    </div>
  );
};

export default SummaryScreen;
