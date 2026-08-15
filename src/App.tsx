import React from 'react';
import { useGithubStore } from './store/useGithubStore';
import { useGithubData } from './hooks/useGithubData';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { RecentSearchTags } from './components/RecentSearchTags';
import { UserProfileCard } from './components/UserProfileCard';
import { LanguageStats } from './components/LanguageStats';
import { RepoList } from './components/RepoList';
import { SkeletonLoader } from './components/SkeletonLoader';

export const App: React.FC = () => {
  const username = useGithubStore((state) => state.username);
  const {
    user,
    repos,
    isLoading,
    userError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useGithubData(username);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-main)',
        color: 'var(--text-main)',
        transition: 'background-color 0.2s ease',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '24px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        <Header />
        <SearchBar />
        <RecentSearchTags />

        {userError && (
          <div
            style={{
              padding: '16px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              color: '#ef4444',
              fontSize: '14px',
            }}
          >
            ⚠️ {userError.message}
          </div>
        )}

        {isLoading ? (
          <SkeletonLoader />
        ) : (
          user && (
            <main
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '24px',
                alignItems: 'start',
              }}
            >
              {/* 좌측 사이드바: 프로필 및 언어 통계 */}
              <aside style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <UserProfileCard user={user} />
                <LanguageStats repos={repos} />
              </aside>

              {/* 우측 본문: 레포지토리 목록 (무한 스크롤) */}
              <div style={{ minWidth: 0, flex: 1 }}>
                <RepoList
                  repos={repos}
                  isLoading={false}
                  hasNextPage={hasNextPage}
                  isFetchingNextPage={isFetchingNextPage}
                  fetchNextPage={fetchNextPage}
                />
              </div>
            </main>
          )
        )}
      </div>
    </div>
  );
};

export default App;