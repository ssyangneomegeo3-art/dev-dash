import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GithubUIState {
  searchUsername: string;
  recentSearches: string[];
  isDarkMode: boolean; // 다크모드 상태
  setSearchUsername: (username: string) => void;
  removeRecentSearch: (target: string) => void;
  clearRecentSearches: () => void;
  toggleDarkMode: () => void; // 다크모드 토글 액션
}

export const useGithubStore = create<GithubUIState>()(
  persist(
    (set) => ({
      searchUsername: 'ssyangneomegeo3-art',
      recentSearches: ['ssyangneomegeo3-art'],
      isDarkMode: false, // 기본값: 라이트 모드

      setSearchUsername: (username: string) =>
        set((state) => {
          const trimmed = username.trim();
          if (!trimmed) return state;

          const updated = [
            trimmed,
            ...state.recentSearches.filter((name) => name.toLowerCase() !== trimmed.toLowerCase()),
          ].slice(0, 5);

          return {
            searchUsername: trimmed,
            recentSearches: updated,
          };
        }),

      removeRecentSearch: (target: string) =>
        set((state) => ({
          recentSearches: state.recentSearches.filter((name) => name !== target),
        })),

      clearRecentSearches: () => set({ recentSearches: [] }),

      // 다크모드 전환
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
    }),
    {
      name: 'devdash-storage', // LocalStorage Key
    }
  )
);