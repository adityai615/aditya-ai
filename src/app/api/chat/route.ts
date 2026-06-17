import { NextResponse } from "next/server";
import { generateAIResponse, type VisitorContextPayload } from "@/lib/ai/provider";

type ChatRequestBody = {
  message?: string;
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

  const message = body.message?.trim();
  if (!message) {
    return NextResponse.json(
      { error: "`message` is required and must be a non-empty string" },
      { status: 400 },
    );
  }

  const visitor = parseVisitorPayload(body.visitor);
  const isFirstMessageInConversation = body.isFirstMessageInConversation === true;

  const result = await generateAIResponse({
    message,
    visitor,
    isFirstMessageInConversation,
  });
  return NextResponse.json(result);
}
