"use client";

import { useEffect, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";

// Singleton socket for online count (lightweight connection)
let sharedSocket: Socket | null = null;
let subscriberCount = 0;

export function useOnlineCount() {
  const [onlineCount, setOnlineCount] = useState<number>(0);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    subscriberCount++;

    // Create shared socket if doesn't exist
    if (!sharedSocket) {
      sharedSocket = io(SOCKET_URL, {
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: 3,
        reconnectionDelay: 2000,
        // Only request online count, no authentication needed
        autoConnect: true,
      });

      sharedSocket.on("connect", () => {
        console.log("Online count socket connected");
      });

      sharedSocket.on("disconnect", () => {
        console.log("Online count socket disconnected");
      });
    }

    const socket = sharedSocket;

    const handleOnlineCount = (data: { count: number }) => {
      setOnlineCount(data.count);
      setIsConnected(true);
    };

    const handleConnect = () => {
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    socket.on("online-count", handleOnlineCount);
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    // Set initial connection state
    if (socket.connected) {
      setIsConnected(true);
    }

    return () => {
      socket.off("online-count", handleOnlineCount);
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);

      subscriberCount--;

      // Disconnect shared socket when no subscribers
      if (subscriberCount === 0 && sharedSocket) {
        sharedSocket.disconnect();
        sharedSocket = null;
      }
    };
  }, []);

  return { onlineCount, isConnected };
}
