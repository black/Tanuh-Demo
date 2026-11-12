import Link from "next/link";
import { Card } from "@/components/shadcn/card";
import { Icon } from "@/components/ui/Icon";
import { ROUTES } from "@/components/layout/routes";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/* The start page: what is here, as it was in the demo's index.html. */
const LINKS = [
  { href: ROUTES.health, icon: "data_usage", title: "Data Quality", body: "Each worker's and each taluk's scores by week, the rules behind them, and a map of the taluks, as of the last export from the service.", internal: true },
  { href: `${BASE}/docs.html`, icon: "menu_book", title: "Reference documentation", body: "The API, the record rules and dataset rules Samvit uses, and how the service is built.", internal: false },
  { href: "http://localhost:8000/docs", icon: "api", title: "API explorer", body: "The running service's own interactive API documentation, on port 8000. It opens only while the service runs on this machine.", internal: false },
];

export function HomeLinks() {
  return (
    <div className="flex max-w-prose flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-balance text-mobile-title-lg text-base-default">DQS demo for Samvit</h2>
        <p className="text-mobile-body-md text-base-muted">Pages served alongside the running service. deploy/README.md in the repository is the runbook.</p>
      </div>
      <ul className="flex flex-col gap-2">
        {LINKS.map((l) => {
          const body = (
            <>
              <span className="inline-flex size-control shrink-0 items-center justify-center rounded-full bg-brand-subtle text-brand-default"><Icon name={l.icon} /></span>
              <span className="flex flex-col gap-1">
                <span className="text-mobile-title-md text-link-default">{l.title}</span>
                <span className="text-mobile-body-md text-base-muted">{l.body}</span>
              </span>
            </>
          );
          const cls = "flex items-start gap-4";
          return (
            <li key={l.href}>
              <Card className="hover:bg-surface-subtle">
                {l.internal ? <Link href={l.href} className={cls}>{body}</Link> : <a href={l.href} className={cls}>{body}</a>}
              </Card>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
