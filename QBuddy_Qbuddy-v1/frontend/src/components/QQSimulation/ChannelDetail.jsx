import React, { useEffect, useRef } from 'react';
import { CHANNEL_POSTS } from '../../data/mockData';
import './ChannelDetail.css';

export default function ChannelDetail({ 
  channel, 
  role, 
  onBack,
  highlightPostId 
}) {
  const postsContainerRef = useRef(null);
  const postRefs = useRef({});
  
  // 获取频道帖子
  const posts = role?.id && channel?.id ? (CHANNEL_POSTS[role.id]?.[channel.id] || []) : [];
  
  // 高亮帖子滚动
  useEffect(() => {
    if (highlightPostId && postRefs.current[highlightPostId]) {
      setTimeout(() => {
        const postEl = postRefs.current[highlightPostId];
        if (postEl) {
          postEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          postEl.classList.add('highlighted');
          // 2秒后移除高亮
          setTimeout(() => {
            postEl.classList.remove('highlighted');
          }, 2000);
        }
      }, 100);
    }
  }, [highlightPostId]);

  return (
    <div className="channel-detail">
      <div className="detail-header">
        <span className="back-btn" onClick={onBack}>←</span>
        <div className="header-info">
          <span className="channel-avatar">{channel.avatar}</span>
          <span className="channel-name">{channel.name}</span>
        </div>
        <span className="placeholder"></span>
      </div>
      
      <div className="channel-intro">
        <p className="intro-desc">{channel.description}</p>
        <div className="intro-meta">
          <span className="member-count">👥 {channel.memberCount.toLocaleString()} 成员</span>
          {channel.category && <span className="category-tag">{channel.category}</span>}
        </div>
      </div>
      
      <div className="posts-container" ref={postsContainerRef}>
        <div className="posts-header">
          <span className="posts-title">帖子</span>
          <span className="posts-count">{posts.length} 条</span>
        </div>
        
        {posts.length === 0 ? (
          <div className="posts-empty">
            <p>暂无帖子</p>
          </div>
        ) : (
          <div className="posts-list">
            {posts.map((post) => (
              <div 
                key={post.id} 
                className="post-card"
                ref={(el) => { postRefs.current[post.id] = el; }}
              >
                <div className="post-author">
                  <span className="post-avatar">{post.avatar}</span>
                  <div className="author-info">
                    <span className="author-name">{post.author}</span>
                    <span className="post-time">{post.time}</span>
                  </div>
                </div>
                
                <div className="post-content">{post.content}</div>
                
                {post.tags && post.tags.length > 0 && (
                  <div className="post-tags">
                    {post.tags.map((tag, idx) => (
                      <span key={idx} className="post-tag">#{tag}</span>
                    ))}
                  </div>
                )}
                
                <div className="post-actions">
                  <span className="action-item">👍 {post.likes}</span>
                  <span className="action-item">💬 {post.comments}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
