/* Formatting for figures shown on the page. None of these computes a score. */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const parts = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return { y, m, d };
};

/** "21 Sep" */
export const shortDate = (iso: string) => {
  const { m, d } = parts(iso);
  return `${d} ${MONTHS[m - 1]}`;
};

/** "21 Sep – 27 Sep 2026" */
export const weekRange = (w: { start: string; end: string }) =>
  `${shortDate(w.start)} – ${shortDate(w.end)} ${parts(w.end).y}`;

/** "September 2026" */
export const monthName = (iso: string) => {
  const { y, m } = parts(iso);
  return `${["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][m - 1]} ${y}`;
};

type Periods = { period: "week" | "month"; weeks: { start: string; end: string }[] };

/** "week" or "month", for text such as "this week". */
export const periodWord = (m: Periods) => m.period;

/** "Week of 21 Sep – 27 Sep 2026" or "September 2026". */
export const periodTitle = (m: Periods, k: number) =>
  m.period === "month" ? monthName(m.weeks[k].start) : `Week of ${weekRange(m.weeks[k])}`;

/** "week of 21 Sep – 27 Sep 2026" or "September 2026", inside a sentence. */
export const periodName = (m: Periods, k: number) =>
  m.period === "month" ? monthName(m.weeks[k].start) : `week of ${weekRange(m.weeks[k])}`;

/** A chart tick: "21 Sep" for a week, "Sep" for a month. */
export const periodTick = (m: Periods, k: number) =>
  m.period === "month" ? MONTHS[parts(m.weeks[k].start).m - 1] : shortDate(m.weeks[k].start);

/** A whole number with Indian digit grouping, or "—". */
export const int = (x: number | null | undefined) =>
  x == null ? "—" : Math.round(x).toLocaleString("en-IN");

/** A share (0 to 1) as a percentage, or "—". */
export const pct = (x: number | null | undefined, digits = 1) =>
  x == null ? "—" : `${(x * 100).toFixed(digits)}%`;

/** A score on the 1 to 5 scale, to two places, or "—". */
export const f2 = (x: number | null | undefined) => (x == null ? "—" : Number(x).toFixed(2));

export const dateTime = (iso: string, style: "medium" | "long" = "medium") =>
  new Date(iso).toLocaleString("en-IN", { dateStyle: style, timeStyle: "short" });
