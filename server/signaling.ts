import { Server as HttpServer } from "http";
import { Server as SocketServer, Socket } from "socket.io";
import Redis from "ioredis";
import { v4 as uuidv4 } from "uuid";

interface UserData {
  odId: string;
  userName: string;
  gender: string;
  genderPreference: string;
  socketId: string;
  joinedAt: number;
}

// Helper to get odId (userId)
const getUserId = (userData: UserData) => userData.odId;

interface ActiveCall {
  callId: string;
  user1: UserData;
  user2: UserData;
  startedAt: number;
}

// Queue keys
const QUEUE_KEYS = {
  WAITING_ALL: "queue:waiting:all",
  WAITING_MALE: "queue:waiting:male",
  WAITING_FEMALE: "queue:waiting:female",
  USER_DATA: "user:data",
  ACTIVE_CALLS: "calls:active",
  USER_CALL: "user:call",
};

export class SignalingServer {
  private io: SocketServer;
  private redis: Redis;
  private onlineCountInterval: NodeJS.Timeout | null = null;

  constructor(httpServer: HttpServer, redisUrl: string) {
    this.io = new SocketServer(httpServer, {
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
      },
      pingTimeout: 60000,
      pingInterval: 25000,
      transports: ["websocket", "polling"],
    });

    // Parse Redis URL and configure TLS for Upstash (rediss://)
    const isTls = redisUrl.startsWith("rediss://");
    this.redis = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      tls: isTls ? { rejectUnauthorized: false } : undefined,
    });

    this.redis.on("connect", () => console.log("Redis connected"));
    this.redis.on("ready", () => console.log("Redis ready"));
    this.redis.on("error", (err) => console.error("Redis error:", err));

    this.setupSocketHandlers();
    this.startOnlineCountBroadcast();
  }

  // Broadcast online count every 5 seconds to reduce load
  private startOnlineCountBroadcast() {
    this.onlineCountInterval = setInterval(() => {
      const count = this.io.engine.clientsCount;
      this.io.emit("online-count", { count });
    }, 5000);

    // Also emit on connection changes with slight debounce
    this.io.on("connection", () => {
      setTimeout(() => {
        this.io.emit("online-count", { count: this.io.engine.clientsCount });
      }, 100);
    });
  }

  private setupSocketHandlers() {
    this.io.on("connection", (socket: Socket) => {
      console.log(`User connected: ${socket.id}`);

      // Send current online count immediately to new connection
      socket.emit("online-count", { count: this.io.engine.clientsCount });

      // Authenticate user
      socket.on(
        "authenticate",
        async (data: { userId: string; userName: string; gender: string }) => {
          try {
            const userData: UserData = {
              odId: data.userId,
              userName: data.userName,
              gender: data.gender,
              genderPreference: "any",
              socketId: socket.id,
              joinedAt: Date.now(),
            };

            await this.redis.hset(
              QUEUE_KEYS.USER_DATA,
              socket.id,
              JSON.stringify(userData),
            );
            socket.emit("authenticated", { success: true });
          } catch (error) {
            console.error("Authentication error:", error);
            socket.emit("error", { message: "Authentication failed" });
          }
        },
      );

      // Join matchmaking queue
      socket.on("join-queue", async (data: { genderPreference: string }) => {
        try {
          const userDataStr = await this.redis.hget(
            QUEUE_KEYS.USER_DATA,
            socket.id,
          );
          if (!userDataStr) {
            socket.emit("error", { message: "Please authenticate first" });
            return;
          }

          const userData: UserData = JSON.parse(userDataStr);
          userData.genderPreference = data.genderPreference;

          // Check if already in a call
          const existingCall = await this.redis.hget(
            QUEUE_KEYS.USER_CALL,
            userData.odId,
          );
          if (existingCall) {
            socket.emit("error", { message: "Already in a call" });
            return;
          }

          // Try to find a match first
          const match = await this.findMatch(userData);

          if (match) {
            // Match found - create call
            await this.createCall(userData, match);
          } else {
            // No match - add to queue
            await this.addToQueue(userData);
            socket.emit("queue-joined", {
              position: await this.getQueuePosition(userData),
            });
          }
        } catch (error) {
          console.error("Join queue error:", error);
          socket.emit("error", { message: "Failed to join queue" });
        }
      });

      // Leave queue
      socket.on("leave-queue", async () => {
        try {
          await this.removeFromQueue(socket.id);
          socket.emit("queue-left");
        } catch (error) {
          console.error("Leave queue error:", error);
        }
      });

      // WebRTC signaling
      socket.on(
        "send-signal",
        async (data: { signal: any; targetSocketId: string }) => {
          this.io.to(data.targetSocketId).emit("receive-signal", {
            signal: data.signal,
            fromSocketId: socket.id,
          });
        },
      );

      // End call
      socket.on("end-call", async (data: { callId: string }) => {
        try {
          await this.endCall(data.callId, "completed");
        } catch (error) {
          console.error("End call error:", error);
        }
      });

      // Skip to next user
      socket.on("skip-user", async () => {
        try {
          const userDataStr = await this.redis.hget(
            QUEUE_KEYS.USER_DATA,
            socket.id,
          );
          if (!userDataStr) return;

          const userData: UserData = JSON.parse(userDataStr);
          const callId = await this.redis.hget(
            QUEUE_KEYS.USER_CALL,
            userData.odId,
          );

          if (callId) {
            await this.endCall(callId, "skipped");
          }

          // Re-queue user for next match
          setTimeout(() => {
            socket.emit("ready-for-next");
          }, 500);
        } catch (error) {
          console.error("Skip user error:", error);
        }
      });

      // Handle disconnect
      socket.on("disconnect", async () => {
        console.log(`User disconnected: ${socket.id}`);
        try {
          const userDataStr = await this.redis.hget(
            QUEUE_KEYS.USER_DATA,
            socket.id,
          );
          if (userDataStr) {
            const userData: UserData = JSON.parse(userDataStr);
            const callId = await this.redis.hget(
              QUEUE_KEYS.USER_CALL,
              userData.odId,
            );

            if (callId) {
              await this.endCall(callId, "disconnected");
            }

            await this.removeFromQueue(socket.id);
            await this.redis.hdel(QUEUE_KEYS.USER_DATA, socket.id);
          }
        } catch (error) {
          console.error("Disconnect cleanup error:", error);
        }
      });
    });
  }

  private async addToQueue(userData: UserData): Promise<void> {
    const userStr = JSON.stringify(userData);
    const pipeline = this.redis.pipeline();

    // Add to general queue
    pipeline.zadd(QUEUE_KEYS.WAITING_ALL, userData.joinedAt, userStr);

    // Add to gender-specific queue
    if (userData.gender === "male") {
      pipeline.zadd(QUEUE_KEYS.WAITING_MALE, userData.joinedAt, userStr);
    } else if (userData.gender === "female") {
      pipeline.zadd(QUEUE_KEYS.WAITING_FEMALE, userData.joinedAt, userStr);
    }

    await pipeline.exec();
  }

  private async removeFromQueue(socketId: string): Promise<void> {
    const queues = [
      QUEUE_KEYS.WAITING_ALL,
      QUEUE_KEYS.WAITING_MALE,
      QUEUE_KEYS.WAITING_FEMALE,
    ];

    for (const queue of queues) {
      const members = await this.redis.zrange(queue, 0, -1);
      for (const member of members) {
        try {
          const data = JSON.parse(member);
          if (data.socketId === socketId) {
            await this.redis.zrem(queue, member);
          }
        } catch (e) {
          // Skip invalid entries
        }
      }
    }
  }

  private async findMatch(userData: UserData): Promise<UserData | null> {
    // Determine target queue based on preference
    let targetQueue: string;

    if (userData.genderPreference === "male") {
      targetQueue = QUEUE_KEYS.WAITING_MALE;
    } else if (userData.genderPreference === "female") {
      targetQueue = QUEUE_KEYS.WAITING_FEMALE;
    } else {
      targetQueue = QUEUE_KEYS.WAITING_ALL;
    }

    // Get waiting users (FIFO - oldest first)
    const waitingUsers = await this.redis.zrange(targetQueue, 0, 100);

    for (const userStr of waitingUsers) {
      try {
        const waitingUser: UserData = JSON.parse(userStr);

        // Skip self
        if (waitingUser.odId === userData.odId) continue;

        // Check if their preference matches our gender
        if (
          waitingUser.genderPreference !== "any" &&
          waitingUser.genderPreference !== userData.gender
        ) {
          continue;
        }

        // Match found!
        return waitingUser;
      } catch (e) {
        // Skip invalid entries
      }
    }

    return null;
  }

  private async createCall(user1: UserData, user2: UserData): Promise<void> {
    const callId = uuidv4();

    // Remove both users from queues
    await this.removeFromQueue(user1.socketId);
    await this.removeFromQueue(user2.socketId);

    // Store call data
    const callData: ActiveCall = {
      callId,
      user1,
      user2,
      startedAt: Date.now(),
    };

    const pipeline = this.redis.pipeline();
    pipeline.hset(QUEUE_KEYS.ACTIVE_CALLS, callId, JSON.stringify(callData));
    pipeline.hset(QUEUE_KEYS.USER_CALL, user1.odId, callId);
    pipeline.hset(QUEUE_KEYS.USER_CALL, user2.odId, callId);
    await pipeline.exec();

    // Notify both users
    this.io.to(user1.socketId).emit("match-found", {
      callId,
      partnerId: user2.odId,
      partnerName: user2.userName,
      partnerSocketId: user2.socketId,
      isInitiator: true,
    });

    this.io.to(user2.socketId).emit("match-found", {
      callId,
      partnerId: user1.odId,
      partnerName: user1.userName,
      partnerSocketId: user1.socketId,
      isInitiator: false,
    });

    console.log(
      `Call created: ${callId} between ${user1.userName} and ${user2.userName}`,
    );
  }

  private async endCall(callId: string, reason: string): Promise<void> {
    const callDataStr = await this.redis.hget(QUEUE_KEYS.ACTIVE_CALLS, callId);
    if (!callDataStr) return;

    const callData: ActiveCall = JSON.parse(callDataStr);

    // Notify both users
    this.io.to(callData.user1.socketId).emit("call-ended", { reason });
    this.io.to(callData.user2.socketId).emit("call-ended", { reason });

    // Clean up
    const pipeline = this.redis.pipeline();
    pipeline.hdel(QUEUE_KEYS.ACTIVE_CALLS, callId);
    pipeline.hdel(QUEUE_KEYS.USER_CALL, callData.user1.odId);
    pipeline.hdel(QUEUE_KEYS.USER_CALL, callData.user2.odId);
    await pipeline.exec();

    console.log(`Call ended: ${callId}, reason: ${reason}`);
  }

  private async getQueuePosition(userData: UserData): Promise<number> {
    const rank = await this.redis.zrank(
      QUEUE_KEYS.WAITING_ALL,
      JSON.stringify(userData),
    );
    return rank !== null ? rank + 1 : 0;
  }

  public getIO(): SocketServer {
    return this.io;
  }
}

export default SignalingServer;
