"use client";

import { useEffect, useMemo, useRef } from "react";
import { formatDuration } from "@/lib/format";
import type { TranscriptSegment } from "@/lib/types";
import { timeWords } from "@/lib/wordTimings";
import { usePlayback } from "@/hooks/usePlayback";
import type { RecorderStatus } from "@/hooks/useRecorder";
import Waveform from "./Waveform";
import {
  AiProcessingIcon,
  ArrowBackIcon,
  CheckIcon,
  DeleteIcon,
  MicIcon,
  PauseIcon,
  PlayIcon,
  SparkleIcon,
} from "./icons";

const sheet =
  "animate-slide-up flex flex-col rounded-lg border border-divider bg-white p-4";

/* ---------------------------------------------------------------- Recording */

export function RecordingCard(props: {
  status: RecorderStatus;
  elapsedMs: number;
  levels: number[];
  transcript: string;
  onDelete: () => void;
  onTogglePause: () => void;
  onDone: () => void;
}) {
  const paused = props.status === "paused";
  const transcriptRef = useRef<HTMLParagraphElement>(null);
  const followRef = useRef(true);
  const lastTopRef = useRef(0);

  // Keep the newest words in view; stop following if the user scrolls up to reread.
  useEffect(() => {
    const el = transcriptRef.current;
    if (el && followRef.current) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [props.transcript]);

  return (
    <section className={`${sheet} gap-[21px]`} aria-label="Recording">
      <div className="flex flex-col gap-4">
        <p className="flex items-center gap-2 text-base leading-6 tracking-body">
          {paused ? "Paused" : "Recording"}
          {!paused && <span className="animate-rec-dot size-2 rounded-full bg-danger" aria-hidden />}
        </p>
        <div className="flex items-center gap-4">
          <span className="w-[27px] shrink-0 text-xs leading-4 tracking-wide tabular-nums" aria-live="off">
            {formatDuration(props.elapsedMs)}
          </span>
          <Waveform levels={props.levels} variant="live" />
        </div>
        {props.transcript && (
          <p
            ref={transcriptRef}
            onScroll={(e) => {
              const el = e.currentTarget;
              // Auto-scroll only ever moves down, so an upward move means the user is reading back.
              if (el.scrollTop < lastTopRef.current - 2) followRef.current = false;
              else if (el.scrollHeight - el.scrollTop - el.clientHeight < 8) followRef.current = true;
              lastTopRef.current = el.scrollTop;
            }}
            className="no-scrollbar max-h-12 overflow-y-auto text-xs leading-4 tracking-wide text-content-tertiary [mask-image:linear-gradient(to_bottom,transparent,black_12px)]"
          >
            {props.transcript}
          </p>
        )}
      </div>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={props.onDelete}
          aria-label="Discard recording"
          className="rounded-full bg-danger-bg p-4 text-danger transition hover:brightness-95 active:scale-95"
        >
          <DeleteIcon />
        </button>
        <button
          type="button"
          onClick={props.onTogglePause}
          className="flex min-w-[136px] items-center justify-center gap-2.5 rounded-lg border border-border p-4 text-sm leading-5 font-medium tracking-wide text-brand-text transition hover:bg-surface-hover active:scale-[0.98]"
        >
          {paused ? <MicIcon /> : <PauseIcon />}
          {paused ? "Resume" : "Pause"}
        </button>
        <button
          type="button"
          onClick={props.onDone}
          aria-label="Finish recording"
          className="rounded-full bg-brand p-4 text-white transition hover:brightness-110 active:scale-95"
        >
          <CheckIcon />
        </button>
      </div>
    </section>
  );
}

/* --------------------------------------------------------- Shared player row */

type Playback = ReturnType<typeof usePlayback>;

function PlayerControls({
  playback,
  durationMs,
  levels,
  waveform,
}: {
  playback: Playback;
  durationMs: number;
  levels: number[];
  waveform: "playback" | "static";
}) {
  const { playing, positionMs, progress, toggle, seek } = playback;
  const showProgress = waveform === "playback" || playing || positionMs > 0;
  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause playback" : "Play recording"}
        className="rounded-full bg-surface-hover p-2 text-[#1c1b1f] transition hover:bg-surface-muted active:scale-95"
      >
        {playing ? <PauseIcon size={24} /> : <PlayIcon size={24} />}
      </button>
      <Waveform
        levels={levels}
        variant={showProgress ? "playback" : "static"}
        progress={progress}
        onSeek={seek}
      />
      <span className="shrink-0 text-xs leading-4 tracking-wide tabular-nums">
        {formatDuration(playing || positionMs > 0 ? positionMs : durationMs)}
      </span>
    </div>
  );
}

export function PlayerRow({
  blob,
  durationMs,
  levels,
  waveform = "playback",
}: {
  blob: Blob;
  durationMs: number;
  levels: number[];
  waveform?: "playback" | "static";
}) {
  const playback = usePlayback(blob, durationMs);
  return <PlayerControls playback={playback} durationMs={durationMs} levels={levels} waveform={waveform} />;
}

/* --------------------------------------------------------------- Processing */

