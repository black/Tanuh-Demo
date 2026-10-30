import React from "react";

interface Props {
  name: string;
  className?: string;
  ariaHidden?: boolean;
}

const Icon = (props: Props) => {
  const { name, className = "", ariaHidden = true } = props;

  return (
    <span
      className={`material-symbols-outlined select-none ${className}`}
      aria-hidden={ariaHidden}
    >
      {name}
    </span>
  );
};

export default Icon;
