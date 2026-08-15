// src/api/github.ts
import type { GithubUser, GithubRepo } from '../types/github'; // 👈 import 뒤에 'type' 추가

const BASE_URL = 'https://api.github.com';

// 1. 유저 프로필 조회 API
export const fetchGithubUser = async (username: string): Promise<GithubUser> => {
  const response = await fetch(`${BASE_URL}/users/${username}`);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`'${username}' 사용자를 찾을 수 없습니다.`);
    }
    throw new Error(`사용자 정보 조회 실패 (상태 코드: ${response.status})`);
  }
  return response.json();
};

// 2. 레포지토리 목록 조회 API
export const fetchGithubRepos = async (username: string): Promise<GithubRepo[]> => {
  const response = await fetch(`${BASE_URL}/users/${username}/repos?sort=updated&per_page=6`);
  if (!response.ok) {
    throw new Error(`레포지토리 목록 조회 실패 (상태 코드: ${response.status})`);
  }
  return response.json();
};