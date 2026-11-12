/*
 * The Month view of the model: the stored weeks grouped by calendar month.
 *
 * dashboard.json stores scores by week only. A month's figures are made from its weeks:
 *   - a score is the average of the month's weekly scores that exist (value, interval and
 *     1 to 5 scale alike), and its band is read from the averaged value with the file's band
 *     thresholds;
 *   - records, and a rule's failures and records checked, are summed, and a rule's failure
 *     rate is failures over records checked for the month;
 *   - the month is Insufficient when none of its weeks was scored;
 *   - the trend (status), taluk and pack are those of the month's latest week with records.
 * A week belongs to the month its Thursday falls in, so each week is counted once.
 */
import type { Model, TalukView, WorkerView } from "./model";
import type { Band, DimensionScore, RuleOutcome, Score, Settings, TalukWeek, WeekScores, WorkerWeek } from "./types";

const pad = (n: number) => String(n).padStart(2, "0");

/** "2026-09" for the month a week (Monday `start`) belongs to: the month of its Thursday. */
function monthKey(start: string) {
  const d = new Date(`${start}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 3);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}`;
}

function monthBounds(key: string) {
  const [y, m] = key.split("-").map(Number);
  const last = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return { start: `${key}-01`, end: `${key}-${pad(last)}` };
}

const mean = (xs: number[]) => xs.reduce((s, x) => s + x, 0) / xs.length;

function bandFor(value: number, settings: Partial<Settings>, fallback: Band): Band {
  const { band_high: hi, band_low: lo } = settings;
  if (hi == null || lo == null) return fallback;
  return value >= hi ? "high" : value < lo ? "low" : "mid";
}

function averageScore(list: (Score | null | undefined)[], settings: Partial<Settings>): Score | null {
  const s = list.filter((x): x is Score => !!x);
  if (!s.length) return null;
  const value = mean(s.map((x) => x.value));
  return {
    value,
    low: mean(s.map((x) => x.low)),
    high: mean(s.map((x) => x.high)),
    scale: mean(s.map((x) => x.scale)),
    low_scale: mean(s.map((x) => x.low_scale)),
    high_scale: mean(s.map((x) => x.high_scale)),
    band: bandFor(value, settings, s[s.length - 1].band),
  };
}

const SCORE_KEYS: (keyof WeekScores)[] = ["quality", "fabrication_suspicion", "provenance_confidence", "sufficiency", "trust"];

/** The fields every worker and taluk month shares. `weeks` is the month's weeks with records, oldest first. */
function baseMonth<T extends WorkerWeek | TalukWeek>(weeks: T[], bounds: { start: string; end: string }, settings: Partial<Settings>) {
  const latest = weeks[weeks.length - 1];
  const scored = weeks.filter((x) => !x.insufficient);
  const scores = Object.fromEntries(SCORE_KEYS.map((key) => [key, averageScore(scored.map((x) => x.scores[key]), settings)])) as unknown as WeekScores;
  const dims = new Map<string, DimensionScore[]>();
  scored.forEach((x) => x.dimensions.forEach((d) => dims.set(d.dimension, [...(dims.get(d.dimension) ?? []), d])));
  const dimensions: DimensionScore[] = [...dims.values()].map((list) => ({
    dimension: list[0].dimension,
    feeds: list[0].feeds,
    measured: list.some((d) => d.measured),
    score: averageScore(list.map((d) => d.score), settings),
  }));
  return {
    ...latest,
    ...bounds,
    n_records: weeks.reduce((s, x) => s + x.n_records, 0),
    insufficient: scored.length === 0,
    scores,
    dimensions,
  };
}

function sumRules(weeks: WorkerWeek[]): RuleOutcome[] {
  const by = new Map<string, RuleOutcome[]>();
  weeks.forEach((x) => (x.rules ?? []).forEach((q) => by.set(q.rule_id, [...(by.get(q.rule_id) ?? []), q])));
  return [...by.values()].map((list) => {
    const n_evaluated = list.reduce((s, q) => s + q.n_evaluated, 0);
    const n_violations = list.reduce((s, q) => s + q.n_violations, 0);
    const subs = list.map((q) => q.sub_score).filter((x): x is number => x != null);
    return {
      ...list[list.length - 1],
      status: list.some((q) => q.status === "scored") ? "scored" : list[list.length - 1].status,
      n_evaluated,
      n_violations,
      rate: n_evaluated ? n_violations / n_evaluated : null,
      sub_score: subs.length ? mean(subs) : null,
    };
  });
}

export function monthlyModel(m: Model) {
  const keys: string[] = [];
  const monthOfWeek = m.weeks.map((w) => {
    const key = monthKey(w.start);
    if (keys[keys.length - 1] !== key) keys.push(key);
    return keys.length - 1;
  });
  const groups = keys.map((_, i) => monthOfWeek.flatMap((mi, wi) => (mi === i ? [wi] : [])));
  const months = keys.map(monthBounds);

  const roll = <T extends WorkerWeek | TalukWeek>(w: (T | null)[], extra: (weeks: T[]) => Partial<T> = () => ({})) =>
    groups.map((wis, i) => {
      const weeks = wis.map((wi) => w[wi]).filter((x): x is T => !!x);
      return weeks.length ? ({ ...baseMonth(weeks, months[i], m.settings), ...extra(weeks) } as T) : null;
    });

  const workers: WorkerView[] = m.workers.map((w) => ({ ...w, w: roll<WorkerWeek>(w.w, (weeks) => ({ rules: sumRules(weeks) })) }));
  const taluks: TalukView[] = m.taluks.map((t) => ({ ...t, w: roll<TalukWeek>(t.w) }));
  const model: Model = {
    ...m,
    period: "month",
    weeks: months,
    weekIndex: Object.fromEntries(months.map((x, i) => [x.start, i])),
    taluks,
    taluk: Object.fromEntries(taluks.map((t) => [t.unit_id, t])),
    workers,
    worker: Object.fromEntries(workers.map((w) => [w.key, w])),
  };
  /** The index of each week's month, and each month's latest week. */
  return { model, monthOfWeek, lastWeekOfMonth: groups.map((g) => g[g.length - 1]) };
}
