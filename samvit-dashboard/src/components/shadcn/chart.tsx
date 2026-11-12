"use client";
import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { cn } from "@/lib/utils";

/*
 * shadcn/ui Chart: Recharts in a responsive container. Each series in the config gets a
 * --color-<key> variable for its colour. Axis text is Mobile/Label/Small in fg/base/subtle.
 */
export type ChartConfig = Record<string, { label?: React.ReactNode; color?: string }>;

const ChartContext = React.createContext<{ config: ChartConfig } | null>(null);

function ChartContainer({
  config,
  className,
  children,
  style,
  ...props
}: React.ComponentProps<"div"> & { config: ChartConfig; children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>["children"] }) {
  const vars = Object.fromEntries(Object.entries(config).filter(([, c]) => c.color).map(([key, c]) => [`--color-${key}`, c.color]));
  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        style={{ ...vars, ...style } as React.CSSProperties}
        className={cn(
          "flex justify-center text-mobile-label-sm [&_.recharts-cartesian-axis-tick_text]:fill-fg-base-subtle [&_.recharts-surface]:outline-none [&_.recharts-wrapper]:outline-none",
          className,
        )}
        {...props}
      >
        <RechartsPrimitive.ResponsiveContainer>{children}</RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

export { ChartContainer };
