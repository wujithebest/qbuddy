import React from 'react';
import RoleSelector from '../RoleSelector/RoleSelector';
import UserProfile from './UserProfile';
import './LeftPanel.css';

export default function LeftPanel({ 
  selectedRole, 
  onRoleSelect,
  roleId,
  qbuddyPhase
}) {
  if (!selectedRole) {
    return (
      <div className="left-panel panel">
        <div className="panel-header">
          <span>🎭 角色选择</span>
        </div>
        <div className="panel-content">
          <RoleSelector selectedRole={null} onSelect={onRoleSelect} />
          <div className="empty-state">
            <p>请选择一个角色开始体验</p>
          </div>
        </div>
      </div>
    );
  }

  // 痛点场景数据
  const PAIN_POINTS = {
    chen: [
      { id: 'pp_ddl', icon: '📢', label: 'DDL消息淹没提醒', category: 'todo', cardKeyword: 'DDL' },
      { id: 'pp_vote', icon: '🗳️', label: '群投票错过', category: 'todo', cardKeyword: '投票' },
      { id: 'pp_at', icon: '📌', label: '@提及被忽略', category: 'todo', cardKeyword: '@' },
      { id: 'pp_buddy', icon: '🔥', label: '搭子降温预警', category: 'social', cardKeyword: '降温' },
    ],
    lin: [
      { id: 'pp_at', icon: '📌', label: '@提及被忽略', category: 'todo', cardKeyword: '@' },
      { id: 'pp_birthday', icon: '🎂', label: '好友生日忘记', category: 'birthday', cardKeyword: '生日' },
      { id: 'pp_buddy', icon: '🔥', label: '搭子降温预警', category: 'social', cardKeyword: '降温' },
      { id: 'pp_dynamic', icon: '🎵', label: '好友动态错过', category: 'buddy_activity', cardKeyword: '动态' },
    ],
    zhou: [
      { id: 'pp_channel', icon: '📚', label: '频道推荐错过', category: 'channel', cardKeyword: '频道' },
      { id: 'pp_ddl', icon: '📢', label: 'DDL消息淹没提醒', category: 'todo', cardKeyword: 'DDL' },
      { id: 'pp_request', icon: '📋', label: '答应的事忘记', category: 'todo', cardKeyword: '答应' },
      { id: 'pp_buddy', icon: '🔥', label: '搭子降温预警', category: 'social', cardKeyword: '降温' },
    ]
  };

  const currentPainPoints = PAIN_POINTS[roleId] || [];
  const isQbuddyDone = qbuddyPhase === 'done';
  const [activePainPoint, setActivePainPoint] = React.useState(null);

  const handlePainPointClick = (point) => {
    if (!isQbuddyDone) {
      // 如果QBuddy还没扫描，先切换到qbuddy tab
      window.dispatchEvent(new CustomEvent('qbuddy:switch-tab', { detail: { tab: 'qbuddy' } }));
    }
    
    // 派发跳转事件
    window.dispatchEvent(new CustomEvent('qbuddy:jump-to-card', { 
      detail: { category: point.category, cardKeyword: point.cardKeyword } 
    }));
    
    // 视觉反馈
    setActivePainPoint(point.id);
    setTimeout(() => setActivePainPoint(null), 1500);
  };

  return (
    <div className="left-panel panel">
      <div className="panel-header">
        <span>🎭 {selectedRole.name} 的体验</span>
      </div>
      <div className="panel-content">
        <RoleSelector selectedRole={selectedRole} onSelect={onRoleSelect} />
        <UserProfile role={selectedRole} />
        
        {/* 痛点场景直达按钮组 */}
        <div className="painpoint-section">
          <div className="painpoint-header">
            <span>🎯 痛点场景直达</span>
          </div>
          <div className="painpoint-desc">一键跳转QBuddy对应解决方案</div>
          <div className="painpoint-buttons">
            {currentPainPoints.map(point => (
              <button 
                key={point.id}
                className={`painpoint-btn ${activePainPoint === point.id ? 'active' : ''}`}
                onClick={() => handlePainPointClick(point)}
              >
                <span className="painpoint-icon">{point.icon}</span>
                <span className="painpoint-label">{point.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
