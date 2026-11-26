import Image from "next/image";
import Link from "next/link";
import { cardBase } from "../atoms/cardStyles";
import { KeyValueLabel } from "../atoms/KeyValueLabel";

/** Figma: program-card (registered) */
export function RegisteredProgramCard({ href }: { href: string }) {
  return (
    <Link href={href} className={`${cardBase} flex gap-4 p-4`}>
      <div className="flex min-w-px flex-1 flex-col gap-3">
        <div className="flex items-center justify-between">
          <KeyValueLabel label="Enrolled" value="19 May, 2026" />
          <Image src="/figma/chevron-right-20.svg" alt="" width={20} height={20} />
        </div>
        <p className="type-title-sm whitespace-pre text-content-primary">
          {"Non-Communicable Disease  (NCD)"}
        </p>
      </div>
    </Link>
  );
}
