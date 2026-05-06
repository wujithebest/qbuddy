import React from 'react';
import QBuddyEntry from './QBuddyEntry';
import './NavBar.css';

export default function NavBar({ 
  activeTab, 
  onTabChange, 
  onQBuddyClick, 
  hasNotification
}) {
  const tabs = [
    { id: 'chats', icon: '💬', label: '消息' },
    { id: 'contacts', icon: '👥', label: '联系人' },
    { id: 'qbuddy', icon: '🧡', label: 'QBuddy', isSpecial: true },
    { id: 'channels', icon: '📢', label: '频道' },
    { id: 'dynamic', icon: '✨', label: '动态' },
  ];

  return (
    <div className="nav-bar">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`nav-item ${activeTab === tab.id ? 'active' : ''} ${tab.isSpecial ? 'special' : ''}`}
          onClick={() => tab.isSpecial ? onQBuddyClick() : onTabChange(tab.id)}
        >
          {tab.isSpecial ? (
            <div className="special-content">
              <div className="nav-icon-wrapper">
                <QBuddyEntry 
                  isActive={activeTab === 'qbuddy'} 
                  hasNotification={hasNotification}
                />
              </div>
            </div>
          ) : (
            <div className="normal-content">
              <span className="nav-icon">{tab.icon}</span>
              <span className="nav-label">{tab.label}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
