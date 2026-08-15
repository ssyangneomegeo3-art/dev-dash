import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface GithubState {
  username: string;
  recentSearches: string[];
  isDarkMode: boolean;
  pinnedRepoIds: number[];
  setUsername: (name: string) => void;
  addRecentSearch: (name: string) => void;
  removeRecentSearch: (name: string) => void;
  toggleDarkMode: () => void;
  togglePinRepo: (id: number) => void;
}

export const useGithubStore = create<GithubState>()(
  persist(
    (set) => ({
      username: 'ssyangneomegeo3-art',
      recentSearches: ['ssyangneomegeo3-art'],
      isDarkMode: false,
      pinnedRepoIds: [],

      setUsername: (name: string) => set({ username: name.trim() }),

      addRecentSearch: (name: string) =>
        set((state) => {
          const trimmed = name.trim();
          if (!trimmed) return state;
          const filtered = state.recentSearches.filter(
            (item) => item.toLowerCase() !== trimmed.toLowerCase()
          );
          return { recentSearches: [trimmed, ...filtered].slice(0, 5) };
        }),

      removeRecentSearch: (name: string) =>
        set((state) => ({
          recentSearches: state.recentSearches.filter((item) => item !== name),
        })),

      toggleDarkMode: () =>
        set((state) => {
          const nextMode = !state.isDarkMode;
          if (nextMode) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          return { isDarkMode: nextMode };
        }),

      togglePinRepo: (id: number) =>
        set((state) => ({
          pinnedRepoIds: state.pinnedRepoIds.includes(id)
            ? state.pinnedRepoIds.filter((item) => item !== id)
            : [...state.pinnedRepoIds, id],
        })),
    }),
    {
      name: 'devdash-github-storage',
    }
  )
);