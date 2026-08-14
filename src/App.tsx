import React, { useEffect, useState } from 'react';
import { useGithubStore } from './store/useGithubStore';

export function App() {
  const { username, user, repos, isLoading, error, setUsername, fetchGithubData } =
    useGithubStore();
  const [inputVal, setInputVal] = useState<string>(username);

  useEffect(() => {
    fetchGithubData('ssyangneomegeo3-art');
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      setUsername(inputVal.trim());
      fetchGithubData(inputVal.trim());
    }
  };

  return (
    <div
      style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '32px 16px',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        color: '#1f2937',
      }}
    >
      <header style={{ marginBottom: '32px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '8px' }}>
          🚀 DevDash: GitHub Explorer
        </h1>
        <p style={{ color: '#4b5563', margin: 0 }}>
          TypeScript + Zustand 기반 개발자 대시보드
        </p>
      </header>

      <form
        onSubmit={handleSearch}
        style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}
      >
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="GitHub 사용자 ID 입력 (예: ssyangneomegeo3-art)"
          style={{
            flex: 1,
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid #d1d5db',
            fontSize: '1rem',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: '12px 24px',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.7 : 1,
          }}
        >
          {isLoading ? '검색 중...' : '검색'}
        </button>
      </form>

      {error && (
        <div
          style={{
            padding: '16px',
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            borderRadius: '8px',
            marginBottom: '24px',
          }}
        >
          ❌ {error}
        </div>
      )}

      {user && (
        <section
          style={{
            backgroundColor: '#f9fafb',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            marginBottom: '32px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <img
              src={user.avatar_url}
              alt={user.login}
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
            <div>
              <h2 style={{ margin: '0 0 4px 0', fontSize: '1.5rem' }}>
                {user.name || user.login}
              </h2>
              <a
                href={user.html_url}
                target="_blank"
                rel="noreferrer"
                style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}
              >
                @{user.login}
              </a>
              {user.bio && (
                <p style={{ margin: '8px 0 0 0', color: '#4b5563', fontSize: '0.95rem' }}>
                  {user.bio}
                </p>
              )}
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
              marginTop: '20px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                backgroundColor: '#ffffff',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
              }}
            >
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Public Repos</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                {user.public_repos}
              </div>
            </div>
            <div
              style={{
                backgroundColor: '#ffffff',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
              }}
            >
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Followers</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                {user.followers}
              </div>
            </div>
            <div
              style={{
                backgroundColor: '#ffffff',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
              }}
            >
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Following</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                {user.following}
              </div>
            </div>
          </div>
        </section>
      )}

      {repos.length > 0 && (
        <section>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', fontWeight: 700 }}>
            📌 최근 업데이트된 프로젝트
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '16px',
            }}
          >
            {repos.map((repo) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noreferrer"
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  backgroundColor: '#ffffff',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                }}
              >
                <div>
                  <div
                    style={{
                      fontWeight: 'bold',
                      color: '#1d4ed8',
                      marginBottom: '8px',
                      wordBreak: 'break-all',
                    }}
                  >
                    {repo.name}
                  </div>
                  <p
                    style={{
                      fontSize: '0.875rem',
                      color: '#4b5563',
                      margin: '0 0 16px 0',
                      minHeight: '40px',
                    }}
                  >
                    {repo.description || '설명이 없습니다.'}
                  </p>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.75rem',
                    color: '#6b7280',
                  }}
                >
                  <span>⭐ {repo.stargazers_count}</span>
                  <span>{repo.language || 'N/A'}</span>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default App;