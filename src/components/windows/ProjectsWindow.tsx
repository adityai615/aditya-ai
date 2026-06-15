"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

type Project = {
  id: string;
  number: string;
  name: string;
  category: string;
  description: string;
  tech: string[];
  achievements: string[];
  links: {
    github?: string;
    liveDemo?: string;
  };
  details: {
    problem: string;
    architecture: string;
    techStack: string;
    keyFeatures: string[];
    businessImpact: string;
    implementationNotes: string;
  };
};

const projects: Project[] = [
  {
    id: "luminare-voice-labs",
    number: "01",
    name: "Luminare Voice Labs",
    category: "AI Voice CRM",
    description:
      "A production-focused voice operations platform built to run outbound AI calling workflows with real-time intelligence, analytics, and control.",
    tech: ["FastAPI", "LiveKit", "Twilio", "Sarvam AI", "React", "WebSockets"],
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
      techStack:
        "FastAPI services, LiveKit media transport, Twilio telephony, Sarvam AI models, React operations UI, JWT auth.",
      keyFeatures: [
        "JWT-authenticated operator access",
        "Call analytics and session visibility",
        "Real-time call state updates",
        "Prompt + routing control workflows",
      ],
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
    tech: ["Next.js", "MongoDB", "Razorpay", "Delhivery", "Cloudinary", "Resend"],
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
      techStack:
        "Next.js application layer, MongoDB data model, Razorpay transactions, Delhivery logistics, Cloudinary media pipeline, Resend notification service.",
      keyFeatures: [
        "Variant-aware product management",
        "Order state and fulfillment visibility",
        "SEO-oriented page architecture",
        "Transactional messaging automation",
      ],
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
    tech: ["FastAPI", "React", "LangChain", "FAISS", "Groq", "Twilio"],
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
      techStack:
        "FastAPI backend services, React control panel, LangChain pipelines, FAISS vector index, Groq inference, Twilio WhatsApp integration.",
      keyFeatures: [
        "Knowledge base management",
        "Booking and workflow execution",
        "Tenant-scoped conversation controls",
        "Retrieval quality tuning",
      ],
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
    tech: [
      "React Three Fiber",
      "Node.js",
      "MongoDB",
      "AWS",
      "Tripo3D",
      "Gemini AI",
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
      techStack:
        "React Three Fiber rendering layer, Node.js services, MongoDB storage, AWS asset hosting, Tripo3D and Gemini AI generation workflows.",
      keyFeatures: [
        "Live material and component customization",
        "AI-assisted 3D asset generation",
        "Persisted configuration states",
        "Personalized product visualization",
      ],
      businessImpact:
        "Improved product exploration depth and enabled high-intent personalization experiences for interactive commerce funnels.",
      implementationNotes:
        "Prioritized render performance, predictable asset handling, and structured generation pipelines for scalable feature growth.",
    },
  },
];

