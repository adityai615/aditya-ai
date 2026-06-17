import { NextResponse } from "next/server";
import { parseChatTurns } from "@/lib/ai/chat-types";
import { generateAIResponse, type VisitorContextPayload } from "@/lib/ai/provider";
import { parseChatModelProvider } from "@/lib/ai/models";
import { checkChatRateLimit, getClientIp } from "@/lib/chat-rate-limit";

type ChatRequestBody = {
  message?: string;
  messages?: unknown;
  provider?: unknown;
  visitor?: unknown;
  isFirstMessageInConversation?: unknown;
};

function parseVisitorPayload(input: unknown): VisitorContextPayload | undefined {
  if (input === undefined || input === null) {
    return undefined;
  }
  if (typeof input !== "object") {
    return undefined;
  }
  const record = input as Record<string, unknown>;
  const browser =
    typeof record.browser === "string" ? record.browser.trim().slice(0, 48) : "Other";
  const os = typeof record.os === "string" ? record.os.trim().slice(0, 48) : "Other";
  const rawWidth = record.screenWidth;
  const screenWidth =
    typeof rawWidth === "number" && Number.isFinite(rawWidth)
      ? Math.max(0, Math.min(32768, Math.round(rawWidth)))
      : 0;
  return { browser: browser || "Other", os: os || "Other", screenWidth };
}

export async function POST(request: Request) {
  let body: ChatRequestBody;

  try {
    body = (await request.json()) as ChatRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsedMessages = parseChatTurns(body.messages);
  if (!parsedMessages) {
    return NextResponse.json(
      { error: "`messages` must be a non-empty array ending with a user turn" },
      { status: 400 },
    );
  }

  const clientIp = getClientIp(request);

  try {
    const rateLimit = await checkChatRateLimit(clientIp);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "Too many requests. Please wait a bit before sending more messages.",
          rateLimited: true,
        },
        { status: 429 },
      );
    }
  } catch {
    // Allow chat if rate-limit storage is temporarily unavailable.
  }

  const visitor = parseVisitorPayload(body.visitor);
  const isFirstMessageInConversation = body.isFirstMessageInConversation === true;
  const provider = parseChatModelProvider(body.provider);

  const result = await generateAIResponse({
    messages: parsedMessages,
    provider,
    visitor,
    isFirstMessageInConversation,
  });
  return NextResponse.json(result);
}
