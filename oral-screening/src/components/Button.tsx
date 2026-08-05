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
  primary: "bg-brand-primary-dark text-white disabled:opacity-40",
  secondary: "border border-border text-brand-primary",
};

const Button = (props: Props) => {
  const { label, variant = "primary", onClick, disabled = false, className = "" } = props;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex h-12 w-[120px] items-center justify-center rounded-lg px-md py-sm text-body-md ${VARIANT_STYLES[variant]} ${className}`}
    >
      {label}
    </button>
  );
};

export default Button;
