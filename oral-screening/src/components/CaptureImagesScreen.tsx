"use client";

import React, { useMemo, useRef, useState } from "react";
import TopNavbar from "./TopNavbar";
import Chip from "./Chip";
import PlaceholderPhoto from "./PlaceholderPhoto";
import Icon from "./Icon";
import Button from "./Button";
import CapturedImageModal from "./CapturedImageModal";
import CameraCapture from "./CameraCapture";
import ImagePreview from "./ImagePreview";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import ReferenceThumbnail from "./ReferenceThumbnail";
import type { CapturedImageRecord } from "@/lib/types";

const MIN_IMAGES = 8;

type ReferenceSite = {
  id: string;
  name: string;
  image: string;
};

type CapturedImage = {
  id: string;
  number: number;
  suspicious: "yes" | "no" | null;
  imageUrl?: string;
};

type PendingCapture = {
  imageUrl: string;
};

// The 14 reference mouth sites shown in the thumbnail rail, using the
// clinical reference photography provided for the file (annotated with the
// region outline to guide capture). Two sites — the buccal vestibule pair
// and the frontal gingiva/lower-arch pair — are a best-effort read of the
// unlabeled source photos; flag if any should be swapped or renamed.
const REFERENCE_SITES: ReferenceSite[] = [
  { id: "site-1", name: "Lips", image: "/reference/lips.png" },
  { id: "site-2", name: "Upper Labial Mucosa", image: "/reference/upper-labial-mucosa.png" },
  { id: "site-3", name: "Lower Labial Mucosa", image: "/reference/lower-labial-mucosa.png" },
  { id: "site-4", name: "Left Buccal Mucosa", image: "/reference/left-buccal-mucosa.png" },
  { id: "site-5", name: "Right Buccal Mucosa", image: "/reference/right-buccal-mucosa.png" },
  { id: "site-6", name: "Right Buccal Vestibule", image: "/reference/right-buccal-vestibule.png" },
  { id: "site-7", name: "Left Buccal Vestibule", image: "/reference/left-buccal-vestibule.png" },
  { id: "site-8", name: "Right Lateral Border of Tongue", image: "/reference/right-lateral-tongue.png" },
  { id: "site-9", name: "Left Lateral Border of Tongue", image: "/reference/left-lateral-tongue.png" },
  { id: "site-10", name: "Dorsum Surface of Tongue", image: "/reference/dorsum-tongue.png" },
  { id: "site-11", name: "Floor of the Mouth", image: "/reference/floor-of-mouth.png" },
  { id: "site-12", name: "Gingiva (Frontal)", image: "/reference/gingiva-frontal.png" },
  { id: "site-13", name: "Lower Gingiva", image: "/reference/lower-gingiva.png" },
  { id: "site-14", name: "Palate", image: "/reference/palate.png" },
];

const INITIAL_CAPTURES: Record<string, CapturedImage[]> = {};

interface Props {
  onNext: (captures: CapturedImageRecord[]) => void;
}

