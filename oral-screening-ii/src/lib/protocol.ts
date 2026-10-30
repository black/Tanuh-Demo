// Capture limits and the recommended region sequence for the guided flow.
// The sequence, names and framing tips are a placeholder for the approved
// screening protocol (PRD §5 open question) — confirm before clinical use.

export const MIN_IMAGES = 8;
export const MAX_IMAGES = 14;

export type RegionGroup = "lips" | "buccal" | "tongue" | "floor";

export const REGION_GROUPS: { id: RegionGroup; label: string }[] = [
  { id: "lips", label: "Lips & labial" },
  { id: "buccal", label: "Buccal" },
  { id: "tongue", label: "Tongue" },
  { id: "floor", label: "Floor, palate & gums" },
];

export type Region = {
  id: string;
  group: RegionGroup;
  name: string;
  image: string;
  instruction: string;
};

export const REGIONS: Region[] = [
  {
    id: "lips",
    group: "lips",
    name: "Lips",
    image: "/reference/lips.png",
    instruction: "Ask the patient to close their mouth gently. Frame both lips, corner to corner.",
  },
  {
    id: "upper-labial-mucosa",
    group: "lips",
    name: "Upper Labial Mucosa",
    image: "/reference/upper-labial-mucosa.png",
    instruction: "Evert the upper lip with gloved fingers so the inner surface fills the frame.",
  },
  {
    id: "lower-labial-mucosa",
    group: "lips",
    name: "Lower Labial Mucosa",
    image: "/reference/lower-labial-mucosa.png",
    instruction: "Pull the lower lip down and out to expose the inner surface.",
  },
  {
    id: "right-buccal-mucosa",
    group: "buccal",
    name: "Right Buccal Mucosa",
    image: "/reference/right-buccal-mucosa.png",
    instruction: "Retract the right cheek. Capture the inner cheek from the corner of the mouth back.",
  },
  {
    id: "left-buccal-mucosa",
    group: "buccal",
    name: "Left Buccal Mucosa",
    image: "/reference/left-buccal-mucosa.png",
    instruction: "Retract the left cheek. Capture the inner cheek from the corner of the mouth back.",
  },
  {
    id: "right-buccal-vestibule",
    group: "buccal",
    name: "Right Buccal Vestibule",
    image: "/reference/right-buccal-vestibule.png",
    instruction: "Pull the right cheek outward to show the fold between cheek and gum.",
  },
  {
    id: "left-buccal-vestibule",
    group: "buccal",
    name: "Left Buccal Vestibule",
    image: "/reference/left-buccal-vestibule.png",
    instruction: "Pull the left cheek outward to show the fold between cheek and gum.",
  },
  {
    id: "dorsum-tongue",
    group: "tongue",
    name: "Dorsum of Tongue",
    image: "/reference/dorsum-tongue.png",
    instruction: "Ask the patient to stick their tongue out fully. Capture the top surface.",
  },
  {
    id: "right-lateral-tongue",
    group: "tongue",
    name: "Right Lateral Border of Tongue",
    image: "/reference/right-lateral-tongue.png",
    instruction: "Ask the patient to move the tongue to the left so the right edge is visible.",
  },
  {
    id: "left-lateral-tongue",
    group: "tongue",
    name: "Left Lateral Border of Tongue",
    image: "/reference/left-lateral-tongue.png",
    instruction: "Ask the patient to move the tongue to the right so the left edge is visible.",
  },
  {
    id: "floor-of-mouth",
    group: "floor",
    name: "Floor of the Mouth",
    image: "/reference/floor-of-mouth.png",
    instruction: "Ask the patient to lift the tongue to the roof of the mouth.",
  },
  {
    id: "palate",
    group: "floor",
    name: "Palate",
    image: "/reference/palate.png",
    instruction: "Tilt the patient's head back, mouth wide open. Point the camera upward.",
  },
  {
    id: "gingiva-frontal",
    group: "floor",
    name: "Gingiva (Frontal)",
    image: "/reference/gingiva-frontal.png",
    instruction: "Ask the patient to bite together and smile wide to show the front gums.",
  },
  {
    id: "lower-gingiva",
    group: "floor",
    name: "Lower Gingiva",
    image: "/reference/lower-gingiva.png",
    instruction: "Pull the lower lip down to show the lower gums and teeth.",
  },
];

import type { QualityResult } from "./imageQuality";

export type Suspicious = "yes" | "no";

export type AcceptedImage = {
  id: string;
  regionId: string;
  url: string;
  suspicious: Suspicious;
  // null only briefly, if the photo was answered before grading finished.
  quality: QualityResult | null;
};

export function regionById(id: string): Region {
  return REGIONS.find((r) => r.id === id)!;
}
