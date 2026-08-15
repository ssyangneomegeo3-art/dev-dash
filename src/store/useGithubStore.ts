import { create } from 'zustand';

interface GithubUIState {
  searchUsername: string;
  setSearchUsername: (username: string) => void;
}

export const useGithubStore = create<GithubUIState>((set) => ({
  searchUsername: 'ssyangneomegeo3-art',
  setSearchUsername: (username: string) => set({ searchUsername: username.trim() }),
}));