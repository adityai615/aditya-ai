"use client";

import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Briefcase, Code2, GraduationCap, Trophy, User } from "lucide-react";

type SectionId =
  | "overview"
  | "experience"
  | "skills"
  | "education"
  | "achievements";

type NavItem = {
  id: SectionId;
  label: string;
  icon: LucideIcon;
};

type Stat = {
  label: string;
  value: string;
};

type SkillGroup = {
  title: string;
  items: string[];
};

type Achievement = {
  title: string;
  subtitle: string;
};

const navItems: NavItem[] = [
  { id: "overview", label: "Overview", icon: User },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "skills", label: "Skills", icon: Code2 },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "achievements", label: "Achievements", icon: Trophy },
];

const quickStats: Stat[] = [
  { label: "Projects", value: "8+" },
  { label: "Clients", value: "5+" },
  { label: "Experience", value: "2+ yrs" },
  { label: "AI Apps", value: "10+" },
];

const skillGroups: SkillGroup[] = [
  { title: "Frontend", items: ["Next.js", "React", "TypeScript", "Tailwind CSS"] },
  {
    title: "Backend",
    items: ["Node.js", "FastAPI", "Express", "MongoDB", "PostgreSQL"],
  },
  {
    title: "AI",
    items: ["LangChain", "LlamaIndex", "Groq", "FAISS", "Vector Databases"],
  },
  { title: "Tools", items: ["Git", "GitHub", "Postman", "Vercel", "AWS"] },
];

const experienceHighlights = [
  "Delivered multiple client projects",
  "Built production ecommerce platforms",
  "Developed AI-powered communication systems",
  "Managed deployment and support",
];

