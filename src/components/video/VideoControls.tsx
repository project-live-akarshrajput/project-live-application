"use client";

import React from "react";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  SkipForward,
  Flag,
  Settings,
} from "lucide-react";
import { useCallStore } from "@/store/callStore";
import { cn } from "@/lib/utils";

interface VideoControlsProps {
  onEndCall: () => void;
  onSkip: () => void;
  onReport: () => void;
  disabled?: boolean;
}

export default function VideoControls({
  onEndCall,
  onSkip,
  onReport,
  disabled = false,
}: VideoControlsProps) {
  const { isVideoEnabled, isAudioEnabled, toggleVideo, toggleAudio, isInCall } =
    useCallStore();

  return (
    <div className="flex items-center justify-center gap-3">
      {/* Mic Toggle */}
      <button
        onClick={toggleAudio}
        disabled={disabled}
        className={cn(
          "p-3 rounded-full transition-all duration-200",
          isAudioEnabled
            ? "bg-dark-700 hover:bg-dark-600 text-white"
            : "bg-red-600 hover:bg-red-700 text-white",
          disabled && "opacity-50 cursor-not-allowed",
        )}
        title={isAudioEnabled ? "Mute microphone" : "Unmute microphone"}
      >
        {isAudioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
      </button>

      {/* Video Toggle */}
      <button
        onClick={toggleVideo}
        disabled={disabled}
        className={cn(
          "p-3 rounded-full transition-all duration-200",
          isVideoEnabled
            ? "bg-dark-700 hover:bg-dark-600 text-white"
            : "bg-red-600 hover:bg-red-700 text-white",
          disabled && "opacity-50 cursor-not-allowed",
        )}
        title={isVideoEnabled ? "Turn off camera" : "Turn on camera"}
      >
        {isVideoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
      </button>

      {/* End Call */}
      <button
        onClick={onEndCall}
        disabled={disabled || !isInCall}
        className={cn(
          "p-4 rounded-full bg-red-600 hover:bg-red-700 text-white transition-all duration-200",
          (disabled || !isInCall) && "opacity-50 cursor-not-allowed",
        )}
        title="End call"
      >
        <PhoneOff size={22} />
      </button>

      {/* Skip */}
      <button
        onClick={onSkip}
        disabled={disabled || !isInCall}
        className={cn(
          "p-3 rounded-full bg-dark-700 hover:bg-dark-600 text-white transition-all duration-200",
          (disabled || !isInCall) && "opacity-50 cursor-not-allowed",
        )}
        title="Skip to next person"
      >
        <SkipForward size={20} />
      </button>

      {/* Report */}
      <button
        onClick={onReport}
        disabled={disabled || !isInCall}
        className={cn(
          "p-3 rounded-full bg-dark-700 hover:bg-orange-600 text-white transition-all duration-200",
          (disabled || !isInCall) && "opacity-50 cursor-not-allowed",
        )}
        title="Report user"
      >
        <Flag size={20} />
      </button>
    </div>
  );
}
