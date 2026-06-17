import { generateWithGemini } from "@/lib/ai/gemini";
import { buildSystemPrompt, type BuildSystemPromptOptions } from "@/lib/ai/systemPrompt";
import { portfolioContext } from "@/lib/portfolio-context";

export type AIProviderName = "gemini" | "claude" | "openai" | "openrouter";

const ACTIVE_PROVIDER: AIProviderName = "gemini";

const FALLBACK_SCOPE_MESSAGE =
  "I'm just here to talk about Aditya's work — ask me about his projects, skills, or whether he's available to hire!";

function getPortfolioKeywords() {
  const skillKeywords = portfolioContext.skills.flatMap((group) => group.items);
  const projectKeywords = portfolioContext.projects.flatMap((project) => [
    project.name,
    project.category,
    ...project.techStack,
    ...project.keyFeatures,
  ]);
  const experienceKeywords = portfolioContext.experience.flatMap((item) => [
    item.role,
    item.organization,
    ...item.highlights,
  ]);

  return new Set(
    [
      "aditya",
      "portfolio",
      "project",
      "projects",
      "experience",
      "skills",
      "education",
      "achievement",
      "achievements",
      "contact",
      "freelance",
      "freelancer",
      ...skillKeywords,
      ...projectKeywords,
      ...experienceKeywords,
      portfolioContext.profile.fullName,
      portfolioContext.profile.headline,
      portfolioContext.profile.location,
    ]
      .map((keyword) => keyword.toLowerCase().trim())
      .filter(Boolean),
  );
}

const portfolioKeywords = getPortfolioKeywords();

function isPortfolioQuestion(message: string) {
  const normalized = message.toLowerCase();
  if (!normalized.trim()) {
    return false;
  }

  const greetings = ["hi", "hello", "hey", "namaste"];
  if (greetings.some((greeting) => normalized === greeting)) {
    return true;
  }

  for (const keyword of portfolioKeywords) {
    if (normalized.includes(keyword)) {
      return true;
    }
  }

  return false;
}

export type VisitorContextPayload = {
  browser: string;
  os: string;
  screenWidth: number;
};

type GenerateResponseInput = {
  message: string;
  visitor?: VisitorContextPayload;
  /** When true, system prompt includes first-message-only browser/OS roast guidance. */
  isFirstMessageInConversation?: boolean;
};

export type GenerateAIResponseResult = {
  response: string;
  /** True when the model ran with first-message roast instructions (client should mark roast consumed). */
  consumeFirstMessageRoast: boolean;
};

async function runActiveProvider(
  message: string,
  systemPromptOptions?: BuildSystemPromptOptions,
) {
  const systemPrompt = buildSystemPrompt(systemPromptOptions);

  switch (ACTIVE_PROVIDER) {
    case "gemini":
      return generateWithGemini({ message, systemPrompt });
    case "claude":
    case "openai":
    case "openrouter":
      throw new Error(`${ACTIVE_PROVIDER} provider is not implemented yet`);
    default:
      throw new Error("Unsupported AI provider");
  }
}

export async function generateAIResponse({
  message,
  visitor,
  isFirstMessageInConversation,
}: GenerateResponseInput): Promise<GenerateAIResponseResult> {
  const visitorInfoLine = visitor
    ? `Browser=${visitor.browser}, OS=${visitor.os}, ScreenWidth=${visitor.screenWidth}px`
    : undefined;

  const includeFirstMessageRoastInstructions =
    Boolean(isFirstMessageInConversation) && Boolean(visitorInfoLine);

  const systemPromptOptions: BuildSystemPromptOptions = {
    ...(visitorInfoLine ? { visitorInfoLine } : {}),
    includeFirstMessageRoastInstructions,
  };

  if (!isPortfolioQuestion(message)) {
    return { response: FALLBACK_SCOPE_MESSAGE, consumeFirstMessageRoast: false };
  }

  try {
    const response = await runActiveProvider(message, systemPromptOptions);
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
