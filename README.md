# Tanuh AI — Capture Images Screen

Next.js implementation of the "Capture images" screen from the Tanuh AI mobile app Figma file (node `3064:1756`, part of the "Oral Screening – Take Image" flow).

## What's implemented

- Mobile frame (360px) with status bar, teal top nav (`Oral / Screening`), and header showing progress chip (`x/8`) and helper text.
- Left thumbnail rail of the 14 reference oral sites; tapping a thumbnail switches the active site.
- Main panel with the reference photo (with a green outline overlay, as in the design) and the "Suspicious Lesion?" captured-image list.
- Each captured image has a numbered badge, a remove (×) button, and No/Yes lesion-tag chips (yellow when marked suspicious).
- Floating camera action button that opens the device camera/file picker (`capture="environment"`) and appends a new capture to the active site.
- Back / Next footer buttons; Next is disabled until 8 total images are captured.

## Note on images

The Figma MCP server serves the original photography from `localhost:3845`, which is only reachable from the Figma desktop app on your machine — not from this build environment. `src/components/PlaceholderPhoto.tsx` renders a generated gradient tile in its place. Swap in real asset URLs there (or pass a `src` prop) once you have access to the exported images.

## Running locally

This project's dependencies couldn't be installed in the sandbox (no network access to the npm registry), so `node_modules` isn't included. On your machine:

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Stack

Next.js 14 (App Router) + TypeScript + Tailwind CSS. Tailwind theme in `tailwind.config.ts` mirrors the Figma file's color/spacing/typography variables (`brand/primary`, `states/warning`, etc.).
