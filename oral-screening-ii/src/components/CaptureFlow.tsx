"use client";

import React, { useCallback, useRef, useState } from "react";
import RegionListScreen from "./RegionListScreen";
import CameraScreen from "./CameraScreen";
import ReviewScreen from "./ReviewScreen";
import Toast, { type ToastMessage } from "./Toast";
import { MAX_IMAGES, regionById, type AcceptedImage, type Suspicious } from "@/lib/protocol";
import { useReferencePreference } from "@/lib/useReferencePreference";
import { gradeImage, type QualityResult } from "@/lib/imageQuality";

// List → camera (for the tapped region) → review → back to the list.
// `quality` is null until the on-device grade for the capture comes back.
type Screen =
  | { kind: "list" }
  | { kind: "camera"; regionId: string }
  | { kind: "review"; regionId: string; url: string; quality: QualityResult | null }
  | { kind: "done" };

function revoke(url: string) {
  if (url.startsWith("blob:")) URL.revokeObjectURL(url);
}

interface Props {}

const CaptureFlow = (props: Props) => {
  const {} = props;

  const [screen, setScreen] = useState<Screen>({ kind: "list" });
  const [accepted, setAccepted] = useState<AcceptedImage[]>([]);
  // The chevron's collapsed state is the "hide reference images" preference,
  // so it persists across regions and sessions.
  const [referenceHidden, setReferenceHidden] = useReferencePreference();
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const toastId = useRef(0);
  const dismissToast = useCallback(() => setToast(null), []);

  function handleSelectRegion(regionId: string) {
    if (accepted.length >= MAX_IMAGES) return;
    setScreen({ kind: "camera", regionId });
  }

  function handleCapture(regionId: string, url: string) {
    setScreen({ kind: "review", regionId, url, quality: null });
    gradeImage(url).then((quality) =>
      setScreen((prev) => (prev.kind === "review" && prev.url === url ? { ...prev, quality } : prev))
    );
  }

  function handleAnswer(value: Suspicious) {
    if (screen.kind !== "review") return;
    const { regionId, url, quality } = screen;
    const id = `${regionId}-${Date.now()}`;
    setAccepted((prev) => [...prev, { id, regionId, url, suspicious: value, quality }]);
    setScreen({ kind: "list" });
    // Echo back exactly what was recorded so a mis-tap is easy to spot.
    toastId.current += 1;
    setToast({
      id: toastId.current,
      title: "Image saved",
      detail: `${regionById(regionId).name} · Lesion: ${value === "yes" ? "Yes" : "No"}`,
    });
    // Answered before grading finished: fill the grade in once it's ready.
    if (!quality) {
      gradeImage(url).then((result) =>
        setAccepted((prev) => prev.map((img) => (img.id === id ? { ...img, quality: result } : img)))
      );
    }
  }

  function handleRetake() {
    if (screen.kind !== "review") return;
    revoke(screen.url);
    setScreen({ kind: "camera", regionId: screen.regionId });
  }

  function handleDeleteImage(imageId: string) {
    setAccepted((prev) => {
      const removed = prev.find((img) => img.id === imageId);
      if (removed) revoke(removed.url);
      return prev.filter((img) => img.id !== imageId);
    });
  }

  function handleRestart() {
    accepted.forEach((img) => revoke(img.url));
    setAccepted([]);
    setScreen({ kind: "list" });
  }

  if (screen.kind === "camera") {
    return (
      <CameraScreen
        key={screen.regionId}
        region={regionById(screen.regionId)}
        referenceOpen={!referenceHidden}
        onToggleReference={() => setReferenceHidden(!referenceHidden)}
        onCapture={(url) => handleCapture(screen.regionId, url)}
        onBack={() => setScreen({ kind: "list" })}
      />
    );
  }

  if (screen.kind === "review") {
    return (
      <ReviewScreen
        region={regionById(screen.regionId)}
        imageUrl={screen.url}
        quality={screen.quality}
        onAnswer={handleAnswer}
        onRetake={handleRetake}
      />
    );
  }

  if (screen.kind === "done") {
    return (
      <div className="flex h-dvh w-full flex-col items-center justify-center gap-mobile-md bg-surface-subtle px-mobile-lg shadow-xl">
        <p className="text-mobile-title-medium text-brand-default">Image capture complete</p>
        <p className="text-center text-mobile-body-medium text-base-subtle">
          {accepted.length} photos captured, {accepted.filter((img) => img.suspicious === "yes").length} marked
          suspicious.
        </p>
        <button type="button" onClick={handleRestart} className="text-mobile-body-medium text-brand-default underline">
          Start over
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <RegionListScreen
        images={accepted}
        onSelectRegion={handleSelectRegion}
        onDeleteImage={handleDeleteImage}
        onBack={() => {}}
        onNext={() => setScreen({ kind: "done" })}
      />
      <Toast toast={toast} onDismiss={dismissToast} />
    </div>
  );
};

export default CaptureFlow;
