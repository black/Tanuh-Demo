/*
 * The dashboard's view of dashboard.json, indexed by period: by week as stored, or by
 * month as built in months.ts. The `weeks` array holds the periods either way.
 *
 * In the Week view every score the page shows is a value from the file. This module only
 * counts and sums stored values (a rule's failures and records checked in a period, the
 * workers in each band) and never computes a score; the Month view averages weekly scores
 * (see months.ts).
 */
import type { Band, DashboardDoc, Rule, Score, Settings, Taluk, TalukWeek, Village, Worker, WorkerWeek } from "./types";
import { TREND_STATUS, type Status } from "./labels";

export interface TalukView extends Omit<Taluk, "weeks" | "name"> {
  name: string;
  /** The taluk's week at each index of `weeks`, or null. */
  w: (TalukWeek | null)[];
}

export interface WorkerView extends Omit<Worker, "weeks"> {
  idx: number;
  /** The worker's week at each index of `weeks`, or null when they had no records. */
  w: (WorkerWeek | null)[];
  /** "Name (id)" when the worker master has a name, otherwise the id. */
  label: string;
}

export type BandOrIns = Band | "ins";

export type Period = "week" | "month";

export interface Model {
  /** What one entry of `weeks` is. */
  period: Period;
  tenant: string;
  generatedAt: string;
  settings: Partial<Settings>;
  packVersions: string[];
  stamps: DashboardDoc["scored_under"];
  weeks: { start: string; end: string }[];
  weekIndex: Record<string, number>;
  rules: Rule[];
  rule: Record<string, Rule>;
  taluks: TalukView[];
  taluk: Record<string, TalukView>;
  workers: WorkerView[];
  worker: Record<string, WorkerView>;
  /** Each village's records by week, as stored (always by week, in either period view). */
  villages: Village[];
}

export function buildModel(doc: DashboardDoc): Model {
  const weeks = doc.weeks;
  const weekIndex: Record<string, number> = {};
  weeks.forEach((w, k) => (weekIndex[w.start] = k));
  const byWeek = <T extends { start: string }>(list: T[] | undefined) => {
    const out: (T | null)[] = new Array(weeks.length).fill(null);
    (list ?? []).forEach((x) => {
      if (x.start in weekIndex) out[weekIndex[x.start]] = x;
    });
    return out;
  };

  // The rules come from the newest pack that stamped a score. A week scored under an older
  // pack may have an outcome for a rule the newest pack does not have; that rule is added
  // with its id as its title, so its outcomes are still shown.
  const rules: Rule[] = [...(doc.rules ?? [])];
  const known = new Set(rules.map((r) => r.rule_id));
  doc.workers.forEach((w) =>
    (w.weeks ?? []).forEach((x) =>
      (x.rules ?? []).forEach((q) => {
        if (known.has(q.rule_id)) return;
        known.add(q.rule_id);
        rules.push({ rule_id: q.rule_id, title: null, dimension: q.dimension, feeds: q.feeds, scored: null, blocking: null, record_types: [] });
      }),
    ),
  );
  rules.sort((a, b) => a.rule_id.localeCompare(b.rule_id));

  const taluks: TalukView[] = (doc.taluks ?? []).map((t) => ({ ...t, name: t.name || t.unit_id, w: byWeek(t.weeks) }));
  const workers: WorkerView[] = doc.workers.map((w, idx) => ({
    ...w,
    idx,
    w: byWeek(w.weeks),
    label: w.name && w.name !== w.worker_id ? `${w.name} (${w.worker_id})` : w.worker_id,
  }));

  const packVersions = [
    ...new Set((doc.scored_under ?? []).map((s) => (s.rulepack_version == null ? `unknown (${s.rulepack_id})` : String(s.rulepack_version)))),
  ];

  return {
    period: "week",
    tenant: doc.tenant,
    generatedAt: doc.generated_at,
    settings: doc.settings ?? {},
    packVersions,
    stamps: doc.scored_under ?? [],
    weeks,
    weekIndex,
    rules,
    rule: Object.fromEntries(rules.map((r) => [r.rule_id, r])),
    taluks,
    taluk: Object.fromEntries(taluks.map((t) => [t.unit_id, t])),
    workers,
    worker: Object.fromEntries(workers.map((w) => [w.key, w])),
    villages: doc.villages ?? [],
  };
}

/* ---------- lookups ---------- */

