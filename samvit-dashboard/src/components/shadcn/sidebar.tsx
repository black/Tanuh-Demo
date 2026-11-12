"use client";
import * as React from "react";
import { Slot } from "radix-ui";
import { cn } from "@/lib/utils";
import { Button } from "@/components/shadcn/button";
import { Icon } from "@/components/ui/Icon";

/*
 * shadcn/ui Sidebar (collapsible="icon"), restyled as the Figma "sidebar": 56px wide when
 * collapsed and 200px when open, on bg/surface/default with the overlay shadow while open;
 * pt web/padding/p-3, pb web/padding/p-2, px web/gap/gap-2, items web/gap/gap-4 apart. A menu
 * button is the Figma "icon-button" (a 24px icon, web/padding/p-2, web/rounded/rounded); the
 * current page is bg/brand/subtle-hover with fg/brand/default, and labels are
 * Mobile/Body/Medium, shown only while the sidebar is open. Hidden below the sm breakpoint,
 * as in the design.
 */
type SidebarContextProps = { state: "expanded" | "collapsed"; open: boolean; setOpen: (open: boolean) => void; toggleSidebar: () => void };

const SidebarContext = React.createContext<SidebarContextProps | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) throw new Error("useSidebar must be used within a SidebarProvider.");
  return context;
}

function SidebarProvider({ defaultOpen = false, className, children, ...props }: React.ComponentProps<"div"> & { defaultOpen?: boolean }) {
  const [open, setOpen] = React.useState(defaultOpen);
  const toggleSidebar = React.useCallback(() => setOpen((o) => !o), []);
  const value = React.useMemo<SidebarContextProps>(() => ({ state: open ? "expanded" : "collapsed", open, setOpen, toggleSidebar }), [open, toggleSidebar]);
  return (
    <SidebarContext.Provider value={value}>
      <div data-slot="sidebar-wrapper" className={cn("group/sidebar-wrapper flex w-full", className)} {...props}>
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

function Sidebar({ className, children, ...props }: React.ComponentProps<"div">) {
  const { state } = useSidebar();
  return (
    <div data-slot="sidebar" data-state={state} data-collapsible={state === "collapsed" ? "icon" : ""} className="group peer hidden h-full shrink-0 sm:block">
      <div
        data-slot="sidebar-inner"
        className={cn(
          "flex h-full flex-col gap-4 overflow-hidden bg-surface-default px-2 pb-2 pt-3 transition-[width]",
          state === "expanded" ? "w-sidebar-open shadow-overlay" : "w-sidebar",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}

function SidebarTrigger({ className, onClick, ...props }: React.ComponentProps<typeof Button>) {
  const { open, toggleSidebar } = useSidebar();
  const label = open ? "Collapse menu" : "Expand menu";
  return (
    <Button
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon"
      aria-label={label}
      title={label}
      aria-expanded={open}
      className={className}
      onClick={(e) => { onClick?.(e); toggleSidebar(); }}
      {...props}
    >
      <Icon name="menu" />
    </Button>
  );
}

function SidebarInset({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-inset" className={cn("flex h-full min-h-0 min-w-0 flex-1 flex-col", className)} {...props} />;
}

function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-header" className={cn("flex flex-col", className)} {...props} />;
}

function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-content" className={cn("flex min-h-0 flex-1 flex-col gap-4 overflow-auto", className)} {...props} />;
}

function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-footer" className={cn("mt-auto flex flex-col", className)} {...props} />;
}

function SidebarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-group" className={cn("flex w-full min-w-0 flex-col", className)} {...props} />;
}

function SidebarMenu({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul data-slot="sidebar-menu" className={cn("flex w-full min-w-0 flex-col gap-4", className)} {...props} />;
}

function SidebarMenuItem({ className, ...props }: React.ComponentProps<"li">) {
  return <li data-slot="sidebar-menu-item" className={cn("relative", className)} {...props} />;
}

function SidebarMenuButton({ asChild = false, isActive = false, className, ...props }: React.ComponentProps<"button"> & { asChild?: boolean; isActive?: boolean }) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      data-slot="sidebar-menu-button"
      data-active={isActive}
      className={cn(
        "flex h-control w-full items-center gap-3 overflow-hidden whitespace-nowrap rounded p-2 text-left text-mobile-body-md text-base-default focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-default aria-disabled:cursor-default data-[active=false]:[&:not([aria-disabled=true])]:hover:bg-surface-subtle data-[active=true]:bg-brand-subtle-hover data-[active=true]:text-brand-default group-data-[collapsible=icon]:[&>span:last-child]:sr-only",
        className,
      )}
      {...props}
    />
  );
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
};