const CaptureImagesScreen = (props: Props) => {
  const { onNext } = props;

  const [activeSiteId, setActiveSiteId] = useState(REFERENCE_SITES[0].id);
  const [capturesBySite, setCapturesBySite] =
    useState<Record<string, CapturedImage[]>>(INITIAL_CAPTURES);
  const [pendingCapture, setPendingCapture] = useState<PendingCapture | null>(null);
  const [pendingSuspicious, setPendingSuspicious] = useState<"yes" | "no">("yes");
  const [cameraOpen, setCameraOpen] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [pendingRemoveId, setPendingRemoveId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeSite = REFERENCE_SITES.find((s) => s.id === activeSiteId)!;
  const activeCaptures = capturesBySite[activeSiteId] ?? [];

  const totalCaptured = useMemo(
    () => Object.values(capturesBySite).reduce((sum, arr) => sum + arr.length, 0),
    [capturesBySite]
  );

  function handlePhotoSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setPendingCapture({ imageUrl: URL.createObjectURL(file) });
    setPendingSuspicious("yes");
  }

  function handleOpenCamera() {
    setCameraOpen(true);
  }

  function handleCameraCapture(imageUrl: string) {
    setCameraOpen(false);
    setPendingCapture({ imageUrl });
    setPendingSuspicious("yes");
  }

  function handleCameraClose() {
    setCameraOpen(false);
  }

  function handleCameraUnavailable() {
    // No getUserMedia support (or permission denied) — fall back to the
    // native file/camera picker instead.
    setCameraOpen(false);
    fileInputRef.current?.click();
  }

  function handleRetake() {
    if (pendingCapture) URL.revokeObjectURL(pendingCapture.imageUrl);
    setPendingCapture(null);
    setCameraOpen(true);
  }

  function handleSaveCapture() {
    if (!pendingCapture) return;
    setCapturesBySite((prev) => {
      const list = prev[activeSiteId] ?? [];
      const nextNumber = list.length + 1;
      return {
        ...prev,
        [activeSiteId]: [
          ...list,
          {
            id: `${activeSiteId}-${Date.now()}`,
            number: nextNumber,
            suspicious: pendingSuspicious,
            imageUrl: pendingCapture.imageUrl,
          },
        ],
      };
    });
    setPendingCapture(null);
  }

  function removeCapture(imageId: string) {
    setCapturesBySite((prev) => ({
      ...prev,
      [activeSiteId]: (prev[activeSiteId] ?? [])
        .filter((img) => img.id !== imageId)
        .map((img, idx) => ({ ...img, number: idx + 1 })),
    }));
  }

  function setSuspicious(imageId: string, value: "yes" | "no") {
    setCapturesBySite((prev) => ({
      ...prev,
      [activeSiteId]: (prev[activeSiteId] ?? []).map((img) =>
        img.id === imageId ? { ...img, suspicious: value } : img
      ),
    }));
  }

  function handleConfirmDelete() {
    if (pendingRemoveId) removeCapture(pendingRemoveId);
    setPendingRemoveId(null);
  }

  function handleNext() {
    const flat: CapturedImageRecord[] = REFERENCE_SITES.flatMap((site) =>
      (capturesBySite[site.id] ?? [])
        .filter((img) => img.imageUrl)
        .map((img) => ({
          id: img.id,
          siteId: site.id,
          siteName: site.name,
          imageUrl: img.imageUrl!,
          suspicious: img.suspicious,
        }))
    );
    onNext(flat);
  }

  return (
    <div className="relative flex h-dvh w-full flex-col overflow-hidden bg-surface-primary shadow-xl">
      <TopNavbar label="Oral" sublabel="Screening" />

      {/* Header */}
      <div className="flex flex-col gap-0 bg-states-error-light px-md py-md">
        <div className="flex items-start justify-between">
          <p className="text-title-md text-brand-primary-dark">Capture images</p>
          <Chip
            label={`${Math.min(totalCaptured, MIN_IMAGES)}/${MIN_IMAGES}`}
            variant="primary"
          />
        </div>
        <p className="text-body-sm text-text-secondary">
          Please add at least {MIN_IMAGES} images
        </p>
      </div>

      {/* Body */}
      <div className="flex flex-1 gap-4 overflow-hidden px-4 pt-4">
        {/* Thumbnail rail */}
        <div className="no-scrollbar flex w-16 flex-col gap-2 overflow-y-auto pb-4">
          {REFERENCE_SITES.map((site) => (
            <ReferenceThumbnail
              key={site.id}
              name={site.name}
              image={site.image}
              count={capturesBySite[site.id]?.length ?? 0}
              isActive={site.id === activeSiteId}
              onClick={() => setActiveSiteId(site.id)}
            />
          ))}
        </div>

        {/* Main content */}
        <div className="no-scrollbar flex-1 overflow-y-auto pb-32">
          <p className="text-title-sm text-text-primary">{activeSite.name}</p>
          <div className="relative mt-2 h-[240px] w-full overflow-hidden rounded-lg">
            <img
              src={activeSite.image}
              alt={activeSite.name}
              className="size-full object-cover"
            />
          </div>

          <p className="mt-4 text-title-sm text-text-secondary">
            Suspicious Lesion?
          </p>

          <div className="mt-2 flex flex-col gap-2">
            {activeCaptures.length === 0 && (
              <p className="rounded-lg border border-dashed border-border px-4 py-6 text-center text-body-sm text-text-secondary">
                No images captured for this site yet. Tap the camera button to
                add one.
              </p>
            )}
            {activeCaptures.map((img) => (
              <div
                key={img.id}
                role={img.imageUrl ? "button" : undefined}
                tabIndex={img.imageUrl ? 0 : undefined}
                onClick={() => img.imageUrl && setPreviewImageUrl(img.imageUrl)}
                className={`relative h-[97px] w-full overflow-hidden rounded-lg ${
                  img.imageUrl ? "cursor-pointer" : ""
                }`}
              >
                {img.imageUrl ? (
                  <img
                    src={img.imageUrl}
                    alt=""
                    className="size-full object-cover"
                  />
                ) : (
                  <PlaceholderPhoto seed={img.id} className="size-full" />
                )}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-black/60 to-transparent" />
                <span className="absolute left-1.5 top-1.5 flex size-[18px] items-center justify-center rounded-full bg-brand-neutral text-[11px] leading-none text-black">
                  {img.number}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPendingRemoveId(img.id);
                  }}
                  aria-label="Remove image"
                  className="absolute right-1.5 top-1.5 flex size-[18px] items-center justify-center text-white"
                >
                  <Icon name="close" className="text-[14px]" />
                </button>
                <div className="absolute bottom-1.5 left-1.5 flex gap-1.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSuspicious(img.id, "no");
                    }}
                  >
                    <Chip
                      label="No"
                      variant="neutral"
                      className={img.suspicious === "no" ? "" : "opacity-60"}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSuspicious(img.id, "yes");
                    }}
                  >
                    <Chip
                      label="Yes"
                      variant="warning"
                      className={img.suspicious === "yes" ? "" : "opacity-60"}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating action button (add photo) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handlePhotoSelected}
      />
      <button
        type="button"
        disabled={totalCaptured > MIN_IMAGES-1}
        onClick={handleOpenCamera}
        aria-label="Add photo"
        className="absolute bottom-[132px] right-4 flex size-14 items-center justify-center rounded-full bg-text-positive text-brand-primary-dark shadow-[0_0_8px_rgba(0,0,0,0.25)]"
      >
        <Icon name="add_a_photo" className="text-[24px]" />
      </button>

      {/* Footer buttons */}
      <div className="flex items-center justify-between gap-2 border-t border-border bg-surface-primary px-4 py-4">
        <Button label="Back" variant="secondary" />
        <Button
          label="Next"
          variant="primary"
          disabled={totalCaptured < MIN_IMAGES}
          onClick={handleNext}
        />
      </div>

      {cameraOpen && (
        <CameraCapture
          onCapture={handleCameraCapture}
          onClose={handleCameraClose}
          onUnavailable={handleCameraUnavailable}
        />
      )}

      {pendingCapture && (
        <CapturedImageModal
          imageUrl={pendingCapture.imageUrl}
          suspicious={pendingSuspicious}
          onSuspiciousChange={setPendingSuspicious}
          onRetake={handleRetake}
          onSave={handleSaveCapture}
        />
      )}

      {previewImageUrl && (
        <ImagePreview
          imageUrl={previewImageUrl}
          onClose={() => setPreviewImageUrl(null)}
        />
      )}

      {pendingRemoveId && (
        <ConfirmDeleteModal
          onConfirm={handleConfirmDelete}
          onCancel={() => setPendingRemoveId(null)}
        />
      )}
    </div>
  );
};

export default CaptureImagesScreen;
