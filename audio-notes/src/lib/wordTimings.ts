import type { TranscriptSegment } from "./types";

export type TimedWord = { text: string; startMs: number; endMs: number };

/**
 * Estimates when each transcript word is spoken. The browser's speech API has no
 * word timestamps, so words are spread across each phrase's time window by
 * length; without phrase timings, across the whole clip.
 */
export function timeWords(transcript: string, segments: TranscriptSegment[] | undefined, durationMs: number): TimedWord[] {
  const spans: { text: string; startMs: number; endMs: number }[] = [];
  if (segments?.length) {
    let start = 0;
    for (const seg of segments) {
      const end = Math.min(durationMs, Math.max(seg.endMs, start));
      spans.push({ text: seg.text, startMs: start, endMs: end });
      start = end;
    }
    // Give a phrase finalised right at the end at least some room.
    const last = spans.at(-1)!;
    if (last.endMs - last.startMs < 300) last.endMs = Math.max(last.endMs, durationMs);
  } else {
    spans.push({ text: transcript, startMs: 0, endMs: durationMs });
  }

  const words: TimedWord[] = [];
  for (const span of spans) {
    const parts = span.text.split(/\s+/).filter(Boolean);
    const weights = parts.map((w) => w.length + 1);
    const total = weights.reduce((a, b) => a + b, 0) || 1;
    let t = span.startMs;
    parts.forEach((text, i) => {
      const len = ((span.endMs - span.startMs) * weights[i]) / total;
      words.push({ text, startMs: t, endMs: t + len });
      t += len;
    });
  }
  return words;
}
