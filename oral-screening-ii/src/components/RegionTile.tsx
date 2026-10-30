import React from "react";
import Icon from "./Icon";
import type { AcceptedImage, Region } from "@/lib/protocol";

interface Props {
  region: Region;
  images: AcceptedImage[];
  // True at the 14-photo cap: capturing is blocked, viewing still works.
  captureDisabled?: boolean;
  onCapture: () => void;
  onViewPhotos: () => void;
}

// Region card from Figma (node 3960:8051): name, photo-count badge and a
// lesion label on the left; the reference image on the right with a round
// "open" button. Tapping the card opens the camera; tapping the image (once
// photos exist) opens the photos taken for this region.
const RegionTile = (props: Props) => {
  const { region, images, captureDisabled = false, onCapture, onViewPhotos } = props;

  const count = images.length;
  const lesionCount = images.filter((img) => img.suspicious === "yes").length;

  return (
    <div className="relative flex h-32 overflow-hidden rounded-mobile-sm border border-divider bg-surface-default">
      <button
        type="button"
        onClick={onCapture}
        disabled={captureDisabled}
        aria-label={`Take photo of ${region.name}`}
        className="absolute inset-0 rounded-mobile-sm disabled:cursor-not-allowed"
      />

      <div className="pointer-events-none flex min-w-0 flex-1 flex-col justify-between p-mobile-md">
        <p className="line-clamp-2 text-mobile-body-large text-base-default">{region.name}</p>
        {count > 0 && (
          <div className="flex items-center gap-mobile-xs">
            <span
              aria-label={`${count} ${count === 1 ? "photo" : "photos"}`}
              className="flex size-6 items-center justify-center rounded-full bg-brand-default text-mobile-body-small text-base-inverse"
            >
              {String(count).padStart(2, "0")}
            </span>
            {lesionCount > 0 && (
              <span className="flex h-6 items-center rounded-full bg-warning-subtle px-mobile-sm text-mobile-body-small text-warning-default">
                {lesionCount} lesion
              </span>
            )}
          </div>
        )}
      </div>

      {count > 0 ? (
        <button
          type="button"
          onClick={onViewPhotos}
          aria-label={`View ${count} ${count === 1 ? "photo" : "photos"} of ${region.name}`}
          className="relative size-32 shrink-0"
        >
          <img src={region.image} alt="" className="size-full object-cover" />
          {/* Darkens the bottom-right corner so the white arrow reads on any photo. */}
          <span className="absolute inset-0 bg-gradient-to-tl from-neutral-950/60 via-neutral-950/15 to-transparent" />
          <span className="absolute bottom-[7px] right-[11px] flex size-10 items-center justify-center rounded-full bg-interactive-translucent text-base-inverse backdrop-blur-sm">
            <Icon name="arrow_outward" className="text-[20px]" />
          </span>
        </button>
      ) : (
        <img
          src={region.image}
          alt=""
          className={`pointer-events-none size-32 shrink-0 object-cover ${captureDisabled ? "opacity-50" : ""}`}
        />
      )}
    </div>
  );
};

export default RegionTile;
