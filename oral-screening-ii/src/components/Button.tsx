import React from "react";

type ButtonVariant = "primary" | "secondary";

interface Props {
  label: string;
  variant?: ButtonVariant;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-default text-base-inverse disabled:border disabled:border-divider disabled:bg-surface-default disabled:text-base-disabled",
  secondary: "border border-divider bg-surface-default text-brand-default",
};

const Button = (props: Props) => {
  const { label, variant = "primary", onClick, disabled = false, className = "" } = props;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex h-12 w-[120px] items-center justify-center rounded-mobile-sm px-mobile-md text-mobile-body-medium ${VARIANT_STYLES[variant]} ${className}`}
    >
      {label}
    </button>
  );
};

export default Button;
