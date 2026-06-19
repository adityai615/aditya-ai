"use client";

import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Briefcase,
  Code2,
  GraduationCap,
  Mail,
  MapPin,
  Trophy,
  User,
} from "lucide-react";

import { portfolioContext } from "@/lib/portfolio-context";
import {
  CONTACT_EMAIL_MAILTO,
  CONTACT_LINKEDIN_URL,
} from "@/lib/contact";

type SectionId =
  | "overview"
  | "experience"
  | "skills"
  | "education"
  | "achievements";

type NavItem = {
  id: SectionId;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
};

const navItems: NavItem[] = [
  { id: "overview", label: "Overview", shortLabel: "Overview", icon: User },
  { id: "experience", label: "Experience", shortLabel: "Work", icon: Briefcase },
  { id: "skills", label: "Skills", shortLabel: "Skills", icon: Code2 },
  { id: "education", label: "Education", shortLabel: "Edu", icon: GraduationCap },
  { id: "achievements", label: "Leadership", shortLabel: "Lead", icon: Trophy },
];

const availabilityLabels: Record<
  (typeof portfolioContext.profile)["availability"],
  string
> = {
  available: "Open to work",
  limited: "Limited availability",
  unavailable: "Not available",
};

const cardClass =
  "rounded-xl border-[0.5px] border-[var(--os-border)] bg-[var(--os-surface)]/40 p-4 sm:p-6 scroll-mt-[7.5rem] lg:scroll-mt-4";

const sectionTitleClass =
  "text-ui text-[17px] font-semibold text-[var(--os-text)] sm:text-[20px]";

const {
  profile,
  experience,
  skills,
  education,
  achievements,
  aboutOverviewExtra,
  quickStats,
} = portfolioContext;

