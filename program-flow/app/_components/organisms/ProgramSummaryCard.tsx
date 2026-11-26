import { ActionText } from "../atoms/ActionText";
import { cardBase } from "../atoms/cardStyles";
import { KeyValueLabel } from "../atoms/KeyValueLabel";
import { Separator } from "../atoms/Separator";
import { ByLine } from "../molecules/ByLine";
import { PatientInfo } from "../molecules/PatientInfo";

/** Figma: patient-profile-card (program summary) */
export function ProgramSummaryCard({
  exitedOn,
  onExit,
}: {
  exitedOn?: string;
  onExit: () => void;
}) {
  return (
    <section className={`${cardBase} flex flex-col gap-4 p-4`}>
      <div className="flex items-center justify-between">
        <KeyValueLabel label="Enrolled" value="19 May, 2026" />
        <ByLine name="Thanush" />
      </div>

      <div className="flex flex-col gap-1">
        <p className="type-title-sm whitespace-pre text-content-primary">
          {"Non-Communicable Disease  (NCD)"}
        </p>
        {/* Figma: Bodystack (sm, secondary) */}
        <p className="type-body-sm text-content-secondary">Summary of the program</p>
      </div>

      <PatientInfo
        initials="PN"
        name="Patient Name"
        gender="Gender"
        age="Age"
        address="Karahalli Hosakote Taluk"
      />

      <Separator />

      <div className="flex items-center justify-between py-1">
        {exitedOn ? (
          <KeyValueLabel label="Exited" value={exitedOn} />
        ) : (
          <ActionText onClick={onExit}>Exit</ActionText>
        )}
        <div className="flex items-center gap-4">
          <ActionText>Edit</ActionText>
          <ActionText primary>Share</ActionText>
        </div>
      </div>
    </section>
  );
}
