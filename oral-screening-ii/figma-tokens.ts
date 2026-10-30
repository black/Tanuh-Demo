// Variables pulled from the Figma file "Tanuh AI - Mobile App"
// (DlNiSPVm9thXiMQdEgAkGH), keyed by their exact Figma names. Collected from
// the variables bound on the Oral Screening, UI Design, Referral, AI Referral 2,
// Supervisor and AI Notes pages. tailwind.config.ts maps these into utilities;
// edit values here (or re-pull from Figma), not in components.

export const figmaColors = {
  // Primitive / legacy collection
  "color/brand/primary": "#14868c",
  "color/brand/primary dark": "#00767d",
  "color/brand/primary-light": "#daf3f4",
  "color/brand/light": "#daf3f4",
  "color/brand/neutral": "#f7f7f7",
  "color/brand/surface": "#f7f7f7",
  "color/brand/secondary": "#144a8c",
  "color/surface/surface-primary": "#f9fafb",
  "color/surface/surface-white": "#ffffff",
  "color/surface/surface-neutral": "#ffffff",
  "color/surface/surface-secondary": "#1f2937",
  "color/text/text-color-primary": "#111827",
  "color/text/text-color-secondary": "#6b7280",
  "color/text/text-color-hint": "#9ca3af",
  "color/text/text-color-positive": "#f0fdf4",
  "color/border/border-default": "#e5e7eb",
  "color/border/border-secondary": "#9ca3af",
  "color/border/border-none": "#f3f4f6",
  "color/states/warning/default": "#fde047",
  "color/states/warning/dark": "#a16207",
  "color/states/warning/light 2": "#fefce8",
  "color/states/error/light": "#f2f2f2",
  "color/error/default": "#ef4444",
  "color/error/dark": "#b91c1c",
  "color/neutral/0": "#ffffff",
  "color/neutral/300": "#d1d5db",
  "color/neutral/400": "#9ca3af",
  "color/neutral/500": "#6b7280",
  "color/neutral/800": "#1f2937",
  "color/neutral/950": "#030712",
  "colors/glyph/default": "#1c1b1f",
  "colors/background/primary": "#ffffff",
  "colors/bg/default/primary": "#ffffff",
  "colors/bg/inverse": "#111827",
  "colors/border/primary": "#e5e7eb",

  // Semantic collection — backgrounds
  "bg/brand/default": "#11777c",
  "bg/brand/subtle": "#ddf1f2",
  "bg/surface/default": "#ffffff",
  "bg/surface/subtle": "#f9fafb",
  "bg/surface/muted": "#f3f4f6",
  "bg/surface/pressed": "#f3f4f6",
  "bg/surface/disabled": "#e5e7eb",
  "bg/warning/subtle": "#fef3c7",
  "bg/danger/subtle": "#f2e3e4",
  "bg/danger/default": "#af1d24",
  "surface/layer/default": "#ffffff",
  "surface/layer/subtle": "#f9fafb",
  "surface/layer/muted": "#f3f4f6",
  "surface/layer/brand": "#ddf1f2",
  "surface/interactive/translucent": "#ffffff33",
  "surface/interactive/hover": "#f9fafb",
  "surface/transparent": "#ffffff00",
  "action/primary/default": "#11777c",
  "button/solid/background/default": "#11777c",
  "button/text/background/default": "#ffffff00",
  "background/selection/selected": "#11777c",
  "background/feedback/warning/subtle": "#fef3c7",
  "selection/background": "#11777c",
  "feedback/warning/background": "#fef3c7",
  "feedback/danger/background": "#f2e3e4",

  // Semantic collection — foregrounds (text)
  "fg/base/default": "#111827",
  "fg/base/muted": "#4b5563",
  "fg/base/subtle": "#6b7280",
  "fg/base/disabled": "#9ca3af",
  "fg/base/inverse": "#ffffff",
  "fg/brand/default": "#0e6266",
  "fg/on/brand": "#ffffff",
  "fg/warning/default": "#92400e",
  "fg/danger/default": "#861d23",
  "text/content/primary": "#111827",
  "text/content/secondary": "#4b5563",
  "text/content/tertiary": "#6b7280",
  "text/content/disabled": "#9ca3af",
  "text/brand/default": "#0e6266",
  "text/on/action": "#ffffff",
  "foreground/selection/selected": "#ffffff",
  "foreground/feedback/warning": "#92400e",
  "feedback/warning/foreground": "#92400e",
  "feedback/danger/foreground": "#861d23",
  "selection/foreground": "#ffffff",
  "button/solid/content/default": "#ffffff",
  "button/text/content/default": "#111827",
  "button/secondary/content/default": "#111827",

  // Semantic collection — icons
  "icon/content/primary": "#111827",
  "icon/content/tertiary": "#6b7280",
  "icon/content/static": "#1c1b1f",
  "icon/on/action": "#ffffff",

  // Semantic collection — borders
  "border/divider": "#e5e7eb",
  "border/emphasis/subtle": "#e5e7eb",
  "border/base/default": "#d1d5db",
  "border/base/hover": "#9ca3af",
  "border/state/interactive": "#d1d5db",
  "border/interactive/pressed": "#4b5563",
  "border/interactive/disabled": "#e5e7eb",
  "border/brand/default": "#11777c",
  "border/warning/default": "#d97706",
  "border/danger/default": "#af1d24",
} as const;

