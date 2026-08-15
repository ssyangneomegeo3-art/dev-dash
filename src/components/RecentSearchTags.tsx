import React from 'react';
import { useGithubStore } from '../store/useGithubStore';

export const RecentSearchTags: React.FC = () => {
  const { recentSearches = [], setUsername, removeRecentSearch } = useGithubStore();

  if (!recentSearches || recentSearches.length === 0) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '12px' }}>
      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>최근 검색:</span>
      {recentSearches.map((name) => (
        <span
          key={name}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            backgroundColor: 'var(--tag-bg)',
            color: 'var(--tag-text)',
            border: '1px solid var(--card-border)',
            padding: '4px 10px',
            borderRadius: '16px',
            fontSize: '0.85rem',
            cursor: 'pointer',
          }}
          onClick={() => setUsername(name)}
        >
          {name}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              removeRecentSearch(name);
            }}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.9rem',
              lineHeight: 1,
              padding: '0 2px',
              color: 'var(--text-muted)',
            }}
          >
            ×
          </button>
        </span>
      ))}
    </div>
  );
};