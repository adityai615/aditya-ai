export type GitHubProfile = {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  location: string | null;
  created_at: string;
  public_repos: number;
  followers: number;
  following: number;
};

export type GitHubRepo = {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  updated_at: string;
  fork: boolean;
};

export type GitHubStatCard = {
  label: "Repositories" | "Followers" | "Following" | "Account Age";
  value: string;
};

export type GitHubDashboardRepo = {
  id: number;
  name: string;
  url: string;
  description: string;
  language: string;
  stars: number;
  updatedAt: string;
};

export type GitHubLanguageStat = {
  language: string;
  count: number;
  percentage: number;
};

export type GitHubDashboardData = {
  profile: {
    avatarUrl: string;
    name: string;
    username: string;
    bio: string;
    location: string;
    profileUrl: string;
    createdAt: string;
  };
  stats: GitHubStatCard[];
  mostUsedLanguage: string;
  totalStars: number;
  languageBreakdown: GitHubLanguageStat[];
  featuredRepository: GitHubDashboardRepo | null;
  recentlyUpdatedRepository: GitHubDashboardRepo | null;
  topRepositories: GitHubDashboardRepo[];
};

