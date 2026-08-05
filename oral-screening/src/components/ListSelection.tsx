import React from "react";
import Icon from "./Icon";

interface Props {
  label: string;
  selected: boolean;
  onClick: () => void;
}

const ListSelection = (props: Props) => {
  const { label, selected, onClick } = props;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-14 w-full items-center gap-sm rounded-lg p-md ${
        selected
          ? "bg-brand-primary-dark text-brand-neutral"
          : "bg-brand-primary-light text-brand-primary-dark"
      }`}
    >
      <span className="flex-1 text-left text-body-md">{label}</span>
      {selected && <Icon name="check_circle" className="text-[24px]" />}
    </button>
  );
};

export default ListSelection;
