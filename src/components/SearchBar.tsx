import React, { useState } from 'react';
import { useGithubStore } from '../store/useGithubStore';
import { useToastStore } from '../store/useToastStore';

export const SearchBar: React.FC = () => {
  const { setUsername, addRecentSearch } = useGithubStore();
  const { addToast } = useToastStore();
  const [inputVal, setInputVal] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputVal.trim();
    if (!trimmed) {
      addToast('검색할 GitHub 사용자명을 입력해 주세요.', 'warning');
      return;
    }
    setUsername(trimmed);
    addRecentSearch(trimmed);
    setInputVal('');
  };

  return (
    <div className="search-card-wrapper">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-group">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="GitHub 사용자명 검색 (예: ssyangneomegeo3-art, facebook, torvalds)"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck="false"
          />
        </div>
        <button type="submit" className="search-submit-btn" disabled={!inputVal.trim()}>
          검색하기
        </button>
      </form>
    </div>
  );
};