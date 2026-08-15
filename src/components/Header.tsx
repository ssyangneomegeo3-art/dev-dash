import React from 'react';
import { useGithubStore } from '../store/useGithubStore';

export const Header: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useGithubStore();

  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 0 24px 0',
        borderBottom: '1px solid var(--border-color)',
        marginBottom: '28px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '1.8rem' }}>⚡</span>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.2 }}>
            DevDash
          </h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-sub)' }}>GitHub Developer Dashboard</p>
        </div>
      </div>

      <button
        type="button"
        onClick={toggleDarkMode}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          color: 'var(--text-main)',
          padding: '8px 14px',
          borderRadius: '8px',
          fontWeight: 600,
          fontSize: '0.85rem',
          cursor: 'pointer',
          boxShadow: 'var(--shadow)',
          transition: 'all 0.2s ease',
        }}
      >
        <span>{isDarkMode ? '☀️' : '🌙'}</span>
        <span>{isDarkMode ? '라이트 모드' : '다크 모드'}</span>
      </button>
    </header>
  );
};