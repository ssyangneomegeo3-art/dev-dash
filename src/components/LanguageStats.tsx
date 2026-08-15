import React, { useMemo } from 'react';
import type { GithubRepo } from '../types/github';

interface LanguageStatsProps {
  repos: GithubRepo[];
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Java: '#b07219',
  Go: '#00ADD8',
  Rust: '#dea584',
  C: '#555555',
  'C++': '#f34b7d',
  'C#': '#178600',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Shell: '#89e051',
  Vue: '#41b883',
  Other: '#8b949e',
};

export const LanguageStats: React.FC<LanguageStatsProps> = ({ repos }) => {
  const stats = useMemo(() => {
    const counts: Record<string, number> = {};
    let total = 0;

    repos.forEach((repo) => {
      if (repo.language) {
        counts[repo.language] = (counts[repo.language] || 0) + 1;
        total += 1;
      }
    });

    if (total === 0) return [];

    return Object.entries(counts)
      .map(([lang, count]) => ({
        lang,
        percentage: ((count / total) * 100).toFixed(1),
        color: LANGUAGE_COLORS[lang] || LANGUAGE_COLORS.Other,
      }))
      .sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage))
      .slice(0, 5);
  }, [repos]);

  if (stats.length === 0) return null;

  return (
    <div className="lang-card">
      <h3 className="lang-card-title">주요 사용 언어 점유율</h3>
      <div className="lang-progress-bar">
        {stats.map((item) => (
          <div
            key={item.lang}
            className="lang-segment"
            style={{
              width: `${item.percentage}%`,
              backgroundColor: item.color,
            }}
            title={`${item.lang}: ${item.percentage}%`}
          />
        ))}
      </div>
      <div className="lang-legend">
        {stats.map((item) => (
          <div key={item.lang} className="lang-legend-item">
            <span className="lang-color-dot" style={{ backgroundColor: item.color }} />
            <span>
              {item.lang} <strong>{item.percentage}%</strong>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};