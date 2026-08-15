import React from 'react';
import type { GithubUser } from '../types/github';

interface UserProfileCardProps {
  user: GithubUser;
}

export const UserProfileCard: React.FC<UserProfileCardProps> = ({ user }) => {
  return (
    <div className="profile-card">
      <div className="profile-header">
        <img src={user.avatar_url} alt={`${user.login}의 아바타`} className="profile-avatar" />
        <div className="profile-names">
          <h2 className="profile-fullname">{user.name || user.login}</h2>
          <span className="profile-username">@{user.login}</span>
        </div>
      </div>

      {user.bio && <p className="profile-bio">{user.bio}</p>}

      <div className="profile-stats">
        <div className="stat-item">
          <span className="stat-value">{user.public_repos.toLocaleString()}</span>
          <span className="stat-label">저장소</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{user.followers.toLocaleString()}</span>
          <span className="stat-label">팔로워</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{user.following.toLocaleString()}</span>
          <span className="stat-label">팔로잉</span>
        </div>
      </div>

      <div className="profile-details">
        {user.company && (
          <div className="profile-detail-item">
            <span>🏢</span>
            <span>{user.company}</span>
          </div>
        )}
        {user.location && (
          <div className="profile-detail-item">
            <span>📍</span>
            <span>{user.location}</span>
          </div>
        )}
        {user.blog && (
          <div className="profile-detail-item">
            <span>🔗</span>
            <a href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`} target="_blank" rel="noreferrer" className="repo-link">
              {user.blog}
            </a>
          </div>
        )}
      </div>

      <a href={user.html_url} target="_blank" rel="noreferrer" className="profile-github-link">
        GitHub 프로필 방문 ↗
      </a>
    </div>
  );
};