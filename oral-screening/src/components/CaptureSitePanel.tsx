import SuspiciousImageCard from "./SuspiciousImageCard";
import type { CapturedImage, ReferenceSite } from "@/lib/captureSites";

interface Props {
  site: ReferenceSite;
  captures: CapturedImage[];
  onViewImage: (imageUrl: string) => void;
  onRemoveImage: (imageId: string) => void;
  onSuspiciousChange: (imageId: string, value: "yes" | "no") => void;
}

const CaptureSitePanel = (props: Props) => {
  const { site, captures, onViewImage, onRemoveImage, onSuspiciousChange } = props;

  return (
    <div className="no-scrollbar flex-1 overflow-y-auto pb-32">
      <p className="text-title-sm text-text-primary font-semibold">{site.name}</p>
      <button
        type="button"
        onClick={() => onViewImage(site.image)}
        className="relative mt-2 h-[240px] w-full cursor-pointer overflow-hidden rounded-lg"
      >
        <img src={site.image} alt={site.name} className="size-full object-cover" />
      </button>

      <p className="mt-4 text-title-sm text-text-secondary">Suspicious Lesion?</p>

      <div className="mt-2 flex flex-col gap-2">
        {captures.length === 0 && (
          <p className="rounded-lg border border-dashed border-border px-4 py-6 text-center text-body-sm text-text-secondary">
            No images captured for this site yet. Tap the camera button to add
            one.
          </p>
        )}
        {captures.map((img) => (
          <SuspiciousImageCard
            key={img.id}
            imageUrl={img.imageUrl}
            placeholderSeed={img.id}
            size="sm"
            number={img.number}
            onClick={
              img.imageUrl ? () => onViewImage(img.imageUrl as string) : undefined
            }
            onRemove={() => onRemoveImage(img.id)}
            suspicious={img.suspicious}
            onSuspiciousChange={(value) => onSuspiciousChange(img.id, value)}
          />
        ))}
      </div>
    </div>
  );
};

export default CaptureSitePanel;
