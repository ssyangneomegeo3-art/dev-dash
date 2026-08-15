import React from 'react';
import type { GithubUser } from '../types/github';

interface UserProfileCardProps {
  user: GithubUser;
}

export const UserProfileCard: React.FC<UserProfileCardProps> = ({ user }) => {
  return (
    <div
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: 'var(--shadow)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        position: 'sticky',
        top: '24px',
      }}
    >
      <img
        src={user.avatar_url}
        alt={`${user.login} avatar`}
        style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          border: '2px solid var(--border-color)',
          marginBottom: '16px',
          objectFit: 'cover',
        }}
      />
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 4px 0' }}>
        {user.name || user.login}
      </h2>
      <a
        href={user.html_url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          fontSize: '0.9rem',
          color: 'var(--accent-color)',
          textDecoration: 'none',
          marginBottom: '14px',
          fontWeight: 500,
        }}
      >
        @{user.login}
      </a>

      {user.bio && (
        <p style={{ fontSize: '0.85rem', color: 'var(--text-sub)', margin: '0 0 20px 0', lineHeight: 1.4 }}>
          {user.bio}
        </p>
      )}

      {/* 통계 박스 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          width: '100%',
          paddingTop: '16px',
          borderTop: '1px solid var(--border-color)',
        }}
      >
        <div>
          <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-main)' }}>{user.public_repos}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)' }}>Repos</div>
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-main)' }}>{user.followers}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)' }}>Followers</div>
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-main)' }}>{user.following}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)' }}>Following</div>
        </div>
      </div>
    </div>
  );
};