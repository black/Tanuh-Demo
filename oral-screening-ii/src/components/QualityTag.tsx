import React from "react";
import Icon from "./Icon";
import type { QualityResult } from "@/lib/imageQuality";

interface Props {
  // null while the photo is still being analysed.
  quality: QualityResult | null;
  showReason?: boolean;
  className?: string;
}

// Icon and label sit in separate pills: a solid icon badge for at-a-glance
// colour, and a light text chip that stays readable over any photo.
const STYLES = {
  poor: { label: "Poor", icon: "priority_high", badge: "bg-danger-default text-base-inverse", chip: "bg-danger-subtle text-danger-default" },
  fine: { label: "Fine", icon: "check", badge: "bg-states-warning-dark text-base-inverse", chip: "bg-warning-subtle text-warning-default" },
  best: { label: "Best", icon: "done_all", badge: "bg-brand-default text-base-inverse", chip: "bg-brand-subtle text-brand-default" },
  checking: { label: "Checking", icon: "hourglass_top", badge: "bg-neutral-950/60 text-base-inverse", chip: "bg-neutral-950/60 text-base-inverse" },
} as const;

const QualityTag = (props: Props) => {
  const { quality, showReason = false, className = "" } = props;

  const style = STYLES[quality?.grade ?? "checking"];
  const reason = quality?.grade === "poor" ? quality.reason : undefined;

  return (
    <span
      title={reason}
      aria-label={quality ? `Image quality: ${style.label}${reason ? `, ${reason}` : ""}` : "Checking image quality"}
      className={`flex items-center gap-mobile-xss ${className}`}
    >
      <span className={`flex size-6 items-center justify-center rounded-full shadow-sm ${style.badge}`}>
        <Icon name={style.icon} className="text-[16px] font-bold" />
      </span>
      <span className={`flex h-6 items-center rounded-full px-mobile-xs text-mobile-body-small font-medium shadow-sm ${style.chip}`}>
        {style.label}
        {showReason && reason && <span className="font-normal">&nbsp;· {reason}</span>}
      </span>
    </span>
  );
};

export default QualityTag;