export function ProcessingCard(props: { blob: Blob; durationMs: number; levels: number[] }) {
  return (
    <section className={`${sheet} h-[168px] justify-between`} aria-label="Audio note" aria-busy="true">
      <div className="flex flex-col gap-4">
        <p className="text-base leading-6 tracking-body">Audio Note</p>
        <PlayerRow {...props} waveform="static" />
      </div>
      <div className="flex items-center gap-2 text-ai" role="status">
        <AiProcessingIcon />
        <p className="text-sm leading-5 tracking-body-md">Transcribing...</p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Summary */

export function SummaryCard(props: {
  summary: string;
  tags: string[];
  onTranscript: () => void;
  onSave: () => void;
}) {
  return (
    <section className={`${sheet} h-[288px] justify-between gap-4 overflow-hidden`} aria-label="Summary">
      <div className="flex min-h-0 flex-col gap-4">
        <div className="flex items-center gap-2 text-ai">
          <SparkleIcon />
          <h2 className="text-base leading-6 tracking-body">Summary</h2>
        </div>
        {props.tags.length > 0 && (
          <ul className="no-scrollbar -mr-4 flex shrink-0 gap-2 overflow-x-auto pr-4">
            {props.tags.map((t) => (
              <li
                key={t}
                className="shrink-0 rounded-full bg-surface-muted px-2 py-1 text-xs leading-4 tracking-wide whitespace-nowrap text-content-tertiary"
              >
                {t}
              </li>
            ))}
          </ul>
        )}
        <p className="no-scrollbar min-h-0 overflow-y-auto text-xs leading-4 tracking-wide text-content-tertiary">
          {props.summary}
        </p>
      </div>
      <div className="flex shrink-0 items-center justify-between gap-4">
        <button
          type="button"
          onClick={props.onTranscript}
          className="flex-1 rounded-lg border border-border p-4 text-sm leading-5 font-medium tracking-wide text-brand-text transition hover:bg-surface-hover active:scale-[0.98]"
        >
          Transcript
        </button>
        <button
          type="button"
          onClick={props.onSave}
          className="flex-1 rounded-lg bg-brand p-4 text-sm leading-5 font-medium tracking-wide text-white transition hover:brightness-110 active:scale-[0.98]"
        >
          Save
        </button>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- Transcript */

/** Transcript text that follows playback: spoken words darken, the current word is highlighted. */
function HighlightedTranscript({
  transcript,
  segments,
  durationMs,
  playback,
}: {
  transcript: string;
  segments?: TranscriptSegment[];
  durationMs: number;
  playback: Playback;
}) {
  const words = useMemo(() => timeWords(transcript, segments, durationMs), [transcript, segments, durationMs]);
  const containerRef = useRef<HTMLParagraphElement>(null);
  const active = playback.playing || playback.positionMs > 0;
  const pos = playback.positionMs;
  const current = active ? words.findIndex((w) => pos >= w.startMs && pos < w.endMs) : -1;

  // Keep the current word visible inside the scrollable transcript.
  useEffect(() => {
    const box = containerRef.current;
    const el = box?.querySelector<HTMLElement>(`[data-word="${current}"]`);
    if (!box || !el) return;
    const top = el.offsetTop - box.offsetTop;
    if (top < box.scrollTop || top + el.offsetHeight > box.scrollTop + box.clientHeight) {
      box.scrollTo({ top: top - box.clientHeight / 3, behavior: "smooth" });
    }
  }, [current]);

  if (!transcript) {
    return <p className="text-xs leading-4 tracking-wide text-content-tertiary">No speech was detected in this recording.</p>;
  }
  return (
    <p
      ref={containerRef}
      className="no-scrollbar relative max-h-[40dvh] min-h-0 overflow-y-auto text-xs leading-4 tracking-wide text-content-tertiary"
    >
      {words.map((w, i) => (
        <span key={i}>
          <span
            data-word={i}
            onClick={() => playback.seek(w.startMs / durationMs)}
            className={`-mx-0.5 cursor-pointer rounded px-0.5 transition-colors duration-150 ${
              i === current
                ? "bg-ai/15 text-ai shadow-[0_0_0_1px_rgb(78_0_141/0.25)]"
                : active && w.endMs <= pos
                  ? "text-content"
                  : active
                    ? "text-content-disabled hover:text-content"
                    : "hover:text-content"
            }`}
          >
            {w.text}
          </span>{" "}
        </span>
      ))}
    </p>
  );
}

type TranscriptProps = {
  transcript: string;
  segments?: TranscriptSegment[];
  blob: Blob;
  durationMs: number;
  levels: number[];
  onBack: () => void;
};

/** Transcription content (Figma node 3911:6894): header, highlighted text, player underneath. */
export function TranscriptView(props: TranscriptProps) {
  const playback = usePlayback(props.blob, props.durationMs);
  return (
    <>
      <div className="flex items-center gap-2 text-ai">
        <button type="button" onClick={props.onBack} aria-label="Back" className="-m-1 rounded-full p-1 hover:bg-surface-muted">
          <ArrowBackIcon />
        </button>
        <h2 className="text-base leading-6 tracking-body">Transcription</h2>
      </div>
      <HighlightedTranscript
        transcript={props.transcript}
        segments={props.segments}
        durationMs={props.durationMs}
        playback={playback}
      />
      <PlayerControls playback={playback} durationMs={props.durationMs} levels={props.levels} waveform="playback" />
    </>
  );
}

/** Transcription as a bottom sheet, for a recording that hasn't been saved yet. */
export function TranscriptCard(props: TranscriptProps) {
  return (
    <section className={`${sheet} gap-4`} aria-label="Transcription">
      <TranscriptView {...props} />
    </section>
  );
}
