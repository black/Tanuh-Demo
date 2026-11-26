import { Avatar } from "../atoms/Avatar";
import { Dot } from "../atoms/Dot";

/** Figma: patient-profile-card (type=list) — avatar + name / gender • age / address. */
export function PatientInfo({
  initials,
  name,
  gender,
  age,
  address,
}: {
  initials: string;
  name: string;
  gender: string;
  age: string;
  address?: string;
}) {
  return (
    <div className="flex w-full items-center gap-4">
      <Avatar initials={initials} />
      <div className="flex flex-1 flex-col justify-center">
        <p className="type-title-md text-fg-default">{name}</p>
        <div className="type-body-sm flex items-center gap-1 text-fg-default">
          <span>{gender}</span>
          <Dot />
          <span>{age}</span>
        </div>
        {address && <p className="type-body-sm text-fg-subtle">{address}</p>}
      </div>
    </div>
  );
}
