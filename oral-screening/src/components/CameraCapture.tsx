"use client";

import React, { useEffect, useRef, useState } from "react";
import Icon from "./Icon";

interface Props {
  onCapture: (imageUrl: string) => void;
  onClose: () => void;
  onUnavailable: () => void;
}

const CameraCapture = (props: Props) => {
  const { onCapture, onClose, onUnavailable } = props;

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setReady(true);
      } catch {
        if (!cancelled) onUnavailable();
      }
    }

    startCamera();

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleShutter() {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(
      (blob) => {
        if (blob) onCapture(URL.createObjectURL(blob));
      },
      "image/jpeg",
      0.92
    );
  }

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="size-full object-cover"
      />

      <button
        type="button"
        onClick={onClose}
        aria-label="Close camera"
        className="absolute left-4 top-4 flex size-10 items-center justify-center rounded-full bg-black/40 text-white"
      >
        <Icon name="close" className="text-[22px]" />
      </button>

      {ready && (
        <button
          type="button"
          onClick={handleShutter}
          aria-label="Take photo"
          className="absolute bottom-8 left-1/2 flex size-16 -translate-x-1/2 items-center justify-center rounded-full border-4 border-white bg-white/20"
        >
          <span className="size-12 rounded-full bg-white" />
        </button>
      )}
    </div>
  );
};

export default CameraCapture;
