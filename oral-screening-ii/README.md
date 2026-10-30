# Oral Screening II — Guided Image Capture

Prototype of the Figma design *Tanuh AI - Mobile App*, node 3956:8034
(guided oral screening image capture).

```bash
npm install
npm run dev   # http://localhost:3012
```

## Flow (from the Figma frames)

1. **List** — one card per oral region (name, annotated reference photo, count
   badge). Tap a card to open the camera for that region.
2. **Camera** — the app-bar chevron expands/collapses the reference image above
   the viewfinder. The collapsed state is remembered across regions and
   sessions (`localStorage`), covering the PRD's "hide reference images" rule.
3. **Review** — the captured photo with *Suspicious Lesion? No / Yes*.
   Answering saves the photo and returns to the list; the back arrow discards
   it and reopens the camera (retake).

Every capture gets an on-device quality grade — **Best**, **Fine** or
**Poor** (with a reason: too dark, overexposed, blurry) — shown as a tag on the
review screen and in each region's photo sheet. Grading lives in
`src/lib/imageQuality.ts`; thresholds were set against the reference photos and
still need calibrating on real field captures.

PRD limits enforced on top of the design: *Next* is disabled until 8 photos,
cards lock at 14, and the hint line shows progress toward the minimum.
Without camera access the shutter uses the region's sample photo (demo mode).

## Design tokens

All colours, text styles, letter-spacing, spacing and radii come from the Figma
file's variables, listed under their exact Figma names in `figma-tokens.ts`.
`tailwind.config.ts` maps them to utilities (`bg/danger/subtle` →
`bg-danger-subtle`, `fg/base/muted` → `text-base-muted`, `Mobile/Body/Large` →
`text-mobile-body-large`, `mobile/gap/xs` → `gap-mobile-xs`). The stock
Tailwind palette is removed, so only Figma colours can be used. Update values
in `figma-tokens.ts`, not in components.

## Open items

- Region list and order in `src/lib/protocol.ts` are placeholders pending the
  approved protocol.
- The design has no explicit Retake/Skip on review or a way to view/remove
  saved photos; retake is mapped to the back arrow for now.
