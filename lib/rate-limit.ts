import { Redis } from "@upstash/redis";

// Daily message limit per user
export const DAILY_MESSAGE_LIMIT = 20;

// Redis client (uses KV_REST_API_URL and KV_REST_API_TOKEN from env)
const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

/**
 * Get the Redis key for a user's daily message count
 * Key expires at midnight UTC
 */
function getDailyKey(userId: string): string {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  return `ratelimit:daily:${userId}:${today}`;
}

/**
 * Get seconds until midnight UTC (for key expiration)
 */
function getSecondsUntilMidnight(): number {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setUTCHours(24, 0, 0, 0);
  return Math.floor((midnight.getTime() - now.getTime()) / 1000);
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetInSeconds: number;
}

/**
 * Check and increment the user's daily message count
 * Returns whether the message is allowed and remaining quota
 */
export async function checkRateLimit(userId: string): Promise<RateLimitResult> {
  const key = getDailyKey(userId);
  const resetInSeconds = getSecondsUntilMidnight();

  try {
    // Get current count
    const currentCount = (await redis.get<number>(key)) ?? 0;

    if (currentCount >= DAILY_MESSAGE_LIMIT) {
      return {
        allowed: false,
        remaining: 0,
        limit: DAILY_MESSAGE_LIMIT,
        resetInSeconds,
      };
    }

    // Increment count with expiration
    await redis.incr(key);
    // Set expiration if this is the first message today
    if (currentCount === 0) {
      await redis.expire(key, resetInSeconds);
    }

    return {
      allowed: true,
      remaining: DAILY_MESSAGE_LIMIT - currentCount - 1,
      limit: DAILY_MESSAGE_LIMIT,
      resetInSeconds,
    };
  } catch (error) {
    console.error("[TaxBot] Rate limit check failed:", error);
    // On error, allow the request but log it
    return {
      allowed: true,
      remaining: DAILY_MESSAGE_LIMIT,
      limit: DAILY_MESSAGE_LIMIT,
      resetInSeconds,
    };
  }
}

/**
 * Get remaining messages without incrementing
 */
export async function getRemainingMessages(userId: string): Promise<number> {
  const key = getDailyKey(userId);
  try {
    const currentCount = (await redis.get<number>(key)) ?? 0;
    return Math.max(0, DAILY_MESSAGE_LIMIT - currentCount);
  } catch (error) {
    console.error("[TaxBot] Failed to get remaining messages:", error);
    return DAILY_MESSAGE_LIMIT;
  }
}
