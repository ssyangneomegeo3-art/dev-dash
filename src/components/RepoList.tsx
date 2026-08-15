import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useGithubStore } from '../store/useGithubStore';
import { useToastStore } from '../store/useToastStore';
import type { GithubRepo } from '../types/github';

interface RepoListProps {
  repos: GithubRepo[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

type SortOption = 'updated' | 'stars' | 'forks';

export const RepoList: React.FC<RepoListProps> = ({
  repos,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}) => {
  const { pinnedRepoIds, togglePinRepo, setSelectedReadmeRepo } = useGithubStore();
  const { addToast } = useToastStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('ALL');
  const [sortBy, setSortBy] = useState<SortOption>('updated');

  const observerTarget = useRef<HTMLDivElement>(null);

  // 고유 언어 목록 추출
  const availableLanguages = useMemo(() => {
    const langs = new Set<string>();
    repos.forEach((r) => {
      if (r.language) langs.add(r.language);
    });
    return Array.from(langs).sort();
  }, [repos]);

  // 필터링 & 정렬 & 핀 고정 정렬
  const processedRepos = useMemo(() => {
    let result = [...repos];

    // 1. 키워드 검색
    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(lower) ||
          (r.description && r.description.toLowerCase().includes(lower))
      );
    }

    // 2. 언어 필터
    if (selectedLanguage !== 'ALL') {
      result = result.filter((r) => r.language === selectedLanguage);
    }

    // 3. 정렬 기준
    result.sort((a, b) => {
      if (sortBy === 'stars') return b.stargazers_count - a.stargazers_count;
      if (sortBy === 'forks') return b.forks_count - a.forks_count;
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });

    // 4. 핀 고정 항목 최상단 배치
    return result.sort((a, b) => {
      const isAPinned = pinnedRepoIds.includes(a.id);
      const isBPinned = pinnedRepoIds.includes(b.id);
      if (isAPinned && !isBPinned) return -1;
      if (!isAPinned && isBPinned) return 1;
      return 0;
    });
  }, [repos, searchTerm, selectedLanguage, sortBy, pinnedRepoIds]);

  // 무한 스크롤 IntersectionObserver
  useEffect(() => {
    const currentTarget = observerTarget.current;
    if (!currentTarget || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(currentTarget);
    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 하이라이팅 렌더 헬퍼
  const renderHighlightedText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    const parts = text.split(new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return (
      <>
        {parts.map((part, idx) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <mark key={idx} className="highlight-mark">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  const handlePinToggle = (repo: GithubRepo) => {
    const wasPinned = pinnedRepoIds.includes(repo.id);
    togglePinRepo(repo.id);
    addToast(
      wasPinned ? `'${repo.name}' 고정이 해제되었습니다.` : `'${repo.name}' 저장소가 상단에 고정되었습니다.`,
      'info',
      2000
    );
  };

  return (
    <div className="repo-list-wrapper">
      <div className="repo-controls-card">
        <input
          type="text"
          className="repo-search-input"
          placeholder="저장소 이름 또는 설명 실시간 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="repo-filters-group">
          <select
            className="repo-select"
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            <option value="ALL">모든 언어</option>
            {availableLanguages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>

          <select
            className="repo-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
          >
            <option value="updated">최근 업데이트순</option>
            <option value="stars">스타(Stars) 많은순</option>
            <option value="forks">포크(Forks) 많은순</option>
          </select>
        </div>
      </div>

      <div className="repo-list-container" style={{ marginTop: '16px' }}>
        {processedRepos.length === 0 ? (
          <div className="repo-card" style={{ textAlign: 'center', padding: '36px' }}>
            <p style={{ color: 'var(--text-muted)' }}>조건에 일치하는 저장소가 없습니다.</p>
          </div>
        ) : (
          processedRepos.map((repo) => {
            const isPinned = pinnedRepoIds.includes(repo.id);
            return (
              <div key={repo.id} className={`repo-card ${isPinned ? 'pinned' : ''}`}>
                <div className="repo-card-top">
                  <div className="repo-card-title-group">
                    <a href={repo.html_url} target="_blank" rel="noreferrer" className="repo-link">
                      {renderHighlightedText(repo.name, searchTerm)}
                    </a>
                    <span className="repo-badge">{repo.private ? 'Private' : 'Public'}</span>
                  </div>

                  <div className="repo-card-actions">
                    <button
                      type="button"
                      className="repo-icon-btn"
                      onClick={() =>
                        setSelectedReadmeRepo({
                          owner: repo.owner.login,
                          name: repo.name,
                        })
                      }
                      title="README.md 미리보기"
                    >
                      📖 README
                    </button>
                    <button
                      type="button"
                      className={`repo-icon-btn ${isPinned ? 'active' : ''}`}
                      onClick={() => handlePinToggle(repo)}
                      title={isPinned ? '고정 해제' : '상단 고정'}
                    >
                      📌 {isPinned ? '고정됨' : '고정'}
                    </button>
                  </div>
                </div>

                {repo.description && (
                  <p className="repo-description">
                    {renderHighlightedText(repo.description, searchTerm)}
                  </p>
                )}

                <div className="repo-meta">
                  {repo.language && (
                    <span className="repo-meta-item">
                      🔹 {repo.language}
                    </span>
                  )}
                  <span className="repo-meta-item">⭐ {repo.stargazers_count}</span>
                  <span className="repo-meta-item">🍴 {repo.forks_count}</span>
                  <span className="repo-meta-item">
                    🕒 {new Date(repo.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            );
          })
        )}

        <div ref={observerTarget} className="infinite-scroll-trigger">
          {isFetchingNextPage && <p>저장소를 추가로 불러오는 중...</p>}
          {!hasNextPage && repos.length > 0 && <p>모든 저장소를 불러왔습니다.</p>}
        </div>
      </div>
    </div>
  );
};