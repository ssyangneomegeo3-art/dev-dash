import { create } from 'zustand';
import type { GithubUser, GithubRepo } from '../types/github';

export interface GithubState {
  username: string;
  user: GithubUser | null;
  repos: GithubRepo[];
  isLoading: boolean;
  error: string | null;
  setUsername: (username: string) => void;
  fetchGithubData: (targetUser?: string) => Promise<void>;
}

export const useGithubStore = create<GithubState>((set, get) => ({
  username: 'ssyangneomegeo3-art',
  user: null,
  repos: [],
  isLoading: false,
  error: null,

  setUsername: (username: string) => set({ username }),

  fetchGithubData: async (targetUser?: string): Promise<void> => {
    const queryUser = targetUser || get().username;
    set({ isLoading: true, error: null });

    try {
      const userRes = await fetch(`https://api.github.com/users/${queryUser}`);
      if (!userRes.ok) {
        throw new Error('사용자 정보를 찾을 수 없습니다.');
      }
      const userData: GithubUser = await userRes.json();

      const repoRes = await fetch(
        `https://api.github.com/users/${queryUser}/repos?sort=updated&per_page=6`
      );
      if (!repoRes.ok) {
        throw new Error('레포지토리 정보를 가져오지 못했습니다.');
      }
      const repoData: GithubRepo[] = await repoRes.json();

      set({
        user: userData,
        repos: repoData,
        isLoading: false,
        username: queryUser,
      });
    } catch (err: any) {
      set({
        error: err?.message || '알 수 없는 오류가 발생했습니다.',
        isLoading: false,
        user: null,
        repos: [],
      });
    }
  },
}));