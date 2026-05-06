import React, { useState, useEffect } from 'react';
import './CardMessage.css';

const TYPE_CONFIG = {
  ddl: { icon: '📋', color: '#fa5151', label: 'DDL提醒' },
  vote: { icon: '🗳️', color: '#07c160', label: '投票提醒' },
  at: { icon: '@', color: '#12b7f5', label: '@提醒' },
  buddy_cooling: { icon: '❄️', color: '#ff9500', label: '搭子降温' },
  reactivate: { icon: '🔥', color: '#ff9500', label: '沉寂激活' },
  birthday: { icon: '🎂', color: '#ff2d55', label: '生日提醒' },
  channel: { icon: '📡', color: '#5856d6', label: '频道推荐' },
  conflict: { icon: '⚠️', color: '#ff3b30', label: '冲突提醒' },
  accepted_request: { icon: '✅', color: '#07c160', label: '答应过的请求' },
  unreplied_request: { icon: '💭', color: '#ff9500', label: '待回复的请求' },
  buddy_activity: { icon: '🎵', color: '#af52de', label: '好友动态' },
  ecosystem: { icon: '🌐', color: '#5856d6', label: '生态同好' }
};

// 分类配置
const CATEGORY_CONFIG = {
  todo: { color: '#fff4e5', textColor: '#ff9500', borderColor: '#ff950033' },
  social: { color: '#e8f5e9', textColor: '#07c160', borderColor: '#07c16033' },
  birthday: { color: '#fce4ec', textColor: '#ff2d55', borderColor: '#ff2d5533' },
  channel: { color: '#ede7f6', textColor: '#5856d6', borderColor: '#5856d633' },
  buddy_activity: { color: '#f3e5f5', textColor: '#af52de', borderColor: '#af52de33' }
};

// 聚合卡片分类样式
const GROUPED_CATEGORY_STYLE = {
  todo: { bgColor: '#fff9f0', borderColor: '#ff9500' },
  social: { bgColor: '#f0fdf4', borderColor: '#07c160' },
  birthday: { bgColor: '#fef2f2', borderColor: '#ff2d55' },
  channel: { bgColor: '#f5f3ff', borderColor: '#5856d6' },
  buddy_activity: { bgColor: '#fdf4ff', borderColor: '#af52de' }
};

// 计算搭子降温温度
const calculateTemperature = (card) => {
  if (card.type !== 'buddy_cooling' || !card.detail) return 45;
  
  const { baselineInfo, lastInteraction } = card.detail;
  
  // 解析基线信息
  let baselineDays = 3; // 默认基线
  if (baselineInfo) {
    if (baselineInfo.includes('2-3天')) baselineDays = 2.5;
    else if (baselineInfo.includes('每周')) baselineDays = 7;
    else if (baselineInfo.includes('3-5天')) baselineDays = 4;
    else if (baselineInfo.includes('1周')) baselineDays = 7;
    else if (baselineInfo.includes('2周')) baselineDays = 14;
  }
  
  // 解析当前间隔
  let currentDays = 12; // 默认间隔
  if (lastInteraction) {
    if (lastInteraction.includes('12天')) currentDays = 12;
    else if (lastInteraction.includes('10天')) currentDays = 10;
    else if (lastInteraction.includes('3周')) currentDays = 21;
    else if (lastInteraction.includes('20天')) currentDays = 20;
    else if (lastInteraction.includes('1个月')) currentDays = 30;
    else {
      const match = lastInteraction.match(/(\d+)天/);
      if (match) currentDays = parseInt(match[1]);
    }
  }
  
  // 计算温度:偏离倍数越大，温度越低
  const ratio = currentDays / baselineDays;
  let temperature = 100 - (ratio - 1) * 20;
  temperature = Math.max(15, Math.min(85, temperature));
  
  return Math.round(temperature);
};

// 获取温度颜色
const getTemperatureColor = (temp) => {
  if (temp > 60) return '#4A6CF7';
  if (temp > 35) return '#6B7280';
  return '#DC2626';
};

