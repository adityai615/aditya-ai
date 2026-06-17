"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, RefreshCw, Sparkles, Star, Zap } from "lucide-react";
import type { GitHubDashboardData, GitHubDashboardRepo } from "@/types/github";

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  Ruby: "#701516",
  PHP: "#4F5D95",
  "C++": "#f34b7d",
  C: "#555555",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Vue: "#41b883",
};

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: "easeOut" } },
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function formatRelativeDate(value: string) {
  const diffMs = Date.now() - new Date(value).getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

function getLanguageColor(language: string) {
  return LANGUAGE_COLORS[language] ?? "#8b8b8b";
}

function CountUpValue({ value }: { value: string }) {
  const numeric = Number.parseInt(value.replace(/,/g, ""), 10);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (Number.isNaN(numeric)) {
      setDisplay(value);
      return;
    }

    let frame = 0;
    const totalFrames = 24;
    const timer = window.setInterval(() => {
      frame += 1;
      const progress = frame / totalFrames;
      const eased = 1 - (1 - progress) ** 3;
      setDisplay(Math.round(numeric * eased).toString());
      if (frame >= totalFrames) {
        window.clearInterval(timer);
        setDisplay(value);
      }
    }, 16);

    return () => window.clearInterval(timer);
  }, [numeric, value]);

  return <>{display}</>;
}

function LanguageDot({ language }: { language: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: getLanguageColor(language) }}
        aria-hidden="true"
      />
      <span>{language}</span>
    </span>
  );
}

function ProfileSkeleton() {
  return (
    <div className="rounded-lg border-[0.5px] border-[var(--os-border)] bg-[var(--os-surface)] p-5">
      <div className="animate-pulse">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-[var(--os-hover)]" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-4 w-40 rounded bg-[var(--os-hover)]" />
            <div className="h-3 w-28 rounded bg-[var(--os-hover)]" />
          </div>
        </div>
        <div className="mt-4 h-3 w-full rounded bg-[var(--os-hover)]" />
        <div className="mt-2 h-3 w-2/3 rounded bg-[var(--os-hover)]" />
      </div>
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={`stat-skeleton-${index}`}
          className="rounded-lg border-[0.5px] border-[var(--os-border)] bg-[var(--os-surface)] p-4"
        >
          <div className="animate-pulse space-y-2">
            <div className="h-3 w-20 rounded bg-[var(--os-hover)]" />
            <div className="h-6 w-16 rounded bg-[var(--os-hover)]" />
          </div>
        </div>
      ))}
    </div>
  );
}

function RepositoriesSkeleton() {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={`repo-skeleton-${index}`}
          className="rounded-lg border-[0.5px] border-[var(--os-border)] bg-[var(--os-surface)] p-4"
        >
          <div className="animate-pulse space-y-2">
            <div className="h-4 w-40 rounded bg-[var(--os-hover)]" />
            <div className="h-3 w-full rounded bg-[var(--os-hover)]" />
            <div className="h-3 w-2/3 rounded bg-[var(--os-hover)]" />
          </div>
        </div>
      ))}
    </div>
  );
}

function FeaturedRepositoryCard({
  repository,
  isRecentlyUpdated,
}: {
  repository: GitHubDashboardRepo;
  isRecentlyUpdated: boolean;
}) {
  return (
    <motion.article
      variants={fadeUp}
      className="relative overflow-hidden rounded-xl border-[0.5px] border-[var(--os-border)] bg-[var(--os-surface)] p-5 sm:p-6"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          background: `radial-gradient(circle at top right, ${getLanguageColor(repository.language)}, transparent 55%)`,
        }}
      />
      <div className="relative">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-label inline-flex items-center gap-1 rounded-full border-[0.5px] border-[#3fb950]/30 bg-[#3fb950]/10 px-2.5 py-1 text-[#3fb950]">
            <Sparkles size={11} />
            Featured
          </span>
          {isRecentlyUpdated ? (
            <span className="text-label inline-flex items-center gap-1 rounded-full border-[0.5px] border-[var(--os-border)] bg-[var(--os-background)] px-2.5 py-1 text-[var(--os-text-muted)]">
              <Zap size={11} />
              Recently updated
            </span>
          ) : null}
        </div>

        <h3 className="text-ui mt-3 text-[22px] font-semibold text-[var(--os-text)]">
          {repository.name}
        </h3>
        <p className="text-ui mt-2 max-w-[720px] text-[14px] leading-relaxed text-[var(--os-text-muted)]">
          {repository.description}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <span className="text-label text-[var(--os-text-muted)]">
            <LanguageDot language={repository.language} />
          </span>
          <span className="text-label inline-flex items-center gap-1 text-[var(--os-text-muted)]">
            <Star size={12} className="text-[#e3b341]" fill="#e3b341" />
            {repository.stars} stars
          </span>
          <span className="text-label text-[var(--os-text-muted)]">
            Updated {formatRelativeDate(repository.updatedAt)}
          </span>
        </div>

        <a
          href={repository.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-ui mt-5 inline-flex items-center gap-2 rounded-md border-[0.5px] border-[var(--os-border)] bg-[var(--os-background)] px-3 py-2 text-sm font-medium text-[var(--os-text)] transition-colors hover:bg-[var(--os-hover)]"
        >
          View Repository
          <ExternalLink size={14} />
        </a>
      </div>
    </motion.article>
  );
}

