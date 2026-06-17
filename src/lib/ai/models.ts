export type ChatModelProvider = "gemini" | "groq";

export const CHAT_MODEL_PROVIDERS: ChatModelProvider[] = ["gemini", "groq"];

export const CHAT_MODEL_LABELS: Record<ChatModelProvider, string> = {
  gemini: "Gemini",
  groq: "Groq",
};

export const CHAT_MODEL_STORAGE_KEY = "agent-chat-provider";

export function parseChatModelProvider(value: unknown): ChatModelProvider {
  return value === "groq" ? "groq" : "gemini";
}
