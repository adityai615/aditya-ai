export type ChatTurn = {
  role: "user" | "assistant";
  content: string;
};

export const MAX_CHAT_TURNS = 24;
export const MAX_CHAT_TURN_LENGTH = 2000;

export function parseChatTurns(input: unknown): ChatTurn[] | null {
  if (!Array.isArray(input)) {
    return null;
  }

  const turns: ChatTurn[] = [];

  for (const item of input) {
    if (typeof item !== "object" || item === null) {
      return null;
    }

    const record = item as Record<string, unknown>;
    const role = record.role;
    const content = typeof record.content === "string" ? record.content.trim() : "";

    if (role !== "user" && role !== "assistant") {
      return null;
    }

    if (!content || content.length > MAX_CHAT_TURN_LENGTH) {
      return null;
    }

    turns.push({ role, content });
  }

  if (turns.length === 0 || turns[turns.length - 1]?.role !== "user") {
    return null;
  }

  return turns.slice(-MAX_CHAT_TURNS);
}
