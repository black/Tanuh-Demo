import type { Metadata, Viewport } from "next";
import "@fontsource/poppins/300.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "material-symbols/outlined.css";
import "./globals.css";
import { DashboardDataProvider } from "@/context/DashboardData";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: { default: "SAMVIT Data Quality", template: "%s · SAMVIT Data Quality" },
  description: "Each worker's and each taluk's data quality scores by week, and the rules behind them.",
  icons: { icon: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/logo.png` },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-surface-muted font-sans text-mobile-body-md text-base-default antialiased">
        <DashboardDataProvider>
          <AppShell>{children}</AppShell>
        </DashboardDataProvider>
      </body>
    </html>
  );
}
