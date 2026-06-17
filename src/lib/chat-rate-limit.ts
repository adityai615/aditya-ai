import { getRedis } from "@/lib/redis";

const CHAT_RATE_LIMIT = 30;
const CHAT_RATE_WINDOW_SECONDS = 60 * 60;

export type ChatRateLimitResult = {
  allowed: boolean;
  remaining: number;
};

export function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

export async function checkChatRateLimit(ip: string): Promise<ChatRateLimitResult> {
  const redis = getRedis();
  if (!redis) {
    return { allowed: true, remaining: CHAT_RATE_LIMIT };
  }

  const key = `aadios:chat:rate:${ip}`;
  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, CHAT_RATE_WINDOW_SECONDS);
  }

  const remaining = Math.max(0, CHAT_RATE_LIMIT - count);
  return {
    allowed: count <= CHAT_RATE_LIMIT,
    remaining,
  };
}
