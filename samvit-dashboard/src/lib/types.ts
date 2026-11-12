/*
 * The two files the dashboard reads, as written by `dqs dashboard export`.
 * DASHBOARD.md in the project describes every field and when it is null.
 */

export type Band = "high" | "mid" | "low";

/** A stored score. value, low and high are 0 to 100; the *_scale fields are the same on 1 to 5. */
export interface Score {
  value: number;
  low: number;
  high: number;
  scale: number;
  low_scale: number;
  high_scale: number;
  band: Band;
}

export interface Settings {
  n_min: number;
  rule_n_min: number;
  min_peers: number;
  trend_window: number;
  band_high: number;
  band_low: number;
  band_high_scale: number;
  band_low_scale: number;
  sufficiency_full: number;
  power_p: number;
  prior_weight: number;
  anchor_green: number;
  anchor_amber: number;
  anchor_red: number;
}

export interface Stamp {
  rulepack_id: string;
  rulepack_version: number | null;
  scoring_version: string;
  worker_weeks: number;
  taluk_weeks: number;
}

export type Feeds = "sufficiency" | "provenance" | "suspicion" | "quality";

export interface Rule {
  rule_id: string;
  title: string | null;
  dimension: string;
  feeds: Feeds;
  grain?: string;
  engine?: string;
  plugin?: string | null;
  record_types: string[];
  scored: boolean | null;
  blocking: boolean | null;
}

export type Trend = "consistently_low" | "recent_slip" | "consistently_high";

export interface WeekScores {
  quality: Score | null;
  fabrication_suspicion: Score | null;
  provenance_confidence: Score | null;
  sufficiency: Score | null;
  trust: Score | null;
}

export interface DimensionScore {
  dimension: string;
  feeds: Feeds;
  measured: boolean;
  score: Score | null;
}

export type RuleStatus = "scored" | "too_few" | "unscored" | "insufficient";

export interface RuleOutcome {
  rule_id: string;
  dimension: string;
  feeds: Feeds;
  status: RuleStatus;
  n_evaluated: number;
  n_violations: number;
  rate: number | null;
  sub_score: number | null;
}

interface WeekBase {
  start: string;
  end: string;
  rulepack_id: string;
  scoring_version: string;
  n_records: number;
  insufficient: boolean;
  scores: WeekScores;
  trend: Trend | null;
  dimensions: DimensionScore[];
}

export interface WorkerWeek extends WeekBase {
  taluk_id: string | null;
  rules: RuleOutcome[];
}

export interface TalukWeek extends WeekBase {
  workers: {
    median: number | null;
    median_scale: number | null;
    low_share: number | null;
    scored: number;
    insufficient: number;
  };
  percentile: number | null;
}

export interface Taluk {
  unit_id: string;
  name: string | null;
  level: string;
  weeks: TalukWeek[];
}

export interface Worker {
  key: string;
  worker_id: string;
  name: string | null;
  peer_group_key: number | null;
  village_id: string | null;
  village_name: string | null;
  taluk_id: string | null;
  weeks: WorkerWeek[];
}

/** A village's records by week, of every record type, and the workers who filed them. */
export interface Village {
  village_id: string;
  name: string | null;
  taluk_id: string | null;
  weeks: { start: string; n_records: number; workers: string[] }[];
}

export interface DashboardDoc {
  schema_version: number;
  tenant: string;
  generated_at: string;
  scored_under: Stamp[];
  settings: Settings | null;
  weeks: { start: string; end: string }[];
  rules: Rule[];
  taluks: Taluk[];
  workers: Worker[];
  villages?: Village[];
}

/** An outline: rings of [longitude, latitude] pairs. */
export type Rings = [number, number][][];

/** india-states.json: the country's state outlines, for the first level of the map. */
export interface StatesDoc {
  source: string | null;
  licence: string | null;
  licence_url: string | null;
  states: { name: string; rings: Rings }[];
}

export interface MapDoc {
  schema_version: number;
  tenant: string;
  generated_at: string;
  taluks: { unit_id: string; name: string | null; rings: Rings; label: [number, number] | null }[];
  villages?: { village_id: string; aliases: string[]; name: string | null; taluk_id: string | null; rings: Rings }[];
  inset: {
    source: string | null;
    licence: string | null;
    licence_url: string | null;
    districts: { name: string; holds_villages: boolean; rings: Rings }[];
  } | null;
}
