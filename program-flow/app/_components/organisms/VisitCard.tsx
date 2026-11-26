import Image from "next/image";
import { ActionText } from "../atoms/ActionText";
import { cardBase } from "../atoms/cardStyles";
import { Dot } from "../atoms/Dot";
import { Label, type LabelTone } from "../atoms/Label";

/** Figma: visit-card */
export function VisitCard({
  title,
  date,
  status,
  actions,
}: {
  title: string;
  date: string;
  status?: { title: string; tone: LabelTone };
  actions: [string, string];
}) {
  return (
    <div className={`${cardBase} flex h-32 min-h-32 flex-col justify-between p-4`}>
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <p className="type-title-md whitespace-nowrap text-fg-default">{title}</p>
          <div className="type-body-sm flex items-center gap-1 whitespace-nowrap">
            <span className="text-fg-subtle">Scheduled</span>
            <Dot variant="divider" />
            <span className="text-fg-brand">{date}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {status && <Label title={status.title} tone={status.tone} />}
          <Image src="/figma/chevron-down-20.svg" alt="" width={20} height={20} />
        </div>
      </div>
      <div className="flex items-center justify-end gap-4">
        <ActionText>{actions[0]}</ActionText>
        <ActionText primary>{actions[1]}</ActionText>
      </div>
    </div>
  );
}
