import type { Config } from "tailwindcss";
import {
  figmaColors as c,
  figmaRadius,
  figmaSpacing,
  figmaTextStyles,
  figmaTracking,
} from "./figma-tokens";

// Every colour, type style, letter-spacing, spacing and radius token comes
// from figma-tokens.ts (exact Figma variable names). The default Tailwind
// palette is replaced, not extended, so only Figma colours exist.
//
// Naming: semantic Figma groups map to the utility they style —
//   bg/danger/subtle      → bg-danger-subtle
//   fg/base/muted         → text-base-muted
//   border/divider        → border-divider
//   Mobile/Body/Large     → text-mobile-body-large (size, leading, tracking, weight)
//   mobile/gap/xs         → gap-mobile-xs   (padding/gap share one scale)
//   var(--tracking-wide)  → tracking-wide

const px = (n: number) => `${n}px`;

type FontSize = [string, { lineHeight: string; letterSpacing: string; fontWeight: string }];

const fontSize = Object.fromEntries(
  Object.entries(figmaTextStyles).map(([name, [size, leading, tracking, weight]]): [string, FontSize] => [
    name.toLowerCase().replace(/\//g, "-"),
    [px(size), { lineHeight: px(leading), letterSpacing: px(tracking), fontWeight: String(weight) }],
  ])
);

const letterSpacing = Object.fromEntries(
  Object.entries(figmaTracking).map(([name, value]) => [
    name.replace(/^var\(--tracking-/, "").replace(/\)$/, ""),
    px(value),
  ])
);

// mobile/padding/sm and mobile/gap/sm → "mobile-sm"; web/gap/gap-2-5 → "web-2-5".
const spacing = Object.fromEntries(
  Object.entries(figmaSpacing).map(([name, value]) => [
    name.startsWith("web/") ? "web-2-5" : `mobile-${name.split("/").pop()}`,
    px(value),
  ])
);

const borderRadius = Object.fromEntries(
  Object.entries(figmaRadius).map(([name, value]) => [
    name === "radius/radius-md" ? "md" : name === "mobile/rounded/full" ? "full" : `mobile-${name.split("/").pop()}`,
    px(value),
  ])
);

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    // Primitives: usable with any colour utility (bg, text, border, from/via…).
    colors: {
      transparent: "transparent",
      current: "currentColor",
      brand: {
        primary: c["color/brand/primary"],
        "primary-dark": c["color/brand/primary dark"],
        light: c["color/brand/light"],
        neutral: c["color/brand/neutral"],
        secondary: c["color/brand/secondary"],
      },
      neutral: {
        0: c["color/neutral/0"],
        300: c["color/neutral/300"],
        400: c["color/neutral/400"],
        500: c["color/neutral/500"],
        800: c["color/neutral/800"],
        950: c["color/neutral/950"],
      },
      inverse: c["colors/bg/inverse"],
      states: {
        "warning-default": c["color/states/warning/default"],
        "warning-dark": c["color/states/warning/dark"],
        "warning-light-2": c["color/states/warning/light 2"],
        "error-light": c["color/states/error/light"],
      },
      error: {
        default: c["color/error/default"],
        dark: c["color/error/dark"],
      },
    },
    fontFamily: {
      sans: ["Inter", "Helvetica", "Arial", "sans-serif"],
    },
    fontSize,
    letterSpacing,
    extend: {
      backgroundColor: {
        "brand-default": c["bg/brand/default"],
        "brand-subtle": c["bg/brand/subtle"],
        "surface-default": c["bg/surface/default"],
        "surface-subtle": c["bg/surface/subtle"],
        "surface-muted": c["bg/surface/muted"],
        "surface-pressed": c["bg/surface/pressed"],
        "surface-disabled": c["bg/surface/disabled"],
        "warning-subtle": c["bg/warning/subtle"],
        "danger-subtle": c["bg/danger/subtle"],
        "danger-default": c["bg/danger/default"],
        "layer-default": c["surface/layer/default"],
        "layer-subtle": c["surface/layer/subtle"],
        "layer-muted": c["surface/layer/muted"],
        "layer-brand": c["surface/layer/brand"],
        "interactive-translucent": c["surface/interactive/translucent"],
        "interactive-hover": c["surface/interactive/hover"],
        "action-primary": c["action/primary/default"],
      },
      textColor: {
        "base-default": c["fg/base/default"],
        "base-muted": c["fg/base/muted"],
        "base-subtle": c["fg/base/subtle"],
        "base-disabled": c["fg/base/disabled"],
        "base-inverse": c["fg/base/inverse"],
        "brand-default": c["fg/brand/default"],
        "on-brand": c["fg/on/brand"],
        "warning-default": c["fg/warning/default"],
        "danger-default": c["fg/danger/default"],
        "content-primary": c["text/content/primary"],
        "content-secondary": c["text/content/secondary"],
        "content-tertiary": c["text/content/tertiary"],
        "content-disabled": c["text/content/disabled"],
        "icon-on-action": c["icon/on/action"],
      },
      borderColor: {
        DEFAULT: c["border/divider"],
        divider: c["border/divider"],
        "emphasis-subtle": c["border/emphasis/subtle"],
        "base-default": c["border/base/default"],
        "base-hover": c["border/base/hover"],
        "state-interactive": c["border/state/interactive"],
        "interactive-pressed": c["border/interactive/pressed"],
        "interactive-disabled": c["border/interactive/disabled"],
        "brand-default": c["border/brand/default"],
        "warning-default": c["border/warning/default"],
        "danger-default": c["border/danger/default"],
      },
      spacing,
      borderRadius,
    },
  },
  plugins: [],
};

export default config;
