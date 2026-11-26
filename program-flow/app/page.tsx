import { Fragment } from "react";
import { TopNavbar } from "./_components/organisms/TopNavbar";
import { PatientListItem } from "./_components/molecules/PatientListItem";
import { Dot } from "./_components/atoms/Dot";
import { Separator } from "./_components/atoms/Separator";

const groups = [
  { date: "25-06-2025", count: "2 Patients", patients: 1 },
  { date: "25-06-2025", count: "2 Patients", patients: 2 },
  { date: "15-04-2025", count: "4 Patients", patients: 4 },
];

export default function PatientListPage() {
  return (
    <main className="min-h-screen bg-brand-surface">
      <TopNavbar label="Patients" sublabel="Registered" showSync showSearch />

      <div className="flex flex-col gap-6 px-4 pt-4 pb-6">
        {groups.map((group, g) => (
          <Fragment key={g}>
            {g > 0 && <Separator />}
            <div className="flex items-center gap-[7px] whitespace-nowrap">
              <span className="type-roboto-body-sm text-text-primary">{group.date}</span>
              <Dot />
              <span className="type-roboto-body-sm text-border-secondary">
                {group.count}
              </span>
            </div>
            {Array.from({ length: group.patients }, (_, i) => (
              <PatientListItem
                key={i}
                href="/patient"
                initials="PN"
                name="Patient Name"
                gender="Gender"
                age="Age"
                address="Karahalli Hosakote Taluk"
              />
            ))}
          </Fragment>
        ))}
      </div>
    </main>
  );
}
