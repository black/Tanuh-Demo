import React from "react";
import Icon from "./Icon";

interface Props {
  label: string;
  sublabel?: string;
  onBack?: () => void;
}

const TopNavbar = (props: Props) => {
  const { label, sublabel, onBack } = props;

  return (
    <div className="flex h-14 w-full items-center justify-between bg-brand-primary px-md">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onBack}
          aria-label="Go back"
          className="flex size-6 items-center justify-center text-white"
        >
          <Icon name="arrow_back" className="text-[20px]" />
        </button>
        <div className="leading-tight text-white">
          <p className="text-body-lg">{label}</p>
          {sublabel && <p className="text-body-sm opacity-90">{sublabel}</p>}
        </div>
      </div>
      <button
        type="button"
        aria-label="Sync"
        className="flex size-6 items-center justify-center text-white"
      >
        <Icon name="sync" className="text-[20px]" />
      </button>
    </div>
  );
};

export default TopNavbar;
