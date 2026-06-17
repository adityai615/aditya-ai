import { createGroq } from "@ai-sdk/groq";
import { generateText } from "ai";

import type { ChatTurn } from "@/lib/ai/chat-types";

const GROQ_MODEL = "llama-3.3-70b-versatile";

export type GroqGenerateRequest = {
  messages: ChatTurn[];
  systemPrompt: string;
};

function getGroqModel() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured");
  }

  const groq = createGroq({ apiKey });
  return groq(GROQ_MODEL);
}

export async function generateWithGroq({
  messages,
  systemPrompt,
}: GroqGenerateRequest): Promise<string> {
  const model = getGroqModel();
  const result = await generateText({
    model,
    system: systemPrompt,
    messages,
    temperature: 0.3,
  });

  return result.text.trim();
}
