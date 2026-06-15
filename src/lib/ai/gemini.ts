import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";

const GEMINI_MODEL = "gemini-2.5-flash";

export type GeminiGenerateRequest = {
  message: string;
  systemPrompt: string;
};

function getGeminiModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const google = createGoogleGenerativeAI({ apiKey });
  return google(GEMINI_MODEL);
}

export async function generateWithGemini({
  message,
  systemPrompt,
}: GeminiGenerateRequest): Promise<string> {
  const model = getGeminiModel();
  const result = await generateText({
    model,
    system: systemPrompt,
    prompt: message,
    temperature: 0.3,
  });

  return result.text.trim();
}
