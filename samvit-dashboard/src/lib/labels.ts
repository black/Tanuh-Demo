/* Display names and groupings the page uses for what the file stores. */
import type { Feeds, Trend } from "./types";

/*
 * The design groups the four gates under three headings. Genuineness shows provenance
 * confidence, with fabrication suspicion beside it.
 */
export type GateGroup = "Sufficiency" | "Genuineness" | "Fidelity";

export const GATE_GROUPS: GateGroup[] = ["Sufficiency", "Genuineness", "Fidelity"];

export const GATE_GROUP: Record<Feeds, GateGroup> = {
  sufficiency: "Sufficiency",
  provenance: "Genuineness",
  suspicion: "Genuineness",
  quality: "Fidelity",
};

export const GROUP_FEEDS: Record<GateGroup, Feeds[]> = {
  Sufficiency: ["sufficiency"],
  Genuineness: ["provenance", "suspicion"],
  Fidelity: ["quality"],
};

/** The question each dimension card asks. */
export const QUESTION: Record<GateGroup, string> = {
  Sufficiency: "Is everything required present?",
  Genuineness: "Was it really captured, here, now?",
  Fidelity: "Is the capture technically usable?",
};

const DIM_NAMES: Record<string, string> = {
  "sufficiency.protocol": "Protocol completeness",
  "sufficiency.multi_modality": "Images captured",
  "genuineness.provenance": "Field capture evidence",
  "genuineness.fabrication": "Fabrication signals",
  "quality.conformance": "Conformance",
  "quality.consistency": "Consistency",
  "quality.accuracy": "Agreement with AI and clinician",
};

/** A dimension's name: "quality.consistency" → "Consistency". */
export const dimensionName = (id: string) => {
  if (DIM_NAMES[id]) return DIM_NAMES[id];
  const s = (id.split(".").pop() ?? id).replace(/_/g, " ");
  return s.charAt(0).toUpperCase() + s.slice(1);
};

/** A worker's or taluk's status for a week. */
export type Status = "low" | "high" | "slip" | "ins";

export const TREND_STATUS: Record<Trend, Status> = {
  consistently_low: "low",
  recent_slip: "slip",
  consistently_high: "high",
};

export const STATUS_LABEL: Record<Status, string> = {
  low: "Consistently Low",
  high: "Consistently High",
  slip: "Recent Slip",
  ins: "Insufficient",
};

/** The Badge variant for each status. */
export const STATUS_VARIANT = { low: "danger", high: "positive", slip: "warning", ins: "neutral" } as const satisfies Record<Status, string>;

/** A rule id without its tenant prefix: "samvit:ORAL-001" → "ORAL-001". */
export const shortRuleId = (id: string) => String(id).replace(/^[a-z]+:/, "");
