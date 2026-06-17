/**
 * Single source of truth for portfolio projects.
 * Add or edit projects here only — Projects window and AI agent both read from this file.
 */

import type { ProjectItem } from "@/lib/portfolio-context";
// ProjectItem is a type-only import — no runtime circular dependency.

export type ProjectLinks = {
  github?: string;
  liveDemo?: string;
};

export type ProjectDetails = {
  problem: string;
  architecture: string;
  techStackSummary: string;
  businessImpact: string;
  implementationNotes: string;
};

export type Project = {
  id: string;
  number: string;
  name: string;
  category: string;
  description: string;
  techStack: string[];
  keyFeatures: string[];
  achievements: string[];
  links: ProjectLinks;
  details: ProjectDetails;
};

export const PROJECTS: Project[] = [
  {
    id: "luminare-voice-labs",
    number: "01",
    name: "Luminare Voice Labs",
    category: "AI Voice CRM",
    description:
      "A production-focused voice operations platform built to run outbound AI calling workflows with real-time intelligence, analytics, and control.",
    techStack: ["FastAPI", "LiveKit", "Twilio", "Sarvam AI", "React", "WebSockets"],
    keyFeatures: [
      "JWT-authenticated operator access",
      "Call analytics and session visibility",
      "Real-time call state updates",
      "Prompt + routing control workflows",
    ],
    achievements: [
      "Real outbound AI phone calls",
      "STT → LLM → TTS pipeline",
      "Voice CRM dashboard",
      "WebSocket voice streaming",
    ],
    links: {},
    details: {
      problem:
        "Sales and support teams needed a scalable way to automate high-volume calls without losing context, call quality, or measurable outcomes.",
      architecture:
        "Streaming pipeline architecture with telephony ingress, real-time transcription, LLM orchestration, TTS response generation, and dashboard events over WebSockets.",
      techStackSummary:
        "FastAPI services, LiveKit media transport, Twilio telephony, Sarvam AI models, React operations UI, JWT auth.",
      businessImpact:
        "Reduced manual calling overhead and enabled faster outbound cycles with measurable call outcomes.",
      implementationNotes:
        "Designed for low-latency turn-taking, resilient streaming sessions, and observable event logs for production debugging.",
    },
  },
  {
    id: "kalakrati-imaginations",
    number: "02",
    name: "Kalakrati Imaginations",
    category: "Production Ecommerce Platform",
    description:
      "An end-to-end ecommerce system with reliable payment, logistics, and post-purchase automation flows designed for real commerce operations.",
    techStack: ["Next.js", "MongoDB", "Razorpay", "Delhivery", "Cloudinary", "Resend"],
    keyFeatures: [
      "Variant-aware product management",
      "Order state and fulfillment visibility",
      "SEO-oriented page architecture",
      "Transactional messaging automation",
    ],
    achievements: [
      "Production deployment",
      "Payments and shipping workflows",
      "Admin dashboard",
      "Email automation",
    ],
    links: {},
    details: {
      problem:
        "The business required a production-ready storefront that could support catalog complexity, operational fulfillment, and customer communication at scale.",
      architecture:
        "Server-rendered storefront with API-backed admin workflows, integrated payment state machine, shipping event sync, and media delivery pipeline.",
      techStackSummary:
        "Next.js application layer, MongoDB data model, Razorpay transactions, Delhivery logistics, Cloudinary media pipeline, Resend notification service.",
      businessImpact:
        "Enabled reliable online sales operations with cleaner fulfillment coordination and improved customer lifecycle communication.",
      implementationNotes:
        "Built with production deployment constraints in mind, including payment reliability, content speed, and operational maintainability.",
    },
  },
  {
    id: "varta-ai",
    number: "03",
    name: "Varta AI",
    category: "WhatsApp AI Agent Platform",
    description:
      "A multi-tenant WhatsApp AI platform enabling businesses to run contextual assistants with retrieval, workflows, and managed conversations.",
    techStack: ["FastAPI", "React", "LangChain", "FAISS", "Groq", "Twilio"],
    keyFeatures: [
      "Knowledge base management",
      "Booking and workflow execution",
      "Tenant-scoped conversation controls",
      "Retrieval quality tuning",
    ],
    achievements: [
      "WhatsApp AI assistant",
      "Multi-business support",
      "RAG architecture",
      "Conversation management",
    ],
    links: {},
    details: {
      problem:
        "Businesses needed a deployable assistant channel on WhatsApp that could answer domain questions and execute workflow actions consistently.",
      architecture:
        "Tenant-aware orchestration layer with ingestion and embedding pipeline, FAISS retrieval, LLM response generation, and Twilio message transport.",
      techStackSummary:
        "FastAPI backend services, React control panel, LangChain pipelines, FAISS vector index, Groq inference, Twilio WhatsApp integration.",
      businessImpact:
        "Accelerated response time for end-users while reducing repetitive support work across participating businesses.",
      implementationNotes:
        "Focused on retrieval consistency, workflow predictability, and clear operational controls for non-technical teams.",
    },
  },
  {
    id: "3d-product-configurator",
    number: "04",
    name: "3D Product Configurator",
    category: "Interactive 3D Commerce",
    description:
      "A commerce-grade 3D customization system where users can personalize products and generate 3D assets from text or image inputs.",
    techStack: ["React Three Fiber", "Node.js", "MongoDB", "AWS", "Tripo3D", "Gemini AI"],
    keyFeatures: [
      "Live material and component customization",
      "AI-assisted 3D asset generation",
      "Persisted configuration states",
      "Personalized product visualization",
    ],
    achievements: [
      "Real-time 3D customization",
      "AI-generated models",
      "Text-to-3D and Image-to-3D",
      "Product personalization",
    ],
    links: {},
    details: {
      problem:
        "Modern commerce experiences needed richer product interaction than static imagery, especially for configurable products.",
      architecture:
        "Client-side 3D renderer with backend generation orchestration, asset persistence, and cloud-backed delivery for model variants.",
      techStackSummary:
        "React Three Fiber rendering layer, Node.js services, MongoDB storage, AWS asset hosting, Tripo3D and Gemini AI generation workflows.",
      businessImpact:
        "Improved product exploration depth and enabled high-intent personalization experiences for interactive commerce funnels.",
      implementationNotes:
        "Prioritized render performance, predictable asset handling, and structured generation pipelines for scalable feature growth.",
    },
  },
  {
    id: "aditya-os",
    number: "05",
    name: "Aditya OS",
    category: "Interactive Developer Portfolio",
    description:
      "A custom fictional OS-themed developer portfolio — the very site you're looking at right now. Built as an interactive desktop environment with draggable windows, a live AI agent, real-time Spotify integration, and a global like counter.",
    techStack: [
      "Next.js 16",
      "TypeScript",
      "Tailwind CSS",
      "Gemini API",
      "Groq API",
      "Upstash Redis",
      "Spotify Web API",
    ],
    keyFeatures: [
      "Working AI assistant (Gemini + Groq with automatic fallback)",
      'Live "Top 50 India" Spotify chart',
      "Multi-tap like system with real-time animations",
      "Fully responsive mobile experience with a separate tab-based navigation layout",
    ],
    achievements: [
      "Working AI assistant (Gemini + Groq)",
      'Live "Top 50 India" Spotify chart',
      "Multi-tap like system with real-time animations",
      "Fully responsive mobile tab-based navigation",
    ],
    links: {},
    details: {
      problem:
        "A traditional portfolio résumé page couldn't capture the depth of Aditya's full-stack and AI work — visitors needed an engaging, memorable way to explore projects and interact directly.",
      architecture:
        "Next.js app with a desktop-style window manager, server-side API routes for AI chat, Spotify, likes (Upstash Redis), and client-side state for draggable windows and mobile tab navigation.",
      techStackSummary:
        "Next.js 16, TypeScript, Tailwind CSS, Gemini API, Groq API, Upstash Redis for the global like counter, Spotify Web API for live chart data.",
      businessImpact:
        "Delivers an immersive, production-deployed showcase of full-stack and AI capabilities that visitors can explore interactively.",
      implementationNotes:
        "Built as a self-referential meta-project — the portfolio itself is the demo, with real integrations for AI, music, and social engagement.",
    },
  },
];

export function toProjectItem(project: Project): ProjectItem {
  return {
    name: project.name,
    category: project.category,
    description: project.description,
    techStack: project.techStack,
    keyFeatures: project.keyFeatures,
    businessImpact: project.details.businessImpact,
  };
}

export const PROJECTS_FOR_AGENT: ProjectItem[] = PROJECTS.map(toProjectItem);