export default function CardMessage({ card, isExpanded, onToggle, onAction, index, isSending, onNavigateToChat, onNavigateToChannel, onNavigateToDynamic, isDismissed }) {
  // 防御性检查:card或card.detail缺失时不崩溃
  if (!card || !card.type) {
    return null;
  }
  
  // 处理聚合卡片类型
  if (card.type === 'grouped_card') {
    return (
      <GroupedCard 
        card={card} 
        isExpanded={isExpanded} 
        onToggle={onToggle} 
        onAction={onAction}
        onNavigateToChat={onNavigateToChat}
        onNavigateToChannel={onNavigateToChannel}
      />
    );
  }
  
  const config = TYPE_CONFIG[card.type] || TYPE_CONFIG.ddl;
  const temperature = calculateTemperature(card);
  const tempColor = getTemperatureColor(temperature);
  
  // 编辑状态
  const [isEditing, setIsEditing] = useState(false);
  const [messageText, setMessageText] = useState('');
  
  // 当card.detail中的祝福/问候字段变化时，初始化messageText
  // 用useEffect而非useState初始值，确保card数据加载后也能同步
  useEffect(() => {
    const initialText = card.detail?.suggestedMessage || card.detail?.suggestedGreeting || card.detail?.blessing || '';
    if (initialText && !messageText) {
      setMessageText(initialText);
    }
  }, [card.detail?.blessing, card.detail?.suggestedMessage, card.detail?.suggestedGreeting]);

  // 处理跳转动作
  const handleJump = (e) => {
    e.stopPropagation();
    // channel类型使用专门的频道跳转
    if (card.type === 'channel' && onNavigateToChannel && card.detail?.channelId) {
      onNavigateToChannel({
        channelId: card.detail.channelId,
        postId: null
      });
    } else if (onNavigateToChat && card.detail?.group) {
      onNavigateToChat({
        type: card.type,
        group: card.detail.group,
        groupName: card.detail.group,
        chatInfo: card
      });
    } else if (onNavigateToChat && card.detail?.contact) {
      onNavigateToChat({
        type: card.type,
        contact: card.detail.contact,
        chatInfo: card
      });
    } else if (onNavigateToChat && card.detail?.channelName) {
      // channel类型：用channelName尝试匹配
      onNavigateToChat({
        type: card.type,
        group: card.detail.channelName,
        groupName: card.detail.channelName,
        chatInfo: card
      });
    } else {
      onAction('jump');
    }
  };

  // 获取分类样式
  const categoryStyle = CATEGORY_CONFIG[card.category] || { color: '#f5f5f5', textColor: '#666', borderColor: '#ddd' };
  
  return (
    <div 
      className={`card-message fade-in ${isExpanded ? 'expanded' : ''} ${isSending ? 'sending' : ''} ${isDismissed ? 'dismissed' : ''}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {card.category && card.categoryLabel && (
        <div 
          className="card-category-tag"
          style={{ 
            backgroundColor: categoryStyle.color,
            color: categoryStyle.textColor,
            borderColor: categoryStyle.borderColor
          }}
        >
          {card.categoryLabel}
        </div>
      )}
      <div className="card-header" onClick={onToggle}>
        <div 
          className="card-type-badge"
          style={{ background: config.color }}
        >
          {config.icon}
        </div>
        <div className="card-title-area">
          <span className="card-title">{card.title}</span>
          <span className="card-summary">{card.summary}</span>
        </div>
        <span className={`expand-icon ${isExpanded ? 'rotated' : ''}`}>v</span>
      </div>

      <div className={`card-detail ${isExpanded ? 'show' : ''}`}>
        <div className="card-detail-content">
          {card.type === 'ddl' && (
            <div className="detail-section">
              <div className="detail-row">
                <span className="detail-label">群组</span>
                <span className="detail-value">{card.detail.group}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">内容</span>
                <span className="detail-value">{card.detail.content}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">截止</span>
                <span className="detail-value highlight">{card.detail.deadline}</span>
              </div>
              <div className="card-actions">
                <button className="action-btn primary" onClick={handleJump}>
                  {'\u2192'} 一键跳转
                </button>
              </div>
            </div>
          )}

          {card.type === 'vote' && (
            <div className="detail-section">
              <div className="detail-row">
                <span className="detail-label">投票</span>
                <span className="detail-value">{card.detail.voteTitle || card.detail.content || '投票进行中'}</span>
              </div>
              {card.detail.currentVotes && typeof card.detail.currentVotes === 'object' ? (
                <div className="vote-options">
                  {Object.entries(card.detail.currentVotes).map(([option, count]) => (
                    <div key={option} className="vote-option">
                      <span className="option-name">{option}</span>
                      <div className="vote-bar">
                        <div 
                          className="vote-fill"
                          style={{ width: `${(count / 6) * 100}%` }}
                        />
                      </div>
                      <span className="vote-count">{count}票</span>
                    </div>
                  ))}
                </div>
              ) : card.detail.voteOptions && Array.isArray(card.detail.voteOptions) ? (
                <div className="vote-options">
                  {card.detail.voteOptions.map((option, idx) => (
                    <div key={option} className="vote-option">
                      <span className="option-name">{option}</span>
                      <div className="vote-bar">
                        <div 
                          className="vote-fill"
                          style={{ width: `${30 + idx * 15}%` }}
                        />
                      </div>
                      <span className="vote-count">{2 + idx}票</span>
                    </div>
                  ))}
                </div>
              ) : null}
              <div className="detail-row">
                <span className="detail-label">截止</span>
                <span className="detail-value highlight">{card.detail.deadline || '尽快'}</span>
              </div>
              <div className="card-actions">
                <button className="action-btn primary" onClick={handleJump}>
                  {'\u2192'} 一键跳转
                </button>
              </div>
            </div>
          )}

          {card.type === 'buddy_cooling' && (
            <div className="detail-section">
              <div className="detail-row">
                <span className="detail-label">搭子</span>
                <span className="detail-value">{card.detail.contact}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">上次互动</span>
                <span className="detail-value">{card.detail.lastInteraction}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">基线频率</span>
                <span className="detail-value">{card.detail.baselineInfo}</span>
              </div>
              <div className="temperature-meter">
                <div className="temp-label">关系温度</div>
                <div className="temp-bar">
                  <div 
                    className="temp-fill cooling" 
                    style={{ 
                      width: `${temperature}%`,
                      background: tempColor
                    }} 
                  />
                </div>
                <div className="temp-values">
                  <span>冰冷</span>
                  <span className="temp-percent" style={{ color: tempColor }}>{temperature}%</span>
                  <span>正常</span>
                </div>
              </div>
              <div className="card-actions">
                <button className="action-btn primary" onClick={() => onAction('send_greeting')}>
                  [回复] 发消息
                </button>
                <button className="action-btn secondary" onClick={() => onAction('not_interested')}>
                  X 不感兴趣
                </button>
              </div>
            </div>
          )}

          {card.type === 'reactivate' && (
            <div className="detail-section">
              <div className="detail-row">
                <span className="detail-label">好友</span>
                <span className="detail-value">{card.detail.contact}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">沉寂</span>
                <span className="detail-value highlight">{card.detail.silenceDuration}</span>
              </div>
              <div className="suggestion-box">
                <div className="suggestion-label">[回复] 开口建议</div>
                <textarea 
                  className={`blessing-text ${isEditing ? 'editing' : ''}`}
                  value={messageText || card.detail.suggestedGreeting}
                  onChange={(e) => setMessageText(e.target.value)}
                  readOnly={!isEditing}
                  rows={3}
                />
                <div className="blessing-actions">
                  <button className="edit-btn" onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? 'OK 完成' : '✏️ 编辑'}
                  </button>
                  <button className="send-btn" onClick={() => onAction('send_greeting', messageText)}>
                    发送
                  </button>
                </div>
              </div>
              <div className="card-actions">
                <button className="action-btn secondary" onClick={() => onAction('view_dynamic')}>
                  [查看]️ 查看TA的动态
                </button>
              </div>
            </div>
          )}

          {card.type === 'birthday' && (
            <div className="detail-section">
              <div className="detail-row">
                <span className="detail-label">寿星</span>
                <span className="detail-value">{card.detail.contact}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">日期</span>
                <span className="detail-value highlight">{card.detail.birthday}</span>
              </div>
              <div className="suggestion-box blessing">
                <div className="suggestion-label">[祝福] 祝福文案</div>
                <textarea 
                  className={`blessing-text ${isEditing ? 'editing' : ''}`}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  readOnly={!isEditing}
                  rows={3}
                />
                <div className="blessing-actions">
                  <button className="edit-btn" onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? 'OK 完成' : '✏️ 编辑'}
                  </button>
                  <button className="send-btn" onClick={() => onAction('send_blessing', messageText)}>
                    发送
                  </button>
                </div>
              </div>
              <div className="card-actions">
                <button className="action-btn secondary" onClick={() => onAction('not_interested')}>
                  X 不感兴趣
                </button>
              </div>
            </div>
          )}

          {card.type === 'channel' && (
            <div className="detail-section">
              <div className="detail-row">
                <span className="detail-label">频道</span>
                <span className="detail-value">{card.detail.channelName}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">原因</span>
                <span className="detail-value">{card.detail.reason}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">成员</span>
                <span className="detail-value">{card.detail.memberCount}</span>
              </div>
              <div className="card-actions">
                <button className="action-btn primary" onClick={handleJump}>
                  {'\u2192'} 去看看
                </button>
                <button className="action-btn secondary" onClick={() => onAction('not_interested')}>
                  X 不感兴趣
                </button>
              </div>
            </div>
          )}

          {card.type === 'buddy_activity' && (
            <div className="detail-section">
              <div className="detail-row">
                <span className="detail-label">发布者</span>
                <span className="detail-value">{card.detail.author}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">时间</span>
                <span className="detail-value">{card.detail.time}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">内容</span>
                <span className="detail-value">{card.detail.content}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">互动</span>
                <span className="detail-value">👍 {card.detail.likes} 💬 {card.detail.comments}</span>
              </div>
              <div className="card-actions">
                <button className="action-btn primary" onClick={(e) => {
                  e.stopPropagation();
                  onNavigateToDynamic({ author: card.detail?.author || '' });
                }}>
                  {'→'} 一键跳转
                </button>
                <button className="action-btn secondary" onClick={() => onAction('not_interested')}>
                  X 不感兴趣
                </button>
              </div>
            </div>
          )}

          {card.type === 'ecosystem' && (
            <div className="detail-section">
              <div className="detail-row">
                <span className="detail-label">共同好友</span>
                <span className="detail-value">
                  {card.detail?.mutualConnections?.map(c => c.name).join('、') || '暂无'}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">共同音乐</span>
                <span className="detail-value">{card.detail.recommendations?.song || '暂无'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">共同阅读</span>
                <span className="detail-value">{card.detail.recommendations?.book || '暂无'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">共同追剧</span>
                <span className="detail-value">{card.detail.recommendations?.video || '暂无'}</span>
              </div>
              <div className="card-actions">
                <button className="action-btn primary" onClick={(e) => {
                  e.stopPropagation();
                  // 从 mutualConnections 中提取第一个好友的名称用于跳转
                  const contactName = card.detail?.mutualConnections?.[0]?.name || card.contact_name || '';
                  if (contactName && onNavigateToChat) {
                    onNavigateToChat({
                      type: card.type,
                      contact: contactName,
                      chatInfo: card
                    });
                  } else if (onAction) {
                    onAction('jump');
                  }
                }}>
                  {'\u2192'} 和TA聊聊
                </button>
                <button className="action-btn secondary" onClick={() => onAction('not_interested')}>
                  X 不感兴趣
                </button>
              </div>
            </div>
          )}

          {card.type === 'at' && (
            <div className="detail-section">
              <div className="detail-row">
                <span className="detail-label">来自</span>
                <span className="detail-value">{card.detail.from}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">内容</span>
                <span className="detail-value">{card.detail.content}</span>
              </div>
              <div className="card-actions">
                <button className="action-btn primary" onClick={handleJump}>
                  {'\u2192'} 查看详情
                </button>
              </div>
            </div>
          )}

          {card.type === 'conflict' && (
            <div className="detail-section">
              <div className="detail-row">
                <span className="detail-label">冲突</span>
                <span className="detail-value">{card.detail.event1}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">与</span>
                <span className="detail-value">{card.detail.event2}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">时间</span>
                <span className="detail-value highlight">{card.detail.time}</span>
              </div>
              <div className="card-actions">
                <button className="action-btn primary" onClick={() => onAction('jump')}>
                  {'\u2192'} 处理冲突
                </button>
              </div>
            </div>
          )}

          {card.type === 'accepted_request' && (
            <div className="detail-section">
              <div className="detail-row">
                <span className="detail-label">来自</span>
                <span className="detail-value">{card.detail.sender}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">内容</span>
                <span className="detail-value">{card.detail.content}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">来源</span>
                <span className="detail-value">{card.detail.group}</span>
              </div>
              <div className="card-actions">
                <button className="action-btn primary" onClick={handleJump}>
                  {'\u2192'} 一键跳转
                </button>
                <button className="action-btn secondary" onClick={() => onAction('mark_done')}>
                  OK 标记完成
                </button>
                <button className="action-btn secondary" onClick={() => onAction('not_interested')}>
                  X 不感兴趣
                </button>
              </div>
            </div>
          )}

          {card.type === 'unreplied_request' && (
            <div className="detail-section">
              <div className="detail-row">
                <span className="detail-label">来自</span>
                <span className="detail-value">{card.detail.sender}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">内容</span>
                <span className="detail-value">{card.detail.content}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">来源</span>
                <span className="detail-value">{card.detail.group}</span>
              </div>
              <div className="card-actions">
                <button className="action-btn primary" onClick={handleJump}>
                  {'\u2192'} 一键跳转
                </button>
                <button className="action-btn secondary" onClick={() => onAction('not_interested')}>
                  X 不感兴趣
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 聚合卡片组件
function GroupedCard({ card, isExpanded, onToggle, onAction, onNavigateToChat, onNavigateToChannel }) {
  const [expandedSubCards, setExpandedSubCards] = useState({});
  
  // 获取分类样式
  const categoryStyle = GROUPED_CATEGORY_STYLE[card.category] || { bgColor: '#f5f5f5', borderColor: '#ccc' };
  
  // 切换子卡片展开状态
  const toggleSubCard = (subCardId) => {
    setExpandedSubCards(prev => ({
      ...prev,
      [subCardId]: !prev[subCardId]
    }));
  };
  
  // 处理子卡片的动作
  const handleSubCardAction = (subCard, action, actionData) => {
    if (onAction) {
      onAction(action, actionData, subCard.id);
    }
  };
  
  // 处理子卡片的跳转
  const handleSubCardJump = (subCard) => {
    // channel类型使用专门的频道跳转
    if (subCard.type === 'channel' && onNavigateToChannel && subCard.detail?.channelId) {
      onNavigateToChannel({
        channelId: subCard.detail.channelId,
        postId: null
      });
    } else if (onNavigateToChat) {
      if (subCard.detail?.group) {
        onNavigateToChat({
          type: subCard.type,
          group: subCard.detail.group,
          groupName: subCard.detail.group,
          chatInfo: subCard
        });
      } else if (subCard.detail?.contact) {
        onNavigateToChat({
          type: subCard.type,
          contact: subCard.detail.contact,
          chatInfo: subCard
        });
      } else if (subCard.detail?.channelName) {
        onNavigateToChat({
          type: subCard.type,
          group: subCard.detail.channelName,
          groupName: subCard.detail.channelName,
          chatInfo: subCard
        });
      }
    }
  };
  
  return (
    <div 
      className="grouped-card-container"
      style={{ 
        backgroundColor: categoryStyle.bgColor,
        borderLeftColor: categoryStyle.borderColor
      }}
    >
      {/* 聚合卡片头部 */}
      <div className="grouped-header" onClick={onToggle}>
        <span className="grouped-category-label">{card.categoryLabel}</span>
        <span className="grouped-count">({card.cards?.length || 0})</span>
        <span className={`expand-icon ${isExpanded ? 'rotated' : ''}`}>v</span>
      </div>
      
      {/* 展开后显示子卡片列表 */}
      {isExpanded && (
        <div className="grouped-sub-cards">
          {card.cards?.map((subCard, idx) => (
            <div key={subCard.id || idx} className="grouped-sub-card">
              <div className="sub-card-header" onClick={() => toggleSubCard(subCard.id)}>
                <div 
                  className="sub-card-type-badge"
                  style={{ background: TYPE_CONFIG[subCard.type]?.color || '#666' }}
                >
                  {TYPE_CONFIG[subCard.type]?.icon || '[ ]'}
                </div>
                <div className="sub-card-title-area">
                  <span className="sub-card-title">{subCard.title}</span>
                  <span className="sub-card-summary">{subCard.summary}</span>
                </div>
                <span className={`expand-icon ${expandedSubCards[subCard.id] ? 'rotated' : ''}`}>v</span>
              </div>
              
              {expandedSubCards[subCard.id] && (
                <div className="sub-card-detail">
                  <SubCardDetail 
                    card={subCard} 
                    onAction={(action, data) => handleSubCardAction(subCard, action, data)}
                    onJump={() => handleSubCardJump(subCard)}
                    onNavigateToChannel={onNavigateToChannel}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// 子卡片详情组件
function SubCardDetail({ card, onAction, onJump, onNavigateToChannel }) {
  // 根据卡片类型显示不同的详情
  const renderDetail = () => {
    switch (card.type) {
      case 'ddl':
        return (
          <div className="sub-detail-rows">
            <div className="sub-detail-row">
              <span>群组</span>
              <span>{card.detail?.group}</span>
            </div>
            <div className="sub-detail-row">
              <span>截止</span>
              <span className="highlight">{card.detail?.deadline}</span>
            </div>
          </div>
        );
      case 'vote':
        return (
          <div className="sub-detail-rows">
            <div className="sub-detail-row">
              <span>投票</span>
              <span>{card.detail?.voteTitle || card.detail?.content}</span>
            </div>
            <div className="sub-detail-row">
              <span>截止</span>
              <span className="highlight">{card.detail?.deadline}</span>
            </div>
          </div>
        );
      case 'buddy_cooling':
        return (
          <div className="sub-detail-rows">
            <div className="sub-detail-row">
              <span>搭子</span>
              <span>{card.detail?.contact}</span>
            </div>
            <div className="sub-detail-row">
              <span>上次互动</span>
              <span>{card.detail?.lastInteraction}</span>
            </div>
          </div>
        );
      case 'reactivate':
        return (
          <div className="sub-detail-rows">
            <div className="sub-detail-row">
              <span>好友</span>
              <span>{card.detail?.contact}</span>
            </div>
            <div className="sub-detail-row">
              <span>沉寂</span>
              <span className="highlight">{card.detail?.silenceDuration}</span>
            </div>
            <div className="sub-detail-row suggestion">
              <span>建议</span>
              <span>{card.detail?.suggestedGreeting}</span>
            </div>
          </div>
        );
      case 'birthday':
        return (
          <div className="sub-detail-rows">
            <div className="sub-detail-row">
              <span>寿星</span>
              <span>{card.detail?.contact}</span>
            </div>
            <div className="sub-detail-row">
              <span>日期</span>
              <span className="highlight">{card.detail?.birthday}</span>
            </div>
            <div className="sub-detail-row suggestion">
              <span>祝福</span>
              <span>{card.detail?.blessing}</span>
            </div>
          </div>
        );
      case 'channel':
        return (
          <div className="sub-detail-rows">
            <div className="sub-detail-row">
              <span>频道</span>
              <span>{card.detail?.channelName}</span>
            </div>
            <div className="sub-detail-row">
              <span>成员</span>
              <span>{card.detail?.memberCount}</span>
            </div>
          </div>
        );
      case 'buddy_activity':
        return (
          <div className="sub-detail-rows">
            <div className="sub-detail-row">
              <span>发布者</span>
              <span>{card.detail?.author}</span>
            </div>
            <div className="sub-detail-row">
              <span>内容</span>
              <span>{card.detail?.content}</span>
            </div>
          </div>
        );
      default:
        return (
          <div className="sub-detail-rows">
            <div className="sub-detail-row">
              <span>{card.summary}</span>
            </div>
          </div>
        );
    }
  };
  
  // 处理查看详情跳转
  const handleDetailJump = (e) => {
    // channel类型使用专门的频道跳转
    if (card.type === 'channel' && onNavigateToChannel && card.detail?.channelId) {
      onNavigateToChannel({
        channelId: card.detail.channelId,
        postId: null
      });
    } else if (onJump) {
      onJump();
    }
  };
  
  return (
    <div className="sub-card-content">
      {renderDetail()}
      <div className="sub-card-actions">
        <button className="action-btn primary" onClick={handleDetailJump}>
          {'\u2192'} 查看详情
        </button>
        <button className="action-btn secondary" onClick={() => onAction('not_interested')}>
          X 不感兴趣
        </button>
      </div>
    </div>
  );
}
