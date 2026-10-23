import { ArrowBackIcon, SyncIcon } from "./icons";

export default function TopNavbar({ label, sublabel }: { label: string; sublabel: string }) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between bg-brand p-4 font-roboto text-white">
      <div className="flex items-center gap-4">
        <button type="button" aria-label="Back" className="-m-1 rounded-full p-1 hover:bg-white/10">
          <ArrowBackIcon />
        </button>
        <div className="flex flex-col">
          <p className="-mb-0.5 text-base leading-6">{label}</p>
          <p className="text-xs leading-4">{sublabel}</p>
        </div>
      </div>
      <button type="button" aria-label="Sync" className="-m-1 rounded-full p-1 hover:bg-white/10">
        <SyncIcon />
      </button>
    </header>
  );
}
