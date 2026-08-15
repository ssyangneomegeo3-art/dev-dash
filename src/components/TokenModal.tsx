import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchRateLimit } from '../api/github';
import { useGithubStore } from '../store/useGithubStore';
import { useToastStore } from '../store/useToastStore';

export const TokenModal: React.FC = () => {
  const { isTokenModalOpen, setIsTokenModalOpen, token, setToken } = useGithubStore();
  const { addToast } = useToastStore();
  const queryClient = useQueryClient();
  const [inputToken, setInputToken] = useState('');

  // TokenModal 전용 RateLimit 쿼리 (모달이 열렸을 때만 활성화)
  const rateLimitQuery = useQuery({
    queryKey: ['githubRateLimit', token],
    queryFn: () => fetchRateLimit(token || undefined),
    enabled: isTokenModalOpen,
    staleTime: 1000 * 60 * 1,
  });

  if (!isTokenModalOpen) return null;

  const handleSave = () => {
    const trimmed = inputToken.trim();
    if (!trimmed) {
      addToast('유효한 GitHub PAT 토큰을 입력해 주세요.', 'warning');
      return;
    }
    setToken(trimmed);
    setInputToken('');
    addToast('GitHub PAT 토큰이 안전하게 적용되었습니다.', 'success');
    // 캐시 무효화를 통해 최신 토큰 상태로 재조회
    queryClient.invalidateQueries({ queryKey: ['githubRateLimit'] });
    queryClient.invalidateQueries({ queryKey: ['githubUser'] });
    queryClient.invalidateQueries({ queryKey: ['githubRepos'] });
  };

  const handleRemove = () => {
    setToken(null);
    setInputToken('');
    addToast('PAT 토큰이 제거되었습니다. 기본 한도(60회)로 전환됩니다.', 'info');
    queryClient.invalidateQueries({ queryKey: ['githubRateLimit'] });
    queryClient.invalidateQueries({ queryKey: ['githubUser'] });
    queryClient.invalidateQueries({ queryKey: ['githubRepos'] });
  };

  const rateLimit = rateLimitQuery.data?.rate;
  const limit = rateLimit?.limit ?? 60;
  const remaining = rateLimit?.remaining ?? 60;
  const percentage = Math.round((remaining / limit) * 100);

  return (
    <div className="modal-backdrop" onClick={() => setIsTokenModalOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">GitHub Personal Access Token (PAT)</h2>
          <button
            type="button"
            className="modal-close-btn"
            onClick={() => setIsTokenModalOpen(false)}
            aria-label="모달 닫기"
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
            GitHub PAT(Classic 또는 Fine-grained)를 등록하면 시간당 API 요청 한도가 <strong>60회에서 5,000회</strong>로 대폭 증가합니다.
          </p>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
              <span>API 잔여 요청량</span>
              <strong>
                {remaining} / {limit} ({percentage}%)
              </strong>
            </div>
            <div style={{ height: '8px', backgroundColor: 'var(--bg-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${percentage}%`,
                  backgroundColor: percentage > 20 ? 'var(--accent-green)' : 'var(--accent-red)',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label htmlFor="token-input" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              {token ? '새로운 PAT 토큰으로 변경' : 'PAT 토큰 입력'}
            </label>
            <input
              id="token-input"
              type="password"
              className="search-input"
              style={{ paddingLeft: '14px' }}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              value={inputToken}
              onChange={(e) => setInputToken(e.target.value)}
            />
          </div>
        </div>

        <div className="modal-footer">
          {token && (
            <button
              type="button"
              className="header-btn"
              style={{ color: 'var(--accent-red)', borderColor: 'var(--accent-red)', marginRight: 'auto' }}
              onClick={handleRemove}
            >
              토큰 삭제
            </button>
          )}
          <button type="button" className="header-btn" onClick={() => setIsTokenModalOpen(false)}>
            닫기
          </button>
          <button
            type="button"
            className="search-submit-btn"
            style={{ minHeight: '38px', padding: '0 16px' }}
            onClick={handleSave}
            disabled={!inputToken.trim()}
          >
            저장 및 적용
          </button>
        </div>
      </div>
    </div>
  );
};