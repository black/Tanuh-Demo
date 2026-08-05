import React from "react";

type ChipVariant = "neutral" | "primary" | "warning";

const VARIANT_STYLES: Record<ChipVariant, string> = {
  neutral: "bg-brand-primary-light text-brand-primary-dark",
  primary: "bg-brand-primary text-brand-primary-light",
  warning: "bg-states-warning-default text-states-warning-dark",
};

interface Props {
  label: string;
  variant?: ChipVariant;
  className?: string;
}

const Chip = (props: Props) => {
  const { label, variant = "neutral", className = "" } = props;

  return (
    <span
      className={`inline-flex min-w-[40px] items-center justify-center rounded-full px-md py-xs text-body-sm font-medium ${VARIANT_STYLES[variant]} ${className}`}
    >
      {label}
    </span>
  );
};

export default Chip;
