import React from 'react';
import { CONTACT_PROFILES, DYNAMIC_DATA, CHAT_LISTS } from '../../data/mockData';
import './ContactProfile.css';

export default function ContactProfile({ 
  contact, 
  role, 
  onBack, 
  onSendMessage 
}) {
  // 获取好友详细信息
  const profiles = role?.id ? (CONTACT_PROFILES[role.id] || {}) : {};
  const profile = profiles[contact.name] || {
    avatar: contact.avatar,
    relationship: contact.relationship || '好友',
    interestTags: [],
    recentEvents: [],
    qqEcosystem: { gaming: [], video: [], music: [], reading: [] },
    signature: '这个人很懒，什么都没留下'
  };
  
  // 从DYNAMIC_DATA中获取该好友的动态
  const dynamics = role?.id ? (DYNAMIC_DATA[role.id] || []) : [];
  
  // 清理名字中的emoji
  const cleanName = (s) => (s || '').replace(/[\u{1F000}-\u{1FFFF}]|[\u{2600}-\u{27BF}]|[\u{FE00}-\u{FE0F}]|[\u{1F900}-\u{1F9FF}]|👥|🎮|📚|🏀|🎨|🏸|🎸|👦|👧|🎂|👩‍🎓|👨‍🏫|🎵|📷|🧑‍💼|👾|👨|👩|🧑|🏀|‍/gu, '').trim();
  
  const friendDynamics = dynamics.filter(d => {
    const cleanAuthor = cleanName(d.author);
    const cleanContactName = cleanName(contact.name);
    return cleanAuthor === cleanContactName || 
           cleanContactName.includes(cleanAuthor) || 
           cleanAuthor.includes(cleanContactName);
  });
  
  // 从CHAT_LISTS中匹配对应的聊天
  const chatList = role?.id ? (CHAT_LISTS[role.id] || []) : [];
  const matchedChat = chatList.find(c => {
    const cleanName = (s) => (s || '').replace(/[\u{1F000}-\u{1FFFF}]|👥|🎮|📚|🏀|🎨|🏸|🎸|👦|👧|🎂|👩‍🎓|👨‍🏫|🎵|📷|🧑‍💼|👾|👨|👩|🧑|🏀/gu, '').trim();
    return cleanName(c.name).includes(cleanName(contact.name)) || 
           cleanName(contact.name).includes(cleanName(c.name));
  });

  const handleSendMessage = () => {
    if (onSendMessage) {
      if (matchedChat) {
        onSendMessage(matchedChat);
      } else {
        // 没有匹配的聊天记录，构造一个虚拟聊天对象
        onSendMessage({
          id: `chat_${contact.name}`,
          name: contact.name,
          avatar: contact.avatar,
          lastMessage: '',
          time: '',
          unread: 0
        });
      }
    }
  };

  // 获取QQ生态数据（简化显示）
  const { gaming = [], video = [], music = [], reading = [] } = profile.qqEcosystem || {};

  return (
    <div className="contact-profile">
      <div className="profile-header">
        <span className="back-btn" onClick={onBack}>←</span>
        <span className="profile-title">好友资料</span>
        <span className="placeholder"></span>
      </div>
      
      <div className="profile-content">
        {/* 基本信息卡片 */}
        <div className="profile-basic-card">
          <div className="basic-avatar">{profile.avatar}</div>
          <div className="basic-info">
            <div className="basic-name">{contact.name}</div>
            <div className="basic-signature">{profile.signature}</div>
          </div>
          <div className="relationship-tag">{profile.relationship}</div>
        </div>
        
        {/* QQ生态板块 */}
        <div className="profile-section">
          <div className="section-title">QQ生态</div>
          <div className="ecosystem-cards">
            {gaming.length > 0 && (
              <div className="eco-card eco-gaming">
                <div className="eco-icon">🎮</div>
                <div className="eco-label">在玩</div>
                <div className="eco-items">
                  {gaming.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="eco-item">{item}</div>
                  ))}
                </div>
              </div>
            )}
            {video.length > 0 && (
              <div className="eco-card eco-video">
                <div className="eco-icon">📺</div>
                <div className="eco-label">在看</div>
                <div className="eco-items">
                  {video.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="eco-item">{item}</div>
                  ))}
                </div>
              </div>
            )}
            {music.length > 0 && (
              <div className="eco-card eco-music">
                <div className="eco-icon">🎵</div>
                <div className="eco-label">在听</div>
                <div className="eco-items">
                  {music.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="eco-item">{item}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* 最近动态 */}
        {friendDynamics.length > 0 && (
          <div className="profile-section">
            <div className="section-title">最近动态</div>
            <div className="dynamics-list">
              {friendDynamics.map((dyn) => (
                <div key={dyn.id} className="dynamics-item">
                  <div className="dyn-content">{dyn.content}</div>
                  <div className="dyn-meta">
                    <span className="dyn-time">{dyn.time}</span>
                    <span className="dyn-stats">👍 {dyn.likes} 💬 {dyn.comments}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* 兴趣标签 */}
        {profile.interestTags && profile.interestTags.length > 0 && (
          <div className="profile-section">
            <div className="section-title">兴趣标签</div>
            <div className="interest-tags">
              {profile.interestTags.map((tag, idx) => (
                <span key={idx} className="interest-tag">{tag}</span>
              ))}
            </div>
          </div>
        )}
        
        {/* 最近事件 */}
        {profile.recentEvents && profile.recentEvents.length > 0 && (
          <div className="profile-section">
            <div className="section-title">最近动态</div>
            <div className="recent-events">
              {profile.recentEvents.map((event, idx) => (
                <div key={idx} className="recent-event-item">{event}</div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* 底部发消息按钮 */}
      <div className="profile-footer">
        <button 
          className="send-message-btn" 
          onClick={handleSendMessage}
        >
          💬 给他发消息
        </button>
      </div>
    </div>
  );
}
