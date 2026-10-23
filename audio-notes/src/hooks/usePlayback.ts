"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Plays a recorded blob. Progress is measured against the duration we tracked
 * while recording, because MediaRecorder webm files often report Infinity.
 */
export function usePlayback(blob: Blob | null, durationMs: number) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef(0);
  const [playing, setPlaying] = useState(false);
  const [positionMs, setPositionMs] = useState(0);

  useEffect(() => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const audio = new Audio();
    audio.preload = "none";
    audio.src = url;
    // rAF gives smooth progress; timeupdate keeps it moving when rAF is throttled.
    audio.ontimeupdate = () => setPositionMs(audio.currentTime * 1000);
    audio.onended = () => {
      cancelAnimationFrame(rafRef.current);
      audio.currentTime = 0;
      setPlaying(false);
      setPositionMs(0);
    };
    audioRef.current = audio;
    return () => {
      audio.pause();
      cancelAnimationFrame(rafRef.current);
      URL.revokeObjectURL(url);
      audioRef.current = null;
    };
  }, [blob]);

  const loop = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    setPositionMs(a.currentTime * 1000);
    if (!a.paused) rafRef.current = requestAnimationFrame(loop);
  }, []);

  const toggle = useCallback(async () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      await a.play();
      setPlaying(true);
      rafRef.current = requestAnimationFrame(loop);
    } else {
      a.pause();
      setPlaying(false);
    }
  }, [loop]);

  const seek = useCallback(
    (ratio: number) => {
      const a = audioRef.current;
      if (!a) return;
      a.currentTime = (ratio * durationMs) / 1000;
      setPositionMs(ratio * durationMs);
    },
    [durationMs],
  );

  const progress = durationMs ? Math.min(1, positionMs / durationMs) : 0;
  return { playing, positionMs, progress, toggle, seek };
}
