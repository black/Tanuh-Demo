"use client";

import React, { useState } from "react";
import TopNavbar from "./TopNavbar";
import Button from "./Button";
import ListSelection from "./ListSelection";
import Icon from "./Icon";
import ImagePreview from "./ImagePreview";
import type { CapturedImageRecord, ReferralAnswer, ReferralDetails } from "@/lib/types";

const DISTRICTS = ["Bengaluru Rural", "Bengaluru Urban"];
const HOSPITALS = ["Hospital 1", "Hospital 2", "Hospital 3"];

type Step = "question" | "place";

interface Props {
  captures: CapturedImageRecord[];
  onBack: () => void;
  onNext: (details: ReferralDetails) => void;
}

const ReferralDecisionScreen = (props: Props) => {
  const { captures, onBack, onNext } = props;

  const [step, setStep] = useState<Step>("question");
  const [referToDentist, setReferToDentist] = useState<ReferralAnswer>(null);
  const [district, setDistrict] = useState<string | null>(null);
  const [hospital, setHospital] = useState<string | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  const suspiciousCaptures = captures.filter((img) => img.suspicious === "yes");

  function handleBack() {
    if (step === "place") {
      setStep("question");
      return;
    }
    onBack();
  }

  function handleFooterNext() {
    if (step === "question") {
      if (referToDentist === "yes") {
        setStep("place");
      } else if (referToDentist === "no") {
        onNext({ referToDentist: "no", district: null, hospital: null });
      }
      return;
    }
    onNext({ referToDentist: "yes", district, hospital });
  }

  const questionNextDisabled = referToDentist === null;
  const placeNextDisabled = !district || !hospital;

  return (
    <div className="relative flex h-[800px] w-[360px] flex-col overflow-hidden bg-surface-primary shadow-xl">
      <TopNavbar label="Oral" sublabel="Screening" onBack={handleBack} />

      <div className="bg-states-error-light px-md py-md">
        <p className="text-title-md text-brand-primary-dark">
          Referral Decision
        </p>
      </div>

      <div className="no-scrollbar flex-1 overflow-y-auto px-4 pb-24 pt-4">
        {step === "question" ? (
          <div className="flex flex-col gap-4">
            <p className="text-body-md text-text-secondary">
              App found No Suspicious Lesion. But you noticed suspicious
              lesions. Would you like to refer the patient to a dentist?
            </p>
            <div className="flex flex-col gap-2">
              <ListSelection
                label="No"
                selected={referToDentist === "no"}
                onClick={() => setReferToDentist("no")}
              />
              <ListSelection
                label="Yes"
                selected={referToDentist === "yes"}
                onClick={() => setReferToDentist("yes")}
              />
            </div>

            {suspiciousCaptures.length > 0 && (
              <>
                <p className="text-title-sm text-states-warning-dark">
                  Suspicious Images Display
                </p>
                <div className="flex flex-col gap-4">
                  {suspiciousCaptures.map((img) => (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => setPreviewImageUrl(img.imageUrl)}
                      className="relative h-32 w-full overflow-hidden rounded-lg"
                    >
                      <img
                        src={img.imageUrl}
                        alt={img.siteName}
                        className="size-full object-cover"
                      />
                      <div className="pointer-events-none absolute inset-x-0 top-0 h-[73px] bg-gradient-to-b from-black/60 to-transparent" />
                      <span className="absolute left-4 top-2 flex items-center gap-1 text-label-sm text-white">
                        AI Flagged
                        <Icon name="auto_awesome" className="text-[18px] opacity-70" />
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-body-md text-text-secondary">Place of referral</p>

            <div className="flex flex-col gap-3">
              <p className="text-body-sm text-text-primary">District</p>
              <div className="flex flex-col gap-2">
                {DISTRICTS.map((name) => (
                  <ListSelection
                    key={name}
                    label={name}
                    selected={district === name}
                    onClick={() => setDistrict(name)}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-body-sm text-text-primary">Taluka Hospital</p>
              <div className="flex flex-col gap-2">
                {HOSPITALS.map((name) => (
                  <ListSelection
                    key={name}
                    label={name}
                    selected={hospital === name}
                    onClick={() => setHospital(name)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-border bg-surface-primary px-4 py-4">
        <Button label="Back" variant="secondary" onClick={handleBack} />
        <Button
          label="Next"
          variant="primary"
          disabled={step === "question" ? questionNextDisabled : placeNextDisabled}
          onClick={handleFooterNext}
        />
      </div>

      {previewImageUrl && (
        <ImagePreview
          imageUrl={previewImageUrl}
          onClose={() => setPreviewImageUrl(null)}
        />
      )}
    </div>
  );
};

export default ReferralDecisionScreen;
