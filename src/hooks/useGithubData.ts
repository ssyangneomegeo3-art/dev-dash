import { useQuery } from '@tanstack/react-query';
import { fetchGithubUser, fetchGithubRepos } from '../api/github';

export const useGithubData = (username: string) => {
  const userQuery = useQuery({
    queryKey: ['githubUser', username],
    queryFn: () => fetchGithubUser(username),
    enabled: !!username,
    staleTime: 1000 * 60 * 5, // 5분 캐싱
    gcTime: 1000 * 60 * 30,  // 30분 메모리 유지
  });

  const reposQuery = useQuery({
    queryKey: ['githubRepos', username],
    queryFn: () => fetchGithubRepos(username),
    enabled: !!username,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

  return {
    user: userQuery.data,
    repos: reposQuery.data,
    isLoading: userQuery.isLoading || reposQuery.isLoading,
    isFetching: userQuery.isFetching || reposQuery.isFetching,
    isError: userQuery.isError || reposQuery.isError,
    error: (userQuery.error || reposQuery.error) as Error | null,
    refetchAll: () => {
      userQuery.refetch();
      reposQuery.refetch();
    },
  };
};