import Image from "next/image";
import { cardBase } from "../atoms/cardStyles";
import { Label } from "../atoms/Label";

/** Figma: program-card (available) */
export function AvailableProgramCard() {
  return (
    <div className={`${cardBase} flex items-center gap-4 p-4`}>
      <p className="type-title-sm min-w-px flex-1 whitespace-pre-wrap text-content-primary">
        {"Non-Communicable Disease  (NCD)"}
      </p>
      <div className="flex shrink-0 items-center gap-2">
        <Label title="Start" tone="positive" />
        <Image src="/figma/chevron-right-20.svg" alt="" width={20} height={20} />
      </div>
    </div>
  );
}