// Letter-spacing variables (px).
export const figmaTracking = {
  "var(--tracking-normal)": 0,
  "var(--tracking-m3-0-1)": 0.1,
  "var(--tracking-m3-0-15)": 0.15,
  "var(--tracking-m3-0-25)": 0.25,
  "var(--tracking-wide)": 0.4,
  "var(--tracking-m3-0-5)": 0.5,
  "var(--tracking-m3-neg-0-25)": -0.25,
} as const;

// Text styles: [size, line height, letter spacing, weight]. Font is Inter
// (var(--font-body/label/title/button/display/headline) all resolve to Inter
// in these frames; `family/body` = Roboto belongs to the older collection).
export const figmaTextStyles = {
  "Mobile/Display/Large": [57, 64, -0.25, 400],
  "Mobile/Display/Small": [36, 44, 0, 400],
  "Mobile/Headline/Large": [32, 40, 0, 400],
  "Mobile/Title/Large": [22, 28, 0, 400],
  "Mobile/Title/Medium": [16, 24, 0.15, 500],
  "Mobile/Title/Small": [14, 20, 0.1, 500],
  "Mobile/Body/Large": [16, 24, 0.5, 400],
  "Mobile/Body/Medium": [14, 20, 0.25, 400],
  "Mobile/Body/Small": [12, 16, 0.4, 400],
  "Mobile/Label/Large": [12, 16, 0.4, 400],
  "Mobile/Label/Medium": [11, 16, 0.4, 400],
  "Mobile/Label/Small": [10, 14, 0.4, 400],
  "Mobile/Button/Large": [16, 24, 0.4, 500],
  "Mobile/Button/Medium": [14, 20, 0.4, 500],
  "Mobile/Button/Small": [12, 16, 0.4, 500],
} as const;

// Spacing (px). mobile/padding/* and mobile/gap/* share one scale.
export const figmaSpacing = {
  "mobile/padding/none": 0,
  "mobile/padding/xss": 4,
  "mobile/padding/xs": 8,
  "mobile/padding/sm": 12,
  "mobile/padding/md": 16,
  "mobile/gap/none": 0,
  "mobile/gap/xss": 4,
  "mobile/gap/xs": 8,
  "mobile/gap/sm": 12,
  "mobile/gap/md": 16,
  "mobile/gap/lg": 24,
  "mobile/gap/3xl": 48,
  "web/gap/gap-2-5": 10,
} as const;

// Corner radii (px).
export const figmaRadius = {
  "mobile/rounded/none": 0,
  "mobile/rounded/xs": 4,
  "mobile/rounded/sm": 8,
  "mobile/rounded/lg": 16,
  "mobile/rounded/xl": 28,
  "mobile/rounded/full": 9999,
  "radius/radius-md": 6,
} as const;
