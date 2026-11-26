import Image from "next/image";
import { ActionText } from "../atoms/ActionText";
import { cardBase } from "../atoms/cardStyles";
import { KeyValueLabel } from "../atoms/KeyValueLabel";
import { Separator } from "../atoms/Separator";
import { ByLine } from "../molecules/ByLine";
import { PatientInfo } from "../molecules/PatientInfo";

/** Figma: patient-profile-card (patient dashboard) */
export function PatientSummaryCard() {
  return (
    <section className={`${cardBase} flex flex-col gap-4 p-4`}>
      <div className="flex items-center justify-between">
        <KeyValueLabel label="Enrolled" value="19 May, 2026" />
        <ByLine name="Thanush" />
      </div>

      <PatientInfo initials="PN" name="Patient Name" gender="Gender" age="Age" />

      <div className="flex items-center gap-4">
        <Image src="/figma/explore-nearby.svg" alt="" width={24} height={24} />
        <div className="flex flex-1 flex-col">
          <span className="type-label-md text-content-disabled">Location</span>
          <span className="type-body-sm text-action-primary">
            Karahalli, Nalavagilu
          </span>
        </div>
      </div>

      <Separator />

      <div className="flex items-center justify-end gap-4 py-1">
        <ActionText>Edit</ActionText>
        <ActionText primary>Void</ActionText>
      </div>
    </section>
  );
}
