import React from 'react';
import './UserProfile.css';

const PAIN_POINT_ICONS = {
  'DDL': '⏰',
  '投票': '🗳️',
  '群': '👥',
  '消息': '💬',
  '搭子': '🎮',
  '关系': '💕',
  '生日': '🎂',
  '考研': '📚',
  '闭关': '🔒',
  '动漫': '🎭',
  '羽毛球': '🏸',
  '吉他': '🎸',
  '新生': '🎓',
  '圈子': '🎪',
  '学姐': '👩‍🎓',
  '学长': '👨‍🎓'
};

const getPainPointIcon = (point) => {
  for (const [key, icon] of Object.entries(PAIN_POINT_ICONS)) {
    if (point.includes(key)) return icon;
  }
  return '❗';
};

export default function UserProfile({ role }) {
  // 模拟统计数据
  const stats = {
    friends: role?.id === 'chen' ? 156 : role?.id === 'lin' ? 289 : 98,
    groups: role?.id === 'chen' ? 12 : role?.id === 'lin' ? 24 : 8,
    pendingReminders: role?.id === 'chen' ? 5 : role?.id === 'lin' ? 8 : 3
  };

  return (
    <div className="user-profile fade-in">
      <div className="profile-header">
        <div className="profile-avatar">{role.avatar}</div>
        <div className="profile-basic">
          <h2 className="profile-name">{role.name}</h2>
          <p className="profile-meta">{role.identity === 'college' ? (role.grade || '大学生') : role.identity === 'interest_focused' ? '兴趣领域年轻人' : role.identity === 'young_worker' ? '工作年轻人' : (role.grade || '')} · {role.major}</p>
        </div>
      </div>
      
      {/* 数据统计面板 */}
      <div className="stats-panel">
        <div className="stat-item">
          <span className="stat-value">{stats.friends}</span>
          <span className="stat-label">好友</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <span className="stat-value">{stats.groups}</span>
          <span className="stat-label">群聊</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item highlight">
          <span className="stat-value">{stats.pendingReminders}</span>
          <span className="stat-label">待处理</span>
        </div>
      </div>
      
      <p className="profile-bio">"{role.bio}"</p>
      
      <div className="pain-points">
        <h4>😣 典型痛点</h4>
        <ul>
          {role.painPoints.map((point, idx) => (
            <li key={idx}>
              <span className="pain-icon">{getPainPointIcon(point)}</span>
              <span className="pain-text">{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
