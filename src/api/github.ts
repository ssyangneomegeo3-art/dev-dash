import type { GithubUser, GithubRepo, RateLimitResponse } from '../types/github';

const getHeaders = (token?: string): HeadersInit => {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
  };
  if (token && token.trim()) {
    headers.Authorization = `Bearer ${token.trim()}`;
  }
  return headers;
};

// 1. 유저 프로필 정보 조회
export const fetchGithubUser = async (
  username: string,
  token?: string
): Promise<GithubUser> => {
  const res = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
    headers: getHeaders(token),
  });

  if (!res.ok) {
    throw new Error(`GitHub User API Error: ${res.status} ${res.statusText}`);
  }

  return res.json();
};

// 2. 저장소 목록 페이징 조회
export const fetchGithubRepos = async (
  username: string,
  page: number = 1,
  perPage: number = 12,
  token?: string
): Promise<GithubRepo[]> => {
  const res = await fetch(
    `https://api.github.com/users/${encodeURIComponent(username)}/repos?page=${page}&per_page=${perPage}&sort=updated`,
    {
      headers: getHeaders(token),
    }
  );

  if (!res.ok) {
    throw new Error(`GitHub Repos API Error: ${res.status} ${res.statusText}`);
  }

  return res.json();
};

// 3. API 잔여 한도(Rate Limit) 조회
export const fetchRateLimit = async (token?: string): Promise<RateLimitResponse> => {
  const res = await fetch('https://api.github.com/rate_limit', {
    headers: getHeaders(token),
  });

  if (!res.ok) {
    throw new Error(`GitHub Rate Limit API Error: ${res.status} ${res.statusText}`);
  }

  return res.json();
};

// 4. 저장소 README.md 원문 텍스트 조회
export const fetchRepoReadme = async (
  owner: string,
  repo: string,
  token?: string
): Promise<string> => {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.raw+json',
  };
  if (token && token.trim()) {
    headers.Authorization = `Bearer ${token.trim()}`;
  }

  const res = await fetch(
    `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/readme`,
    { headers }
  );

  if (!res.ok) {
    throw new Error(`README not found (${res.status})`);
  }

  return res.text();
};