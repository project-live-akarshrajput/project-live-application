import { Redis } from "@upstash/redis";

// For production with Upstash
export function getUpstashRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    console.warn("Upstash Redis credentials not found");
    return null;
  }

  return new Redis({
    url,
    token,
  });
}

// Helper to check if we're using Upstash
export function isUsingUpstash(): boolean {
  return !!(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  );
}
