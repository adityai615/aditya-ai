import { generateWithGemini } from "@/lib/ai/gemini";
import { generateWithGroq } from "@/lib/ai/groq";
import type { ChatTurn } from "@/lib/ai/chat-types";
import { type ChatModelProvider, parseChatModelProvider } from "@/lib/ai/models";
import { buildSystemPrompt, type BuildSystemPromptOptions } from "@/lib/ai/systemPrompt";

export type { ChatModelProvider } from "@/lib/ai/models";
export type { ChatTurn } from "@/lib/ai/chat-types";

function isProviderConfigured(provider: ChatModelProvider) {
  if (provider === "gemini") {
    return Boolean(process.env.GEMINI_API_KEY?.trim());
  }
  return Boolean(process.env.GROQ_API_KEY?.trim());
}

function getFallbackProvider(provider: ChatModelProvider): ChatModelProvider {
  return provider === "gemini" ? "groq" : "gemini";
}

async function generateWithProvider(
  provider: ChatModelProvider,
  messages: ChatTurn[],
  systemPrompt: string,
) {
  if (provider === "groq") {
    return generateWithGroq({ messages, systemPrompt });
  }
  return generateWithGemini({ messages, systemPrompt });
}

export type VisitorContextPayload = {
  browser: string;
  os: string;
  screenWidth: number;
};

type GenerateResponseInput = {
  messages: ChatTurn[];
  provider?: unknown;
  visitor?: VisitorContextPayload;
  /** When true, system prompt includes first-message-only browser/OS roast guidance. */
  isFirstMessageInConversation?: boolean;
};

export type GenerateAIResponseResult = {
  response: string;
  /** True when the model ran with first-message roast instructions (client should mark roast consumed). */
  consumeFirstMessageRoast: boolean;
};

async function runWithProviderFallback(
  preferredProvider: ChatModelProvider,
  messages: ChatTurn[],
  systemPromptOptions?: BuildSystemPromptOptions,
) {
  const systemPrompt = buildSystemPrompt(systemPromptOptions);
  const fallbackProvider = getFallbackProvider(preferredProvider);
  const attemptOrder = [preferredProvider, fallbackProvider].filter(
    (provider, index, list) => isProviderConfigured(provider) && list.indexOf(provider) === index,
  );

  if (attemptOrder.length === 0) {
    throw new Error("No AI providers are configured");
  }

  let lastError: unknown;

  for (const provider of attemptOrder) {
    try {
      return await generateWithProvider(provider, messages, systemPrompt);
    } catch (error) {
      lastError = error;
      console.error(`[chat] ${provider} provider failed:`, error);
    }
  }

  throw lastError ?? new Error("All AI providers failed");
}

export async function generateAIResponse({
  messages,
  provider,
  visitor,
  isFirstMessageInConversation,
}: GenerateResponseInput): Promise<GenerateAIResponseResult> {
  const preferredProvider = parseChatModelProvider(provider);
  const visitorInfoLine = visitor
    ? `Browser=${visitor.browser}, OS=${visitor.os}, ScreenWidth=${visitor.screenWidth}px`
    : undefined;

  const includeFirstMessageRoastInstructions =
    Boolean(isFirstMessageInConversation) && Boolean(visitorInfoLine);

  const systemPromptOptions: BuildSystemPromptOptions = {
    ...(visitorInfoLine ? { visitorInfoLine } : {}),
    includeFirstMessageRoastInstructions,
  };

  try {
    const response = await runWithProviderFallback(
      preferredProvider,
      messages,
      systemPromptOptions,
    );
    return {
      response,
      consumeFirstMessageRoast: includeFirstMessageRoastInstructions,
    };
  } catch {
    return {
      response:
        "I am having trouble answering right now. Please try again in a moment with a portfolio-related question.",
      consumeFirstMessageRoast: false,
    };
  }
}
