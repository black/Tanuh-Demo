"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useDashboardData } from "@/context/DashboardData";
import { dateTime } from "@/lib/format";
import { SidebarInset, SidebarProvider } from "@/components/shadcn/sidebar";
import { AppSidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { ViewTabs } from "./ViewTabs";
import { PeriodControls } from "./PeriodControls";
import { isDataView } from "./routes";

/*
 * The page frame: the sidebar and top bar stay fixed and only the content scrolls. From the
 * xl breakpoint each view fits the window and its cards scroll inside instead. On the
 * Data Quality views the content starts with the view tabs and the period controls
 * (content: gap web/gap/gap-4, px web/gap/gap-4, py web/padding/p-4, on bg/surface/muted).
 */
export function AppShell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const scroller = useRef<HTMLDivElement>(null);
  const { data } = useDashboardData();

  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 });
  }, [path]);

  const footer =
    data.status === "ready"
      ? `Scores exported ${dateTime(data.value.generatedAt)}${data.value.packVersions.length ? ` · rulepack version${data.value.packVersions.length > 1 ? "s" : ""} ${data.value.packVersions.join(", ")}` : ""} · tenant ${data.value.tenant}.`
      : "";

  return (
    <SidebarProvider className="h-dvh overflow-hidden bg-surface-muted text-base-default">
      <AppSidebar />
      <SidebarInset>
        <TopBar product="Quality Dashboard" audience="District Programme Manager" initials="PM" />
        <div ref={scroller} id="content" className="min-h-0 flex-1 overflow-y-auto overscroll-contain xl:overflow-hidden">
          <div className="flex min-h-full flex-col gap-4 p-4 xl:h-full">
            {isDataView(path) && (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <ViewTabs />
                <PeriodControls />
              </div>
            )}
            <main className="flex min-w-0 flex-1 flex-col xl:min-h-0">{children}</main>
            {footer && <footer className="text-mobile-label-lg text-base-subtle">{footer}</footer>}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
