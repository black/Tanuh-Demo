import Image from "next/image";
import { cardBase } from "../atoms/cardStyles";

export type EncounterIcon =
  | { kind: "icon"; src: string; size: number; tint: string }
  | { kind: "image"; src: string; overlay: boolean; size: number };

/** Encounter type list item (Unplanned tab). */
export function EncounterTypeCard({
  title,
  subtitle,
  icon,
}: {
  title: string;
  subtitle: string;
  icon: EncounterIcon;
}) {
  return (
    <div className={`${cardBase} flex items-start gap-4 p-3`}>
      {icon.kind === "icon" ? (
        <div
          className="flex size-12 shrink-0 items-center justify-center rounded-mobile-sm"
          style={{ backgroundColor: icon.tint }}
        >
          <Image src={icon.src} alt="" width={icon.size} height={icon.size} />
        </div>
      ) : (
        <div
          className="relative shrink-0 overflow-hidden rounded-mobile-sm"
          style={{ width: icon.size, height: icon.size }}
        >
          <Image src={icon.src} alt="" fill sizes="48px" className="object-cover" />
          {icon.overlay && (
            <div className="absolute inset-0 bg-[rgba(200,200,200,0.2)]" />
          )}
        </div>
      )}
      <div className="flex min-w-px flex-1 items-center justify-between self-stretch">
        <div className="flex flex-col justify-center whitespace-nowrap">
          <p className="type-title-sm text-glyph-default">{title}</p>
          <p className="type-body-sm text-content-tertiary">{subtitle}</p>
        </div>
        <Image src="/figma/chevron-right-24.svg" alt="" width={24} height={24} />
      </div>
    </div>
  );
}
