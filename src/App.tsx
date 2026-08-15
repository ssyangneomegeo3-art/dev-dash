import React, { useMemo } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { RecentSearchTags } from './components/RecentSearchTags';
import { UserProfileCard } from './components/UserProfileCard';
import { LanguageStats } from './components/LanguageStats';
import { RepoList } from './components/RepoList';
import { SkeletonLoader } from './components/SkeletonLoader';
import { TokenModal } from './components/TokenModal';
import { ReadmeModal } from './components/ReadmeModal';
import { Toast } from './components/Toast';
import { useGithubData } from './hooks/useGithubData';
import { useGithubStore } from './store/useGithubStore';

export const App: React.FC = () => {
  const { username } = useGithubStore();
  const { userQuery, reposQuery } = useGithubData();

  // 무한 스크롤 저장소 페이지 병합
  const allRepos = useMemo(() => {
    if (!reposQuery.data) return [];
    return reposQuery.data.pages.flatMap((page) => page);
  }, [reposQuery.data]);

  return (
    <div className="app-container">
      <Header />

      <main className="main-content">
        <SearchBar />
        <RecentSearchTags />

        {userQuery.isLoading && <SkeletonLoader />}

        {userQuery.isSuccess && userQuery.data && (
          <div className="dashboard-grid">
            <aside className="sidebar-col">
              <UserProfileCard user={userQuery.data} />
              <LanguageStats repos={allRepos} />
            </aside>

            <section className="content-col">
              <RepoList
                repos={allRepos}
                hasNextPage={Boolean(reposQuery.hasNextPage)}
                isFetchingNextPage={reposQuery.isFetchingNextPage}
                fetchNextPage={reposQuery.fetchNextPage}
              />
            </section>
          </div>
        )}

        {userQuery.isError && (
          <div
            className="repo-card"
            style={{ textAlign: 'center', padding: '48px 24px', marginTop: '24px' }}
          >
            <h3 style={{ color: 'var(--accent-red)', marginBottom: '8px' }}>
              데이터를 불러올 수 없습니다
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              '{username}' 계정이 존재하지 않거나 일시적인 네트워크 오류가 발생했습니다.
            </p>
          </div>
        )}
      </main>

      {/* 전역 모달 및 토스트 피드백 */}
      <TokenModal />
      <ReadmeModal />
      <Toast />
    </div>
  );
};

export default App;