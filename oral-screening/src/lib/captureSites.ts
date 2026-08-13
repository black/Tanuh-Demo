export type ReferenceSite = {
  id: string;
  name: string;
  image: string;
};

export type CapturedImage = {
  id: string;
  number: number;
  suspicious: "yes" | "no" | null;
  imageUrl?: string;
};

export const MIN_IMAGES = 8;

// The 14 reference mouth sites shown in the thumbnail rail, using the
// clinical reference photography provided for the file (annotated with the
// region outline to guide capture). Two sites — the buccal vestibule pair
// and the frontal gingiva/lower-arch pair — are a best-effort read of the
// unlabeled source photos; flag if any should be swapped or renamed.
export const REFERENCE_SITES: ReferenceSite[] = [
  { id: "site-1", name: "Lips", image: "/reference/lips.png" },
  { id: "site-2", name: "Upper Labial Mucosa", image: "/reference/upper-labial-mucosa.png" },
  { id: "site-3", name: "Lower Labial Mucosa", image: "/reference/lower-labial-mucosa.png" },
  { id: "site-4", name: "Left Buccal Mucosa", image: "/reference/left-buccal-mucosa.png" },
  { id: "site-5", name: "Right Buccal Mucosa", image: "/reference/right-buccal-mucosa.png" },
  { id: "site-6", name: "Right Buccal Vestibule", image: "/reference/right-buccal-vestibule.png" },
  { id: "site-7", name: "Left Buccal Vestibule", image: "/reference/left-buccal-vestibule.png" },
  { id: "site-8", name: "Right Lateral Border of Tongue", image: "/reference/right-lateral-tongue.png" },
  { id: "site-9", name: "Left Lateral Border of Tongue", image: "/reference/left-lateral-tongue.png" },
  { id: "site-10", name: "Dorsum Surface of Tongue", image: "/reference/dorsum-tongue.png" },
  { id: "site-11", name: "Floor of the Mouth", image: "/reference/floor-of-mouth.png" },
  { id: "site-12", name: "Gingiva (Frontal)", image: "/reference/gingiva-frontal.png" },
  { id: "site-13", name: "Lower Gingiva", image: "/reference/lower-gingiva.png" },
  { id: "site-14", name: "Palate", image: "/reference/palate.png" },
];
