import type { GithubUser, GithubRepo } from '../types/github';
import { GITHUB_API_BASE } from '../types/github';

export const fetchGithubUser = async (username: string): Promise<GithubUser> => {
  const response = await fetch(`${GITHUB_API_BASE}/users/${username}`);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('User not found');
    }
    if (response.status === 403) {
      throw new Error('GitHub API rate limit exceeded. Please try again later.');
    }
    throw new Error(`Failed to fetch user data (Status: ${response.status})`);
  }
  return response.json();
};

export const fetchGithubRepos = async (
  username: string,
  page: number = 1,
  perPage: number = 12
): Promise<GithubRepo[]> => {
  const response = await fetch(
    `${GITHUB_API_BASE}/users/${username}/repos?per_page=${perPage}&page=${page}&sort=updated`
  );
  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('GitHub API rate limit exceeded. Please try again later.');
    }
    throw new Error(`Failed to fetch repositories (Status: ${response.status})`);
  }
  return response.json();
};