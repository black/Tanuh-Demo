/* The app's pages. The three Data Quality views share the tabs row and the period controls. */
export const ROUTES = {
  home: "/",
  health: "/health-check",
  workers: "/workers",
  dimensions: "/quality-dimensions",
  guide: "/how-to-read",
} as const;

export const VIEW_TABS = [
  { href: ROUTES.health, label: "Health Check" },
  { href: ROUTES.workers, label: "Workers" },
  { href: ROUTES.dimensions, label: "Quality Dimensions" },
];

const trim = (p: string) => (p.length > 1 ? p.replace(/\/+$/, "") : p);

/** Whether `path` (as usePathname gives it) is the page at `href`. */
export const isRoute = (path: string | null, href: string) => trim(path ?? "/") === trim(href);

/** Whether `path` is one of the Data Quality views. */
export const isDataView = (path: string | null) => VIEW_TABS.some((t) => isRoute(path, t.href));
