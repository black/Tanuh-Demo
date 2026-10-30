"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type CameraStatus = "starting" | "ready" | "unavailable";

// Keeps one camera stream open for the whole capture session so the FLW never
// has to relaunch the camera between regions.
export function useCamera(active: boolean) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<CameraStatus>("starting");

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    let stream: MediaStream | null = null;

    async function start() {
      try {
        if (!navigator.mediaDevices?.getUserMedia) throw new Error("No camera API");
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1080 } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        if (videoRef.current) videoRef.current.srcObject = stream;
        setStatus("ready");
      } catch {
        if (!cancelled) setStatus("unavailable");
      }
    }

    start();

    return () => {
      cancelled = true;
      stream?.getTracks().forEach((track) => track.stop());
      setStatus("starting");
    };
  }, [active]);

  const capture = useCallback((): Promise<string | null> => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return Promise.resolve(null);

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return Promise.resolve(null);

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return new Promise((resolve) =>
      canvas.toBlob((blob) => resolve(blob ? URL.createObjectURL(blob) : null), "image/jpeg", 0.92)
    );
  }, []);

  return { videoRef, status, capture };
}
