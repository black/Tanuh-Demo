"use client";

import React from "react";
import AppBar from "./AppBar";
import type { Region } from "@/lib/protocol";
import { useCamera } from "@/lib/useCamera";

interface Props {
  region: Region;
  referenceOpen: boolean;
  onToggleReference: () => void;
  onCapture: (url: string) => void;
  onBack: () => void;
}

const CameraScreen = (props: Props) => {
  const { region, referenceOpen, onToggleReference, onCapture, onBack } = props;

  const { videoRef, status, capture } = useCamera(true);

  async function handleShutter() {
    // Without a camera (desktop demo, permission denied) the shutter falls
    // back to the region's sample photo so the flow can still be exercised.
    const url = status === "ready" ? await capture() : region.image;
    if (url) onCapture(url);
  }

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-inverse shadow-xl">
      <AppBar
        title={region.name}
        onBack={onBack}
        referenceOpen={referenceOpen}
        onToggleReference={onToggleReference}
      />

      {referenceOpen && (
        <div className="shrink-0 bg-brand-default px-mobile-md pb-mobile-md pt-mobile-md">
          <img
            src={region.image}
            alt={`Reference: ${region.name}`}
            className="aspect-[328/296] w-full rounded-mobile-sm object-cover"
          />
        </div>
      )}

      <div className="relative flex-1 overflow-hidden bg-neutral-800">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`absolute inset-0 size-full object-cover ${status === "ready" ? "" : "invisible"}`}
        />
        {status === "unavailable" && (
          <p className="absolute inset-x-6 top-1/2 -translate-y-1/2 text-center text-mobile-body-small text-base-inverse/60">
            Camera not available. Demo mode: the shutter uses a sample photo.
          </p>
        )}
      </div>

      <div className="flex h-[120px] shrink-0 items-center justify-center bg-inverse">
        <button
          type="button"
          onClick={handleShutter}
          disabled={status === "starting"}
          aria-label={`Take photo of ${region.name}`}
          className="flex size-[72px] items-center justify-center rounded-full border-2 border-neutral-0 disabled:opacity-40"
        >
          <span className="size-16 rounded-full bg-neutral-0" />
        </button>
      </div>
    </div>
  );
};

export default CameraScreen;
