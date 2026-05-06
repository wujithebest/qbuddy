import React, { useState } from 'react';
import LoginScreen from './components/LoginScreen/LoginScreen';
import LeftPanel from './components/LeftPanel/LeftPanel';
import QQSimulation from './components/QQSimulation/QQSimulation';
import RightPanel from './components/RightPanel/RightPanel';
import PipelineView from './components/PipelineView/PipelineView';
import { ROLES, QBUGDY_CARDS } from './data/mockData';
import './App.css';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  // QBuddy扫描阶段状态，用于传递给LeftPanel
  const [qbuddyPhase, setQbuddyPhase] = useState('idle');
  // 顶部视图模式：'product' = 产品体验, 'pipeline' = 技术架构
  const [topViewMode, setTopViewMode] = useState('product');

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setQbuddyPhase('idle');
  };

  const roleCards = selectedRole ? QBUGDY_CARDS[selectedRole.id] || [] : [];

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="app-wrapper">
      {/* 顶部切换栏 */}
      <div className="top-switch-bar">
        <div className="switch-tabs">
          <button 
            className={`switch-tab ${topViewMode === 'product' ? 'active' : ''}`}
            onClick={() => setTopViewMode('product')}
          >
            📱 产品体验
          </button>
          <button 
            className={`switch-tab ${topViewMode === 'pipeline' ? 'active' : ''}`}
            onClick={() => setTopViewMode('pipeline')}
          >
            ⚙️ 技术架构
          </button>
        </div>
      </div>

      {/* 主内容区 */}
      {topViewMode === 'pipeline' ? (
        <PipelineView role={selectedRole} />
      ) : (
        <div className="app-container">
          {/* 左面板 - 直接使用LeftPanel作为面板 */}
          <LeftPanel 
            selectedRole={selectedRole}
            onRoleSelect={handleRoleSelect}
            roleId={selectedRole?.id}
            qbuddyPhase={qbuddyPhase}
          />

          {/* 中间面板 - QQ仿真 */}
          <div className="center-panel">
            <QQSimulation 
              role={selectedRole}
              onQbuddyPhaseChange={setQbuddyPhase}
            />
          </div>

          {/* 右面板 */}
          <div className="right-panel-wrapper">
            <RightPanel 
              role={selectedRole}
              cards={roleCards}
              onQbuddyPhaseChange={setQbuddyPhase}
            />
          </div>
        </div>
      )}
    </div>
  );
}
