"use client";

import React, { useEffect, useRef } from "react";
import Icon from "./Icon";
import QualityTag from "./QualityTag";
import type { AcceptedImage, Region } from "@/lib/protocol";

interface Props {
  region: Region;
  images: AcceptedImage[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

const SWIPE_THRESHOLD_PX = 50;

// Full-screen viewer for a region's photos. Step with the arrow buttons,
// a horizontal swipe, or ←/→; Esc or ✕ returns to the sheet.
const ImagePreview = (props: Props) => {
  const { region, images, index, onIndexChange, onClose } = props;

  const touchStartX = useRef<number | null>(null);
  const image = images[index];
  const hasPrev = index > 0;
  const hasNext = index < images.length - 1;

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      // Capture phase + stopPropagation so Esc closes only the viewer, not the sheet behind it.
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      } else if (e.key === "ArrowLeft" && hasPrev) {
        onIndexChange(index - 1);
      } else if (e.key === "ArrowRight" && hasNext) {
        onIndexChange(index + 1);
      }
    }
    window.addEventListener("keydown", handleKey, true);
    return () => window.removeEventListener("keydown", handleKey, true);
  }, [index, hasPrev, hasNext, onIndexChange, onClose]);

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (dx > SWIPE_THRESHOLD_PX && hasPrev) onIndexChange(index - 1);
    else if (dx < -SWIPE_THRESHOLD_PX && hasNext) onIndexChange(index + 1);
  }

  if (!image) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${region.name}, image ${index + 1} of ${images.length}`}
      className="absolute inset-0 z-[60] flex flex-col bg-neutral-950 text-base-inverse"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex shrink-0 items-center gap-mobile-sm px-mobile-md py-mobile-sm">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close preview"
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-neutral-0/10"
        >
          <Icon name="close" className="text-[22px]" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-mobile-title-medium">{region.name}</p>
          <p className="text-mobile-body-small text-base-inverse/70">
            {index + 1} of {images.length}
          </p>
        </div>
        <QualityTag quality={image.quality} showReason />
      </div>

      <div
        className="relative flex-1 overflow-hidden"
        onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
        onTouchEnd={handleTouchEnd}
      >
        <img
          key={image.id}
          src={image.url}
          alt={`${region.name}, image ${index + 1}`}
          className="size-full object-contain"
        />

        {image.suspicious === "yes" && (
          <span
            title="Lesion"
            aria-label="Lesion marked"
            className="absolute bottom-mobile-md left-mobile-md flex size-10 items-center justify-center rounded-full bg-warning-subtle text-warning-default"
          >
            <Icon name="warning" className="text-[22px]" />
          </span>
        )}

        {hasPrev && (
          <button
            type="button"
            onClick={() => onIndexChange(index - 1)}
            aria-label="Previous image"
            className="absolute left-mobile-xs top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-neutral-950/55"
          >
            <Icon name="chevron_left" className="text-[26px]" />
          </button>
        )}
        {hasNext && (
          <button
            type="button"
            onClick={() => onIndexChange(index + 1)}
            aria-label="Next image"
            className="absolute right-mobile-xs top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-neutral-950/55"
          >
            <Icon name="chevron_right" className="text-[26px]" />
          </button>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex shrink-0 justify-center gap-mobile-xs py-mobile-md" aria-hidden>
          {images.map((img, i) => (
            <span
              key={img.id}
              className={`size-2 rounded-full ${i === index ? "bg-neutral-0" : "bg-neutral-0/30"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImagePreview;
