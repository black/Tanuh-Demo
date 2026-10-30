"use client";

import React, { useState } from "react";
import AppBar from "./AppBar";
import RegionTile from "./RegionTile";
import CapturedImagesSheet from "./CapturedImagesSheet";
import Button from "./Button";
import Icon from "./Icon";
import { MAX_IMAGES, MIN_IMAGES, REGIONS, REGION_GROUPS, regionById, type AcceptedImage } from "@/lib/protocol";

interface Props {
  images: AcceptedImage[];
  onSelectRegion: (regionId: string) => void;
  onDeleteImage: (imageId: string) => void;
  onBack: () => void;
  onNext: () => void;
}

const RegionListScreen = (props: Props) => {
  const { images, onSelectRegion, onDeleteImage, onBack, onNext } = props;

  const [sheetRegionId, setSheetRegionId] = useState<string | null>(null);

  const total = images.length;
  const minMet = total >= MIN_IMAGES;
  const atMax = total >= MAX_IMAGES;

  const imagesFor = (regionId: string) => images.filter((img) => img.regionId === regionId);
  const sheetImages = sheetRegionId ? imagesFor(sheetRegionId) : [];

  return (
    <div className="relative flex h-dvh w-full flex-col overflow-hidden bg-surface-subtle shadow-xl">
      <AppBar title="Oral Screening" onBack={onBack} />

      <div className="no-scrollbar flex flex-1 flex-col gap-mobile-lg overflow-y-auto px-mobile-md pb-mobile-lg pt-mobile-md">
        <p className="text-mobile-body-small text-base-subtle">
          {atMax ? `Maximum of ${MAX_IMAGES} photos reached` : "Tap a region to take photos"}
        </p>

        {REGION_GROUPS.map((group) => {
          const regions = REGIONS.filter((r) => r.group === group.id);
          const done = regions.filter((r) => imagesFor(r.id).length > 0).length;
          const complete = done === regions.length;
          return (
            <section key={group.id} aria-labelledby={`group-${group.id}`} className="flex flex-col gap-mobile-xs">
              <div className="flex items-center justify-between">
                <h2
                  id={`group-${group.id}`}
                  className="text-mobile-label-medium font-medium uppercase tracking-wide text-base-subtle"
                >
                  {group.label}
                </h2>
                <span
                  className={`flex items-center gap-mobile-xss text-mobile-label-medium font-medium ${
                    complete ? "text-brand-default" : "text-base-subtle"
                  }`}
                >
                  {complete && <Icon name="check" className="text-[14px] font-bold" />}
                  {done}/{regions.length}
                </span>
              </div>
              <div className="flex flex-col gap-mobile-xs">
                {regions.map((region) => (
                  <RegionTile
                    key={region.id}
                    region={region}
                    images={imagesFor(region.id)}
                    captureDisabled={atMax}
                    onCapture={() => onSelectRegion(region.id)}
                    onViewPhotos={() => setSheetRegionId(region.id)}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <div className="flex shrink-0 items-center justify-between bg-surface-subtle px-mobile-md pb-mobile-md pt-mobile-md">
        <Button label="Back" variant="secondary" onClick={onBack} />
        {/* Counts toward the minimum until it's met, then toward the maximum. */}
        <div className="flex flex-col items-center" aria-live="polite">
          <p
            className={`text-mobile-title-medium ${minMet ? "text-brand-default" : "text-base-default"}`}
            aria-label={`${total} of ${minMet ? MAX_IMAGES : MIN_IMAGES} ${minMet ? "maximum" : "minimum"} photos`}
          >
            {total}/{minMet ? MAX_IMAGES : MIN_IMAGES}
          </p>
          <p className="text-mobile-label-medium text-base-subtle">{minMet ? "max photos" : "min photos"}</p>
        </div>
        <Button label="Next" disabled={!minMet} onClick={onNext} />
      </div>

      {sheetRegionId && sheetImages.length > 0 && (
        <CapturedImagesSheet
          region={regionById(sheetRegionId)}
          images={sheetImages}
          onDelete={onDeleteImage}
          onClose={() => setSheetRegionId(null)}
        />
      )}
    </div>
  );
};

export default RegionListScreen;
