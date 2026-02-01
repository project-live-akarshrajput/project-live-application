"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useCallStore } from "@/store/callStore";
import { useWebRTC } from "@/hooks/useWebRTC";
import VideoPlayer from "./VideoPlayer";
import VideoControls from "./VideoControls";
import GenderFilter from "./GenderFilter";
import ReportModal from "./ReportModal";
import { Button, Spinner } from "@/components/ui";
import { formatDuration } from "@/lib/utils";
import { Users, Wifi, WifiOff } from "lucide-react";

export default function VideoRoom() {
  const { data: session } = useSession();
  const [showReportModal, setShowReportModal] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isMediaReady, setIsMediaReady] = useState(false);

  const {
    isConnected,
    isInQueue,
    isInCall,
    queuePosition,
    partnerName,
    partnerId,
    callId,
    callStartTime,
    localStream,
    remoteStream,
    genderPreference,
    setGenderPreference,
  } = useCallStore();

  const {
    initializeMedia,
    joinQueue,
    leaveQueue,
    skipUser,
    endCall,
    connectionState,
    stopMedia,
  } = useWebRTC();

  // Initialize media on mount and cleanup on unmount
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        await initializeMedia();
        if (mounted) {
          setIsMediaReady(true);
        }
      } catch (error) {
        console.error("Failed to initialize media:", error);
      }
    };
    init();

    // Cleanup: Stop all media tracks immediately when leaving the page
    return () => {
      mounted = false;
      stopMedia();
    };
  }, [initializeMedia, stopMedia]);

  // Call duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isInCall && callStartTime) {
      interval = setInterval(() => {
        setCallDuration(Math.floor((Date.now() - callStartTime) / 1000));
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [isInCall, callStartTime]);

  const handleStartSearch = () => {
    if (isMediaReady) {
      joinQueue();
    }
  };

  const handleStopSearch = () => {
    leaveQueue();
  };

  const handleSkip = () => {
    skipUser();
  };

  const handleEndCall = () => {
    endCall();
  };

  const handleReport = () => {
    setShowReportModal(true);
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-dark-400">Please sign in to continue</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-dark-950">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-dark-900 border-b border-dark-800">
        <div className="flex items-center gap-3">
          <div
            className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}
          />
          <span className="text-sm text-dark-300">
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>

        {isInCall && (
          <div className="flex items-center gap-2 text-dark-200">
            <span className="text-sm">Talking to</span>
            <span className="font-medium text-white">{partnerName}</span>
            <span className="text-sm text-primary-400">
              {formatDuration(callDuration)}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2">
          {connectionState !== "new" && connectionState !== "connected" && (
            <span className="text-xs text-dark-400">{connectionState}</span>
          )}
        </div>
      </div>

      {/* Video Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {/* Remote Video (Partner) */}
        <div className="relative">
          <VideoPlayer
            stream={remoteStream}
            mirrored={false}
            label={isInCall ? partnerName || "Partner" : undefined}
            className="aspect-video md:aspect-auto md:h-full"
          />

          {!isInCall && (
            <div className="absolute inset-0 flex items-center justify-center bg-dark-900/90 backdrop-blur-sm rounded-xl">
              <div className="text-center max-w-md px-6">
                {isInQueue ? (
                  <>
                    <Spinner size="lg" className="mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Finding someone to talk to...
                    </h3>
                    {queuePosition && (
                      <p className="text-dark-400 text-sm">
                        Position in queue: {queuePosition}
                      </p>
                    )}
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={handleStopSearch}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-dark-800 flex items-center justify-center">
                      <Users size={32} className="text-primary-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Ready to meet someone?
                    </h3>
                    <p className="text-dark-400 text-sm mb-4">
                      Click Start to find a random person to video chat with
                    </p>

                    {/* Gender Filter */}
                    <div className="mb-4">
                      <GenderFilter
                        value={genderPreference}
                        onChange={setGenderPreference}
                      />
                    </div>

                    <Button
                      size="lg"
                      onClick={handleStartSearch}
                      disabled={!isMediaReady || !isConnected}
                    >
                      {!isMediaReady ? "Loading camera..." : "Start"}
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Local Video (You) */}
        <div className="relative">
          <VideoPlayer
            stream={localStream}
            muted
            mirrored
            label="You"
            className="aspect-video md:aspect-auto md:h-full"
          />

          {!isMediaReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-dark-900/90 backdrop-blur-sm rounded-xl">
              <div className="text-center">
                <Spinner size="lg" className="mx-auto mb-4" />
                <p className="text-dark-400">Initializing camera...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="px-4 py-4 bg-dark-900 border-t border-dark-800">
        <VideoControls
          onEndCall={handleEndCall}
          onSkip={handleSkip}
          onReport={handleReport}
          disabled={!isMediaReady}
        />
      </div>

      {/* Report Modal */}
      {showReportModal && partnerId && callId && (
        <ReportModal
          reportedUserId={partnerId}
          callId={callId}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
}
