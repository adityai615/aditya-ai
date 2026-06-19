/**
 * Single source of truth for portfolio projects.
 * Add or edit projects here only — Projects window and AI agent both read from this file.
 */

import type { ProjectItem } from "@/lib/portfolio-context";

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
    id: "luminare-ai",
    number: "01",
    name: "Luminare AI",
    category: "AI Voice CRM",
    description:
      "AI-powered outbound voice agent for hotel relationship management — automated PSTN calls with real-time STT, LLM reasoning, and TTS, plus a JWT-protected operator dashboard.",
    techStack: [
      "FastAPI",
      "LiveKit",
      "Twilio SIP",
      "Sarvam AI",
      "React",
      "WebSockets",
      "SQLAlchemy",
    ],
    keyFeatures: [
      "Outbound AI voice calls via Twilio SIP → LiveKit → agent worker",
      "Sarvam STT → LLM → TTS pipeline with think-tag stripping",
      "Browser Voice Labs demo over WebSocket (PCM16 + MPEG playback)",
      "Churn risk analysis and tiered loyalty discount workflows",
    ],
    achievements: [
      "Real outbound PSTN AI phone calls",
      "Multilingual en-IN / hi-IN voice support",
      "JWT-secured REST + WebSocket APIs",
      "Call recording and admin dashboard",
    ],
    links: {
      github: "https://github.com/LUMINARE-AI/Conversation-AI-Hotel-RM",
    },
    details: {
      problem:
        "Hotels needed a scalable way to proactively check in with guests, surface churn risk, and offer loyalty incentives — without losing call quality or operational visibility.",
      architecture:
        "Customer Phone ← PSTN ← Twilio SIP Trunk ← LiveKit Cloud (WebRTC room) ← AI Agent worker (Python). Flow: FastAPI creates room → dispatches agent → places SIP call → caller audio → Sarvam STT → Sarvam LLM → Sarvam TTS → audio back through LiveKit → Twilio → phone. Browser Voice Labs uses WebSocket (/api/v1/stream/web/ws) with the same Sarvam pipeline for in-browser two-way voice.",
      techStackSummary:
        "FastAPI + Uvicorn backend, React 19 + Vite + Tailwind dashboard, LiveKit agents for real-time audio, Twilio SIP for PSTN, Sarvam AI (saaras STT, sarvam-m LLM, bulbul TTS), SQLite/SQLAlchemy persistence.",
      businessImpact:
        "Enabled automated guest relationship calls with personalized loyalty offers and measurable engagement scoring for retention teams.",
      implementationNotes:
        "Built for low-latency turn-taking, goodbye detection with automatic SIP hangup, session limits on browser demos, and robust handling of LLM reasoning output.",
    },
  },
  {
    id: "kalakrati-imaginations",
    number: "02",
    name: "Kalakrati Imaginations",
    category: "Production Ecommerce Platform",
    description:
      "A live gifting and ecommerce storefront for curated hampers, festive decor, and wedding collections — with payments, shipping, admin ops, and transactional email automation.",
    techStack: ["Next.js", "MongoDB", "Razorpay", "Delhivery", "Cloudinary", "Resend"],
    keyFeatures: [
      "Variant-aware catalog and category navigation",
      "Razorpay checkout with order state tracking",
      "Delhivery fulfillment and delivery ETA flows",
      "SEO-oriented pages and Resend email automation",
    ],
    achievements: [
      "Production deployment at kalakratiimaginations.com",
      "Payments and shipping workflows",
      "Admin dashboard",
      "Email automation",
    ],
    links: {
      liveDemo: "https://www.kalakratiimaginations.com/",
    },
    details: {
      problem:
        "The business required a production-ready storefront that could support catalog complexity, operational fulfillment, and customer communication at scale.",
      architecture:
        "Next.js server-rendered storefront → MongoDB product/order data → Razorpay payment state machine → Delhivery logistics sync → Cloudinary media CDN → Resend for transactional email. Admin workflows run on the same API layer for catalog, orders, and fulfillment visibility.",
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
      "Multi-tenant WhatsApp AI platform where businesses connect via Twilio, upload knowledge bases, and run LangChain-powered assistants with RAG, booking flows, and conversation logs.",
    techStack: ["FastAPI", "React", "LangChain", "FAISS", "Chroma", "Groq", "Twilio"],
    keyFeatures: [
      "Twilio WhatsApp webhook with TwiML responses",
      "RAG over per-tenant business.txt via FAISS + Chroma",
      "Multi-business SaaS dashboard with KB upload and chat logs",
      "Live in-browser WhatsApp simulation before going live",
    ],
    achievements: [
      "WhatsApp AI assistant",
      "Multi-business support",
      "RAG architecture",
      "Conversation management",
    ],
    links: {
      github: "https://github.com/adityai615/varta-ai-whatsapp-agent",
    },
    details: {
      problem:
        "Businesses needed a deployable assistant channel on WhatsApp that could answer domain questions and execute workflow actions consistently.",
      architecture:
        "User → WhatsApp → Twilio → FastAPI webhook → LangChain agent → RAG (FAISS/Chroma over uploaded KB) → Groq LLM → TwiML XML response → Twilio → WhatsApp. React dashboard manages tenants, KB upload/edit, and message history over the same REST API.",
      techStackSummary:
        "FastAPI backend services, React + Vite control panel, LangChain pipelines, FAISS vector index + Chroma runtime, Groq inference, Twilio WhatsApp integration, SQLite/PostgreSQL.",
      businessImpact:
        "Accelerated response time for end-users while reducing repetitive support work across participating businesses.",
      implementationNotes:
        "Focused on retrieval consistency, workflow predictability, TwiML-safe output escaping, and clear operational controls for non-technical teams.",
    },
  },
  {
    id: "3d-product-configurator",
    number: "04",
    name: "3D Product Configurator",
    category: "Interactive 3D Commerce",
    description:
      "Commerce-grade 3D customization system where users personalize products in the browser and generate 3D assets from text or image inputs via AI pipelines.",
    techStack: ["React Three Fiber", "Node.js", "MongoDB", "AWS", "Tripo3D", "Gemini AI"],
    keyFeatures: [
      "Live material and component customization in WebGL",
      "AI-assisted text-to-3D and image-to-3D generation",
      "Persisted configuration states across sessions",
      "Split Frontend / Backend architecture for scalable asset handling",
    ],
    achievements: [
      "Real-time 3D customization",
      "AI-generated models",
      "Text-to-3D and Image-to-3D",
      "Product personalization",
    ],
    links: {
      github: "https://github.com/LUMINARE-AI/3D-product-configurator",
    },
    details: {
      problem:
        "Modern commerce experiences needed richer product interaction than static imagery, especially for configurable products.",
      architecture:
        "React Three Fiber client renderer for live 3D preview and customization → Node.js backend orchestrates Tripo3D and Gemini AI generation jobs → MongoDB stores product configs → AWS hosts and delivers generated model assets to the storefront.",
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
      "A custom fictional OS-themed developer portfolio — the very site you're looking at right now. Draggable windows, live AI assistant, Spotify chart, and a global like counter.",
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
      "Fully responsive mobile experience with tab-based navigation",
    ],
    achievements: [
      "Production deployment on Vercel",
      "Multi-turn AI chat with rate limiting",
      "Live Spotify + GitHub API integrations",
      "Desktop and mobile shell layouts",
    ],
    links: {
      github: "https://github.com/adityai615/adityaos",
      liveDemo: "https://adityajain-os.vercel.app/",
    },
    details: {
      problem:
        "A traditional portfolio résumé page couldn't capture the depth of Aditya's full-stack and AI work — visitors needed an engaging, memorable way to explore projects and interact directly.",
      architecture:
        "Next.js App Router shell (Desktop + MobileTabBar) → per-app window components → API routes (/api/chat, /api/likes, /api/spotify, /api/github, /api/wallpapers). AI chat uses Vercel AI SDK with Gemini/Groq fallback; likes and rate limits on Upstash Redis; portfolio knowledge synced from src/lib/projects.ts.",
      techStackSummary:
        "Next.js 16, TypeScript, Tailwind CSS, Gemini API, Groq API, Upstash Redis for likes + chat rate limits, Spotify Web API for live chart data.",
      businessImpact:
        "Delivers an immersive, production-deployed showcase of full-stack and AI capabilities that visitors can explore interactively.",
      implementationNotes:
        "Built as a self-referential meta-project — the portfolio itself is the demo, with real integrations for AI, music, and social engagement.",
    },
  },
  {
    id: "flysmart",
    number: "06",
    name: "FlySmart",
    category: "Flight Data Automation",
    description:
      "Python scraper that collects multi-route flight data from MakeMyTrip in one browser session, deduplicates results, and exports a unified master CSV for analysis.",
    techStack: ["Python", "Selenium", "undetected-chromedriver", "pandas", "ChromeDriver"],
    keyFeatures: [
      "Multi-route scraping in a single browser session",
      "undetected_chromedriver for reduced fingerprinting",
      "React/overlay-aware clicks with explicit waits and JS fallbacks",
      "Deduplicated CSV export with search_origin / search_destination tags",
    ],
    achievements: [
      "Multi-city route batching",
      "MakeMyTrip classic search automation",
      "Stale-element resilient card parsing",
      "Master CSV at data/all_flights.csv",
    ],
    links: {
      github: "https://github.com/adityai615/FlySmart",
    },
    details: {
      problem:
        "Comparing fares across multiple city pairs manually on MakeMyTrip was slow and error-prone — a repeatable scraper was needed to merge route results into one dataset.",
      architecture:
        "main.py loops routes from routes.py → BrowserManager starts undetected Chrome → FlightScraper navigates MakeMyTrip (classic search, city autocomplete, date pick) → scrolls listings and parses cards via MakeMyTripSelectors → utils tags rows with route metadata → pandas merges deduplicated rows into data/all_flights.csv.",
      techStackSummary:
        "Python 3.10+, undetected_chromedriver, Selenium ActionChains/JS click fallbacks, modular scraper/ package (browser_manager, flight_scraper, selectors, utils), pandas CSV export.",
      businessImpact:
        "Automated fare collection across routes for personal analysis and learning workflows without manual copy-paste.",
      implementationNotes:
        "Tuned timeouts for multi-route sessions (form_timeout, results_timeout), city name normalization via CITY_MAPPING, and safe WebDriver teardown on Windows.",
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

export function projectHasLinks(links: ProjectLinks) {
  return Boolean(links.github || links.liveDemo);
}
