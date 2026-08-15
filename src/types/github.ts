export interface GithubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
}

export interface GithubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
}