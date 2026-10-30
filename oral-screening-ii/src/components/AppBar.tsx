import React from "react";
import Icon from "./Icon";

interface Props {
  title: string;
  onBack?: () => void;
  // When set, a chevron on the right toggles the reference panel.
  referenceOpen?: boolean;
  onToggleReference?: () => void;
}

const AppBar = (props: Props) => {
  const { title, onBack, referenceOpen, onToggleReference } = props;

  return (
    <div className="flex h-14 w-full shrink-0 items-center gap-mobile-md bg-brand-default px-mobile-md text-base-inverse">
      <button
        type="button"
        onClick={onBack}
        aria-label="Go back"
        className="flex size-6 shrink-0 items-center justify-center"
      >
        <Icon name="arrow_back" className="text-[20px]" />
      </button>
      <p className="min-w-0 flex-1 truncate text-mobile-body-large">{title}</p>
      {onToggleReference && (
        <button
          type="button"
          onClick={onToggleReference}
          aria-expanded={referenceOpen}
          aria-label={referenceOpen ? "Hide reference image" : "Show reference image"}
          className="flex size-6 shrink-0 items-center justify-center"
        >
          <Icon name={referenceOpen ? "keyboard_arrow_up" : "keyboard_arrow_down"} className="text-[22px]" />
        </button>
      )}
    </div>
  );
};

export default AppBar;
