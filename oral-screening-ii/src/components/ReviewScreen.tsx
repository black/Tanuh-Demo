import React from "react";
import AppBar from "./AppBar";
import Icon from "./Icon";
import QualityTag from "./QualityTag";
import type { Region, Suspicious } from "@/lib/protocol";
import type { QualityResult } from "@/lib/imageQuality";

interface Props {
  region: Region;
  imageUrl: string;
  quality: QualityResult | null;
  onAnswer: (value: Suspicious) => void;
  onRetake: () => void;
}

// Captured photo plus the "Suspicious Lesion?" choice. Answering saves the
// photo; Retake (or the back arrow) discards it and reopens the camera.
// Yes and No share one neutral style so neither reads as pre-selected.
const ReviewScreen = (props: Props) => {
  const { region, imageUrl, quality, onAnswer, onRetake } = props;

  const answerClass =
    "flex h-14 items-center justify-center gap-mobile-xs rounded-mobile-sm border border-neutral-0/30 bg-neutral-0/10 text-mobile-body-large text-base-inverse transition-colors active:bg-brand-default";

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-inverse shadow-xl">
      <AppBar title={region.name} onBack={onRetake} />

      <div className="relative flex-1 overflow-hidden px-mobile-md pt-mobile-md">
        <img src={imageUrl} alt={`Captured: ${region.name}`} className="size-full object-cover" />
        <QualityTag quality={quality} showReason className="absolute right-6 top-6" />
      </div>

      <div className="flex shrink-0 flex-col gap-mobile-sm px-mobile-md pb-mobile-md pt-mobile-lg">
        <p className="text-mobile-body-medium text-base-inverse">Suspicious Lesion?</p>
        <div className="grid grid-cols-2 gap-mobile-md">
          <button type="button" onClick={() => onAnswer("yes")} className={answerClass}>
            Yes
          </button>
          <button type="button" onClick={() => onAnswer("no")} className={answerClass}>
            No
          </button>
        </div>
        <hr className="my-mobile-xss border-neutral-0/15" />
        <button
          type="button"
          onClick={onRetake}
          className="flex h-12 w-full items-center justify-center gap-mobile-xs rounded-mobile-sm border border-neutral-0/20 text-mobile-body-medium text-base-inverse/85 active:bg-neutral-0/10"
        >
          <Icon name="replay" className="text-[20px]" />
          Retake photo
        </button>
      </div>
    </div>
  );
};

export default ReviewScreen;
