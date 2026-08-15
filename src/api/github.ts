import type { GithubUser, GithubRepo } from '../types/github';

const BASE_URL = 'https://api.github.com';

// 1. 유저 정보 조회 API
export const fetchGithubUser = async (username: string): Promise<GithubUser> => {
  const cleanUsername = username.trim();
  const response = await fetch(`${BASE_URL}/users/${encodeURIComponent(cleanUsername)}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`'${cleanUsername}' 사용자를 찾을 수 없습니다.`);
    }
    if (response.status === 403) {
      throw new Error('GitHub API 호출 제한(시간당 60회)을 초과했습니다. 잠시 후 다시 시도해 주세요.');
    }
    throw new Error(`사용자 정보 조회 실패 (상태 코드: ${response.status})`);
  }
  return response.json();
};

// 2. 레포지토리 목록 조회 API
export const fetchGithubRepos = async (username: string): Promise<GithubRepo[]> => {
  const cleanUsername = username.trim();
  const response = await fetch(
    `${BASE_URL}/users/${encodeURIComponent(cleanUsername)}/repos?sort=updated&per_page=6`
  );

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('GitHub API 호출 제한(시간당 60회)을 초과했습니다. 잠시 후 다시 시도해 주세요.');
    }
    throw new Error(`레포지토리 목록 조회 실패 (상태 코드: ${response.status})`);
  }
  return response.json();
};