export function AboutWindow() {
  const [activeSection, setActiveSection] = useState<SectionId>("overview");
  const sectionRefs = useRef<Record<SectionId, HTMLElement | null>>({
    overview: null,
    experience: null,
    skills: null,
    education: null,
    achievements: null,
  });

  useEffect(() => {
    const sectionElements = Object.values(sectionRefs.current).filter(
      (section): section is HTMLElement => section !== null,
    );

    if (sectionElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleEntries.length === 0) return;

        setActiveSection(visibleEntries[0].target.id as SectionId);
      },
      {
        root: null,
        threshold: [0.12, 0.3, 0.5],
        rootMargin: "-120px 0px -50% 0px",
      },
    );

    sectionElements.forEach((section) => observer.observe(section));
    return () => sectionElements.forEach((section) => observer.unobserve(section));
  }, []);

  const handleSectionChange = (sectionId: SectionId) => {
    setActiveSection(sectionId);
    sectionRefs.current[sectionId]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="h-full overflow-auto overscroll-contain px-4 py-5 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <div className="mx-auto w-full max-w-[1100px]">
        <header className="border-b-[0.5px] border-[var(--os-border)] pb-4 sm:pb-8">
          <p className="text-label uppercase tracking-[0.08em] text-[var(--os-text-muted)]">
            about
          </p>
          <p className="text-ui mt-2 text-[13px] leading-relaxed text-[var(--os-text-muted)] sm:mt-3 sm:text-[14px]">
            Background, skills, and experience — synced with the live resume.
          </p>
        </header>

        <div className="mt-4 lg:mt-6 lg:grid lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-8">
          <aside className="sticky top-0 z-10 -mx-4 border-b-[0.5px] border-[var(--os-border)] bg-[var(--os-background)]/95 px-4 py-2 backdrop-blur-md lg:static lg:mx-0 lg:border-b-0 lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none">
            <nav
              className="about-section-nav flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0"
              aria-label="About sections"
            >
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSectionChange(item.id)}
                    className={`text-ui inline-flex h-10 shrink-0 snap-start items-center gap-1.5 rounded-lg px-3 text-[12px] transition-colors duration-150 sm:gap-2 sm:text-[13px] lg:h-10 lg:w-full lg:text-[14px] ${
                      isActive
                        ? "border-[0.5px] border-[var(--os-border)] bg-[var(--os-surface)] font-medium text-[var(--os-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                        : "border-[0.5px] border-transparent text-[var(--os-text-muted)] hover:bg-[var(--os-hover)]"
                    }`}
                  >
                    <Icon size={14} strokeWidth={1.9} className="shrink-0" />
                    <span className="sm:hidden">{item.shortLabel}</span>
                    <span className="hidden sm:inline">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          <div className="min-w-0 space-y-3 pt-3 sm:space-y-5 sm:pt-0">
            <section
              id="overview"
              ref={(node) => {
                sectionRefs.current.overview = node;
              }}
              className={cardClass}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h2 className="text-[26px] font-semibold leading-[1.05] tracking-[-0.03em] text-[var(--os-text)] sm:text-[clamp(28px,4vw,40px)]">
                    {profile.fullName}
                  </h2>
                  <p className="text-ui mt-2 text-[14px] font-medium leading-snug text-[var(--os-text-muted)] sm:text-[15px]">
                    {profile.headline}
                  </p>
                </div>
                <span className="text-label w-fit rounded-full border-[0.5px] border-[var(--os-border)] bg-[var(--os-background)] px-3 py-1 text-[10px] uppercase tracking-[0.06em] text-[var(--os-text)] sm:text-[11px]">
                  {availabilityLabels[profile.availability]}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 sm:mt-4">
                <span className="text-ui inline-flex items-center gap-1.5 text-[12px] text-[var(--os-text-muted)] sm:text-[13px]">
                  <MapPin size={14} strokeWidth={1.9} className="shrink-0" />
                  {profile.location}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-4 sm:flex sm:flex-wrap">
                <a
                  href={CONTACT_LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ui inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full border-[0.5px] border-[var(--os-border)] bg-[var(--os-background)] px-3 py-2 text-[12px] font-medium text-[var(--os-text)] transition-colors hover:bg-[var(--os-hover)] sm:min-h-0 sm:justify-start sm:py-1.5"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                    className="shrink-0"
                  >
                    <path
                      d="M16 8C18.2091 8 20 9.79086 20 12V20H16V12C16 11.4477 15.5523 11 15 11C14.4477 11 14 11.4477 14 12V20H10V8H14V9.5C14.734 8.57998 15.828 8 17 8H16ZM6 9H3V20H6V9ZM4.5 4C5.32843 4 6 4.67157 6 5.5C6 6.32843 5.32843 7 4.5 7C3.67157 7 3 6.32843 3 5.5C3 4.67157 3.67157 4 4.5 4Z"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  LinkedIn
                </a>
                <a
                  href={CONTACT_EMAIL_MAILTO}
                  className="text-ui inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full border-[0.5px] border-[var(--os-border)] bg-[var(--os-background)] px-3 py-2 text-[12px] font-medium text-[var(--os-text)] transition-colors hover:bg-[var(--os-hover)] sm:min-h-0 sm:justify-start sm:py-1.5"
                >
                  <Mail size={13} strokeWidth={2} />
                  Email
                </a>
              </div>

              <div className="mt-5 space-y-3 border-t-[0.5px] border-[var(--os-border)] pt-5 sm:mt-6 sm:space-y-4 sm:pt-6">
                <p className="text-ui text-[13px] leading-relaxed text-[var(--os-text-muted)] sm:text-[15px]">
                  {profile.summary}
                </p>
                <p className="text-ui text-[13px] leading-relaxed text-[var(--os-text-muted)] sm:text-[15px]">
                  {aboutOverviewExtra}
                </p>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2 sm:mt-6 sm:grid-cols-4 sm:gap-3">
                {quickStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-lg border-[0.5px] border-[var(--os-border)] bg-[var(--os-background)] px-2.5 py-3 text-center sm:px-4 sm:py-4"
                  >
                    <p className="text-[20px] font-semibold leading-none tracking-[-0.02em] text-[var(--os-text)] sm:text-[26px]">
                      {stat.value}
                    </p>
                    <p className="text-label mt-1.5 text-[9px] uppercase tracking-[0.06em] text-[var(--os-text-muted)] sm:mt-2 sm:text-[11px]">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section
              id="experience"
              ref={(node) => {
                sectionRefs.current.experience = node;
              }}
              className={cardClass}
            >
              <h3 className={sectionTitleClass}>Experience</h3>
              <div className="mt-4 space-y-3 sm:mt-5 sm:space-y-5">
                {experience.map((item) => (
                  <article
                    key={`${item.role}-${item.period}`}
                    className="rounded-lg border-[0.5px] border-[var(--os-border)] bg-[var(--os-background)] p-3.5 sm:p-5"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <p className="text-ui text-[15px] font-semibold leading-snug text-[var(--os-text)] sm:text-[16px]">
                          {item.role}
                        </p>
                        <p className="text-ui mt-1 text-[13px] text-[var(--os-text-muted)] sm:text-[14px]">
                          {item.organization}
                        </p>
                      </div>
                      <span className="text-label w-fit rounded-md border-[0.5px] border-[var(--os-border)] bg-[var(--os-surface)] px-2.5 py-1 text-[10px] text-[var(--os-text-muted)] sm:text-[11px]">
                        {item.period}
                      </span>
                    </div>
                    {item.location ? (
                      <p className="text-label mt-2 text-[var(--os-text-muted)]">
                        {item.location}
                      </p>
                    ) : null}
                    <ul className="mt-3 space-y-2 sm:mt-4 sm:space-y-2.5">
                      {item.highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="text-ui flex items-start gap-2 text-[12px] leading-relaxed text-[var(--os-text-muted)] sm:gap-2.5 sm:text-[14px]"
                        >
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--os-text)]" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </section>

            <section
              id="skills"
              ref={(node) => {
                sectionRefs.current.skills = node;
              }}
              className={cardClass}
            >
              <h3 className={sectionTitleClass}>Technical Skills</h3>
              <div className="mt-4 grid gap-2.5 sm:mt-5 sm:grid-cols-2 sm:gap-3">
                {skills.map((group) => (
                  <div
                    key={group.category}
                    className="rounded-lg border-[0.5px] border-[var(--os-border)] bg-[var(--os-background)] p-3.5 sm:p-4"
                  >
                    <p className="text-label text-[10px] uppercase tracking-[0.06em] text-[var(--os-text-muted)] sm:text-[11px]">
                      {group.category}
                    </p>
                    <div className="mt-2.5 flex flex-wrap gap-1.5 sm:mt-3">
                      {group.items.map((skill) => (
                        <span
                          key={skill}
                          className="text-ui rounded-md border-[0.5px] border-[var(--os-border)] bg-[var(--os-surface)] px-2 py-0.5 text-[11px] text-[var(--os-text-muted)] sm:px-2.5 sm:py-1 sm:text-[12px]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section
              id="education"
              ref={(node) => {
                sectionRefs.current.education = node;
              }}
              className={cardClass}
            >
              <h3 className={sectionTitleClass}>Education</h3>
              <div className="mt-4 space-y-3 sm:mt-5">
                {education.map((item) => (
                  <article
                    key={item.institution}
                    className="rounded-lg border-[0.5px] border-[var(--os-border)] bg-[var(--os-background)] p-3.5 sm:p-5"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <p className="text-ui text-[15px] font-semibold text-[var(--os-text)] sm:text-[16px]">
                          {item.institution}
                        </p>
                        <p className="text-ui mt-1.5 text-[13px] text-[var(--os-text-muted)] sm:text-[14px]">
                          {item.degree}
                        </p>
                        <p className="text-ui mt-0.5 text-[13px] text-[var(--os-text-muted)] sm:text-[14px]">
                          {item.specialization}
                        </p>
                      </div>
                      {item.cgpa ? (
                        <div className="flex w-full items-center justify-between rounded-lg border-[0.5px] border-[var(--os-border)] bg-[var(--os-surface)] px-3 py-2 sm:w-auto sm:flex-col sm:justify-center sm:text-center">
                          <p className="text-label text-[10px] uppercase tracking-[0.06em] text-[var(--os-text-muted)] sm:order-2 sm:mt-1">
                            CGPA
                          </p>
                          <p className="text-[20px] font-semibold leading-none text-[var(--os-text)] sm:order-1">
                            {item.cgpa}
                          </p>
                        </div>
                      ) : null}
                    </div>
                    <div className="text-label mt-3 flex flex-col gap-0.5 text-[var(--os-text-muted)] sm:mt-4 sm:flex-row sm:flex-wrap sm:gap-x-3 sm:gap-y-1">
                      <span>{item.period}</span>
                      <span className="hidden sm:inline" aria-hidden="true">
                        ·
                      </span>
                      <span>{item.location}</span>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section
              id="achievements"
              ref={(node) => {
                sectionRefs.current.achievements = node;
              }}
              className={`${cardClass} pb-2`}
            >
              <h3 className={sectionTitleClass}>
                Leadership & Extracurricular
              </h3>
              <div className="mt-4 grid gap-2.5 sm:mt-5 sm:grid-cols-2 sm:gap-3">
                {achievements.map((item, index) => (
                  <article
                    key={item.title}
                    className="rounded-lg border-[0.5px] border-[var(--os-border)] bg-[var(--os-background)] p-3.5 transition-colors duration-150 hover:bg-[var(--os-hover)]/30 sm:p-4"
                  >
                    <span className="text-label text-[var(--os-text-muted)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="text-ui mt-1.5 text-[14px] font-semibold text-[var(--os-text)] sm:mt-2 sm:text-[15px]">
                      {item.title}
                    </p>
                    <p className="text-ui mt-1.5 text-[12px] leading-relaxed text-[var(--os-text-muted)] sm:mt-2 sm:text-[13px]">
                      {item.subtitle}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