const achievements: Achievement[] = [
  { title: "Best Character Award", subtitle: "JECRC Fresher's Party 2024" },
  { title: "Placement Cell Member", subtitle: "JECRC Foundation" },
  { title: "Freelance Projects Delivered", subtitle: "5+" },
  { title: "Production Deployments", subtitle: "Multiple" },
];

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

    if (sectionElements.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleEntries.length === 0) {
          return;
        }

        const nextSection = visibleEntries[0].target.id as SectionId;
        setActiveSection(nextSection);
      },
      {
        root: null,
        threshold: [0.2, 0.45, 0.7],
        rootMargin: "-90px 0px -50% 0px",
      },
    );

    sectionElements.forEach((section) => observer.observe(section));

    return () => {
      sectionElements.forEach((section) => observer.unobserve(section));
    };
  }, []);

  const handleSectionChange = (sectionId: SectionId) => {
    setActiveSection(sectionId);
    sectionRefs.current[sectionId]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="h-full overflow-auto">
      <div className="mx-auto w-full max-w-[1120px] px-4 py-6 sm:px-6 sm:py-8 md:grid md:grid-cols-[180px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-8">
        <aside className="mb-6 border-b-[0.5px] border-[var(--os-border)] bg-[var(--os-surface)] pb-4 md:sticky md:top-0 md:mb-0 md:h-fit md:self-start md:border-r-[0.5px] md:border-b-0 md:pb-0 md:pr-4 lg:pr-5">
          <nav className="flex gap-2 overflow-x-auto md:flex-col md:overflow-visible">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSectionChange(item.id)}
                  className={`text-ui inline-flex h-10 min-w-max items-center gap-2 rounded-md px-3 text-[14px] transition-colors md:w-full ${
                    isActive
                      ? "border-[0.5px] border-[var(--os-border)] bg-[var(--os-surface)] font-medium text-[var(--os-text)]"
                      : "border-[0.5px] border-transparent text-[var(--os-text-muted)] hover:bg-[var(--os-hover)]"
                  }`}
                >
                  <Icon size={16} strokeWidth={1.9} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        <div className="min-w-0 px-1 md:px-5 md:py-8">
          <section
            id="overview"
            ref={(node) => {
              sectionRefs.current.overview = node;
            }}
            className="scroll-mt-16"
          >
            <p className="text-label uppercase tracking-[0.08em] text-[var(--os-text-muted)]">
              about
            </p>
            <h2 className="mt-3 text-[clamp(30px,4.2vw,44px)] font-semibold leading-[1.05] tracking-[-0.03em] text-[var(--os-text)]">
              Aditya Jain
            </h2>
            <p className="text-ui mt-3 text-[15px] font-medium text-[var(--os-text-muted)]">
              Full Stack Developer • AI Builder • Freelancer
            </p>
            <p className="text-ui mt-6 max-w-[760px] leading-relaxed text-[var(--os-text-muted)]">
              A second-year Computer Science student at JECRC University focused
              on building production-grade web applications, AI systems,
              automation tools, and scalable digital products.
            </p>
            <p className="text-ui mt-4 max-w-[760px] leading-relaxed text-[var(--os-text-muted)]">
              Currently working with clients and building real-world software
              across AI, ecommerce, voice systems, and automation.
            </p>

            <div className="mt-8">
              <p className="text-label font-semibold text-[var(--os-text)]">
                Quick Stats
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {quickStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-md border-[0.5px] border-[var(--os-border)] bg-[var(--os-surface)] p-4"
                  >
                    <p className="text-label text-[var(--os-text-muted)]">
                      {stat.label}
                    </p>
                    <p className="text-ui mt-1 text-[16px] font-medium text-[var(--os-text)]">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section
            id="experience"
            ref={(node) => {
              sectionRefs.current.experience = node;
            }}
            className="scroll-mt-16 pt-12"
          >
            <h3 className="text-ui text-[20px] font-semibold text-[var(--os-text)]">
              Experience
            </h3>
            <div className="mt-5 border-l-[0.5px] border-[var(--os-border)] pl-5">
              <p className="text-ui text-[16px] font-medium text-[var(--os-text)]">
                Freelance Full Stack &amp; AI Developer
              </p>
              <p className="text-label mt-1 text-[var(--os-text-muted)]">
                2025 - Present
              </p>
              <ul className="mt-4 space-y-2">
                {experienceHighlights.map((highlight) => (
                  <li key={highlight} className="text-ui text-[var(--os-text-muted)]">
                    • {highlight}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section
            id="skills"
            ref={(node) => {
              sectionRefs.current.skills = node;
            }}
            className="scroll-mt-16 pt-12"
          >
            <h3 className="text-ui text-[20px] font-semibold text-[var(--os-text)]">
              Skills
            </h3>
            <div className="mt-5 space-y-6">
              {skillGroups.map((group) => (
                <div key={group.title}>
                  <p className="text-ui text-[15px] font-medium text-[var(--os-text)]">
                    {group.title}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {group.items.map((skill) => (
                      <span
                        key={skill}
                        className="text-ui rounded-md border-[0.5px] border-[var(--os-border)] bg-[var(--os-surface)] px-3 py-1.5 text-[13px] text-[var(--os-text-muted)]"
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
            className="scroll-mt-16 pt-12"
          >
            <h3 className="text-ui text-[20px] font-semibold text-[var(--os-text)]">
              Education
            </h3>
            <div className="mt-5 rounded-md border-[0.5px] border-[var(--os-border)] bg-[var(--os-surface)] p-5">
              <p className="text-ui text-[16px] font-medium text-[var(--os-text)]">
                JECRC Foundation
              </p>
              <p className="text-ui mt-2 text-[var(--os-text-muted)]">
                Bachelor of Technology
              </p>
              <p className="text-ui mt-1 text-[var(--os-text-muted)]">
                Computer Science with AI
              </p>
              <p className="text-label mt-4 text-[var(--os-text-muted)]">
                2024 - Present
              </p>
              <p className="text-label mt-4 text-[var(--os-text-muted)]">
                Jaipur, Rajasthan
              </p>
            </div>
          </section>

          <section
            id="achievements"
            ref={(node) => {
              sectionRefs.current.achievements = node;
            }}
            className="scroll-mt-16 pt-12 pb-10"
          >
            <h3 className="text-ui text-[20px] font-semibold text-[var(--os-text)]">
              Achievements
            </h3>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {achievements.map((item) => (
                <article
                  key={item.title}
                  className="rounded-md border-[0.5px] border-[var(--os-border)] bg-[var(--os-surface)] p-4"
                >
                  <p className="text-ui text-[15px] font-medium text-[var(--os-text)]">
                    {item.title}
                  </p>
                  <p className="text-label mt-2 text-[var(--os-text-muted)]">
                    {item.subtitle}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
