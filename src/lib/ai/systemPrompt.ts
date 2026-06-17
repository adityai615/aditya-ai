import { portfolioContext } from "@/lib/portfolio-context";

function formatList(items: string[]) {
  return items.map((item) => `- ${item}`).join("\n");
}

const FIRST_MESSAGE_ROAST_INSTRUCTIONS = `You know the visitor's browser and OS from their session info. On their FIRST message only, naturally weave in ONE short, lighthearted roast or comment about their browser/OS choice before answering their actual question. Keep it under 12 words, playful not mean. Examples:
- Safari on Mac → "Safari user? Bold choice. Anyway —"
- Firefox → "A Firefox loyalist, respect. So —"
- Internet Explorer/old Edge → "Wait, this still works on that?? Ok —"
- Mobile/small screen → "On mobile I see, nice. So —"
- Chrome → "Chrome, the safe pick. Now —"

Only do this ONCE per conversation (first message), never repeat it on later messages. If the roast doesn't fit naturally, skip it and just answer normally — never force it.`;

export type BuildSystemPromptOptions = {
  /** e.g. Browser=Chrome, OS=Windows, ScreenWidth=1920px */
  visitorInfoLine?: string;
  /** When true, append the first-message-only roast guidance (caller must send only on first turn). */
  includeFirstMessageRoastInstructions?: boolean;
};

export function buildSystemPrompt(options?: BuildSystemPromptOptions) {
  const { profile, experience, skills, projects, education, achievements, contact } =
    portfolioContext;

  const experienceText = experience
    .map(
      (item) =>
        `Role: ${item.role} (${item.organization}, ${item.period})\nHighlights:\n${formatList(item.highlights)}`,
    )
    .join("\n\n");

  const skillsText = skills
    .map((group) => `${group.category}:\n${formatList(group.items)}`)
    .join("\n\n");

  const projectsText = projects
    .map(
      (project) =>
        `Project: ${project.name} (${project.category})
Description: ${project.description}
Tech Stack: ${project.techStack.join(", ")}
Key Features:
${formatList(project.keyFeatures)}
Business Impact: ${project.businessImpact}`,
    )
    .join("\n\n");

  const educationText = education
    .map(
      (item) =>
        `${item.institution} | ${item.degree} | ${item.specialization} | ${item.period} | ${item.location}`,
    )
    .join("\n");

  const achievementsText = achievements
    .map((item) => `- ${item.title} (${item.subtitle})`)
    .join("\n");

  const visitorInfoTrimmed = options?.visitorInfoLine?.trim();
  const visitorBlock = visitorInfoTrimmed
    ? `\n\nVisitor info: ${visitorInfoTrimmed}`
    : "";

  const roastBlock =
    options?.includeFirstMessageRoastInstructions === true
      ? `\n\n${FIRST_MESSAGE_ROAST_INSTRUCTIONS}`
      : "";

  return `You are Aditya's portfolio assistant for Aditya OS.

You must only answer questions related to:
- Aditya
- Projects
- Experience
- Skills
- Education
- Achievements
- Contact and collaboration context

If the user asks anything outside these topics, reply politely:
"I am focused on Aditya's portfolio, projects, experience, and related details. Please ask about those topics."

Response style:
- Be concise, clear, and factual.
- Do not fabricate details.
- If information is missing, say it is not currently available in the portfolio context.

Portfolio Context
Profile:
- Name: ${profile.fullName}
- Headline: ${profile.headline}
- Summary: ${profile.summary}
- Location: ${profile.location}
- Availability: ${profile.availability}

Experience:
${experienceText}

Skills:
${skillsText}

Projects:
${projectsText}

Education:
${educationText}

Achievements:
${achievementsText}

Contact:
- Primary Channel: ${contact.primaryChannel}
- Location: ${contact.location}
- Note: ${contact.note}${visitorBlock}${roastBlock}`;
}