export function ProjectsWindow() {
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);

  return (
    <div className="h-full overflow-auto px-6 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto w-full max-w-[1100px]">
        <div className="border-b-[0.5px] border-[var(--os-border)] pb-8">
          <p className="text-label uppercase tracking-[0.08em] text-[var(--os-text-muted)]">
            featured projects
          </p>
          <p className="text-ui mt-4 max-w-[760px] text-[var(--os-text-muted)]">
            A collection of production-grade applications spanning AI systems,
            voice technology, ecommerce infrastructure, and automation
            platforms.
          </p>
        </div>

        <div className="divide-y-[0.5px] divide-[var(--os-border)]">
          {projects.map((project) => {
            const isExpanded = expandedProjectId === project.id;

            return (
              <section
                key={project.id}
                className="group py-8 transition-colors duration-150 hover:bg-[var(--os-hover)]/40 sm:py-10"
              >
                <div className="grid gap-6 lg:grid-cols-[88px_minmax(0,1fr)_220px] lg:gap-8">
                  <div className="text-[32px] leading-none font-semibold tracking-[-0.03em] text-[var(--os-text-muted)]">
                    {project.number}
                  </div>

                  <div>
                    <p className="text-label uppercase tracking-[0.08em] text-[var(--os-text-muted)]">
                      {project.category}
                    </p>
                    <h3 className="mt-2 text-[30px] leading-[1.05] font-semibold tracking-[-0.03em] text-[var(--os-text)]">
                      {project.name}
                    </h3>
                    <p className="text-ui mt-4 max-w-[650px] leading-relaxed text-[var(--os-text-muted)]">
                      {project.description}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {project.tech.map((techItem) => (
                        <span
                          key={techItem}
                          className="text-ui rounded-md border-[0.5px] border-[var(--os-border)] bg-[var(--os-surface)] px-3 py-1 text-[13px] text-[var(--os-text-muted)]"
                        >
                          {techItem}
                        </span>
                      ))}
                    </div>

                    <ul className="mt-5 space-y-2">
                      {project.achievements.map((achievement) => (
                        <li
                          key={achievement}
                          className="text-ui flex items-start gap-2 text-[var(--os-text-muted)]"
                        >
                          <span className="mt-0.5 text-[var(--os-text)]">✓</span>
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-start lg:justify-end">
                    <div className="flex flex-wrap gap-2 lg:justify-end">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedProjectId(isExpanded ? null : project.id)
                        }
                        className="text-ui rounded-md border-[0.5px] border-[var(--os-border)] bg-[var(--os-surface)] px-3 py-2 text-sm font-medium text-[var(--os-text)] transition-colors duration-150 hover:bg-[var(--os-hover)]"
                      >
                        {isExpanded ? "Hide Details" : "View Details"}
                      </button>

                      {project.links.github ? (
                        <a
                          href={project.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-ui rounded-md border-[0.5px] border-[var(--os-border)] bg-[var(--os-surface)] px-3 py-2 text-sm font-medium text-[var(--os-text)] transition-colors duration-150 hover:bg-[var(--os-hover)]"
                        >
                          GitHub
                        </a>
                      ) : null}

                      {project.links.liveDemo ? (
                        <a
                          href={project.links.liveDemo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-ui rounded-md border-[0.5px] border-[var(--os-border)] bg-[var(--os-surface)] px-3 py-2 text-sm font-medium text-[var(--os-text)] transition-colors duration-150 hover:bg-[var(--os-hover)]"
                        >
                          Live Demo
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>

                <AnimatePresence initial={false}>
                  {isExpanded ? (
                    <motion.div
                      key={`${project.id}-details`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <div className="mt-7 border-t-[0.5px] border-[var(--os-border)] pt-6">
                        <div className="grid gap-5 sm:grid-cols-2">
                          <div>
                            <p className="text-label text-[var(--os-text-muted)]">
                              Problem
                            </p>
                            <p className="text-ui mt-2 text-[var(--os-text-muted)]">
                              {project.details.problem}
                            </p>
                          </div>
                          <div>
                            <p className="text-label text-[var(--os-text-muted)]">
                              Architecture
                            </p>
                            <p className="text-ui mt-2 text-[var(--os-text-muted)]">
                              {project.details.architecture}
                            </p>
                          </div>
                          <div>
                            <p className="text-label text-[var(--os-text-muted)]">
                              Tech Stack
                            </p>
                            <p className="text-ui mt-2 text-[var(--os-text-muted)]">
                              {project.details.techStack}
                            </p>
                          </div>
                          <div>
                            <p className="text-label text-[var(--os-text-muted)]">
                              Business Impact
                            </p>
                            <p className="text-ui mt-2 text-[var(--os-text-muted)]">
                              {project.details.businessImpact}
                            </p>
                          </div>
                        </div>

                        <div className="mt-5">
                          <p className="text-label text-[var(--os-text-muted)]">
                            Key Features
                          </p>
                          <ul className="mt-2 space-y-1.5">
                            {project.details.keyFeatures.map((feature) => (
                              <li
                                key={feature}
                                className="text-ui flex items-start gap-2 text-[var(--os-text-muted)]"
                              >
                                <span className="mt-0.5 text-[var(--os-text)]">
                                  •
                                </span>
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-5">
                          <p className="text-label text-[var(--os-text-muted)]">
                            Implementation Notes
                          </p>
                          <p className="text-ui mt-2 text-[var(--os-text-muted)]">
                            {project.details.implementationNotes}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </section>
            );
          })}
        </div>

        <p className="text-label mt-8 text-center text-[var(--os-text-muted)]">
          More projects available upon request.
        </p>
      </div>
    </div>
  );
}
