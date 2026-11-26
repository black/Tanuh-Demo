import Link from "next/link";
import { PatientInfo } from "./PatientInfo";

/** Patient list row — links to the patient dashboard. */
export function PatientListItem({
  href,
  initials,
  name,
  gender,
  age,
  address,
}: {
  href: string;
  initials: string;
  name: string;
  gender: string;
  age: string;
  address: string;
}) {
  return (
    <Link href={href} className="w-full">
      <PatientInfo
        initials={initials}
        name={name}
        gender={gender}
        age={age}
        address={address}
      />
    </Link>
  );
}