function RepositoryCard({
  repository,
  isRecentlyUpdated,
}: {
  repository: GitHubDashboardRepo;
  isRecentlyUpdated: boolean;
}) {
  return (
    <motion.article
      variants={fadeUp}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className="group rounded-lg border-[0.5px] border-[var(--os-border)] bg-[var(--os-background)] p-4 transition-shadow duration-200 hover:border-[var(--os-border-strong)] hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.35)]"
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-ui text-[16px] font-semibold text-[var(--os-text)] group-hover:text-[#3fb950]">
          {repository.name}
        </h4>
        {isRecentlyUpdated ? (
          <span className="text-label shrink-0 rounded-full border-[0.5px] border-[var(--os-border)] bg-[var(--os-surface)] px-2 py-0.5 text-[10px] text-[var(--os-text-muted)]">
            Active
          </span>
        ) : null}
      </div>
      <p className="text-ui mt-2 min-h-[42px] text-[14px] text-[var(--os-text-muted)]">
        {repository.description}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <span className="text-label text-[var(--os-text-muted)]">
          <LanguageDot language={repository.language} />
        </span>
        <span className="text-label inline-flex items-center gap-1 text-[var(--os-text-muted)]">
          <Star size={12} />
          {repository.stars}
        </span>
        <span className="text-label text-[var(--os-text-muted)]">
          {formatRelativeDate(repository.updatedAt)}
        </span>
      </div>

      <a
        href={repository.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-ui mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--os-text)] underline-offset-4 hover:underline"
      >
        View Repository
        <span aria-hidden="true">→</span>
      </a>
    </motion.article>
  );
}

