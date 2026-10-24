"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { RecordingResult, TranscriptSegment } from "@/lib/types";

export type RecorderStatus = "idle" | "recording" | "paused";

const SAMPLE_MS = 100;
// Speech recognition finalises a phrase a little after it was spoken.
const RECOGNITION_LAG_MS = 600;

// Minimal typings for the Web Speech API (not in TS's DOM lib).
type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((e: { resultIndex: number; results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }> }) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: { error: string }) => void) | null;
};

function createRecognition(): SpeechRecognitionLike | null {
  const w = window as unknown as Record<string, new () => SpeechRecognitionLike>;
  const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
  if (!Ctor) return null;
  const r = new Ctor();
  r.continuous = true;
  r.interimResults = true;
  r.lang = navigator.language || "en-US";
  return r;
}

export function useRecorder() {
  const [status, setStatus] = useState<RecorderStatus>("idle");
  const [elapsedMs, setElapsedMs] = useState(0);
  const [levels, setLevels] = useState<number[]>([]);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);

  const statusRef = useRef<RecorderStatus>("idle");
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const levelsRef = useRef<number[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const resumedAtRef = useRef(0);
  const accumulatedRef = useRef(0);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const finalTextRef = useRef("");
  const interimTextRef = useRef("");
  const segmentsRef = useRef<TranscriptSegment[]>([]);
  const recognitionEndedRef = useRef<(() => void) | null>(null);

  const setStatusBoth = (s: RecorderStatus) => {
    statusRef.current = s;
    setStatus(s);
  };

  const currentElapsed = () =>
    accumulatedRef.current + (statusRef.current === "recording" ? performance.now() - resumedAtRef.current : 0);

  // A timer (not rAF) so sampling keeps going when the tab is in the background.
  const tick = useCallback(() => {
    if (statusRef.current !== "recording") return;

    const analyser = analyserRef.current;
    if (analyser) {
      const buf = new Float32Array(analyser.fftSize);
      analyser.getFloatTimeDomainData(buf);
      let sum = 0;
      for (const v of buf) sum += v * v;
      const rms = Math.sqrt(sum / buf.length);
      levelsRef.current.push(Math.min(1, Math.sqrt(Math.max(0, rms - 0.004)) * 2.2));
      setLevels([...levelsRef.current]);
    }
    setElapsedMs(currentElapsed());
  }, []);

  const startRecognition = () => {
    const r = recognitionRef.current;
    if (!r) return;
    try {
      r.start();
    } catch {
      // already started
    }
  };

  const teardown = () => {
    clearInterval(timerRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    ctxRef.current?.close().catch(() => {});
    recognitionRef.current?.abort();
    recognitionRef.current = null;
    streamRef.current = null;
    ctxRef.current = null;
    analyserRef.current = null;
    recorderRef.current = null;
  };

  useEffect(() => teardown, []);

  const start = useCallback(async () => {
    setError(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Audio recording isn't supported in this browser.");
      return false;
    }
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setError("Microphone access was blocked. Allow it in your browser to record.");
      return false;
    }
    streamRef.current = stream;
    chunksRef.current = [];
    levelsRef.current = [];
    finalTextRef.current = "";
    interimTextRef.current = "";
    segmentsRef.current = [];
    accumulatedRef.current = 0;
    setLevels([]);
    setElapsedMs(0);
    setTranscript("");

    const recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data);
    recorder.start(250);
    recorderRef.current = recorder;

    const ctx = new AudioContext();
    ctx.resume().catch(() => {});
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    ctx.createMediaStreamSource(stream).connect(analyser);
    ctxRef.current = ctx;
    analyserRef.current = analyser;

    const recognition = createRecognition();
    if (recognition) {
      recognition.onresult = (e) => {
        let interim = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const res = e.results[i];
          if (res.isFinal) {
            const text = res[0].transcript.trim();
            finalTextRef.current += text + ". ";
            const prevEnd = segmentsRef.current.at(-1)?.endMs ?? 0;
            const endMs = Math.max(prevEnd, currentElapsed() - RECOGNITION_LAG_MS);
            segmentsRef.current.push({ text: text + ".", endMs });
          }
          else interim += res[0].transcript;
        }
        interimTextRef.current = interim;
        setTranscript((finalTextRef.current + interim).trim());
      };
      // Chrome ends recognition after silence; keep it alive while recording.
      recognition.onend = () => {
        if (statusRef.current === "recording") startRecognition();
        else recognitionEndedRef.current?.();
      };
      recognition.onerror = () => {};
      recognitionRef.current = recognition;
    }

    resumedAtRef.current = performance.now();
    setStatusBoth("recording");
    startRecognition();
    timerRef.current = setInterval(tick, SAMPLE_MS);
    return true;
  }, [tick]);

  const pause = useCallback(() => {
    if (statusRef.current !== "recording") return;
    accumulatedRef.current = currentElapsed();
    recorderRef.current?.pause();
    setStatusBoth("paused");
    setElapsedMs(accumulatedRef.current);
    recognitionRef.current?.stop();
  }, []);

  const resume = useCallback(() => {
    if (statusRef.current !== "paused") return;
    recorderRef.current?.resume();
    resumedAtRef.current = performance.now();
    setStatusBoth("recording");
    startRecognition();
  }, []);

  const stop = useCallback(async (): Promise<RecordingResult | null> => {
    const recorder = recorderRef.current;
    if (!recorder) return null;
    const durationMs = currentElapsed();
    setStatusBoth("idle");

    // Let speech recognition flush its last results before reading the transcript.
    const recognition = recognitionRef.current;
    const recognitionDone = recognition
      ? new Promise<void>((resolve) => {
          recognitionEndedRef.current = resolve;
          setTimeout(resolve, 1500);
          try {
            recognition.stop();
          } catch {
            resolve();
          }
        })
      : Promise.resolve();

    const blob = await new Promise<Blob>((resolve) => {
      recorder.onstop = () => resolve(new Blob(chunksRef.current, { type: recorder.mimeType }));
      recorder.stop();
    });
    await recognitionDone;
    recognitionEndedRef.current = null;

    const text = (finalTextRef.current + interimTextRef.current).trim();
    const segments = [...segmentsRef.current];
    if (interimTextRef.current.trim()) segments.push({ text: interimTextRef.current.trim(), endMs: durationMs });
    teardown();
    return { blob, durationMs, levels: [...levelsRef.current], transcript: text, segments };
  }, []);

  const cancel = useCallback(() => {
    setStatusBoth("idle");
    recorderRef.current?.stop();
    teardown();
    setLevels([]);
    setElapsedMs(0);
  }, []);

  return { status, elapsedMs, levels, transcript, error, setError, start, pause, resume, stop, cancel };
}
