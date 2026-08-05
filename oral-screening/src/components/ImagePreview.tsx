import React from "react";

interface Props {
  imageUrl: string;
  onClose: () => void;
}

const ImagePreview = (props: Props) => {
  const { imageUrl, onClose } = props;

  return (
    <div
      className="absolute inset-0 z-50 flex flex-col items-end gap-md p-md"
      style={{ backgroundColor: "#000000" }}
    >
      <button
        type="button"
        onClick={onClose}
        className="flex h-[46px] w-[77px] shrink-0 items-center justify-center rounded-full p-sm text-body-md text-text-hint"
        style={{ backgroundColor: "#ffffff" }}
      >
        Close
      </button>
      <div className="w-full flex-1 overflow-hidden rounded-lg">
        <img
          src={imageUrl}
          alt="Captured image preview"
          className="size-full object-cover"
        />
      </div>
    </div>
  );
};

export default ImagePreview;
