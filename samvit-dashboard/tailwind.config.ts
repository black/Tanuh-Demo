import type { Config } from "tailwindcss";
import { bg, border, fg } from "./src/lib/tokens";

/*
 * Tanuh design tokens, from the variables in the Figma file "Tanuh AI - SAMVIT",
 * page "-> Data Quality". Every colour, spacing step, radius and text style the app uses
 * is defined here, and nothing else: the Tailwind defaults for these scales are replaced,
 * not extended, so a class that is not a design token does not exist.
 *
 * Naming: a class names its Figma variable by the path after the first segment.
 *   bg-surface-muted        bg/surface/muted
 *   text-base-subtle        fg/base/subtle
 *   border-base-muted       border/base/muted
 *   gap-4, p-4              web/gap/gap-4, web/padding/p-4 (16px)
 *   rounded, rounded-lg     web/rounded/rounded (4px), web/rounded/lg (8px)
 *   text-mobile-title-md    text style Mobile/Title/Medium
 *
 * The colours themselves are in src/lib/tokens.ts, so the charts can use the same values.
 */

// web/gap/gap-*, web/padding/p-*, mobile/gap/*, mobile/padding/* (all on the same 4px grid)
const spacing = {
  "0": "0px", // web/gap/gap-0, web/padding/p-0, mobile/gap/none, mobile/padding/none
  "0.5": "2px", // web/gap/gap-0-5
  "1": "4px", // web/gap/gap-1, mobile/gap/xss, mobile/padding/xss
  "1.5": "6px", // web/gap/gap-1-5
  "2": "8px", // web/gap/gap-2, web/padding/p-2, mobile/gap/xs, mobile/padding/xs, spacing/mobile/small
  "3": "12px", // web/padding/p-3, mobile/padding/sm
  "4": "16px", // web/gap/gap-4, web/padding/p-4, mobile/gap/md
  "6": "24px", // web/gap/gap-6
  "8": "32px", // web/gap/gap-8
  "16": "64px", // web/gap/gap-16
};

// Fixed sizes the design gives in pixels (component heights, icons, panel widths).
const sizes = {
  px: "1px", // separators
  bullet: "3px", // the dot between two metadata items
  "dot-sm": "10px", // score dot in a table
  dot: "12px", // worker dot in the map tooltip
  "icon-sm": "16px", // legend dot, change arrow, breadcrumb chevron
  icon: "24px", // icon inside an icon button
  logo: "32px",
  control: "40px", // chip, segmented tabs, icon button, avatar
  separator: "48px", // vertical separator in a reason card
  sidebar: "56px",
  topbar: "64px",
  "chip-min": "88px",
  "sidebar-open": "200px",
  tooltip: "226px",
  rail: "320px", // "Top Reason for Poor Quality" column on Health Check (254px in the design, widened on request)
  panel: "435px", // worker panel on Workers
  kpi: "150px", // KPI and dimension cards
  map: "480px", // the map area in "Workers by Taluk"
  chart: "180px", // "DQ Score Over Time" on the worker panel
};

/*
 * Text styles: [font size, { line height, letter spacing, weight }], one per Figma text
 * style. Every style is Poppins (--font-title, --font-body, --font-label, --font-button,
 * --font-headline).
 */
type TextStyle = [string, { lineHeight: string; letterSpacing: string; fontWeight: string }];
const style = (size: number, line: number, tracking: number, weight: 400 | 500): TextStyle => [
  `${size}px`,
  { lineHeight: `${line}px`, letterSpacing: `${tracking}px`, fontWeight: String(weight) },
];
const fontSize: Record<string, TextStyle | [string, { lineHeight: string }]> = {
  "web-headline-lg": style(30, 36, 0, 400), // Web/Headline/Large
  "web-title-lg": style(20, 28, 0, 400), // Web/Title/Large
  "web-title-md": style(16, 24, 0, 500), // Web/Title/Medium
  "web-body-md": style(14, 20, 0.4, 400), // Web/Body/Medium
  "web-body-sm": style(12, 16, 0.4, 400), // Web/Body/Small
  "web-label-lg": style(12, 16, 0.4, 400), // Web/Label/Large
  "web-label-sm": style(12, 16, 0.4, 400), // Web/Label/Small
  "web-button-lg": style(16, 24, 0.4, 500), // Web/Button/Large
  "web-button-md": style(14, 20, 0.4, 500), // Web/Button/Medium
  "mobile-title-lg": style(22, 28, 0, 400), // Mobile/Title/Large
  "mobile-title-md": style(16, 24, 0.15, 500), // Mobile/Title/Medium
  "mobile-title-sm": style(14, 20, 0.1, 500), // Mobile/Title/Small
  "mobile-body-md": style(14, 20, 0.25, 400), // Mobile/Body/Medium
  "mobile-body-sm": style(12, 16, 0.4, 400), // Mobile/Body/Small
  "mobile-label-lg": style(12, 16, 0.4, 400), // Mobile/Label/Large
  "mobile-label-sm": style(10, 14, 0.4, 400), // Mobile/Label/Small
  // Material Symbols glyph sizes: the design's 24px and 16px icons, and 20px chevrons.
  icon: ["24px", { lineHeight: "24px" }],
  "icon-md": ["20px", { lineHeight: "20px" }],
  "icon-sm": ["16px", { lineHeight: "16px" }],
};

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    colors: { transparent: "transparent", current: "currentColor", white: "#ffffff" },
    backgroundColor: { ...bg, transparent: "transparent" },
    textColor: fg,
    borderColor: { ...border, transparent: "transparent", current: "currentColor" },
    divideColor: border,
    outlineColor: { "brand-default": border["brand-default"] },
    ringColor: { "brand-default": border["brand-default"] },
    fill: { ...bg, "fg-brand-pressed": fg["brand-pressed"], "fg-base-subtle": fg["base-subtle"], current: "currentColor", none: "none" },
    stroke: { ...bg, ...Object.fromEntries(Object.entries(border).map(([k, v]) => [`border-${k}`, v])) },
    spacing,
    borderRadius: {
      none: "0px",
      DEFAULT: "4px", // web/rounded/rounded
      lg: "8px", // web/rounded/lg, web/gap/gap-2 used as a radius on cards
      full: "9999px", // web/radius/full
    },
    fontFamily: { sans: ["Poppins", "system-ui", "-apple-system", "Segoe UI", "sans-serif"] },
    fontSize,
    boxShadow: {
      none: "none",
      tooltip: "0px 0px 2px 0px rgba(0, 0, 0, 0.25)", // the map tooltip
      overlay: "0px 4px 16px 0px rgba(17, 24, 39, 0.12)", // the sidebar while it is open
    },
    extend: {
      width: sizes,
      height: sizes,
      size: sizes,
      minWidth: sizes,
      minHeight: sizes,
      maxWidth: { prose: "72ch" },
    },
  },
  plugins: [],
};

export default config;
