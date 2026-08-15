import React, { useState, useEffect } from 'react';
import type { GithubRepo } from './types/github';
import { useGithubStore } from './store/useGithubStore';
import { useGithubData } from './hooks/useGithubData';
import { SkeletonLoader } from './components/SkeletonLoader';

export default function App() {
  const {
    searchUsername,
    recentSearches,
    isDarkMode,
    setSearchUsername,
    removeRecentSearch,
    clearRecentSearches,
    toggleDarkMode,
  } = useGithubStore();

  const [inputValue, setInputValue] = useState(searchUsername);

  const { user, repos, isLoading, isFetching, isError, error, refetchAll } =
    useGithubData(searchUsername);

  // 테마 색상 정의
  const theme = {
    bg: isDarkMode ? '#0f172a' : '#f8fafc',
    cardBg: isDarkMode ? '#1e293b' : '#ffffff',
    repoCardBg: isDarkMode ? '#1e293b' : '#ffffff',
    text: isDarkMode ? '#f8fafc' : '#0f172a',
    subText: isDarkMode ? '#94a3b8' : '#64748b',
    border: isDarkMode ? '#334155' : '#e2e8f0',
    inputBg: isDarkMode ? '#0f172a' : '#ffffff',
    tagBg: isDarkMode ? '#334155' : '#e2e8f0',
    tagActiveBg: isDarkMode ? '#1e3a8a' : '#dbeafe',
    tagActiveText: isDarkMode ? '#93c5fd' : '#1d4ed8',
  };

  // 브라우저 전체 body 배경색을 다크모드 테마와 강제 동기화 (외곽 흰색 여백 원천 차단)
  useEffect(() => {
    document.body.style.backgroundColor = theme.bg;
    document.body.style.color = theme.text;
  }, [isDarkMode, theme.bg, theme.text]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    setSearchUsername(inputValue.trim());
  };

  const handleTagClick = (username: string) => {
    setInputValue(username);
    setSearchUsername(username);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: theme.bg,
        color: theme.text,
        transition: 'background-color 0.2s ease, color 0.2s ease',
      }}
    >
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 16px', fontFamily: 'inherit' }}>
        
        {/* 상단 다크모드 토글 버튼 */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
          <button
            onClick={toggleDarkMode}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: `1px solid ${theme.border}`,
              backgroundColor: theme.cardBg,
              color: theme.text,
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            }}
          >
            {isDarkMode ? '☀️ 라이트 모드로 전환' : '🌙 다크 모드로 전환'}
          </button>
        </div>

        {/* 헤더 및 검색창 */}
        <header style={{ marginBottom: '28px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '30px', fontWeight: 'bold', marginBottom: '8px' }}>🚀 DevDash</h1>
          <p style={{ color: theme.subText, marginBottom: '20px', fontSize: '15px' }}>
            GitHub 개발자 프로필 및 레포지토리 대시보드
          </p>

          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', maxWidth: '520px', margin: '0 auto 12px auto' }}>
            <input
              type="text"
              placeholder="GitHub 사용자 아이디 입력 (예: torvalds, gaearon)..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '8px',
                border: `1px solid ${theme.border}`,
                backgroundColor: theme.inputBg,
                color: theme.text,
                fontSize: '15px',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              style={{
                padding: '12px 24px',
                borderRadius: '8px',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                border: 'none',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              검색
            </button>
          </form>

          {/* 최근 검색어 태그 */}
          {recentSearches.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '16px' }}>
              <span style={{ fontSize: '13px', color: theme.subText, fontWeight: 500 }}>최근 검색:</span>
              {recentSearches.map((name) => {
                const isSelected = name.toLowerCase() === searchUsername.toLowerCase();
                return (
                  <span
                    key={name}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '5px 12px',
                      borderRadius: '16px',
                      fontSize: '12px',
                      backgroundColor: isSelected ? theme.tagActiveBg : theme.tagBg,
                      color: isSelected ? theme.tagActiveText : theme.text,
                      fontWeight: isSelected ? 600 : 400,
                      border: `1px solid ${theme.border}`,
                      cursor: 'pointer',
                    }}
                    onClick={() => handleTagClick(name)}
                  >
                    @{name}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeRecentSearch(name);
                      }}
                      style={{
                        border: 'none',
                        background: 'none',
                        color: theme.subText,
                        cursor: 'pointer',
                        fontSize: '13px',
                        padding: 0,
                        lineHeight: 1,
                      }}
                    >
                      ×
                    </button>
                  </span>
                );
              })}
              <button
                onClick={clearRecentSearches}
                style={{
                  border: 'none',
                  background: 'none',
                  color: theme.subText,
                  fontSize: '12px',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  marginLeft: '4px',
                }}
              >
                전체 삭제
              </button>
            </div>
          )}
        </header>

        {/* 백그라운드 캐시 동기화 인디케이터 */}
        {isFetching && !isLoading && (
          <div style={{ textAlign: 'center', marginBottom: '16px', color: '#3b82f6', fontSize: '13px', fontWeight: 500 }}>
            🔄 최신 데이터 동기화 중...
          </div>
        )}

        {/* 로딩 중: 스켈레톤 UI */}
        {isLoading && <SkeletonLoader />}

        {/* 에러 상태 UI */}
        {isError && (
          <div
            style={{
              backgroundColor: isDarkMode ? '#450a0a' : '#fef2f2',
              border: `1px solid ${isDarkMode ? '#7f1d1d' : '#fecaca'}`,
              color: isDarkMode ? '#fca5a5' : '#b91c1c',
              padding: '18px',
              borderRadius: '10px',
              textAlign: 'center',
              marginBottom: '24px',
            }}
          >
            <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>⚠️ 데이터를 불러오지 못했습니다.</p>
            <p style={{ fontSize: '14px', marginBottom: '14px' }}>{error?.message || '알 수 없는 오류가 발생했습니다.'}</p>
            <button
              onClick={() => refetchAll()}
              style={{
                padding: '8px 18px',
                backgroundColor: '#dc2626',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 600,
              }}
            >
              다시 시도
            </button>
          </div>
        )}

        {/* 정상 데이터 렌더링 영역 */}
        {!isLoading && !isError && user && (
          <main>
            {/* 프로필 카드 */}
            <section
              style={{
                display: 'flex',
                gap: '24px',
                alignItems: 'center',
                backgroundColor: theme.cardBg,
                padding: '24px',
                borderRadius: '12px',
                border: `1px solid ${theme.border}`,
                marginBottom: '32px',
                boxShadow: isDarkMode ? 'none' : '0 1px 3px rgba(0,0,0,0.05)',
              }}
            >
              <img
                src={user.avatar_url}
                alt={user.login}
                style={{ width: '96px', height: '96px', borderRadius: '50%', border: `2px solid ${theme.border}` }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                  <h2 style={{ fontSize: '22px', fontWeight: 'bold', margin: 0 }}>{user.name || user.login}</h2>
                  <a
                    href={user.html_url}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: '#3b82f6', fontSize: '14px', textDecoration: 'none' }}
                  >
                    @{user.login} ↗
                  </a>
                </div>
                <p style={{ color: theme.subText, fontSize: '14px', marginBottom: '16px' }}>
                  {user.bio || '등록된 소개글이 없습니다.'}
                </p>

                <div style={{ display: 'flex', gap: '16px', fontSize: '14px', flexWrap: 'wrap' }}>
                  <span>📦 <strong>{user.public_repos}</strong> 레포지토리</span>
                  <span>👥 <strong>{user.followers}</strong> 팔로워</span>
                  <span>✨ <strong>{user.following}</strong> 팔로잉</span>
                </div>
              </div>
            </section>

            {/* 레포지토리 목록 */}
            <section>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>📂 최근 활동 레포지토리 (최신순)</h3>
              {repos && repos.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                  {repos.map((repo: GithubRepo) => (
                    <div
                      key={repo.id}
                      style={{
                        padding: '18px',
                        backgroundColor: theme.repoCardBg,
                        borderRadius: '10px',
                        border: `1px solid ${theme.border}`,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: isDarkMode ? 'none' : '0 1px 3px rgba(0,0,0,0.05)',
                      }}
                    >
                      <div>
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            fontWeight: 600,
                            fontSize: '15px',
                            color: isDarkMode ? '#60a5fa' : '#1d4ed8',
                            textDecoration: 'none',
                            wordBreak: 'break-all',
                          }}
                        >
                          {repo.name} ↗
                        </a>
                        <p style={{ fontSize: '13px', color: theme.subText, marginTop: '8px', marginBottom: '14px', minHeight: '38px', lineHeight: 1.4 }}>
                          {repo.description || '설명이 없습니다.'}
                        </p>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '12px',
                          color: theme.subText,
                          paddingTop: '10px',
                          borderTop: `1px solid ${theme.border}`,
                        }}
                      >
                        <span>🏷️ {repo.language || 'Plain'}</span>
                        <span>⭐ {repo.stargazers_count} | 🍴 {repo.forks_count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: theme.subText, textAlign: 'center', padding: '32px 0' }}>공개된 레포지토리가 없습니다.</p>
              )}
            </section>
          </main>
        )}
      </div>
    </div>
  );
}