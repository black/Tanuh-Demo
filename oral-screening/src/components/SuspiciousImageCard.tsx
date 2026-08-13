import Icon from "./Icon";
import Chip from "./Chip";
import PlaceholderPhoto from "./PlaceholderPhoto";

type CardSize = "sm" | "lg";

const SIZE_STYLES: Record<CardSize, { height: string; overlay: string; badge: string }> = {
  sm: {
    height: "h-[97px]",
    overlay: "h-14",
    badge: "left-1.5 top-1.5 size-[18px] text-[11px] leading-none",
  },
  lg: {
    height: "h-32",
    overlay: "h-[73px]",
    badge: "left-2 top-2 size-6 text-label-sm",
  },
};

interface Props {
  imageUrl?: string;
  alt?: string;
  placeholderSeed?: string;
  size?: CardSize;
  onClick?: () => void;
  number?: number;
  aiFlagged?: boolean;
  onRemove?: () => void;
  suspicious?: "yes" | "no" | null;
  onSuspiciousChange?: (value: "yes" | "no") => void;
}

const SuspiciousImageCard = (props: Props) => {
  const {
    imageUrl,
    alt = "",
    placeholderSeed,
    size = "lg",
    onClick,
    number,
    aiFlagged = false,
    onRemove,
    suspicious,
    onSuspiciousChange,
  } = props;

  const { height, overlay, badge } = SIZE_STYLES[size];

  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      className={`relative w-full overflow-hidden rounded-lg ${height} ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      {imageUrl ? (
        <img src={imageUrl} alt={alt} className="size-full object-cover" />
      ) : (
        <PlaceholderPhoto seed={placeholderSeed ?? alt} className="size-full" />
      )}

      <div
        className={`pointer-events-none absolute inset-x-0 top-0 ${overlay} bg-gradient-to-b from-black/60 to-transparent`}
      />

      {number !== undefined && (
        <span
          className={`absolute flex items-center justify-center rounded-full bg-brand-neutral text-black ${badge}`}
        >
          {number}
        </span>
      )}

      {aiFlagged && (
        <span className="absolute left-4 top-2 flex items-center gap-1 text-label-sm text-white">
          AI Flagged
          <Icon name="auto_awesome" className="text-[18px] opacity-70" />
        </span>
      )}

      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label="Remove image"
          className="absolute right-1.5 top-1.5 flex size-[18px] items-center justify-center text-white"
        >
          <Icon name="close" className="text-[14px]" />
        </button>
      )}

      {suspicious !== undefined && onSuspiciousChange && (
        <div className="absolute bottom-1.5 left-1.5 flex gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSuspiciousChange("no");
            }}
          >
            <Chip
              label="No"
              variant="neutral"
              className={suspicious === "no" ? "" : "opacity-60"}
            />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSuspiciousChange("yes");
            }}
          >
            <Chip
              label="Yes"
              variant="warning"
              className={suspicious === "yes" ? "" : "opacity-60"}
            />
          </button>
        </div>
      )}
    </div>
  );
};

export default SuspiciousImageCard;
