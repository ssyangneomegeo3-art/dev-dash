import React, { useState, useMemo, useEffect, useRef } from 'react';
import type { GithubRepo } from '../types/github';
import { useGithubStore } from '../store/useGithubStore';

interface RepoListProps {
  repos: GithubRepo[];
  isLoading: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
}

type SortOption = 'stars' | 'forks' | 'name';

// 검색 키워드 하이라이팅 컴포넌트
const HighlightText: React.FC<{ text: string | null; keyword: string }> = ({ text, keyword }) => {
  if (!text) return null;
  if (!keyword.trim()) return <>{text}</>;

  const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedKeyword})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <mark
            key={index}
            style={{
              backgroundColor: 'rgba(234, 179, 8, 0.35)',
              color: 'var(--text-main)',
              borderRadius: '2px',
              padding: '0 2px',
            }}
          >
            {part}
          </mark>
        ) : (
          <React.Fragment key={index}>{part}</React.Fragment>
        )
      )}
    </>
  );
};

export const RepoList: React.FC<RepoListProps> = ({
  repos,
  isLoading,
  hasNextPage = false,
  isFetchingNextPage = false,
  fetchNextPage,
}) => {
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [sortBy, setSortBy] = useState<SortOption>('stars');

  const pinnedRepoIds = useGithubStore((state) => state.pinnedRepoIds);
  const togglePinRepo = useGithubStore((state) => state.togglePinRepo);

  // 무한 스크롤 감지용 Observer Target Ref
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // 주력 언어 목록 추출
  const languages = useMemo(() => {
    const langSet = new Set<string>();
    repos.forEach((repo) => {
      if (repo.language) langSet.add(repo.language);
    });
    return ['All', ...Array.from(langSet)];
  }, [repos]);

  // 필터링 및 정렬 파이프라인
  const processedRepos = useMemo(() => {
    const trimmedKeyword = searchKeyword.trim().toLowerCase();

    const filtered = repos.filter((repo) => {
      const matchLanguage =
        selectedLanguage === 'All' || repo.language === selectedLanguage;

      const matchKeyword =
        !trimmedKeyword ||
        repo.name.toLowerCase().includes(trimmedKeyword) ||
        (repo.description && repo.description.toLowerCase().includes(trimmedKeyword));

      return matchLanguage && matchKeyword;
    });

    return filtered.sort((a, b) => {
      const isAPinned = pinnedRepoIds.includes(a.id);
      const isBPinned = pinnedRepoIds.includes(b.id);

      if (isAPinned && !isBPinned) return -1;
      if (!isAPinned && isBPinned) return 1;

      if (sortBy === 'stars') return b.stargazers_count - a.stargazers_count;
      if (sortBy === 'forks') return b.forks_count - a.forks_count;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [repos, selectedLanguage, searchKeyword, sortBy, pinnedRepoIds]);

  // Intersection Observer 기반 무한 스크롤 트리거
  useEffect(() => {
    if (!fetchNextPage || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = loadMoreRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) {
    return null;
  }

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* 검색창 및 컨트롤 바 */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'var(--bg-card)',
          padding: '16px',
          borderRadius: '8px',
          border: '1px solid var(--border-color)',
        }}
      >
        {/* 실시간 키워드 검색 */}
        <div style={{ flex: '1 1 240px', position: 'relative' }}>
          <input
            type="text"
            placeholder="Search repositories by name or description..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 32px',
              borderRadius: '6px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-main)',
              color: 'var(--text-main)',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          <span
            style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-sub)',
              fontSize: '14px',
              pointerEvents: 'none',
            }}
          >
            🔍
          </span>
          {searchKeyword && (
            <button
              onClick={() => setSearchKeyword('')}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-sub)',
                cursor: 'pointer',
                fontSize: '12px',
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* 정렬 셀렉트 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label htmlFor="repo-sort" style={{ fontSize: '13px', color: 'var(--text-sub)' }}>
            Sort:
          </label>
          <select
            id="repo-sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-main)',
              color: 'var(--text-main)',
              fontSize: '13px',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="stars">Stars (High to Low)</option>
            <option value="forks">Forks (High to Low)</option>
            <option value="name">Name (A to Z)</option>
          </select>
        </div>
      </div>

      {/* 언어 필터 칩 */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {languages.map((lang) => {
          const isSelected = selectedLanguage === lang;
          return (
            <button
              key={lang}
              onClick={() => setSelectedLanguage(lang)}
              style={{
                padding: '4px 12px',
                borderRadius: '16px',
                fontSize: '12px',
                fontWeight: isSelected ? 600 : 400,
                border: `1px solid ${isSelected ? 'var(--accent-color)' : 'var(--border-color)'}`,
                backgroundColor: isSelected ? 'var(--accent-color)' : 'var(--bg-card)',
                color: isSelected ? '#ffffff' : 'var(--text-main)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {lang}
            </button>
          );
        })}
      </div>

      {/* 결과 수 안내 */}
      <div style={{ fontSize: '13px', color: 'var(--text-sub)' }}>
        Showing <strong>{processedRepos.length}</strong> loaded repositories
      </div>

      {/* 레포지토리 카드 그리드 */}
      {processedRepos.length === 0 ? (
        <div
          style={{
            padding: '48px 16px',
            textAlign: 'center',
            backgroundColor: 'var(--bg-card)',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            color: 'var(--text-sub)',
          }}
        >
          No repositories match your filter criteria.
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '16px',
          }}
        >
          {processedRepos.map((repo) => {
            const isPinned = pinnedRepoIds.includes(repo.id);

            return (
              <article
                key={repo.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '16px',
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: '8px',
                  border: `1px solid ${isPinned ? 'var(--accent-color)' : 'var(--border-color)'}`,
                  position: 'relative',
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: '8px',
                    }}
                  >
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: '16px',
                        fontWeight: 600,
                        color: 'var(--accent-color)',
                        textDecoration: 'none',
                        wordBreak: 'break-all',
                      }}
                    >
                      <HighlightText text={repo.name} keyword={searchKeyword} />
                    </a>
                    <button
                      onClick={() => togglePinRepo(repo.id)}
                      title={isPinned ? 'Unpin repository' : 'Pin to top'}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '16px',
                        padding: '2px 4px',
                        opacity: isPinned ? 1 : 0.4,
                        transition: 'opacity 0.15s ease',
                      }}
                    >
                      📌
                    </button>
                  </div>

                  <p
                    style={{
                      fontSize: '13px',
                      color: 'var(--text-sub)',
                      margin: '8px 0 16px 0',
                      lineHeight: 1.4,
                      minHeight: '36px',
                    }}
                  >
                    <HighlightText
                      text={repo.description || 'No description provided.'}
                      keyword={searchKeyword}
                    />
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    fontSize: '12px',
                    color: 'var(--text-sub)',
                  }}
                >
                  {repo.language && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--accent-color)',
                          display: 'inline-block',
                        }}
                      />
                      {repo.language}
                    </span>
                  )}
                  <span>⭐ {repo.stargazers_count}</span>
                  <span>🍴 {repo.forks_count}</span>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* 무한 스크롤 Observer 감지 영역 & 수동 로드 버튼 */}
      <div
        ref={loadMoreRef}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '24px 0',
        }}
      >
        {isFetchingNextPage ? (
          <div style={{ color: 'var(--text-sub)', fontSize: '14px' }}>
            Loading more repositories...
          </div>
        ) : hasNextPage ? (
          <button
            onClick={() => fetchNextPage && fetchNextPage()}
            style={{
              padding: '8px 20px',
              borderRadius: '6px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-main)',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background-color 0.15s ease',
            }}
          >
            Load More Repositories
          </button>
        ) : repos.length > 0 ? (
          <div style={{ color: 'var(--text-sub)', fontSize: '13px' }}>
            All repositories loaded ({repos.length}).
          </div>
        ) : null}
      </div>
    </section>
  );
};