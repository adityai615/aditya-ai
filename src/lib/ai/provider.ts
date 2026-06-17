import { generateWithGemini } from "@/lib/ai/gemini";
import { generateWithGroq } from "@/lib/ai/groq";
import { type ChatModelProvider, parseChatModelProvider } from "@/lib/ai/models";
import { buildSystemPrompt, type BuildSystemPromptOptions } from "@/lib/ai/systemPrompt";
import { portfolioContext } from "@/lib/portfolio-context";

export type { ChatModelProvider } from "@/lib/ai/models";

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

  const intentKeywords = [
    "hire",
    "hiring",
    "hired",
    "available",
    "availability",
    "collaborate",
    "collaboration",
    "opportunity",
    "recruit",
    "recruiter",
    "role",
    "position",
    "budget",
    "team",
    "client",
    "stack",
    "college",
    "university",
    "degree",
    "email",
    "linkedin",
    "reach out",
    "work with",
    "work on",
    "looking for",
    "developer",
    "build",
    "built",
    "deliver",
    "delivered",
  ];

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
      ...intentKeywords,
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

const ADITYA_REFERENCE_PATTERN = /\b(him|his|he'?s|he'?d|he)\b/i;

function normalizeSocialMessage(message: string) {
  return message
    .toLowerCase()
    .trim()
    .replace(/[!?.]+$/g, "")
    .replace(/\s+/g, " ");
}

function isGreetingOrSocialMessage(message: string) {
  const normalized = normalizeSocialMessage(message);
  if (!normalized) {
    return false;
  }

  const greetingPatterns = [
    /^(hi+|hello+|hey+|hola|namaste|yo|sup|howdy)$/,
    /^good\s+(morning|afternoon|evening|night)$/,
    /^what'?s\s+up$/,
    /^(hi|hello|hey)\s+there$/,
  ];

  const thanksPatterns = [
    /^thanks?$/,
    /^thank\s+you$/,
    /^thank\s+you\s+so\s+much$/,
    /^thanks?\s+a\s+lot$/,
    /^thx$/,
    /^ty$/,
    /^appreciate\s+it$/,
    /^cheers$/,
    /^much\s+appreciated$/,
  ];

  const farewellPatterns = [
    /^bye+$/,
    /^goodbye$/,
    /^see\s+(ya|you)(\s+later)?$/,
    /^cya$/,
    /^take\s+care$/,
  ];

  return (
    greetingPatterns.some((pattern) => pattern.test(normalized)) ||
    thanksPatterns.some((pattern) => pattern.test(normalized)) ||
    farewellPatterns.some((pattern) => pattern.test(normalized))
  );
}

function isPortfolioQuestion(message: string) {
  const normalized = message.toLowerCase().trim();
  if (!normalized) {
    return false;
  }

  if (isGreetingOrSocialMessage(message)) {
    return true;
  }

  if (ADITYA_REFERENCE_PATTERN.test(message)) {
    return true;
  }

  for (const keyword of portfolioKeywords) {
    if (normalized.includes(keyword)) {
      return true;
    }
  }

  return false;
}

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
  message: string,
  systemPrompt: string,
) {
  if (provider === "groq") {
    return generateWithGroq({ message, systemPrompt });
  }
  return generateWithGemini({ message, systemPrompt });
}

export type VisitorContextPayload = {
  browser: string;
  os: string;
  screenWidth: number;
};

type GenerateResponseInput = {
  message: string;
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
  message: string,
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
      return await generateWithProvider(provider, message, systemPrompt);
    } catch (error) {
      lastError = error;
      console.error(`[chat] ${provider} provider failed:`, error);
    }
  }

  throw lastError ?? new Error("All AI providers failed");
}

export async function generateAIResponse({
  message,
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

  if (!isPortfolioQuestion(message)) {
    return { response: FALLBACK_SCOPE_MESSAGE, consumeFirstMessageRoast: false };
  }

  try {
    const response = await runWithProviderFallback(
      preferredProvider,
      message,
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
