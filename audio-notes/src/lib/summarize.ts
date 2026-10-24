// Summaries come from Claude via /api/summarize; the local heuristic below is
// the fallback when the API is unreachable or not configured.

const STOPWORDS = new Set(
  `a an and are as at be been but by can could did do does for from had has have he her him his how i i'm i've
  if in into is it it's its just me my no not of on or our she so some than that the their them then there
  these they this to too up us very was we we'll were what when which who will with would you your also about
  again any because before after more most other over same such only own out off once here all both each few
  further while again today said told get got going really still like well yeah okay ok um uh`.split(/\s+/),
);

export type Summary = { summary: string; tags: string[] };

export type SummaryResult = Summary & { source: "claude" | "local"; error?: string };

export async function summarize(transcript: string): Promise<SummaryResult> {
  if (!transcript.trim()) return { ...summarizeLocally(transcript), source: "local" };
  try {
    const res = await fetch("/api/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcript }),
    });
    const body = await res.json();
    if (!res.ok) throw new Error(body.error ?? `HTTP ${res.status}`);
    return { summary: body.summary, tags: body.tags, source: "claude" };
  } catch (e) {
    return { ...summarizeLocally(transcript), source: "local", error: e instanceof Error ? e.message : String(e) };
  }
}

export function summarizeLocally(transcript: string): Summary {
  const text = transcript.trim();
  if (!text) return { summary: "No speech was detected in this recording.", tags: [] };

  const sentences = text.match(/[^.!?]+[.!?]*/g)?.map((s) => s.trim()).filter(Boolean) ?? [text];
  let summary = "";
  for (const s of sentences) {
    if (summary && summary.length + s.length > 220) break;
    summary += (summary ? " " : "") + s;
  }
  if (!/[.!?]$/.test(summary)) summary += ".";

  // Tags: most frequent meaningful two-word phrases, then single words.
  const words = text.toLowerCase().match(/[a-z][a-z'-]+/g) ?? [];
  const counts = new Map<string, number>();
  const bump = (k: string, w: number) => counts.set(k, (counts.get(k) ?? 0) + w);
  words.forEach((w, i) => {
    if (STOPWORDS.has(w) || w.length < 4) return;
    bump(w, 1);
    const next = words[i + 1];
    if (next && !STOPWORDS.has(next) && next.length >= 4) bump(`${w} ${next}`, 1.5);
  });
  const tags: string[] = [];
  for (const [k] of [...counts].sort((a, b) => b[1] - a[1])) {
    if (tags.some((t) => t.split(" ").some((w) => k.split(" ").includes(w)))) continue;
    tags.push(k);
    if (tags.length === 5) break;
  }
  return { summary, tags };
}
