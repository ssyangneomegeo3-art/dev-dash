import React from 'react';
import { useGithubStore } from '../store/useGithubStore';

export const RecentSearchTags: React.FC = () => {
  const { recentSearches, setUsername, removeRecentSearch } = useGithubStore();

  if (recentSearches.length === 0) return null;

  return (
    <div className="recent-searches-wrapper">
      <span className="recent-label">🕒 최근 검색:</span>
      <div className="recent-tags-list">
        {recentSearches.map((item) => (
          <div key={item} className="tag-chip">
            <button
              type="button"
              className="tag-text-btn"
              onClick={() => setUsername(item)}
              title={`'${item}' 다시 검색`}
            >
              {item}
            </button>
            <button
              type="button"
              className="tag-delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                removeRecentSearch(item);
              }}
              title={`'${item}' 기록 삭제`}
              aria-label={`${item} 검색 기록 삭제`}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};