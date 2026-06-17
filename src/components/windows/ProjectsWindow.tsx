"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { PROJECTS } from "@/lib/projects";

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
          {PROJECTS.map((project) => {
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
                      {project.techStack.map((techItem) => (
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
                              {project.details.techStackSummary}
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
                            {project.keyFeatures.map((feature) => (
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
