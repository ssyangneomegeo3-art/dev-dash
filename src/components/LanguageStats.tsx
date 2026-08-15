import React, { useMemo } from 'react';
import type { GithubRepo } from '../types/github';

interface LanguageStatsProps {
  repos: GithubRepo[];
}

// GitHub 공식 언어 색상 매핑
const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  Go: '#00ADD8',
  Rust: '#dea584',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  Vue: '#41b883',
  Shell: '#89e051',
};

const DEFAULT_COLOR = '#8b949e';

export const LanguageStats: React.FC<LanguageStatsProps> = ({ repos }) => {
  // 언어별 점유율 및 퍼센트 계산
  const stats = useMemo(() => {
    const langCounts: Record<string, number> = {};
    let totalWithLang = 0;

    repos.forEach((repo) => {
      if (repo.language) {
        langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
        totalWithLang += 1;
      }
    });

    if (totalWithLang === 0) return [];

    return Object.entries(langCounts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: ((count / totalWithLang) * 100).toFixed(1),
        color: LANGUAGE_COLORS[name] || DEFAULT_COLOR,
      }))
      .sort((a, b) => b.count - a.count);
  }, [repos]);

  if (stats.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: 'var(--shadow)',
      }}
    >
      <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 14px 0', color: 'var(--text-main)' }}>
        주요 사용 언어 (Top Languages)
      </h3>

      {/* 1. 비율 게이지 바 (Stacked Progress Bar) */}
      <div
        style={{
          display: 'flex',
          height: '10px',
          borderRadius: '6px',
          overflow: 'hidden',
          backgroundColor: 'var(--border-color)',
          marginBottom: '16px',
        }}
      >
        {stats.map((item) => (
          <div
            key={item.name}
            style={{
              width: `${item.percentage}%`,
              backgroundColor: item.color,
              transition: 'width 0.4s ease',
            }}
            title={`${item.name}: ${item.percentage}%`}
          />
        ))}
      </div>

      {/* 2. 언어별 퍼센트 범례 (Legend) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '8px 12px',
        }}
      >
        {stats.map((item) => (
          <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
            <span
              style={{
                width: '9px',
                height: '9px',
                borderRadius: '50%',
                backgroundColor: item.color,
                flexShrink: 0,
              }}
            />
            <span style={{ color: 'var(--text-main)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {item.name}
            </span>
            <span style={{ color: 'var(--text-sub)', marginLeft: 'auto' }}>
              {item.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};