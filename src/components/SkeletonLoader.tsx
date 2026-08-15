import React from 'react';
import { useGithubStore } from '../store/useGithubStore';

export const SkeletonLoader: React.FC = () => {
  const { isDarkMode } = useGithubStore();

  const cardBg = isDarkMode ? '#1e293b' : '#f3f4f6';
  const blockBg = isDarkMode ? '#334155' : '#e5e7eb';
  const border = isDarkMode ? '1px solid #334155' : '1px solid #f3f4f6';

  return (
    <div>
      {/* 프로필 카드 스켈레톤 */}
      <div
        style={{
          display: 'flex',
          gap: '24px',
          alignItems: 'center',
          backgroundColor: cardBg,
          padding: '24px',
          borderRadius: '12px',
          marginBottom: '32px',
          border,
          opacity: 0.8,
        }}
      >
        <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: blockBg }} />
        <div style={{ flex: 1 }}>
          <div style={{ width: '180px', height: '24px', backgroundColor: blockBg, borderRadius: '4px', marginBottom: '12px' }} />
          <div style={{ width: '280px', height: '16px', backgroundColor: blockBg, borderRadius: '4px', marginBottom: '16px' }} />
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ width: '90px', height: '16px', backgroundColor: blockBg, borderRadius: '4px' }} />
            <div style={{ width: '90px', height: '16px', backgroundColor: blockBg, borderRadius: '4px' }} />
          </div>
        </div>
      </div>

      {/* 레포지토리 목록 스켈레톤 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            style={{
              padding: '16px',
              backgroundColor: cardBg,
              borderRadius: '8px',
              border,
              height: '110px',
              opacity: 0.8,
            }}
          >
            <div style={{ width: '140px', height: '18px', backgroundColor: blockBg, borderRadius: '4px', marginBottom: '12px' }} />
            <div style={{ width: '100%', height: '14px', backgroundColor: blockBg, borderRadius: '4px', marginBottom: '8px' }} />
            <div style={{ width: '70%', height: '14px', backgroundColor: blockBg, borderRadius: '4px' }} />
          </div>
        ))}
      </div>
    </div>
  );
};