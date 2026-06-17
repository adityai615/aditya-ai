import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getRedis } from "@/lib/redis";

const LIKES_KEY = "aadios:likes";
const VISITOR_COOKIE = "aadios_visitor_id";
const VISITOR_LIMIT = 100;
const VISITOR_TTL_SECONDS = 60 * 60 * 24;
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function visitorLikesKey(visitorId: string) {
  return `aadios:likes:${visitorId}`;
}

async function getLikeCount(redis: NonNullable<ReturnType<typeof getRedis>>) {
  const count = await redis.get<number>(LIKES_KEY);
  return typeof count === "number" ? count : 0;
}

function attachVisitorCookie(response: NextResponse, visitorId: string) {
  response.cookies.set(VISITOR_COOKIE, visitorId, {
    maxAge: COOKIE_MAX_AGE,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
}

export async function GET() {
  const redis = getRedis();
  if (!redis) {
    return NextResponse.json({ count: 0, unavailable: true });
  }

  try {
    const count = await getLikeCount(redis);
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ error: "Unable to load like count." }, { status: 500 });
  }
}

export async function POST() {
  const redis = getRedis();
  if (!redis) {
    return NextResponse.json({ error: "Like service is not configured." }, { status: 503 });
  }

  try {
    const cookieStore = await cookies();
    let visitorId = cookieStore.get(VISITOR_COOKIE)?.value;
    const isNewVisitor = !visitorId;

    if (!visitorId) {
      visitorId = crypto.randomUUID();
    }

    const perVisitorKey = visitorLikesKey(visitorId);
    const visitorLikes = (await redis.get<number>(perVisitorKey)) ?? 0;

    if (visitorLikes >= VISITOR_LIMIT) {
      const count = await getLikeCount(redis);
      const response = NextResponse.json({ count, rateLimited: true });
      if (isNewVisitor) {
        attachVisitorCookie(response, visitorId);
      }
      return response;
    }

    const count = await redis.incr(LIKES_KEY);
    await redis.incr(perVisitorKey);
    await redis.expire(perVisitorKey, VISITOR_TTL_SECONDS);

    const response = NextResponse.json({ count, rateLimited: false });
    if (isNewVisitor) {
      attachVisitorCookie(response, visitorId);
    }
    return response;
  } catch {
    return NextResponse.json({ error: "Unable to record like." }, { status: 500 });
  }
}
