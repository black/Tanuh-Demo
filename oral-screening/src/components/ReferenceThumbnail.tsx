import React from "react";

interface Props {
  name: string;
  image: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
}

const ReferenceThumbnail = (props: Props) => {
  const { name, image, count, isActive, onClick } = props;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={name}
      className={`relative size-16 shrink-0 overflow-hidden rounded ${
        isActive ? "border-4 border-brand-primary" : "border-none"
      } ${count > 0 || isActive ? "opacity-100" : "opacity-70"}`}
    >
      <img src={image} alt={name} className="size-16 object-cover" />
      {count > 0 && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-brand-primary/80 text-body-md text-white">
          {count}
        </div>
      )}
    </button>
  );
};

export default ReferenceThumbnail;
