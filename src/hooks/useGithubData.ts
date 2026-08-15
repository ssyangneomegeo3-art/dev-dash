import { useEffect, useRef } from 'react';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { fetchGithubUser, fetchGithubRepos, fetchRateLimit } from '../api/github';
import { useGithubStore } from '../store/useGithubStore';
import { useToastStore } from '../store/useToastStore';
import type { GithubUser, GithubRepo } from '../types/github';

export const useGithubData = () => {
  const { username, token } = useGithubStore();
  const { addToast } = useToastStore();
  const lastReportedKeyRef = useRef<string>('');

  // 1. 유저 정보 조회 쿼리
  const userQuery = useQuery<GithubUser, Error>({
    queryKey: ['githubUser', username, token],
    queryFn: () => fetchGithubUser(username, token || undefined),
    enabled: Boolean(username.trim()),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  // 2. 저장소 무한 스크롤 쿼리
  const reposQuery = useInfiniteQuery<GithubRepo[], Error>({
    queryKey: ['githubRepos', username, token],
    queryFn: ({ pageParam = 1 }) =>
      fetchGithubRepos(username, pageParam as number, 12, token || undefined),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < 12) {
        return undefined;
      }
      return allPages.length + 1;
    },
    enabled: Boolean(username.trim()) && !userQuery.isError,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  // 3. API 한도(Rate Limit) 쿼리
  const rateLimitQuery = useQuery({
    queryKey: ['githubRateLimit', token],
    queryFn: () => fetchRateLimit(token || undefined),
    staleTime: 1000 * 60 * 1,
    refetchInterval: 1000 * 60 * 2,
  });

  // 4. 쿼리 에러 발생 시 토스트 알림 연동 (중복 방지 가드)
  useEffect(() => {
    if (userQuery.isError && userQuery.error) {
      const currentErrorKey = `${username}-${userQuery.error.message}`;
      if (lastReportedKeyRef.current === currentErrorKey) return;
      lastReportedKeyRef.current = currentErrorKey;

      const errMsg = userQuery.error.message;
      if (errMsg.includes('404')) {
        addToast(`'${username}' 사용자를 찾을 수 없습니다. 아이디를 확인해 주세요.`, 'error');
      } else if (errMsg.includes('403') || errMsg.includes('rate limit')) {
        addToast('GitHub API 요청 한도가 초과되었습니다. PAT 토큰을 등록해 주세요.', 'warning');
      } else {
        addToast(`네트워크 오류가 발생했습니다: ${errMsg}`, 'error');
      }
    } else if (userQuery.isSuccess) {
      lastReportedKeyRef.current = '';
    }
  }, [userQuery.isError, userQuery.isSuccess, userQuery.error, username, addToast]);

  return {
    userQuery,
    reposQuery,
    rateLimitQuery,
  };
};