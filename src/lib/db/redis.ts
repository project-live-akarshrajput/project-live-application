import Redis from "ioredis";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

interface RedisCache {
  client: Redis | null;
}

declare global {
  var redis: RedisCache | undefined;
}

let cached: RedisCache = global.redis || { client: null };

if (!global.redis) {
  global.redis = cached;
}

export function getRedisClient(): Redis {
  if (cached.client) {
    return cached.client;
  }

  const client = new Redis(REDIS_URL, {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    reconnectOnError(err) {
      const targetErrors = ["READONLY", "ECONNRESET", "ETIMEDOUT"];
      return targetErrors.some((e) => err.message.includes(e));
    },
  });

  client.on("error", (error) => {
    console.error("Redis Client Error:", error);
  });

  client.on("connect", () => {
    console.log("Redis Client Connected");
  });

  cached.client = client;
  return client;
}

// Queue keys
export const QUEUE_KEYS = {
  WAITING_ALL: "queue:waiting:all",
  WAITING_MALE: "queue:waiting:male",
  WAITING_FEMALE: "queue:waiting:female",
  WAITING_OTHER: "queue:waiting:other",
  ACTIVE_CALLS: "calls:active",
  USER_STATUS: "user:status",
  USER_SOCKET: "user:socket",
} as const;

// Helper functions for matchmaking queue
export async function addToQueue(
  redis: Redis,
  userId: string,
  gender: string,
  genderPreference: string,
  socketId: string,
): Promise<void> {
  const userData = JSON.stringify({
    userId,
    gender,
    genderPreference,
    socketId,
    joinedAt: Date.now(),
  });

  const pipeline = redis.pipeline();

  // Add to general queue
  pipeline.zadd(QUEUE_KEYS.WAITING_ALL, Date.now(), userData);

  // Add to gender-specific queue
  const genderQueue =
    gender === "male"
      ? QUEUE_KEYS.WAITING_MALE
      : gender === "female"
        ? QUEUE_KEYS.WAITING_FEMALE
        : QUEUE_KEYS.WAITING_OTHER;

  pipeline.zadd(genderQueue, Date.now(), userData);

  // Store user status
  pipeline.hset(QUEUE_KEYS.USER_STATUS, userId, "waiting");
  pipeline.hset(QUEUE_KEYS.USER_SOCKET, userId, socketId);

  await pipeline.exec();
}

export async function removeFromQueue(
  redis: Redis,
  userId: string,
): Promise<void> {
  const pipeline = redis.pipeline();

  // Get all entries from queues and remove matching user
  const queues = [
    QUEUE_KEYS.WAITING_ALL,
    QUEUE_KEYS.WAITING_MALE,
    QUEUE_KEYS.WAITING_FEMALE,
    QUEUE_KEYS.WAITING_OTHER,
  ];

  for (const queue of queues) {
    const members = await redis.zrange(queue, 0, -1);
    for (const member of members) {
      const data = JSON.parse(member);
      if (data.userId === userId) {
        pipeline.zrem(queue, member);
      }
    }
  }

  pipeline.hdel(QUEUE_KEYS.USER_STATUS, userId);
  pipeline.hdel(QUEUE_KEYS.USER_SOCKET, userId);

  await pipeline.exec();
}

export async function findMatch(
  redis: Redis,
  userId: string,
  gender: string,
  genderPreference: string,
): Promise<{ userId: string; socketId: string } | null> {
  // Determine which queue to search based on preference
  let targetQueue: string;

  if (genderPreference === "any") {
    targetQueue = QUEUE_KEYS.WAITING_ALL;
  } else if (genderPreference === "male") {
    targetQueue = QUEUE_KEYS.WAITING_MALE;
  } else if (genderPreference === "female") {
    targetQueue = QUEUE_KEYS.WAITING_FEMALE;
  } else {
    targetQueue = QUEUE_KEYS.WAITING_ALL;
  }

  // Get waiting users sorted by join time (FIFO)
  const waitingUsers = await redis.zrange(targetQueue, 0, 50);

  for (const userStr of waitingUsers) {
    const userData = JSON.parse(userStr);

    // Skip self
    if (userData.userId === userId) continue;

    // Check if this user's preference matches our gender
    if (
      userData.genderPreference !== "any" &&
      userData.genderPreference !== gender
    ) {
      continue;
    }

    return {
      userId: userData.userId,
      socketId: userData.socketId,
    };
  }

  return null;
}

export async function setActiveCall(
  redis: Redis,
  callId: string,
  user1Id: string,
  user2Id: string,
): Promise<void> {
  const callData = JSON.stringify({
    user1Id,
    user2Id,
    startedAt: Date.now(),
  });

  const pipeline = redis.pipeline();
  pipeline.hset(QUEUE_KEYS.ACTIVE_CALLS, callId, callData);
  pipeline.hset(QUEUE_KEYS.USER_STATUS, user1Id, `in-call:${callId}`);
  pipeline.hset(QUEUE_KEYS.USER_STATUS, user2Id, `in-call:${callId}`);
  await pipeline.exec();
}

export async function endActiveCall(
  redis: Redis,
  callId: string,
): Promise<void> {
  const callDataStr = await redis.hget(QUEUE_KEYS.ACTIVE_CALLS, callId);
  if (!callDataStr) return;

  const callData = JSON.parse(callDataStr);
  const pipeline = redis.pipeline();

  pipeline.hdel(QUEUE_KEYS.ACTIVE_CALLS, callId);
  pipeline.hdel(QUEUE_KEYS.USER_STATUS, callData.user1Id);
  pipeline.hdel(QUEUE_KEYS.USER_STATUS, callData.user2Id);

  await pipeline.exec();
}

export default getRedisClient;
