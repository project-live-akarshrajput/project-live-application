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
import { motion } from "framer-motion";

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
    onlineCount,
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
      <div className="flex items-center justify-center h-full bg-surface-50">
        <p className="text-surface-500">Please sign in to continue</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-surface-100">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-surface-200">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${isConnected ? "bg-success-500" : "bg-red-500"}`}
            />
            <span className="text-sm text-surface-500">
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>
          {isConnected && onlineCount > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-success-50 border border-success-200 rounded-xs">
              <Users size={14} className="text-success-600" />
              <span className="text-xs font-medium text-success-600">
                {onlineCount.toLocaleString()} online
              </span>
            </div>
          )}
        </div>

        {isInCall && (
          <motion.div
            className="flex items-center gap-2 text-surface-600"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <span className="text-sm">Talking to</span>
            <span className="font-medium text-surface-900">{partnerName}</span>
            <span className="text-sm text-primary-500 font-medium">
              {formatDuration(callDuration)}
            </span>
          </motion.div>
        )}

        <div className="flex items-center gap-2">
          {connectionState !== "new" && connectionState !== "connected" && (
            <span className="text-xs text-surface-400 bg-surface-100 px-2 py-1 rounded-xs">
              {connectionState}
            </span>
          )}
        </div>
      </div>

      {/* Video Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 p-3">
        {/* Remote Video (Partner) */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <VideoPlayer
            stream={remoteStream}
            mirrored={false}
            label={isInCall ? partnerName || "Partner" : undefined}
            className="aspect-video md:aspect-auto md:h-full"
          />

          {!isInCall && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/95 backdrop-blur-sm rounded-xs">
              <div className="text-center max-w-md px-6">
                {isInQueue ? (
                  <>
                    <Spinner size="lg" className="mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-surface-900 mb-2">
                      Finding someone to talk to...
                    </h3>
                    {queuePosition && (
                      <p className="text-surface-500 text-sm">
                        Position in queue: {queuePosition}
                      </p>
                    )}
                    <Button
                      variant="secondary"
                      className="mt-4"
                      onClick={handleStopSearch}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="w-14 h-14 mx-auto mb-4 rounded-xs bg-primary-100 flex items-center justify-center">
                      <Users size={28} className="text-primary-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-surface-900 mb-2">
                      Ready to meet someone?
                    </h3>
                    <p className="text-surface-500 text-sm mb-4">
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
        </motion.div>

        {/* Local Video (You) */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <VideoPlayer
            stream={localStream}
            muted
            mirrored
            label="You"
            className="aspect-video md:aspect-auto md:h-full"
          />

          {!isMediaReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/95 backdrop-blur-sm rounded-xs">
              <div className="text-center">
                <Spinner size="lg" className="mx-auto mb-4" />
                <p className="text-surface-500">Initializing camera...</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Controls */}
      <div className="px-4 py-4 bg-white border-t border-surface-200">
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
