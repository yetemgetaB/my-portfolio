import { useQuery } from "@tanstack/react-query";
import {
  fetchUser,
  fetchRepos,
  fetchCommits,
  fetchReadme,
  fetchLanguages,
  fetchRepoContents,
  type GitHubRepo,
  type GitHubCommit,
  type GitHubUser,
} from "@/lib/github";

export function useGitHubUser() {
  return useQuery<GitHubUser>({
    queryKey: ["github-user"],
    queryFn: fetchUser,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

export function useGitHubRepos() {
  return useQuery<GitHubRepo[]>({
    queryKey: ["github-repos"],
    queryFn: fetchRepos,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

export function useGitHubCommits(repo: string | null) {
  return useQuery<GitHubCommit[]>({
    queryKey: ["github-commits", repo],
    queryFn: () => fetchCommits(repo!),
    enabled: !!repo,
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });
}

export function useGitHubReadme(repo: string | null) {
  return useQuery<string>({
    queryKey: ["github-readme", repo],
    queryFn: () => fetchReadme(repo!),
    enabled: !!repo,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

export function useGitHubLanguages(repo: string | null) {
  return useQuery<Record<string, number>>({
    queryKey: ["github-languages", repo],
    queryFn: () => fetchLanguages(repo!),
    enabled: !!repo,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

export function useRepoContents(repo: string | null, path = "") {
  return useQuery({
    queryKey: ["github-contents", repo, path],
    queryFn: () => fetchRepoContents(repo!, path),
    enabled: !!repo,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
