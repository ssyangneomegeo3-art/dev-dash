import React, { useState } from 'react';
import { useGithubStore } from '../store/useGithubStore';

export const SearchBar: React.FC = () => {
  const { username, setUsername, addRecentSearch } = useGithubStore();
  const [inputVal, setInputVal] = useState(username);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputVal.trim();
    if (!trimmed) return;

    setUsername(trimmed);
    addRecentSearch(trimmed);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
      <input
        type="text"
        placeholder="GitHub 유저네임 검색"
        value={inputVal}
        onChange={(e) => setInputVal(e.target.value)}
        style={{
          flex: 1,
          padding: '12px 16px',
          borderRadius: '8px',
          border: '1px solid var(--input-border)',
          backgroundColor: 'var(--input-bg)',
          color: 'var(--text-color)',
          fontSize: '1rem',
          outline: 'none',
        }}
      />
      <button
        type="submit"
        style={{
          padding: '12px 24px',
          borderRadius: '8px',
          border: 'none',
          backgroundColor: 'var(--btn-bg)',
          color: 'var(--btn-text)',
          fontSize: '1rem',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        검색
      </button>
    </form>
  );
};