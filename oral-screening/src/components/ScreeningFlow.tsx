"use client";

import React, { useState } from "react";
import CaptureImagesScreen from "./CaptureImagesScreen";
import AiOralResultsScreen from "./AiOralResultsScreen";
import ReferralDecisionScreen from "./ReferralDecisionScreen";
import SummaryScreen from "./SummaryScreen";
import type { CapturedImageRecord, ReferralDetails } from "@/lib/types";

type Step = "capture" | "ai-result" | "referral" | "summary" | "done";

const EMPTY_REFERRAL: ReferralDetails = {
  referToDentist: null,
  district: null,
  hospital: null,
};

interface Props {}

const ScreeningFlow = (props: Props) => {
  const {} = props;

  const [step, setStep] = useState<Step>("capture");
  const [captures, setCaptures] = useState<CapturedImageRecord[]>([]);
  const [referral, setReferral] = useState<ReferralDetails>(EMPTY_REFERRAL);

  if (step === "capture") {
    return (
      <CaptureImagesScreen
        onNext={(records) => {
          setCaptures(records);
          setStep("ai-result");
        }}
      />
    );
  }

  if (step === "ai-result") {
    return (
      <AiOralResultsScreen
        captures={captures}
        onBack={() => setStep("capture")}
        onNext={() => setStep("referral")}
      />
    );
  }

  if (step === "referral") {
    return (
      <ReferralDecisionScreen
        captures={captures}
        onBack={() => setStep("ai-result")}
        onNext={(details) => {
          setReferral(details);
          setStep("summary");
        }}
      />
    );
  }

  if (step === "summary") {
    return (
      <SummaryScreen
        referral={referral}
        onBack={() => setStep("referral")}
        onFinish={() => setStep("done")}
      />
    );
  }

  return (
    <div className="flex h-dvh w-full flex-col items-center justify-center gap-4 bg-surface-primary px-8 shadow-xl">
      <p className="text-title-md text-brand-primary-dark">Screening complete</p>
      <p className="text-center text-body-md text-text-secondary">
        The oral screening flow has been submitted.
      </p>
      <button
        type="button"
        onClick={() => {
          setCaptures([]);
          setReferral(EMPTY_REFERRAL);
          setStep("capture");
        }}
        className="text-body-md text-brand-primary underline"
      >
        Start over
      </button>
    </div>
  );
};

export default ScreeningFlow;
