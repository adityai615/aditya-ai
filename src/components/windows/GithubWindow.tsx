"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ExternalLink, RefreshCw, Star } from "lucide-react";
import type { GitHubDashboardData } from "@/types/github";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
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
      {Array.from({ length: 6 }).map((_, index) => (
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

export function GithubWindow() {
  const [data, setData] = useState<GitHubDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/github");
      const payload = (await response.json()) as GitHubDashboardData & { error?: string };

      if (!response.ok || payload.error) {
        throw new Error(payload.error ?? "Unable to load GitHub profile.");
      }

      setData(payload);
    } catch {
      setError("Unable to load GitHub profile.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData, retryCount]);

  const createdDate = useMemo(
    () => (data ? formatDate(data.profile.createdAt) : ""),
    [data],
  );

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
            <ProfileSkeleton />
            <StatsSkeleton />
            <RepositoriesSkeleton />
          </>
        ) : (
          <>
            <section className="rounded-lg border-[0.5px] border-[var(--os-border)] bg-[var(--os-surface)] p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 items-start gap-4">
                  <img
                    src={data.profile.avatarUrl}
                    alt={`${data.profile.name} avatar`}
                    className="h-14 w-14 rounded-full border-[0.5px] border-[var(--os-border)] object-cover"
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
            </section>

            <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {data.stats.map((stat) => (
                <article
                  key={stat.label}
                  className="rounded-lg border-[0.5px] border-[var(--os-border)] bg-[var(--os-surface)] p-4"
                >
                  <p className="text-label text-[var(--os-text-muted)]">{stat.label}</p>
                  <p className="text-ui mt-2 text-[24px] font-semibold leading-none text-[var(--os-text)]">
                    {stat.value}
                  </p>
                </article>
              ))}
            </section>

            <section className="rounded-lg border-[0.5px] border-[var(--os-border)] bg-[var(--os-surface)] p-4 sm:p-5">
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
                    Most Used: {data.mostUsedLanguage}
                  </span>
                  <span className="text-label inline-flex items-center gap-1 rounded-md border-[0.5px] border-[var(--os-border)] bg-[var(--os-background)] px-2.5 py-1 text-[var(--os-text-muted)]">
                    <Star size={12} />
                    Total Stars: {data.totalStars}
                  </span>
                </div>
              </div>

              {data.topRepositories.length === 0 ? (
                <p className="text-ui text-[var(--os-text-muted)]">No repositories found.</p>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {data.topRepositories.map((repository) => (
                    <article
                      key={repository.id}
                      className="rounded-lg border-[0.5px] border-[var(--os-border)] bg-[var(--os-background)] p-4"
                    >
                      <h4 className="text-ui text-[16px] font-semibold text-[var(--os-text)]">
                        {repository.name}
                      </h4>
                      <p className="text-ui mt-2 min-h-[42px] text-[14px] text-[var(--os-text-muted)]">
                        {repository.description}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        <span className="text-label text-[var(--os-text-muted)]">
                          {repository.language}
                        </span>
                        <span className="text-label inline-flex items-center gap-1 text-[var(--os-text-muted)]">
                          <Star size={12} />
                          {repository.stars}
                        </span>
                        <span className="text-label text-[var(--os-text-muted)]">
                          Updated {formatDate(repository.updatedAt)}
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
                    </article>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}

