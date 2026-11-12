"use client";
import Image from "next/image";
import Link from "next/link";
import { useDashboardData } from "@/context/DashboardData";
import { downloadText, workersCsv } from "@/lib/csv";
import { Avatar, AvatarFallback } from "@/components/shadcn/avatar";
import { Button } from "@/components/shadcn/button";
import { Separator } from "@/components/shadcn/separator";
import { Icon } from "@/components/ui/Icon";
import { ROUTES } from "./routes";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/*
 * The Figma "AppHeader": min 64px high, px web/padding/p-4, py web/gap/gap-2, on
 * bg/surface/default. The tenant (fg/brand/default) and product name (fg/base/default) are
 * Web/Title/Large, split by a separator (bg/surface/disabled).
 */
export function TopBar({ product, audience, initials }: { product: string; audience: string; initials: string }) {
  const { data, view } = useDashboardData();
  const tenant = data.status === "ready" ? data.value.tenant.toUpperCase() : "";
  const download = () => {
    if (!view) return;
    const { m, k } = view;
    downloadText(`${m.tenant}-workers-${m.period}-${m.weeks[k].start}.csv`, workersCsv(m, k));
  };
  const downloadLabel = `Download this ${view?.m.period ?? "week"}'s worker scores (CSV)`;
  return (
    <header className="flex min-h-topbar shrink-0 items-center justify-between gap-4 bg-surface-default px-4 py-2">
      <Link href={ROUTES.home} className="flex min-w-0 items-center gap-3">
        <Image src={`${BASE}/logo.png`} alt="Tanuh" width={33} height={32} className="h-logo w-auto" priority />
        {tenant && <span className="hidden text-web-title-lg text-brand-default sm:inline">{tenant}</span>}
        <Separator orientation="vertical" className="hidden h-icon self-auto sm:block" />
        <h1 className="whitespace-nowrap text-web-title-lg text-base-default">{product}</h1>
      </Link>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" aria-label={downloadLabel} title={downloadLabel} onClick={download} disabled={!view}>
          <Icon name="download" />
        </Button>
        <Button asChild variant="ghost" size="icon">
          <Link href={ROUTES.guide} aria-label="How to read this" title="How to read this"><Icon name="menu_book" /></Link>
        </Button>
        <Button asChild variant="ghost" size="icon">
          <Link href={ROUTES.guide} aria-label="How to read this" title="How to read this"><Icon name="chat" /></Link>
        </Button>
        <Avatar title={audience}>
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
