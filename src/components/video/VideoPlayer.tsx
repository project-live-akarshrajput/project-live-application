"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  stream: MediaStream | null;
  muted?: boolean;
  mirrored?: boolean;
  className?: string;
  label?: string;
  showPlaceholder?: boolean;
}

export default function VideoPlayer({
  stream,
  muted = false,
  mirrored = true,
  className,
  label,
  showPlaceholder = true,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div
      className={cn(
        "relative w-full h-full bg-dark-900 rounded-xl overflow-hidden",
        className,
      )}
    >
      {stream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={muted}
          className={cn(
            "w-full h-full object-cover",
            mirrored && "scale-x-[-1]",
          )}
        />
      ) : showPlaceholder ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-dark-700 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-dark-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <p className="text-dark-400 text-sm">Waiting for video...</p>
          </div>
        </div>
      ) : null}

      {label && (
        <div className="absolute bottom-3 left-3 px-2 py-1 bg-dark-900/80 backdrop-blur-sm rounded-md">
          <span className="text-white text-sm font-medium">{label}</span>
        </div>
      )}
    </div>
  );
}
