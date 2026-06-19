"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Code2, ExternalLink } from "lucide-react";
import { useState } from "react";
import { PROJECTS, projectHasLinks, type Project } from "@/lib/projects";

const linkButtonClass =
  "text-ui inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full border-[0.5px] border-[var(--os-border)] bg-[var(--os-surface)] px-3 py-2 text-[12px] font-medium text-[var(--os-text)] transition-colors duration-150 hover:bg-[var(--os-hover)] sm:min-h-0 sm:justify-start sm:py-1.5";

function ProjectLinks({
  project,
  className = "",
  fullWidthOnMobile = false,
}: {
  project: Project;
  className?: string;
  fullWidthOnMobile?: boolean;
}) {
  if (!projectHasLinks(project.links)) return null;

  return (
    <div
      className={`flex flex-wrap gap-2 ${fullWidthOnMobile ? "max-sm:grid max-sm:grid-cols-2 max-sm:gap-2" : ""} ${className}`}
    >
      {project.links.github ? (
        <a
          href={project.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className={`${linkButtonClass} ${fullWidthOnMobile ? "max-sm:w-full" : ""}`}
        >
          <Code2 size={13} strokeWidth={2} />
          GitHub
        </a>
      ) : null}
      {project.links.liveDemo ? (
        <a
          href={project.links.liveDemo}
          target="_blank"
          rel="noopener noreferrer"
          className={`${linkButtonClass} ${fullWidthOnMobile ? "max-sm:w-full max-sm:col-span-2" : ""}`}
        >
          <ExternalLink size={13} strokeWidth={2} />
          Live Site
        </a>
      ) : null}
    </div>
  );
}

export function ProjectsWindow() {
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);

  return (
    <div className="h-full overflow-auto overscroll-contain px-4 py-5 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <div className="mx-auto w-full max-w-[1100px]">
        <header className="border-b-[0.5px] border-[var(--os-border)] pb-5 sm:pb-8">
          <p className="text-label uppercase tracking-[0.08em] text-[var(--os-text-muted)]">
            featured projects
          </p>
          <p className="text-ui mt-3 text-[13px] leading-relaxed text-[var(--os-text-muted)] sm:mt-4 sm:text-[14px]">
            Production-grade work across AI voice, ecommerce, automation, and
            full-stack products — with GitHub and live links where available.
          </p>
        </header>

        <div className="mt-4 space-y-3 sm:mt-6 sm:space-y-4">
          {PROJECTS.map((project) => {
            const isExpanded = expandedProjectId === project.id;

            return (
              <article
                key={project.id}
                className="rounded-xl border-[0.5px] border-[var(--os-border)] bg-[var(--os-surface)]/40 transition-colors duration-150 hover:border-[var(--os-text-muted)]/30 hover:bg-[var(--os-hover)]/20"
              >
                <div className="p-4 sm:p-6 lg:p-7">
                  <div className="flex flex-col gap-4 sm:gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-ui rounded-md border-[0.5px] border-[var(--os-border)] bg-[var(--os-background)] px-2 py-0.5 text-[12px] font-semibold tabular-nums text-[var(--os-text-muted)] sm:hidden">
                          {project.number}
                        </span>
                        <span className="text-label inline-block rounded-full border-[0.5px] border-[var(--os-border)] bg-[var(--os-background)] px-2.5 py-0.5 uppercase tracking-[0.08em] text-[var(--os-text-muted)]">
                          {project.category}
                        </span>
                      </div>

                      <div className="mt-3 flex min-w-0 gap-3 sm:mt-0 sm:gap-5">
                        <span className="hidden text-[28px] leading-none font-semibold tracking-[-0.03em] text-[var(--os-text-muted)] sm:inline sm:text-[32px]">
                          {project.number}
                        </span>

                        <div className="min-w-0 flex-1">
                          <h3 className="text-[20px] leading-[1.1] font-semibold tracking-[-0.03em] text-[var(--os-text)] sm:text-[24px] lg:text-[28px]">
                            {project.name}
                          </h3>
                          <p className="text-ui mt-2 text-[13px] leading-relaxed text-[var(--os-text-muted)] sm:mt-3 sm:text-[14px]">
                            {project.description}
                          </p>

                          <ProjectLinks
                            project={project}
                            fullWidthOnMobile
                            className="mt-3 sm:mt-4"
                          />

                          <div className="mt-3 flex flex-wrap gap-1.5 sm:mt-4 sm:gap-2">
                            {project.techStack.map((techItem) => (
                              <span
                                key={techItem}
                                className="text-ui rounded-md border-[0.5px] border-[var(--os-border)] bg-[var(--os-background)] px-2 py-0.5 text-[11px] text-[var(--os-text-muted)] sm:px-2.5 sm:py-1 sm:text-[12px] lg:text-[13px]"
                              >
                                {techItem}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setExpandedProjectId(isExpanded ? null : project.id)
                      }
                      className="text-ui flex w-full min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-lg border-[0.5px] border-[var(--os-border)] bg-[var(--os-background)] px-4 py-2.5 text-sm font-medium text-[var(--os-text)] transition-colors duration-150 hover:bg-[var(--os-hover)] sm:w-auto sm:min-h-0 sm:py-2 lg:mt-1"
                      aria-expanded={isExpanded}
                    >
                      {isExpanded ? "Hide Details" : "View Details"}
                      <ChevronDown
                        size={16}
                        strokeWidth={2}
                        className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                      />
                    </button>
                  </div>

                  <ul className="mt-4 grid gap-2 sm:mt-5 sm:grid-cols-2">
                    {project.achievements.map((achievement) => (
                      <li
                        key={achievement}
                        className="text-ui flex items-start gap-2 text-[12px] text-[var(--os-text-muted)] sm:text-[13px]"
                      >
                        <span className="mt-0.5 shrink-0 text-[var(--os-text)]">
                          ✓
                        </span>
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
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
                      <div className="border-t-[0.5px] border-[var(--os-border)] px-4 pb-5 pt-4 sm:px-6 sm:pb-7 sm:pt-6 lg:px-7">
                        <div className="mb-4 sm:mb-5">
                          <p className="text-label text-[var(--os-text-muted)]">
                            Architecture
                          </p>
                          <div className="text-ui mt-2 rounded-lg border-[0.5px] border-[var(--os-border)] bg-[var(--os-background)] px-3 py-3 text-[12px] leading-relaxed text-[var(--os-text-muted)] sm:px-4 sm:py-3.5 sm:text-[13px]">
                            {project.details.architecture}
                          </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
                          <div>
                            <p className="text-label text-[var(--os-text-muted)]">
                              Problem
                            </p>
                            <p className="text-ui mt-2 text-[12px] leading-relaxed text-[var(--os-text-muted)] sm:text-[13px]">
                              {project.details.problem}
                            </p>
                          </div>
                          <div>
                            <p className="text-label text-[var(--os-text-muted)]">
                              Business Impact
                            </p>
                            <p className="text-ui mt-2 text-[12px] leading-relaxed text-[var(--os-text-muted)] sm:text-[13px]">
                              {project.details.businessImpact}
                            </p>
                          </div>
                          <div>
                            <p className="text-label text-[var(--os-text-muted)]">
                              Tech Stack
                            </p>
                            <p className="text-ui mt-2 text-[12px] leading-relaxed text-[var(--os-text-muted)] sm:text-[13px]">
                              {project.details.techStackSummary}
                            </p>
                          </div>
                          <div>
                            <p className="text-label text-[var(--os-text-muted)]">
                              Implementation Notes
                            </p>
                            <p className="text-ui mt-2 text-[12px] leading-relaxed text-[var(--os-text-muted)] sm:text-[13px]">
                              {project.details.implementationNotes}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 sm:mt-5">
                          <p className="text-label text-[var(--os-text-muted)]">
                            Key Features
                          </p>
                          <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
                            {project.keyFeatures.map((feature) => (
                              <li
                                key={feature}
                                className="text-ui flex items-start gap-2 text-[12px] text-[var(--os-text-muted)] sm:text-[13px]"
                              >
                                <span className="mt-0.5 shrink-0 text-[var(--os-text)]">
                                  •
                                </span>
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {projectHasLinks(project.links) ? (
                          <div className="mt-5 flex flex-col gap-3 border-t-[0.5px] border-[var(--os-border)] pt-4 sm:mt-6 sm:flex-row sm:flex-wrap sm:items-center sm:pt-5">
                            <span className="text-label text-[var(--os-text-muted)]">
                              Links
                            </span>
                            <ProjectLinks project={project} fullWidthOnMobile />
                          </div>
                        ) : null}
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </article>
            );
          })}
        </div>

        <p className="text-label mt-6 text-center text-[var(--os-text-muted)] sm:mt-8">
          More projects available upon request.
        </p>
      </div>
    </div>
  );
}
