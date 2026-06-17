import type { GitHubDashboardData, GitHubProfile, GitHubRepo } from "@/types/github";

export const GITHUB_USERNAME = "adityai615";

const TOP_REPO_LIMIT = 6;

function getAccountAge(createdAt: string) {
  const createdDate = new Date(createdAt);
  const now = new Date();
  const yearDiff = now.getFullYear() - createdDate.getFullYear();
  const monthDiff = now.getMonth() - createdDate.getMonth();

  const years = monthDiff < 0 || (monthDiff === 0 && now.getDate() < createdDate.getDate())
    ? yearDiff - 1
    : yearDiff;

  if (years <= 0) {
    return "Less than 1 year";
  }

  return `${years} ${years === 1 ? "Year" : "Years"}`;
}

function getMostUsedLanguage(repositories: GitHubRepo[]) {
  const languageFrequency = new Map<string, number>();

  repositories.forEach((repository) => {
    if (!repository.language) return;
    languageFrequency.set(
      repository.language,
      (languageFrequency.get(repository.language) ?? 0) + 1,
    );
  });

  const [topLanguage] = [...languageFrequency.entries()].sort((a, b) => b[1] - a[1]);
  return topLanguage?.[0] ?? "Not specified";
}

function getLanguageBreakdown(repositories: GitHubRepo[]) {
  const languageFrequency = new Map<string, number>();

  repositories.forEach((repository) => {
    if (!repository.language) return;
    languageFrequency.set(
      repository.language,
      (languageFrequency.get(repository.language) ?? 0) + 1,
    );
  });

  const total = [...languageFrequency.values()].reduce((sum, count) => sum + count, 0);
  if (total === 0) return [];

  return [...languageFrequency.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([language, count]) => ({
      language,
      count,
      percentage: Math.round((count / total) * 100),
    }));
}

function mapRepository(repository: GitHubRepo): GitHubDashboardData["topRepositories"][number] {
  return {
    id: repository.id,
    name: repository.name,
    url: repository.html_url,
    description: repository.description ?? "No description provided.",
    language: repository.language ?? "Not specified",
    stars: repository.stargazers_count,
    updatedAt: repository.updated_at,
  };
}

export function buildGitHubDashboardData(
  profile: GitHubProfile,
  repositories: GitHubRepo[],
): GitHubDashboardData {
  const nonForkRepositories = repositories.filter((repository) => !repository.fork);
  const mappedRepositories = nonForkRepositories.map(mapRepository);

  const topRepositories = [...mappedRepositories]
    .sort((a, b) => b.stars - a.stars)
    .slice(0, TOP_REPO_LIMIT);

  const recentlyUpdatedRepository = [...mappedRepositories].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  )[0] ?? null;

  const totalStars = nonForkRepositories.reduce(
    (sum, repository) => sum + repository.stargazers_count,
    0,
  );

  return {
    profile: {
      avatarUrl: profile.avatar_url,
      name: profile.name ?? profile.login,
      username: profile.login,
      bio: profile.bio ?? "No bio available.",
      location: profile.location ?? "Not specified",
      profileUrl: profile.html_url,
      createdAt: profile.created_at,
    },
    stats: [
      { label: "Repositories", value: profile.public_repos.toString() },
      { label: "Followers", value: profile.followers.toString() },
      { label: "Following", value: profile.following.toString() },
      { label: "Account Age", value: getAccountAge(profile.created_at) },
    ],
    mostUsedLanguage: getMostUsedLanguage(nonForkRepositories),
    totalStars,
    languageBreakdown: getLanguageBreakdown(nonForkRepositories),
    featuredRepository: topRepositories[0] ?? null,
    recentlyUpdatedRepository,
    topRepositories,
  };
}