export function GithubWindow() {
  const [data, setData] = useState<GitHubDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  const loadData = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const response = await fetch("/api/github");
      const payload = (await response.json()) as GitHubDashboardData & { error?: string };

      if (!response.ok || payload.error) {
        throw new Error(payload.error ?? "Unable to load GitHub profile.");
      }

      setData(payload);
      setLastSyncedAt(new Date());
    } catch {
      setError("Unable to load GitHub profile.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData, retryCount]);

  const createdDate = useMemo(
    () => (data ? formatDate(data.profile.createdAt) : ""),
    [data],
  );

  const remainingRepositories = useMemo(() => {
    if (!data?.featuredRepository) return data?.topRepositories ?? [];
    return data.topRepositories.filter(
      (repository) => repository.id !== data.featuredRepository?.id,
    );
  }, [data]);

  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="w-full max-w-[460px] rounded-lg border-[0.5px] border-[var(--os-border)] bg-[var(--os-surface)] p-6 text-center">
          <p className="text-ui text-[16px] font-medium text-[var(--os-text)]">
            Unable to load GitHub profile.
          </p>
          <button
            type="button"
            onClick={() => setRetryCount((previous) => previous + 1)}
            className="text-ui mt-4 inline-flex items-center gap-2 rounded-md border-[0.5px] border-[var(--os-border)] bg-[var(--os-background)] px-3 py-2 text-sm text-[var(--os-text)] transition-colors hover:bg-[var(--os-hover)]"
          >
            <RefreshCw size={14} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto px-4 py-5 sm:px-6 sm:py-6">
      <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-5">
        {isLoading || !data ? (
          <>
            <div className="flex items-center gap-2 text-[var(--os-text-muted)]">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#3fb950]" />
              <p className="text-label">Syncing with GitHub...</p>
            </div>
            <ProfileSkeleton />
            <StatsSkeleton />
            <RepositoriesSkeleton />
          </>
        ) : (
          <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col gap-5">
            <motion.div
              variants={fadeUp}
              className="flex flex-wrap items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3fb950] opacity-40" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#3fb950]" />
                </span>
                <p className="text-label text-[var(--os-text-muted)]">
                  Live sync
                  {lastSyncedAt
                    ? ` • ${lastSyncedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                    : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => void loadData(true)}
                disabled={isRefreshing}
                className="text-ui inline-flex items-center gap-2 rounded-md border-[0.5px] border-[var(--os-border)] bg-[var(--os-surface)] px-3 py-1.5 text-sm text-[var(--os-text)] transition-colors hover:bg-[var(--os-hover)] disabled:opacity-60"
              >
                <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
                Refresh
              </button>
            </motion.div>

            <motion.section
              variants={fadeUp}
              className="rounded-lg border-[0.5px] border-[var(--os-border)] bg-[var(--os-surface)] p-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 items-start gap-4">
                  <img
                    src={data.profile.avatarUrl}
                    alt={`${data.profile.name} avatar`}
                    className="h-14 w-14 rounded-full border-[0.5px] border-[var(--os-border)] object-cover ring-2 ring-[#3fb950]/20"
                  />
                  <div className="min-w-0">
                    <h2 className="text-ui text-[20px] font-semibold text-[var(--os-text)]">
                      {data.profile.name}
                    </h2>
                    <p className="text-ui text-[14px] text-[var(--os-text-muted)]">
                      @{data.profile.username}
                    </p>
                    <p className="text-ui mt-2 max-w-[700px] text-[14px] text-[var(--os-text-muted)]">
                      {data.profile.bio}
                    </p>
                    <p className="text-label mt-2 text-[var(--os-text-muted)]">
                      {data.profile.location} • Joined {createdDate}
                    </p>
                  </div>
                </div>

                <a
                  href={data.profile.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ui inline-flex items-center gap-2 self-start rounded-md border-[0.5px] border-[var(--os-border)] bg-[var(--os-background)] px-3 py-2 text-sm text-[var(--os-text)] transition-colors hover:bg-[var(--os-hover)]"
                >
                  Open GitHub Profile
                  <ExternalLink size={14} />
                </a>
              </div>
            </motion.section>

            <motion.section variants={fadeUp} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {data.stats.map((stat) => (
                <motion.article
                  key={stat.label}
                  variants={fadeUp}
                  whileHover={{ y: -2 }}
                  className="rounded-lg border-[0.5px] border-[var(--os-border)] bg-[var(--os-surface)] p-4 transition-shadow hover:shadow-[0_8px_24px_-14px_rgba(0,0,0,0.3)]"
                >
                  <p className="text-label text-[var(--os-text-muted)]">{stat.label}</p>
                  <p className="text-ui mt-2 text-[24px] font-semibold leading-none text-[var(--os-text)]">
                    <CountUpValue value={stat.value} />
                  </p>
                </motion.article>
              ))}
            </motion.section>

            {data.languageBreakdown.length > 0 ? (
              <motion.section
                variants={fadeUp}
                className="rounded-lg border-[0.5px] border-[var(--os-border)] bg-[var(--os-surface)] p-4 sm:p-5"
              >
                <h3 className="text-ui text-[18px] font-semibold text-[var(--os-text)]">
                  Language Stack
                </h3>
                <p className="text-label mt-1 text-[var(--os-text-muted)]">
                  Distribution across public repositories
                </p>
                <div className="mt-4 space-y-3">
                  {data.languageBreakdown.map((item) => (
                    <div key={item.language}>
                      <div className="mb-1.5 flex items-center justify-between gap-2">
                        <span className="text-label text-[var(--os-text)]">
                          <LanguageDot language={item.language} />
                        </span>
                        <span className="text-label text-[var(--os-text-muted)]">
                          {item.count} repos • {item.percentage}%
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-[var(--os-hover)]">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.percentage}%` }}
                          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: getLanguageColor(item.language) }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            ) : null}

            {data.featuredRepository ? (
              <FeaturedRepositoryCard
                repository={data.featuredRepository}
                isRecentlyUpdated={
                  data.recentlyUpdatedRepository?.id === data.featuredRepository.id
                }
              />
            ) : null}

            <motion.section
              variants={fadeUp}
              className="rounded-lg border-[0.5px] border-[var(--os-border)] bg-[var(--os-surface)] p-4 sm:p-5"
            >
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-ui text-[18px] font-semibold text-[var(--os-text)]">
                    Top Repositories
                  </h3>
                  <p className="text-label mt-1 text-[var(--os-text-muted)]">
                    Sorted by stars
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="text-label rounded-md border-[0.5px] border-[var(--os-border)] bg-[var(--os-background)] px-2.5 py-1 text-[var(--os-text-muted)]">
                    <LanguageDot language={data.mostUsedLanguage} />
                  </span>
                  <span className="text-label inline-flex items-center gap-1 rounded-md border-[0.5px] border-[var(--os-border)] bg-[var(--os-background)] px-2.5 py-1 text-[var(--os-text-muted)]">
                    <Star size={12} />
                    {data.totalStars} total stars
                  </span>
                </div>
              </div>

              {remainingRepositories.length === 0 ? (
                <p className="text-ui text-[var(--os-text-muted)]">No repositories found.</p>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {remainingRepositories.map((repository) => (
                    <RepositoryCard
                      key={repository.id}
                      repository={repository}
                      isRecentlyUpdated={
                        data.recentlyUpdatedRepository?.id === repository.id
                      }
                    />
                  ))}
                </div>
              )}
            </motion.section>
          </motion.div>
        )}
      </div>
    </div>
  );
}
