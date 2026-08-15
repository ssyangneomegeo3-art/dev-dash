import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { fetchGithubUser, fetchGithubRepos } from '../api/github';
import type { GithubUser, GithubRepo } from '../types/github';

const REPOS_PER_PAGE = 12;

export const useGithubData = (username: string) => {
  // GitHub 유저 기본 정보 조회
  const userQuery = useQuery<GithubUser, Error>({
    queryKey: ['github-user', username],
    queryFn: () => fetchGithubUser(username),
    staleTime: 1000 * 60 * 5, // 5분 캐싱
    enabled: !!username.trim(),
  });

  // GitHub 레포지토리 무한 스크롤 쿼리
  const reposQuery = useInfiniteQuery<GithubRepo[], Error>({
    queryKey: ['github-repos', username],
    queryFn: ({ pageParam }) =>
      fetchGithubRepos(username, pageParam as number, REPOS_PER_PAGE),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (lastPage.length < REPOS_PER_PAGE) {
        return undefined; // 마지막 페이지 도달
      }
      return (lastPageParam as number) + 1;
    },
    staleTime: 1000 * 60 * 5, // 5분 캐싱
    enabled: !!username.trim(),
  });

  // 2차원 pages 배열을 1차원 레포지토리 배열로 평탄화
  const repos = useMemo(() => {
    return reposQuery.data?.pages.flatMap((page) => page) ?? [];
  }, [reposQuery.data]);

  return {
    user: userQuery.data,
    isUserLoading: userQuery.isLoading,
    userError: userQuery.error,

    repos,
    isReposLoading: reposQuery.isLoading,
    reposError: reposQuery.error,
    hasNextPage: reposQuery.hasNextPage,
    isFetchingNextPage: reposQuery.isFetchingNextPage,
    fetchNextPage: reposQuery.fetchNextPage,

    isLoading: userQuery.isLoading || reposQuery.isLoading,
  };
};