export const ruleTitle = (m: Model, id: string) => m.rule[id]?.title || id;

/** The taluk a worker is filed under in week k. A week without a score falls back to the
 *  worker's latest taluk. */
export const talukOf = (w: WorkerView, k: number) => {
  const x = w.w[k];
  return x ? x.taluk_id || null : w.taluk_id || null;
};

/** The worker's taluk in week k, or null when it has none or the file has no scores for it. */
export const groupOf = (m: Model, w: WorkerView, k: number) => {
  const id = talukOf(w, k);
  return id && m.taluk[id] ? id : null;
};

export const talukName = (m: Model, id: string | null) => (id && m.taluk[id] ? m.taluk[id].name : "—");

/** "Village, Taluk", or "No village on file". */
export const placeOf = (m: Model, w: WorkerView, k: number) => {
  const t = groupOf(m, w, k);
  return [w.village_name, t ? m.taluk[t].name : null].filter(Boolean).join(", ") || "No village on file";
};

export const statusOf = (x: { insufficient: boolean; trend: WorkerWeek["trend"] } | null): Status | null =>
  !x ? null : x.insufficient ? "ins" : x.trend ? TREND_STATUS[x.trend] : null;

/** The worker's band in week k: its TrustIndex band, or "ins" with no score. */
export const bandOf = (x: WorkerWeek | null): BandOrIns => (!x || x.insufficient || !x.scores.trust ? "ins" : x.scores.trust.band);

/** The worker's TrustIndex in the latest scored week before k, for the change arrow. */
export function previousTrust(w: WorkerView, k: number): Score | null {
  for (let i = k - 1; i >= 0; i--) {
    const p = w.w[i];
    if (p && !p.insufficient && p.scores.trust) return p.scores.trust;
  }
  return null;
}

/** The latest week up to k in which the worker had records. */
export function lastActiveWeek(w: WorkerView, k: number) {
  for (let i = k; i >= 0; i--) if (w.w[i]) return i;
  return null;
}

/* ---------- counts for one week ---------- */

/** A rule's failures and records checked in week k, over the workers `keep` accepts. */
export function failuresOf(m: Model, ruleId: string, k: number, keep?: (w: WorkerView) => boolean) {
  let failures = 0;
  let checked = 0;
  let rows = 0;
  m.workers.forEach((w) => {
    if (keep && !keep(w)) return;
    const q = w.w[k]?.rules?.find((r) => r.rule_id === ruleId);
    if (!q) return;
    rows++;
    failures += q.n_violations;
    checked += q.n_evaluated;
  });
  return { failures, checked, measured: rows > 0 };
}

export interface ReasonCount {
  rule: Rule;
  failures: number;
  checked: number;
  measured: boolean;
}

export function weekFacts(m: Model, k: number) {
  const present = m.workers.filter((w) => w.w[k]);
  const scored = present.filter((w) => !w.w[k]!.insufficient && w.w[k]!.scores.trust);
  const band = (b: Band) => scored.filter((w) => w.w[k]!.scores.trust!.band === b).length;
  const reasons: ReasonCount[] = m.rules
    .filter((r) => r.scored !== false)
    .map((r) => ({ rule: r, ...failuresOf(m, r.rule_id, k) }))
    .sort((a, b) => b.failures - a.failures || a.rule.rule_id.localeCompare(b.rule.rule_id));
  return {
    present,
    scored,
    records: present.reduce((s, w) => s + w.w[k]!.n_records, 0),
    insufficient: present.filter((w) => w.w[k]!.insufficient).length,
    low: band("low"),
    high: band("high"),
    reasons,
  };
}

export type WeekFacts = ReturnType<typeof weekFacts>;

/** The workers with records in taluk `id` in week k, with their bands. */
export function talukWorkers(m: Model, id: string, k: number) {
  const list = m.workers.filter((w) => w.w[k] && groupOf(m, w, k) === id).map((w) => ({ worker: w, band: bandOf(w.w[k]) }));
  return { list, high: list.filter((x) => x.band === "high").length, low: list.filter((x) => x.band === "low").length };
}

/** A taluk's TrustIndex band in week k: "none" with no records or no TrustIndex. */
export function talukBand(m: Model, id: string, k: number): BandOrIns | "none" {
  const t = m.taluk[id]?.w[k];
  if (!t) return "none";
  if (t.insufficient) return "ins";
  return t.scores.trust ? t.scores.trust.band : "none";
}
