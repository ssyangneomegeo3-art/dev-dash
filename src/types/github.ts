export interface GithubRepoOwner {
  login: string;
  avatar_url: string;
  html_url: string;
}

export interface GithubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  bio: string | null;
  company: string | null;
  location: string | null;
  blog: string | null;
  public_repos: number;
  followers: number;
  following: number;
}

export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  owner: GithubRepoOwner;
  html_url: string;
  description: string | null;
  fork: boolean;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
  used: number;
}

export interface RateLimitResponse {
  resources: {
    core: RateLimitInfo;
    graphql?: RateLimitInfo;
    search?: RateLimitInfo;
  };
  rate: RateLimitInfo;
}

export interface ReadmeRepoInfo {
  owner: string;
  name: string;
}