"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/shadcn/sidebar";
import { Icon } from "@/components/ui/Icon";
import { ROUTES, isRoute } from "./routes";

/* The Figma "sidebar": the menu button, Home, Data Quality and account management, and
 * settings and the theme at the foot (account management, settings and the theme are not
 * available yet). Workers is a Data Quality tab, and "How to read this" is the book icon in
 * the top bar. */
const GLYPH = "inline-flex size-icon shrink-0 items-center justify-center";

export function AppSidebar() {
  const path = usePathname();
  const on = (href: string) => isRoute(path, href);
  const pages = [
    { icon: "diversity_2", label: "Home", href: ROUTES.home, current: on(ROUTES.home) },
    // Health Check, Workers and Quality Dimensions are the Data Quality view tabs.
    { icon: "data_usage", label: "Data Quality", href: ROUTES.health, current: on(ROUTES.health) || on(ROUTES.workers) || on(ROUTES.dimensions) },
  ];
  return (
    <Sidebar aria-label="Main navigation">
      <SidebarHeader>
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent className="mt-6">
        <SidebarGroup>
          <SidebarMenu>
            {pages.map((p) => (
              <SidebarMenuItem key={p.href}>
                <SidebarMenuButton asChild isActive={p.current} tooltip={p.label}>
                  <Link href={p.href} aria-current={p.current ? "page" : undefined}>
                    <Icon name={p.icon} size="md" className={GLYPH} />
                    <span>{p.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
            <SidebarMenuItem>
              <SidebarMenuButton type="button" tooltip="Manage accounts" aria-disabled>
                <Icon name="manage_accounts" size="md" className={GLYPH} />
                <span>Manage accounts</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton type="button" tooltip="Settings" aria-disabled>
              <Icon name="tune" size="md" className={GLYPH} />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton type="button" tooltip="Light theme" aria-disabled>
              <Icon name="light_mode" size="md" className={GLYPH} />
              <span>Light theme</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
