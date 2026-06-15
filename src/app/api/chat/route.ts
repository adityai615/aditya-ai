import { NextResponse } from "next/server";
import { generateAIResponse } from "@/lib/ai/provider";

type ChatRequestBody = {
  message?: string;
};

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

  const response = await generateAIResponse({ message });
  return NextResponse.json({ response });
}
