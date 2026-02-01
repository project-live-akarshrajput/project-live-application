export interface UserProfile {
  id: string;
  email: string;
  username: string;
  displayName: string;
  gender: "male" | "female" | "other" | "prefer-not-to-say";
  genderPreference: "male" | "female" | "any";
  dateOfBirth: string;
  profileImage?: string;
  bio?: string;
  country?: string;
  isOnline: boolean;
  lastSeen: string;
  totalCalls: number;
  isVerified: boolean;
  createdAt: string;
}

export interface CallParticipant {
  userId: string;
  userName: string;
  socketId: string;
  gender: string;
}

export interface ActiveCall {
  callId: string;
  participants: CallParticipant[];
  startedAt: number;
}

export interface MatchRequest {
  userId: string;
  gender: string;
  genderPreference: string;
  socketId: string;
}

export interface SignalData {
  type: "offer" | "answer" | "candidate";
  sdp?: string;
  candidate?: RTCIceCandidateInit;
}

export interface SocketEvents {
  // Client to Server
  "join-queue": (data: { genderPreference: string }) => void;
  "leave-queue": () => void;
  "send-signal": (data: { signal: SignalData; targetSocketId: string }) => void;
  "end-call": (data: { callId: string }) => void;
  "skip-user": () => void;
  "report-user": (data: { reportedUserId: string; reason: string }) => void;

  // Server to Client
  "match-found": (data: {
    callId: string;
    partnerId: string;
    partnerName: string;
    partnerSocketId: string;
    isInitiator: boolean;
  }) => void;
  "receive-signal": (data: {
    signal: SignalData;
    fromSocketId: string;
  }) => void;
  "call-ended": (data: { reason: string }) => void;
  "partner-disconnected": () => void;
  "queue-position": (data: { position: number }) => void;
  error: (data: { message: string }) => void;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
