import React from 'react';
import { useGithubStore } from '../store/useGithubStore';

export const SkeletonLoader: React.FC = () => {
  const { theme } = useGithubStore();
  const isDarkMode = theme === 'dark';

  return (
    <div className={`skeleton-wrapper ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="dashboard-grid">
        {/* 사이드바 스켈레톤 (프로필 카드 + 언어 차트) */}
        <aside className="sidebar-col">
          <div className="profile-card">
            <div className="profile-header">
              <div className="skeleton-avatar skeleton-pulse" />
              <div className="skeleton-line skeleton-title skeleton-pulse" />
              <div className="skeleton-line skeleton-subtitle skeleton-pulse" />
            </div>

            <div className="skeleton-line skeleton-pulse" style={{ width: '100%', marginBottom: '8px' }} />
            <div className="skeleton-line skeleton-pulse" style={{ width: '75%', marginBottom: '16px' }} />

            <div className="profile-stats" style={{ margin: '16px 0' }}>
              <div className="skeleton-line skeleton-pulse" style={{ height: '36px', marginBottom: 0 }} />
              <div className="skeleton-line skeleton-pulse" style={{ height: '36px', marginBottom: 0 }} />
              <div className="skeleton-line skeleton-pulse" style={{ height: '36px', marginBottom: 0 }} />
            </div>

            <div className="skeleton-line skeleton-pulse" style={{ width: '60%', height: '14px', marginBottom: '8px' }} />
            <div className="skeleton-line skeleton-pulse" style={{ width: '50%', height: '14px', marginBottom: '20px' }} />

            <div className="skeleton-line skeleton-pulse" style={{ height: '40px', borderRadius: '8px', marginBottom: 0 }} />
          </div>

          <div className="lang-card">
            <div className="skeleton-line skeleton-pulse" style={{ width: '45%', height: '20px', marginBottom: '16px' }} />
            <div className="skeleton-line skeleton-pulse" style={{ height: '10px', borderRadius: '5px', marginBottom: '16px' }} />
            <div style={{ display: 'flex', gap: '12px' }}>
              <div className="skeleton-line skeleton-pulse" style={{ width: '60px', height: '14px', marginBottom: 0 }} />
              <div className="skeleton-line skeleton-pulse" style={{ width: '60px', height: '14px', marginBottom: 0 }} />
              <div className="skeleton-line skeleton-pulse" style={{ width: '60px', height: '14px', marginBottom: 0 }} />
            </div>
          </div>
        </aside>

        {/* 메인 콘텐츠 스켈레톤 (필터 바 + 레포지토리 카드 4개) */}
        <section className="content-col">
          <div className="repo-controls-card">
            <div className="skeleton-line skeleton-pulse" style={{ height: '38px', width: '100%', marginBottom: 0 }} />
          </div>

          <div className="repo-list-container">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="repo-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div className="skeleton-line skeleton-pulse" style={{ width: '40%', height: '22px', marginBottom: 0 }} />
                  <div className="skeleton-line skeleton-pulse" style={{ width: '84px', height: '30px', borderRadius: '6px', marginBottom: 0 }} />
                </div>

                <div className="skeleton-line skeleton-pulse" style={{ width: '90%', height: '16px', marginBottom: '8px' }} />
                <div className="skeleton-line skeleton-pulse" style={{ width: '65%', height: '16px', marginBottom: '16px' }} />

                <div style={{ display: 'flex', gap: '16px' }}>
                  <div className="skeleton-line skeleton-pulse" style={{ width: '70px', height: '14px', marginBottom: 0 }} />
                  <div className="skeleton-line skeleton-pulse" style={{ width: '50px', height: '14px', marginBottom: 0 }} />
                  <div className="skeleton-line skeleton-pulse" style={{ width: '50px', height: '14px', marginBottom: 0 }} />
                  <div className="skeleton-line skeleton-pulse" style={{ width: '80px', height: '14px', marginBottom: 0 }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};