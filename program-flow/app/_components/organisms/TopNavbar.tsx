"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

type TopNavbarProps = {
  label: string;
  sublabel?: string;
  showSync?: boolean;
  showSearch?: boolean;
};

/** Figma: "Top navbar" — status bar + action bar with back nav. */
export function TopNavbar({
  label,
  sublabel,
  showSync = true,
  showSearch = false,
}: TopNavbarProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-10 flex w-full flex-col bg-bg-brand-default">
      {/* status-bar */}
      <div className="flex h-8 items-center justify-between px-4">
        <span className="font-roboto text-[12px] leading-4 text-white">9:30</span>
        <Image src="/figma/status-camera.svg" alt="" width={16} height={16} />
        <div className="flex items-center">
          <Image src="/figma/status-wifi.svg" alt="" width={16} height={16} />
          <Image src="/figma/status-signal.svg" alt="" width={16} height={16} />
          <Image src="/figma/status-battery.svg" alt="" width={16} height={16} />
        </div>
      </div>

      {/* action-bar */}
      <div className="flex h-14 items-center gap-2.5 p-4">
        <div className="flex min-w-px flex-1 items-center gap-4">
          <button
            type="button"
            aria-label="Back"
            onClick={() => router.back()}
            className="shrink-0 cursor-pointer"
          >
            <Image src="/figma/arrow-back.svg" alt="" width={20} height={20} />
          </button>
          <div className="flex flex-col justify-center whitespace-nowrap text-fg-inverse">
            <p className={`type-roboto-body-lg ${sublabel ? "-mb-0.5" : ""}`}>
              {label}
            </p>
            {sublabel && <p className="type-roboto-body-sm">{sublabel}</p>}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-4">
          {showSync && (
            <button type="button" aria-label="Sync" className="cursor-pointer">
              <Image src="/figma/sync.svg" alt="" width={20} height={20} />
            </button>
          )}
          {showSearch && (
            <button type="button" aria-label="Search" className="cursor-pointer">
              <Image src="/figma/search.svg" alt="" width={20} height={20} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
