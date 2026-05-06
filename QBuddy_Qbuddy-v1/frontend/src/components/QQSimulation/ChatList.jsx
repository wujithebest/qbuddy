import React from 'react';
import { CHAT_LISTS } from '../../data/mockData';
import './ChatList.css';

export default function ChatList({ role, onChatClick }) {
  const chatList = role ? CHAT_LISTS[role.id] || [] : [];

  return (
    <div className="chat-list">
      <div className="chat-list-header">
        <span>消息</span>
        <span className="edit-btn">编辑</span>
      </div>
      
      <div className="chats">
        {chatList.map((chat) => (
          <div 
            key={chat.id} 
            className="chat-item"
            onClick={() => onChatClick(chat)}
          >
            <div className="chat-avatar">
              {chat.avatar}
              {chat.unread > 0 && (
                <span className={`unread-badge ${chat.unread >= 99 ? 'max' : ''}`}>
                  {chat.unread >= 99 ? '99+' : chat.unread}
                </span>
              )}
            </div>
            <div className="chat-info">
              <div className="chat-top">
                <span className="chat-name">{chat.name}</span>
                <span className="chat-time">{chat.time}</span>
              </div>
              <div className="chat-bottom">
                <span className="chat-preview">{chat.lastMsg}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
