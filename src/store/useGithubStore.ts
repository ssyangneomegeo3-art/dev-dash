import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ReadmeRepoInfo } from '../types/github';

export type ThemeMode = 'light' | 'dark';

export interface GithubState {
  username: string;
  recentSearches: string[];
  theme: ThemeMode;
  pinnedRepoIds: number[];
  token: string | null;
  isTokenModalOpen: boolean;
  selectedReadmeRepo: ReadmeRepoInfo | null;
  setUsername: (name: string) => void;
  addRecentSearch: (name: string) => void;
  removeRecentSearch: (name: string) => void;
  toggleTheme: () => void;
  togglePinRepo: (id: number) => void;
  setToken: (token: string | null) => void;
  setIsTokenModalOpen: (isOpen: boolean) => void;
  setSelectedReadmeRepo: (repo: ReadmeRepoInfo | null) => void;
}

const applyThemeToDOM = (theme: ThemeMode) => {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }
};

export const useGithubStore = create<GithubState>()(
  persist(
    (set, get) => ({
      username: 'ssyangneomegeo3-art',
      recentSearches: ['ssyangneomegeo3-art'],
      theme: 'dark',
      pinnedRepoIds: [],
      token: null,
      isTokenModalOpen: false,
      selectedReadmeRepo: null,

      setUsername: (username: string) => set({ username }),

      addRecentSearch: (search: string) => {
        const trimmed = search.trim();
        if (!trimmed) return;
        const current = get().recentSearches;
        const filtered = current.filter((item) => item.toLowerCase() !== trimmed.toLowerCase());
        const updated = [trimmed, ...filtered].slice(0, 5);
        set({ recentSearches: updated });
      },

      removeRecentSearch: (search: string) => {
        set((state) => ({
          recentSearches: state.recentSearches.filter((item) => item !== search),
        }));
      },

      toggleTheme: () => {
        const nextTheme: ThemeMode = get().theme === 'dark' ? 'light' : 'dark';
        applyThemeToDOM(nextTheme);
        set({ theme: nextTheme });
      },

      togglePinRepo: (repoId: number) => {
        set((state) => {
          const isPinned = state.pinnedRepoIds.includes(repoId);
          const pinnedRepoIds = isPinned
            ? state.pinnedRepoIds.filter((id) => id !== repoId)
            : [repoId, ...state.pinnedRepoIds];
          return { pinnedRepoIds };
        });
      },

      setToken: (token: string | null) => set({ token }),

      setIsTokenModalOpen: (isTokenModalOpen: boolean) => set({ isTokenModalOpen }),

      setSelectedReadmeRepo: (selectedReadmeRepo: ReadmeRepoInfo | null) =>
        set({ selectedReadmeRepo }),
    }),
    {
      name: 'devdash-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        username: state.username,
        recentSearches: state.recentSearches,
        theme: state.theme,
        pinnedRepoIds: state.pinnedRepoIds,
        token: state.token,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.theme) {
          applyThemeToDOM(state.theme);
        }
      },
    }
  )
);