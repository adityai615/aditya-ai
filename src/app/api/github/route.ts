import { NextResponse } from "next/server";
import { buildGitHubDashboardData, GITHUB_USERNAME } from "@/lib/github";
import type { GitHubProfile, GitHubRepo } from "@/types/github";

export const revalidate = 1800;

const GITHUB_API_BASE = "https://api.github.com/users";

async function fetchGitHubData() {
  const profileUrl = `${GITHUB_API_BASE}/${GITHUB_USERNAME}`;
  const repositoriesUrl = `${profileUrl}/repos?per_page=100&sort=updated`;

  const [profileResponse, repositoriesResponse] = await Promise.all([
    fetch(profileUrl, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate },
    }),
    fetch(repositoriesUrl, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate },
    }),
  ]);

  if (!profileResponse.ok || !repositoriesResponse.ok) {
    throw new Error("Failed to fetch GitHub data");
  }

  const profile = (await profileResponse.json()) as GitHubProfile;
  const repositories = (await repositoriesResponse.json()) as GitHubRepo[];
  return buildGitHubDashboardData(profile, repositories);
}

export async function GET() {
  try {
    const data = await fetchGitHubData();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Unable to load GitHub profile." }, { status: 500 });
  }
}

