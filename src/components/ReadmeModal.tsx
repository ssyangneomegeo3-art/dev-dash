import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useQuery } from '@tanstack/react-query';
import { fetchRepoReadme } from '../api/github';
import { useGithubStore } from '../store/useGithubStore';

export const ReadmeModal: React.FC = () => {
  const { selectedReadmeRepo, setSelectedReadmeRepo, token } = useGithubStore();

  const isModalOpen = Boolean(selectedReadmeRepo);

  const { data: markdownContent, isLoading, isError } = useQuery({
    queryKey: ['repoReadme', selectedReadmeRepo?.owner, selectedReadmeRepo?.name, token],
    queryFn: () => {
      if (!selectedReadmeRepo) return Promise.resolve('');
      return fetchRepoReadme(selectedReadmeRepo.owner, selectedReadmeRepo.name, token || undefined);
    },
    enabled: isModalOpen,
    staleTime: 1000 * 60 * 10,
  });

  if (!isModalOpen || !selectedReadmeRepo) return null;

  return (
    <div className="modal-backdrop" onClick={() => setSelectedReadmeRepo(null)}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            📖 {selectedReadmeRepo.name} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>/ README.md</span>
          </h2>
          <button
            type="button"
            className="modal-close-btn"
            onClick={() => setSelectedReadmeRepo(null)}
            aria-label="모달 닫기"
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          {isLoading && (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              README.md 문서를 불러오는 중입니다...
            </div>
          )}

          {isError && (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--accent-red)' }}>
              README.md 문서를 불러오지 못했거나 해당 저장소에 README 파일이 존재하지 않습니다.
            </div>
          )}

          {!isLoading && !isError && markdownContent && (
            <div className="markdown-body">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {markdownContent}
              </ReactMarkdown>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="header-btn"
            onClick={() => setSelectedReadmeRepo(null)}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};