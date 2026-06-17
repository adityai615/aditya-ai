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
      "Second-year Computer Science student building production-grade web applications, AI systems, automation tools, and scalable digital products.",
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
  projects: [
    {
      name: "Aditya OS",
      category: "Interactive Developer Portfolio",
      description:
        "A custom fictional OS-themed developer portfolio — the very site you're looking at right now. Built as an interactive desktop environment with draggable windows, a live AI agent, real-time Spotify integration, and a global like counter.",
      techStack: [
        "Next.js 14",
        "TypeScript",
        "Tailwind CSS",
        "Gemini API",
        "Upstash Redis",
        "Spotify Web API",
      ],
      keyFeatures: [
        "Working AI assistant that answers visitor questions",
        'Live "Top 50 India" Spotify chart',
        "Multi-tap like system with real-time animations",
        "Fully responsive mobile experience with a separate tab-based navigation layout",
      ],
      businessImpact:
        "Showcases full-stack and AI capabilities through an immersive, production-deployed portfolio visitors can explore interactively.",
    },
    {
      name: "Luminare Voice Labs",
      category: "AI Voice CRM",
      description:
        "Production-focused voice operations platform for outbound AI calling workflows with analytics and control.",
      techStack: ["FastAPI", "LiveKit", "Twilio", "Sarvam AI", "React", "WebSockets"],
      keyFeatures: [
        "JWT-authenticated operator access",
        "Call analytics and session visibility",
        "Real-time call state updates",
        "Prompt and routing control workflows",
      ],
      businessImpact:
        "Reduced manual calling overhead and enabled faster outbound cycles with measurable outcomes.",
    },
    {
      name: "Kalakrati Imaginations",
      category: "Production Ecommerce Platform",
      description:
        "End-to-end ecommerce system with payments, logistics, and post-purchase automation workflows.",
      techStack: ["Next.js", "MongoDB", "Razorpay", "Delhivery", "Cloudinary", "Resend"],
      keyFeatures: [
        "Variant-aware product management",
        "Order state and fulfillment visibility",
        "SEO-oriented page architecture",
        "Transactional messaging automation",
      ],
      businessImpact:
        "Enabled reliable online sales operations with stronger fulfillment coordination and customer communication.",
    },
    {
      name: "Varta AI",
      category: "WhatsApp AI Agent Platform",
      description:
        "Multi-tenant WhatsApp AI platform for contextual assistants, retrieval, and business workflows.",
      techStack: ["FastAPI", "React", "LangChain", "FAISS", "Groq", "Twilio"],
      keyFeatures: [
        "Knowledge base management",
        "Booking and workflow execution",
        "Tenant-scoped conversation controls",
        "Retrieval quality tuning",
      ],
      businessImpact:
        "Accelerated response time for end-users while reducing repetitive support work.",
    },
    {
      name: "3D Product Configurator",
      category: "Interactive 3D Commerce",
      description:
        "Commerce-focused 3D customization system with AI-powered text-to-3D and image-to-3D generation.",
      techStack: ["React Three Fiber", "Node.js", "MongoDB", "AWS", "Tripo3D", "Gemini AI"],
      keyFeatures: [
        "Real-time 3D customization",
        "AI-assisted 3D asset generation",
        "Persisted configuration states",
        "Personalized product visualization",
      ],
      businessImpact:
        "Improved product exploration and enabled high-intent personalization experiences.",
    },
  ],
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
