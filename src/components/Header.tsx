import React from 'react';
import { useGithubStore } from '../store/useGithubStore';

export const Header: React.FC = () => {
  const { theme, toggleTheme, setIsTokenModalOpen, token } = useGithubStore();

  return (
    <header className="header">
      <div className="header-inner">
        <a href="./" className="logo-group">
          <span className="logo-badge">DevDash</span>
          <span className="logo-title">GitHub Dashboard</span>
        </a>

        <div className="header-actions">
          <button
            type="button"
            className="header-btn"
            onClick={() => setIsTokenModalOpen(true)}
            title="GitHub Personal Access Token 설정"
          >
            <span>{token ? '🔑 토큰 활성' : '🔑 PAT 설정'}</span>
          </button>

          <button
            type="button"
            className="header-btn"
            onClick={toggleTheme}
            title="테마 전환"
            aria-label="테마 전환"
          >
            <span>{theme === 'dark' ? '☀️ 라이트' : '🌙 다크'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};