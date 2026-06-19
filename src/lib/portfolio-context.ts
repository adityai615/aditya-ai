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
  location?: string;
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
  cgpa?: string;
};

export type AchievementItem = {
  title: string;
  subtitle: string;
};

export type QuickStat = {
  label: string;
  value: string;
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
  aboutOverviewExtra: string;
  quickStats: QuickStat[];
};

export const portfolioContext: PortfolioContext = {
  profile: {
    fullName: "Aditya Jain",
    headline: "Freelance Full Stack & AI-Powered Web App Developer",
    summary:
      "Third-year B.Tech Computer Science (AI) student at JECRC Foundation building production-grade web applications, AI voice and chat systems, ecommerce platforms, and automation tools for real clients.",
    location: "Tonk, Rajasthan, India",
    availability: "available",
  },
  experience: [
    {
      role: "Freelance Full Stack & AI-Powered Web App Developer",
      organization: "Independent · Remote",
      period: "June 2025 – Present",
      location: "Remote",
      highlights: [
        "Developed AI-powered communication systems for automated voice and text workflows, reducing manual customer interaction effort by ~70%.",
        "Delivered 5+ freelance projects across ecommerce, AI automation, and business websites.",
        "Built and deployed binkhalid.in and kalakratiimaginations.com — production ecommerce with payments, shipping, email automation, admin dashboards, and order tracking.",
        "Managed end-to-end delivery: deployment, client communication, feature planning, and production support.",
      ],
    },
  ],
  skills: [
    {
      category: "Languages & Frameworks",
      items: [
        "JavaScript",
        "TypeScript",
        "Python",
        "React",
        "Next.js",
        "Node.js",
        "Express.js",
        "FastAPI",
      ],
    },
    {
      category: "Databases & Cloud",
      items: ["MongoDB", "Upstash Redis", "AWS S3", "AWS EC2", "Vercel"],
    },
    {
      category: "AI & APIs",
      items: [
        "Anthropic Claude API",
        "LangChain",
        "FAISS",
        "Groq",
        "Gemini API",
        "Spotify Web API",
        "Sarvam AI",
      ],
    },
    {
      category: "Tools & Technologies",
      items: ["Git", "Postman", "Cursor", "VS Code", "Tailwind CSS", "LiveKit"],
    },
  ],
  projects: PROJECTS_FOR_AGENT,
  education: [
    {
      institution: "JECRC Foundation",
      degree: "Bachelor of Technology",
      specialization: "Computer Science — Specialisation in AI",
      period: "Sep 2024 – Present",
      location: "Jaipur, Rajasthan",
      cgpa: "7.8",
    },
  ],
  achievements: [
    {
      title: "Placement Cell Member",
      subtitle:
        "JECRC Foundation — coordinated outreach and operations for placement initiatives and student engagement.",
    },
    {
      title: "Best Character Award",
      subtitle: "JECRC Fresher's Party 2024",
    },
    {
      title: "Freelance Projects Delivered",
      subtitle: "5+ client projects across ecommerce, AI, and web",
    },
    {
      title: "Production Deployments",
      subtitle: "Live sites including Kalakrati Imaginations & Aditya OS",
    },
  ],
  contact: {
    primaryChannel: "Portfolio assistant",
    location: "Tonk, Rajasthan, India",
    note: "For collaboration or project discussions, use the contact links in the portfolio.",
  },
  aboutOverviewExtra:
    "Open to freelance work and full-time opportunities. Currently building AI voice CRMs, WhatsApp agents, ecommerce platforms, and interactive product experiences end to end.",
  quickStats: [
    { label: "Projects", value: "6+" },
    { label: "Clients", value: "5+" },
    { label: "Experience", value: "1+ yr" },
    { label: "CGPA", value: "7.8" },
  ],
};
