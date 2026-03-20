const GITHUB_API = "https://api.github.com";
const GITHUB_USERNAME = "yetemgetaB";

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  updated_at: string;
  created_at: string;
  topics: string[];
  default_branch: string;
  visibility: string;
}

export interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
  html_url: string;
}

export interface GitHubUser {
  login: string;
  avatar_url: string;
  name: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
  location: string | null;
  blog: string | null;
  created_at: string;
}

function getHeaders(): HeadersInit {
  const token = localStorage.getItem("github_token");
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

export function getUsername(): string {
  return localStorage.getItem("github_username") || GITHUB_USERNAME;
}

export async function fetchUser(): Promise<GitHubUser> {
  const res = await fetch(`${GITHUB_API}/users/${getUsername()}`, { headers: getHeaders() });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  return res.json();
}

export async function fetchRepos(): Promise<GitHubRepo[]> {
  const res = await fetch(
    `${GITHUB_API}/users/${getUsername()}/repos?sort=updated&per_page=30`,
    { headers: getHeaders() }
  );
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  return res.json();
}

export async function fetchCommits(repo: string, count = 10): Promise<GitHubCommit[]> {
  const res = await fetch(
    `${GITHUB_API}/repos/${getUsername()}/${repo}/commits?per_page=${count}`,
    { headers: getHeaders() }
  );
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  return res.json();
}

export async function fetchReadme(repo: string): Promise<string> {
  const res = await fetch(
    `${GITHUB_API}/repos/${getUsername()}/${repo}/readme`,
    { headers: { ...getHeaders(), Accept: "application/vnd.github.v3.raw" } }
  );
  if (!res.ok) throw new Error("No README found");
  return res.text();
}

export async function fetchLanguages(repo: string): Promise<Record<string, number>> {
  const res = await fetch(
    `${GITHUB_API}/repos/${getUsername()}/${repo}/languages`,
    { headers: getHeaders() }
  );
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  return res.json();
}

export async function fetchRepoContents(repo: string, path = ""): Promise<any[]> {
  const res = await fetch(
    `${GITHUB_API}/repos/${getUsername()}/${repo}/contents/${path}`,
    { headers: getHeaders() }
  );
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  return res.json();
}
