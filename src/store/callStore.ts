"use client";

import { create } from "zustand";

interface CallState {
  // Connection state
  isConnected: boolean;
  isInQueue: boolean;
  isInCall: boolean;
  queuePosition: number | null;

  // Call info
  callId: string | null;
  partnerId: string | null;
  partnerName: string | null;
  partnerSocketId: string | null;
  isInitiator: boolean;
  callStartTime: number | null;

  // Media state
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;

  // Filter settings
  genderPreference: "male" | "female" | "any";

  // Actions
  setConnected: (connected: boolean) => void;
  setInQueue: (inQueue: boolean) => void;
  setQueuePosition: (position: number | null) => void;
  setCallInfo: (info: {
    callId: string;
    partnerId: string;
    partnerName: string;
    partnerSocketId: string;
    isInitiator: boolean;
  }) => void;
  clearCallInfo: () => void;
  setLocalStream: (stream: MediaStream | null) => void;
  setRemoteStream: (stream: MediaStream | null) => void;
  toggleVideo: () => void;
  toggleAudio: () => void;
  setGenderPreference: (preference: "male" | "female" | "any") => void;
  reset: () => void;
}

const initialState = {
  isConnected: false,
  isInQueue: false,
  isInCall: false,
  queuePosition: null,
  callId: null,
  partnerId: null,
  partnerName: null,
  partnerSocketId: null,
  isInitiator: false,
  callStartTime: null,
  localStream: null,
  remoteStream: null,
  isVideoEnabled: true,
  isAudioEnabled: true,
  genderPreference: "any" as const,
};

export const useCallStore = create<CallState>((set, get) => ({
  ...initialState,

  setConnected: (connected) => set({ isConnected: connected }),

  setInQueue: (inQueue) =>
    set({ isInQueue: inQueue, isInCall: !inQueue && get().isInCall }),

  setQueuePosition: (position) => set({ queuePosition: position }),

  setCallInfo: (info) =>
    set({
      callId: info.callId,
      partnerId: info.partnerId,
      partnerName: info.partnerName,
      partnerSocketId: info.partnerSocketId,
      isInitiator: info.isInitiator,
      isInCall: true,
      isInQueue: false,
      callStartTime: Date.now(),
    }),

  clearCallInfo: () =>
    set({
      callId: null,
      partnerId: null,
      partnerName: null,
      partnerSocketId: null,
      isInitiator: false,
      isInCall: false,
      callStartTime: null,
      remoteStream: null,
    }),

  setLocalStream: (stream) => set({ localStream: stream }),

  setRemoteStream: (stream) => set({ remoteStream: stream }),

  toggleVideo: () => {
    const { localStream, isVideoEnabled } = get();
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !isVideoEnabled;
      });
    }
    set({ isVideoEnabled: !isVideoEnabled });
  },

  toggleAudio: () => {
    const { localStream, isAudioEnabled } = get();
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !isAudioEnabled;
      });
    }
    set({ isAudioEnabled: !isAudioEnabled });
  },

  setGenderPreference: (preference) => set({ genderPreference: preference }),

  reset: () => {
    const { localStream } = get();
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    set(initialState);
  },
}));
