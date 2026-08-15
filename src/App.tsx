import React, { useState } from 'react';
import { useGithubStore } from './store/useGithubStore';
import { useGithubData } from './hooks/useGithubData';

export default function App() {
  const { searchUsername, setSearchUsername } = useGithubStore();
  const [inputValue, setInputValue] = useState(searchUsername);

  const { user, repos, isLoading, isFetching, isError, error, refetchAll } =
    useGithubData(searchUsername);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    setSearchUsername(inputValue.trim());
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 16px', fontFamily: 'system-ui, sans-serif', color: '#1f2937' }}>
      <header style={{ marginBottom: '32px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>🚀 DevDash</h1>
        <p style={{ color: '#6b7280', marginBottom: '20px' }}>GitHub 개발자 프로필 및 레포지토리 대시보드</p>

        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', maxWidth: '500px', margin: '0 auto' }}>
          <input
            type="text"
            placeholder="GitHub 사용자 아이디 입력..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              fontSize: '15px',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            style={{
              padding: '10px 20px',
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
      </header>

      {/* 백그라운드 캐시 동기화 표시 */}
      {isFetching && !isLoading && (
        <div style={{ textAlign: 'center', marginBottom: '16px', color: '#2563eb', fontSize: '13px', fontWeight: 500 }}>
          🔄 캐시 확인 및 최신 데이터 동기화 중...
        </div>
      )}

      {/* 로딩 UI */}
      {isLoading && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#6b7280' }}>
          <div style={{ fontSize: '20px', marginBottom: '8px' }}>⏳ 데이터 불러오는 중...</div>
          <p>GitHub API에서 최신 프로필 정보를 가져오고 있습니다.</p>
        </div>
      )}

      {/* 에러 UI */}
      {isError && (
        <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '16px', borderRadius: '8px', textAlign: 'center', marginBottom: '24px' }}>
          <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>⚠️ 데이터를 불러오지 못했습니다.</p>
          <p style={{ fontSize: '14px', marginBottom: '12px' }}>{error?.message || '알 수 없는 오류가 발생했습니다.'}</p>
          <button
            onClick={() => refetchAll()}
            style={{
              padding: '6px 14px',
              backgroundColor: '#b91c1c',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            다시 시도
          </button>
        </div>
      )}

      {/* 정상 렌더링 영역 */}
      {!isLoading && !isError && user && (
        <main>
          {/* 프로필 카드 */}
          <section style={{ display: 'flex', gap: '24px', alignItems: 'center', backgroundColor: '#f9fafb', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '32px' }}>
            <img
              src={user.avatar_url}
              alt={user.login}
              style={{ width: '100px', height: '100px', borderRadius: '50%', border: '2px solid #e5e7eb' }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 'bold', margin: 0 }}>{user.name || user.login}</h2>
                <a
                  href={user.html_url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#2563eb', fontSize: '14px', textDecoration: 'none' }}
                >
                  @{user.login} ↗
                </a>
              </div>
              <p style={{ color: '#4b5563', fontSize: '14px', marginBottom: '16px' }}>
                {user.bio || '등록된 소개글이 없습니다.'}
              </p>

              <div style={{ display: 'flex', gap: '16px', fontSize: '14px' }}>
                <span>📦 <strong>{user.public_repos}</strong> 레포지토리</span>
                <span>👥 <strong>{user.followers}</strong> 팔로워</span>
                <span>✨ <strong>{user.following}</strong> 팔로잉</span>
              </div>
            </div>
          </section>

          {/* 최근 레포지토리 목록 */}
          <section>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>📂 최근 활동 레포지토리 (최신순)</h3>
            {repos && repos.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                {repos.map((repo) => (
                  <div
                    key={repo.id}
                    style={{
                      padding: '16px',
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    }}
                  >
                    <div>
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noreferrer"
                        style={{ fontWeight: 600, fontSize: '15px', color: '#1d4ed8', textDecoration: 'none', wordBreak: 'break-all' }}
                      >
                        {repo.name} ↗
                      </a>
                      <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '6px', marginBottom: '12px', minHeight: '38px', lineHeight: 1.4 }}>
                        {repo.description || '설명이 없습니다.'}
                      </p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6b7280', paddingTop: '8px', borderTop: '1px solid #f3f4f6' }}>
                      <span>🏷️ {repo.language || 'Plain'}</span>
                      <span>⭐ {repo.stargazers_count} | 🍴 {repo.forks_count}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#6b7280', textAlign: 'center', padding: '32px 0' }}>공개된 레포지토리가 없습니다.</p>
            )}
          </section>
        </main>
      )}
    </div>
  );
}