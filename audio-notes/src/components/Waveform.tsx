"use client";

import { useLayoutEffect, useRef, useState } from "react";

const BAR = 2;
const GAP = 4;
const MAX_H = 20;

type Props = {
  levels: number[];
  /** live: newest samples on the right. static/playback: whole recording resampled to fit. */
  variant: "live" | "static" | "playback";
  progress?: number;
  onSeek?: (ratio: number) => void;
};

function resample(levels: number[], count: number) {
  if (!levels.length) return Array(count).fill(0);
  const out: number[] = [];
  const step = levels.length / count;
  for (let i = 0; i < count; i++) {
    const from = Math.floor(i * step);
    const to = Math.max(from + 1, Math.floor((i + 1) * step));
    let max = 0;
    for (let j = from; j < to && j < levels.length; j++) max = Math.max(max, levels[j]);
    out.push(max);
  }
  return out;
}

export default function Waveform({ levels, variant, progress = 0, onSeek }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setCount(Math.floor((e.contentRect.width + GAP) / (BAR + GAP))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const bars =
    variant === "live"
      ? [...Array(Math.max(0, count - levels.length)).fill(0), ...levels.slice(-count)]
      : resample(levels, count);

  const color = (i: number) => {
    if (variant === "live") return "bg-border";
    if (variant === "static") return "bg-divider";
    return i / bars.length < progress ? "bg-wave-played" : "bg-divider";
  };

  return (
    <div
      ref={ref}
      className={`flex h-5 min-w-0 flex-1 items-center gap-1 overflow-hidden ${onSeek ? "cursor-pointer" : ""}`}
      onClick={(e) => {
        if (!onSeek) return;
        const r = e.currentTarget.getBoundingClientRect();
        onSeek(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)));
      }}
      aria-hidden="true"
    >
      {bars.map((l, i) => (
        <span
          key={i}
          className={`w-0.5 shrink-0 rounded-full transition-[height] duration-100 ${color(i)}`}
          style={{ height: Math.max(1, Math.round(l * MAX_H)) }}
        />
      ))}
    </div>
  );
}
