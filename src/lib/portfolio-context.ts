import { PROJECTS_FOR_AGENT } from "@/lib/projects";

export type Profile = {
  fullName: string;
  headline: string;
  summary: string;
  location: string;
  availability: "available" | "limited" | "unavailable";
};

export type ExperienceItem = {
  role: string;
  organization: string;
  period: string;
  highlights: string[];
};

export type SkillCategory = {
  category: string;
  items: string[];
};

export type ProjectItem = {
  name: string;
  category: string;
  description: string;
  techStack: string[];
  keyFeatures: string[];
  businessImpact: string;
};

export type EducationItem = {
  institution: string;
  degree: string;
  specialization: string;
  period: string;
  location: string;
};

export type AchievementItem = {
  title: string;
  subtitle: string;
};

export type ContactInfo = {
  primaryChannel: string;
  location: string;
  note: string;
};

export type PortfolioContext = {
  profile: Profile;
  experience: ExperienceItem[];
  skills: SkillCategory[];
  projects: ProjectItem[];
  education: EducationItem[];
  achievements: AchievementItem[];
  contact: ContactInfo;
};

export const portfolioContext: PortfolioContext = {
  profile: {
    fullName: "Aditya Jain",
    headline: "Full Stack Developer, AI Builder, Freelancer",
    summary:
      "Third-year Computer Science student building production-grade web applications, AI systems, automation tools, and scalable digital products.",
    location: "Jaipur, Rajasthan, India",
    availability: "available",
  },
  experience: [
    {
      role: "Freelance Full Stack and AI Developer",
      organization: "Independent",
      period: "2025 - Present",
      highlights: [
        "Delivered multiple client projects",
        "Built production ecommerce platforms",
        "Developed AI-powered communication systems",
        "Managed deployment and post-launch support",
      ],
    },
  ],
  skills: [
    {
      category: "Frontend",
      items: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    },
    {
      category: "Backend",
      items: ["Node.js", "FastAPI", "Express", "MongoDB", "PostgreSQL"],
    },
    {
      category: "AI",
      items: ["LangChain", "LlamaIndex", "Groq", "FAISS", "Vector Databases"],
    },
    {
      category: "Tools",
      items: ["Git", "GitHub", "Postman", "Vercel", "AWS"],
    },
  ],
  projects: PROJECTS_FOR_AGENT,
  education: [
    {
      institution: "JECRC Foundation",
      degree: "Bachelor of Technology",
      specialization: "Computer Science with AI",
      period: "2024 - Present",
      location: "Jaipur, Rajasthan",
    },
  ],
  achievements: [
    { title: "Best Character Award", subtitle: "JECRC Fresher's Party 2024" },
    { title: "Placement Cell Member", subtitle: "JECRC Foundation" },
    { title: "Freelance Projects Delivered", subtitle: "5+" },
    { title: "Production Deployments", subtitle: "Multiple" },
  ],
  contact: {
    primaryChannel: "Portfolio assistant",
    location: "Jaipur, Rajasthan, India",
    note: "For collaboration or project discussions, use the contact links in the portfolio.",
  },
};
