import React from "react";
import Icon from "./Icon";
import Button from "./Button";

interface Props {
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDeleteModal = (props: Props) => {
  const { onConfirm, onCancel } = props;

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div
        className="flex w-full max-w-[296px] flex-col gap-[64px] rounded-lg p-md"
        style={{ backgroundColor: "#ffffff" }}
      >
        <div className="flex w-full flex-col gap-md">
          <div className="flex w-full items-center justify-between">
            <p className="text-title-md text-brand-primary">Remove Image</p>
            <button type="button" onClick={onCancel} aria-label="Close">
              <Icon name="close" className="text-[20px] text-text-primary" />
            </button>
          </div>
          <p className="w-full text-body-md text-text-hint">
            Are you sure you want to remove the image?
          </p>
        </div>
        <div className="flex w-full items-center gap-[23px]">
          <Button label="Yes" variant="secondary" onClick={onConfirm} />
          <Button label="No" variant="primary" onClick={onCancel} />
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
