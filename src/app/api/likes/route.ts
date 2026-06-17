import { Redis } from "@upstash/redis";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const LIKES_KEY = "aadios:likes";
const VISITOR_COOKIE = "aadios_visitor_id";
const VISITOR_LIMIT = 100;
const VISITOR_TTL_SECONDS = 60 * 60 * 24;
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

function visitorLikesKey(visitorId: string) {
  return `aadios:likes:${visitorId}`;
}

async function getLikeCount() {
  const count = await redis.get<number>(LIKES_KEY);
  return typeof count === "number" ? count : 0;
}

function attachVisitorCookie(response: NextResponse, visitorId: string) {
  response.cookies.set(VISITOR_COOKIE, visitorId, {
    maxAge: COOKIE_MAX_AGE,
    httpOnly: false,
    sameSite: "lax",
    path: "/",
  });
}

export async function GET() {
  try {
    const count = await getLikeCount();
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ error: "Unable to load like count." }, { status: 500 });
  }
}

export async function POST() {
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
      const count = await getLikeCount();
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
