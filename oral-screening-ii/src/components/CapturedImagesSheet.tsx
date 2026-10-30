"use client";

import React, { useEffect, useState } from "react";
import Icon from "./Icon";
import QualityTag from "./QualityTag";
import ImagePreview from "./ImagePreview";
import type { AcceptedImage, Region } from "@/lib/protocol";

interface Props {
  region: Region;
  images: AcceptedImage[];
  onDelete: (imageId: string) => void;
  onClose: () => void;
}

const CapturedImagesSheet = (props: Props) => {
  const { region, images, onDelete, onClose } = props;

  // Deleting asks for confirmation on the photo itself, so a stray tap can't
  // drop a clinical image.
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end bg-neutral-950/50" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-title"
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[80%] flex-col rounded-t-mobile-lg bg-surface-default"
      >
        <div className="mx-auto mt-mobile-sm h-1 w-8 shrink-0 rounded-full bg-neutral-300" />
        <div className="flex shrink-0 items-start justify-between gap-mobile-md px-mobile-md pb-mobile-sm pt-mobile-md">
          <div>
            <p id="sheet-title" className="text-mobile-title-medium text-base-default">
              {region.name}
            </p>
            <p className="text-mobile-body-small text-base-subtle">
              {images.length} captured {images.length === 1 ? "image" : "images"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex size-8 items-center justify-center text-base-subtle"
          >
            <Icon name="close" className="text-[22px]" />
          </button>
        </div>

        <div className="no-scrollbar grid grid-cols-2 gap-mobile-sm overflow-y-auto px-mobile-md pb-mobile-lg">
          {images.map((img, i) => (
            <figure key={img.id} className="relative overflow-hidden rounded-mobile-sm">
              <button
                type="button"
                onClick={() => setPreviewIndex(i)}
                aria-label={`View image ${i + 1} full screen`}
                className="block w-full"
              >
                <img src={img.url} alt={`${region.name}, image ${i + 1}`} className="aspect-[3/4] w-full object-cover" />
              </button>
              <span className="absolute left-2 top-2 flex size-6 items-center justify-center rounded-full bg-neutral-0/90 text-mobile-body-small text-base-default">
                {i + 1}
              </span>
              <QualityTag quality={img.quality} className="absolute right-2 top-2" />
              <button
                type="button"
                onClick={() => setConfirmingId(img.id)}
                aria-label={`Delete image ${i + 1}`}
                className="absolute bottom-2 right-2 flex size-8 items-center justify-center rounded-full bg-neutral-950/55 text-base-inverse"
              >
                <Icon name="delete" className="text-[18px]" />
              </button>
              {/* Only lesion photos get a marker; unmarked photos carry no icon. */}
              {img.suspicious === "yes" && (
                <figcaption
                  title="Lesion"
                  aria-label="Lesion marked"
                  className="absolute bottom-2 left-2 flex size-8 items-center justify-center rounded-full bg-warning-subtle text-warning-default"
                >
                  <Icon name="warning" className="text-[18px]" />
                </figcaption>
              )}

              {confirmingId === img.id && (
                <div
                  role="alertdialog"
                  aria-label={`Delete image ${i + 1}?`}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-mobile-sm bg-neutral-950/75 p-mobile-sm text-center text-base-inverse"
                >
                  <p className="text-mobile-body-medium">Delete this photo?</p>
                  <div className="flex w-full gap-mobile-xs">
                    <button
                      type="button"
                      onClick={() => setConfirmingId(null)}
                      className="h-9 flex-1 rounded-mobile-sm border border-neutral-0/50 text-mobile-body-small"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setConfirmingId(null);
                        onDelete(img.id);
                      }}
                      className="h-9 flex-1 rounded-mobile-sm bg-danger-default text-mobile-body-small"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </figure>
          ))}
        </div>
      </div>

      {previewIndex !== null && (
        <ImagePreview
          region={region}
          images={images}
          index={Math.min(previewIndex, images.length - 1)}
          onIndexChange={setPreviewIndex}
          onClose={() => setPreviewIndex(null)}
        />
      )}
    </div>
  );
};

export default CapturedImagesSheet;
