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

function toRepoLanguageInput(repositories: GitHubDashboardData["topRepositories"]): GitHubRepo[] {
  return repositories.map((repository) => ({
    id: repository.id,
    name: repository.name,
    html_url: repository.url,
    description: repository.description,
    language: repository.language === "Not specified" ? null : repository.language,
    stargazers_count: repository.stars,
    updated_at: repository.updatedAt,
    fork: false,
  }));
}

export function buildGitHubDashboardData(
  profile: GitHubProfile,
  repositories: GitHubRepo[],
): GitHubDashboardData {
  const topRepositories = repositories
    .filter((repository) => !repository.fork)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, TOP_REPO_LIMIT)
    .map((repository) => ({
      id: repository.id,
      name: repository.name,
      url: repository.html_url,
      description: repository.description ?? "No description provided.",
      language: repository.language ?? "Not specified",
      stars: repository.stargazers_count,
      updatedAt: repository.updated_at,
    }));

  const totalStars = topRepositories.reduce((sum, repository) => sum + repository.stars, 0);

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
    mostUsedLanguage: getMostUsedLanguage(
      topRepositories.length > 0 ? toRepoLanguageInput(topRepositories) : repositories,
    ),
    totalStars,
    topRepositories,
  };
}

