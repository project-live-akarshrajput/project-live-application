"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useSession } from "next-auth/react";
import { useCallStore } from "@/store/callStore";
import toast from "react-hot-toast";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";

// ICE servers configuration
const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
    { urls: "stun:stun3.l.google.com:19302" },
    { urls: "stun:stun4.l.google.com:19302" },
    // Add TURN servers for production
    // {
    //   urls: process.env.TURN_SERVER_URL,
    //   username: process.env.TURN_SERVER_USERNAME,
    //   credential: process.env.TURN_SERVER_CREDENTIAL,
    // },
  ],
  iceCandidatePoolSize: 10,
};

export function useWebRTC() {
  const { data: session } = useSession();
  const socketRef = useRef<Socket | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const pendingCandidatesRef = useRef<RTCIceCandidate[]>([]);
  const [connectionState, setConnectionState] = useState<string>("new");

  const {
    setConnected,
    setInQueue,
    setQueuePosition,
    setOnlineCount,
    setCallInfo,
    clearCallInfo,
    setLocalStream,
    setRemoteStream,
    localStream,
    partnerSocketId,
    isInitiator,
    genderPreference,
    reset,
  } = useCallStore();

  // Initialize media stream
  const initializeMedia = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          facingMode: "user",
          frameRate: { ideal: 30, max: 60 },
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      setLocalStream(stream);
      return stream;
    } catch (error) {
      console.error("Failed to get media:", error);
      toast.error("Camera/microphone access denied");
      throw error;
    }
  }, [setLocalStream]);

  // Stop media immediately - synchronous cleanup
  const stopMedia = useCallback(() => {
    // Get current stream directly from store to avoid stale closure
    const currentStream = useCallStore.getState().localStream;
    if (currentStream) {
      currentStream.getTracks().forEach((track) => {
        track.stop();
      });
    }
    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    // Disconnect socket
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    // Reset store
    reset();
  }, [reset]);

  // Create peer connection
  const createPeerConnection = useCallback(() => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }

    const pc = new RTCPeerConnection(ICE_SERVERS);

    pc.onicecandidate = (event) => {
      if (event.candidate && socketRef.current && partnerSocketId) {
        socketRef.current.emit("send-signal", {
          signal: { type: "candidate", candidate: event.candidate.toJSON() },
          targetSocketId: partnerSocketId,
        });
      }
    };

    pc.oniceconnectionstatechange = () => {
      setConnectionState(pc.iceConnectionState);
      console.log("ICE connection state:", pc.iceConnectionState);

      if (
        pc.iceConnectionState === "disconnected" ||
        pc.iceConnectionState === "failed"
      ) {
        toast.error("Connection lost");
        handleEndCall();
      }
    };

    pc.ontrack = (event) => {
      console.log("Received remote track:", event.track.kind);
      if (event.streams[0]) {
        setRemoteStream(event.streams[0]);
      }
    };

    pc.onnegotiationneeded = async () => {
      if (isInitiator && pc.signalingState === "stable") {
        try {
          const offer = await pc.createOffer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: true,
          });
          await pc.setLocalDescription(offer);

          if (socketRef.current && partnerSocketId) {
            socketRef.current.emit("send-signal", {
              signal: { type: "offer", sdp: offer.sdp },
              targetSocketId: partnerSocketId,
            });
          }
        } catch (error) {
          console.error("Negotiation error:", error);
        }
      }
    };

    peerConnectionRef.current = pc;
    return pc;
  }, [partnerSocketId, isInitiator, setRemoteStream]);

  // Handle incoming signal
  const handleSignal = useCallback(
    async (data: { signal: any; fromSocketId: string }) => {
      const pc = peerConnectionRef.current;
      if (!pc) return;

      try {
        if (data.signal.type === "offer") {
          await pc.setRemoteDescription(
            new RTCSessionDescription({
              type: "offer",
              sdp: data.signal.sdp,
            }),
          );

          // Process pending candidates
          for (const candidate of pendingCandidatesRef.current) {
            await pc.addIceCandidate(candidate);
          }
          pendingCandidatesRef.current = [];

          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);

          if (socketRef.current) {
            socketRef.current.emit("send-signal", {
              signal: { type: "answer", sdp: answer.sdp },
              targetSocketId: data.fromSocketId,
            });
          }
        } else if (data.signal.type === "answer") {
          await pc.setRemoteDescription(
            new RTCSessionDescription({
              type: "answer",
              sdp: data.signal.sdp,
            }),
          );

          // Process pending candidates
          for (const candidate of pendingCandidatesRef.current) {
            await pc.addIceCandidate(candidate);
          }
          pendingCandidatesRef.current = [];
        } else if (data.signal.type === "candidate" && data.signal.candidate) {
          const candidate = new RTCIceCandidate(data.signal.candidate);
          if (pc.remoteDescription) {
            await pc.addIceCandidate(candidate);
          } else {
            pendingCandidatesRef.current.push(candidate);
          }
        }
      } catch (error) {
        console.error("Signal handling error:", error);
      }
    },
    [],
  );

  // Start call as initiator
  const startCall = useCallback(async () => {
    const pc = createPeerConnection();

    if (localStream) {
      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
      });
    }

    if (isInitiator) {
      try {
        const offer = await pc.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true,
        });
        await pc.setLocalDescription(offer);

        if (socketRef.current && partnerSocketId) {
          socketRef.current.emit("send-signal", {
            signal: { type: "offer", sdp: offer.sdp },
            targetSocketId: partnerSocketId,
          });
        }
      } catch (error) {
        console.error("Failed to create offer:", error);
      }
    }
  }, [createPeerConnection, localStream, isInitiator, partnerSocketId]);

  // End call
  const handleEndCall = useCallback(() => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    pendingCandidatesRef.current = [];
    clearCallInfo();
    setConnectionState("new");
  }, [clearCallInfo]);

  // Join queue
  const joinQueue = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit("join-queue", { genderPreference });
      setInQueue(true);
    }
  }, [genderPreference, setInQueue]);

  // Leave queue
  const leaveQueue = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit("leave-queue");
      setInQueue(false);
      setQueuePosition(null);
    }
  }, [setInQueue, setQueuePosition]);

  // Skip current user
  const skipUser = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit("skip-user");
    }
    handleEndCall();
  }, [handleEndCall]);

  // Connect socket
  useEffect(() => {
    if (!session?.user) return;

    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      setConnected(true);

      // Authenticate
      socket.emit("authenticate", {
        userId: session.user.id,
        userName: session.user.name,
        gender: session.user.gender,
      });
    });

    socket.on("authenticated", () => {
      console.log("Socket authenticated");
    });

    socket.on("online-count", (data: { count: number }) => {
      setOnlineCount(data.count);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
      setConnected(false);
      handleEndCall();
    });

    socket.on("queue-joined", (data) => {
      console.log("Joined queue, position:", data.position);
      setQueuePosition(data.position);
    });

    socket.on("match-found", (data) => {
      console.log("Match found:", data);
      toast.success(`Matched with ${data.partnerName}!`);
      setCallInfo(data);
    });

    socket.on("receive-signal", handleSignal);

    socket.on("call-ended", (data) => {
      console.log("Call ended:", data.reason);
      if (data.reason === "skipped") {
        toast("Partner skipped", { icon: "⏭️" });
      } else if (data.reason === "disconnected") {
        toast.error("Partner disconnected");
      }
      handleEndCall();
    });

    socket.on("ready-for-next", () => {
      // Auto re-queue after skip
      joinQueue();
    });

    socket.on("error", (data) => {
      console.error("Socket error:", data.message);
      toast.error(data.message);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [
    session,
    setConnected,
    setOnlineCount,
    setQueuePosition,
    setCallInfo,
    handleSignal,
    handleEndCall,
    joinQueue,
  ]);

  // Start call when matched
  useEffect(() => {
    if (partnerSocketId && localStream) {
      startCall();
    }
  }, [partnerSocketId, localStream, startCall]);

  return {
    initializeMedia,
    stopMedia,
    joinQueue,
    leaveQueue,
    skipUser,
    endCall: handleEndCall,
    connectionState,
    socket: socketRef.current,
  };
}
