import React, { useState, useEffect, useRef } from 'react';
import NavBar from './NavBar';
import ChatList from './ChatList';
import ChatDetail from './ChatDetail';
import ContactList from './ContactList';
import ContactProfile from './ContactProfile';
import ChannelDetail from './ChannelDetail';
import QBuddyChat from '../QBuddy/QBuddyChat';
import { CHAT_LISTS, DYNAMIC_DATA, CHANNEL_DATA, CHANNEL_POSTS } from '../../data/mockData';
import './QQSimulation.css';

export default function QQSimulation({ 
  role, 
  onQbuddyPhaseChange
}) {
  const [activeTab, setActiveTab] = useState('chats');
  const [selectedChat, setSelectedChat] = useState(null);
  const [showChatDetail, setShowChatDetail] = useState(false);
  const [highlightMsg, setHighlightMsg] = useState(null); // { keyword, type }
  // 高亮动态的状态
  const [highlightDynamic, setHighlightDynamic] = useState(null); // { author: string }
  // 记录是否从QBuddy跳转过来的，用于返回时回到QBuddy
  const [fromQBuddy, setFromQBuddy] = useState(false);
  
  // 联系人详情页状态
  const [selectedContact, setSelectedContact] = useState(null);
  const [showContactProfile, setShowContactProfile] = useState(false);
  
  // 频道详情页状态
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [showChannelDetail, setShowChannelDetail] = useState(false);
  const [highlightChannelPost, setHighlightChannelPost] = useState(null); // postId
  
  // 用于动态列表滚动和添加高亮
  const dynamicRefs = useRef({});

  // 监听痛点场景直达事件
  useEffect(() => {
    // 监听tab切换事件
    const handleSwitchTab = (e) => {
      const tab = e.detail?.tab;
      if (tab) {
        setActiveTab(tab);
        setFromQBuddy(true);
      }
    };
    
    // 监听跳转事件
    const handleJumpToCard = (e) => {
      setActiveTab('qbuddy');
      setFromQBuddy(true);
      // 事件会传递到QBuddyChat
    };
    
    window.addEventListener('qbuddy:switch-tab', handleSwitchTab);
    window.addEventListener('qbuddy:jump-to-card', handleJumpToCard);
    
    return () => {
      window.removeEventListener('qbuddy:switch-tab', handleSwitchTab);
      window.removeEventListener('qbuddy:jump-to-card', handleJumpToCard);
    };
  }, []);

  useEffect(() => {
    setSelectedChat(null);
    setShowChatDetail(false);
    setActiveTab('chats');
    setFromQBuddy(false);
    setHighlightDynamic(null);
    setSelectedContact(null);
    setShowContactProfile(false);
    setSelectedChannel(null);
    setShowChannelDetail(false);
    setHighlightChannelPost(null);
  }, [role?.id]);

  // 当highlightDynamic变化时，滚动到对应动态并添加高亮
  useEffect(() => {
    if (highlightDynamic && highlightDynamic.author) {
      const author = highlightDynamic.author;
      // 延迟一点确保DOM已渲染
      setTimeout(() => {
        // 策略1：精确匹配author
        let itemRef = dynamicRefs.current[author];
        
        // 策略2：模糊匹配author（去emoji后比较）
        if (!itemRef) {
          const cleanStr = (s) => (s || '').replace(/[\u{1F000}-\u{1FFFF}]|[\u{2600}-\u{27BF}]|[\u{FE00}-\u{FE0F}]|[\u{1F900}-\u{1F9FF}]|[👥🎮📚🏀🎨🏸🎸👦👧🎂👩‍🎓👨‍🏫🎵📷🧑‍💼👾👨👩🧑‍]/gu, '').trim();
          const cleanAuthor = cleanStr(author);
          for (const key of Object.keys(dynamicRefs.current)) {
            // 只比较非id的key（即author名，跳过dyn_开头的id）
            if (key.startsWith('dyn_')) continue;
            const cleanKey = cleanStr(key);
            if (cleanKey.includes(cleanAuthor) || cleanAuthor.includes(cleanKey)) {
              itemRef = dynamicRefs.current[key];
              break;
            }
          }
        }
        
        if (itemRef) {
          itemRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
          itemRef.classList.add('highlighted');
          // 3秒后移除高亮
          setTimeout(() => {
            itemRef.classList.remove('highlighted');
          }, 3000);
        }
      }, 500);
    }
  }, [highlightDynamic]);

  const handleChatClick = (chat) => {
    setSelectedChat(chat);
    setShowChatDetail(true);
    setFromQBuddy(false);
  };

  // 联系人点击处理
  const handleContactClick = (contact) => {
    setSelectedContact(contact);
    setShowContactProfile(true);
  };

  // 频道点击处理
  const handleChannelClick = (channel) => {
    setSelectedChannel(channel);
    setShowChannelDetail(true);
  };

  const handleBack = () => {
    // 如果是从QBuddy跳转过来的，返回QBuddy界面
    if (fromQBuddy) {
      setActiveTab('qbuddy');
      setShowChatDetail(false);
      setSelectedChat(null);
      setFromQBuddy(false);
      // 返回时清除动态高亮
      setHighlightDynamic(null);
    } else {
      setShowChatDetail(false);
      setSelectedChat(null);
    }
  };

  // 联系人详情页返回
  const handleContactBack = () => {
    setShowContactProfile(false);
    setSelectedContact(null);
  };

  // 频道详情页返回
  const handleChannelBack = () => {
    setShowChannelDetail(false);
    setSelectedChannel(null);
    setHighlightChannelPost(null);
  };

  const handleQBuddyClick = () => {
    setActiveTab('qbuddy');
    setShowChatDetail(false);
    setSelectedChat(null);
    setHighlightDynamic(null);
    // 清除详情页状态
    setShowContactProfile(false);
    setSelectedContact(null);
    setShowChannelDetail(false);
    setSelectedChannel(null);
    setHighlightChannelPost(null);
  };

  // 处理跳转查看好友动态
  const handleNavigateToDynamic = (info) => {
    const author = info?.author || '';
    setFromQBuddy(true);
    setHighlightDynamic({ author });
    setActiveTab('dynamic');
    setShowChatDetail(false);
    setSelectedChat(null);
  };

  // 处理QBuddy跳转频道
  const handleNavigateToChannel = ({ channelId, postId }) => {
    if (!role) return;
    
    setFromQBuddy(true);
    setActiveTab('channels');
    
    const channels = CHANNEL_DATA[role.id] || [];
    let targetChannel = channels.find(c => c.id === channelId);
    
    if (targetChannel) {
      // 如果没有postId，自动取第一条帖子的id用于高亮
      const firstPostId = postId || (CHANNEL_POSTS[role.id]?.[targetChannel.id]?.[0]?.id) || null;
      setHighlightChannelPost(firstPostId);
      setSelectedChannel(targetChannel);
      setShowChannelDetail(true);
    } else {
      setHighlightChannelPost(null);
    }
    
    setShowChatDetail(false);
    setSelectedChat(null);
  };

  // 模糊匹配群名/联系人名到CHAT_LISTS中的聊天项
  // 解决后端群名和前端CHAT_LISTS群名不完全一致的问题
  const fuzzyMatchChat = (chatList, targetName) => {
    if (!targetName) return null;
    
    // 清理名称：去emoji、去常见后缀
    const cleanStr = (s) => (s || '').replace(/[\u{1F000}-\u{1FFFF}]|👥|🎮|📚|🏀|🎨|🏸|🎸|👦|👧|🎂|👩‍🎓|👨‍🏫|🎵|📷|🧑‍💼|👾|👨|👩|🧑|🏀/gu, '').trim();
    
    const cleanedTarget = cleanStr(targetName);
    
    // 第1轮：精确匹配（清理后完全相同）
    const exactMatch = chatList.find(c => {
      const cleaned = cleanStr(c.name);
      return cleaned === cleanedTarget;
    });
    if (exactMatch) return exactMatch;
    
    // 第2轮：包含匹配（目标名包含在聊天名中，或聊天名包含目标名）
    const containsMatch = chatList.find(c => {
      const cleaned = cleanStr(c.name);
      return cleaned.includes(cleanedTarget) || cleanedTarget.includes(cleaned);
    });
    if (containsMatch) return containsMatch;
    
    // 第3轮：关键词匹配（拆分目标名，找最佳匹配）
    // 先去掉常见词再做关键词拆分
    const keywords = cleanedTarget
      .replace(/课程群|课程|群|频道|社团|协会|班级/g, '')
      .split(/[\s,，]+/)
      .filter(kw => kw.length >= 2); // 至少2字的关键词才有区分度
    
    if (keywords.length > 0) {
      let bestMatch = null;
      let bestScore = 0;
      
      for (const c of chatList) {
        const cleaned = cleanStr(c.name);
        let score = 0;
        for (const kw of keywords) {
          if (cleaned.includes(kw)) score += kw.length;
        }
        if (score > bestScore) {
          bestScore = score;
          bestMatch = c;
        }
      }
      
      if (bestMatch && bestScore >= 2) return bestMatch;
    }
    
    // 第4轮：针对私聊——按联系人名匹配
    // 后端可能返回 "小寒"、"阿琴学姐" 等人名，前端CHAT_LISTS里可能有 "吉他学长小寒 🎸"
    const privateMatch = chatList.find(c => {
      if (c.isGroup) return false;
      const cleaned = cleanStr(c.name);
      // 检查人名是否出现在聊天名中
      return cleaned.includes(cleanedTarget) || cleanedTarget.includes(cleaned);
    });
    if (privateMatch) return privateMatch;
    
    return null;
  };

  // 处理QBuddy的一键跳转
  const handleNavigateToChat = (chatInfo) => {
    if (!chatInfo || !role) return;
    
    // 标记从QBuddy跳转
    setFromQBuddy(true);
    
    const chatInfoType = chatInfo.type || chatInfo.chatInfo?.type || '';
    
    // ===== 频道类型 → 跳到频道tab =====
    if (chatInfoType === 'channel') {
      if (onNavigateToChannel && chatInfo.chatInfo?.detail?.channelId) {
        onNavigateToChannel({
          channelId: chatInfo.chatInfo.detail.channelId,
          postId: chatInfo.chatInfo?.detail?.postId || null
        });
      } else {
        // fallback: 切到频道tab
        setActiveTab('channels');
      }
      return;
    }
    
    // ===== 好友动态类型 → 跳到动态tab =====
    if (chatInfoType === 'buddy_activity') {
      const author = chatInfo.contact || chatInfo.chatInfo?.detail?.author || '';
      setActiveTab('dynamic');
      setHighlightDynamic({ author });
      setShowChatDetail(false);
      setSelectedChat(null);
      return;
    }
    
    // ===== 普通聊天跳转（群聊/私聊） =====
    const chatList = CHAT_LISTS[role.id] || [];
    
    // 确定目标名称：优先用group，其次用contact
    const targetGroupName = chatInfo.groupName || chatInfo.group || '';
    const targetContactName = chatInfo.contact || '';
    
    // 先尝试按群名匹配
    let targetChat = null;
    if (targetGroupName) {
      targetChat = fuzzyMatchChat(chatList, targetGroupName);
    }
    
    // 群名没匹配上，尝试按联系人名匹配
    if (!targetChat && targetContactName) {
      targetChat = fuzzyMatchChat(chatList, targetContactName);
    }
    
    // 构建高亮信息
    const newHighlight = {
      keyword: chatInfo.chatInfo?.detail?.content || '',
      type: chatInfo.chatInfo?.type || chatInfoType || '',
      searchIn: targetGroupName || targetContactName
    };
    
    if (targetChat) {
      setActiveTab('chats');
      setSelectedChat({
        ...targetChat,
        autoMessage: chatInfo.autoMessage,
        autoAction: chatInfo.autoAction
      });
      setShowChatDetail(true);
      setHighlightMsg(newHighlight);
    } else {
      // 如果完全没找到，找第一个群聊兜底
      const firstGroupChat = chatList.find(c => c.isGroup);
      if (firstGroupChat) {
        setActiveTab('chats');
        setSelectedChat({
          ...firstGroupChat,
          autoMessage: chatInfo.autoMessage,
          autoAction: chatInfo.autoAction
        });
        setShowChatDetail(true);
        setHighlightMsg(newHighlight);
      }
    }
  };
  
  // 处理autoAction执行完成后清除标记
  const handleAutoActionConsumed = () => {
    if (selectedChat) {
      setSelectedChat(prev => ({
        ...prev,
        autoMessage: undefined,
        autoAction: undefined
      }));
    }
  };

  // 判断动态是否应该高亮（模糊匹配，去掉emoji后比较）
  const isHighlighted = (dynAuthor) => {
    if (!highlightDynamic || !highlightDynamic.author) return false;
    const target = highlightDynamic.author;
    if (dynAuthor === target) return true;
    const cleanStr = (s) => (s || '').replace(/[\u{1F000}-\u{1FFFF}]|[\u{2600}-\u{27BF}]|[\u{FE00}-\u{FE0F}]|[\u{1F900}-\u{1F9FF}]|[👥🎮📚🏀🎨🏸🎸👦👧🎂👩‍🎓👨‍🏫🎵📷🧑‍💼👾👨👩🧑‍]/gu, '').trim();
    const cleanDyn = cleanStr(dynAuthor);
    const cleanTarget = cleanStr(target);
    return cleanDyn.includes(cleanTarget) || cleanTarget.includes(cleanDyn);
  };

  // 联系人详情页发消息
  const handleContactSendMessage = (chat) => {
    setActiveTab('chats');
    setShowContactProfile(false);
    setSelectedContact(null);
    setSelectedChat(chat);
    setShowChatDetail(true);
  };

  const renderContent = () => {
    // 联系人详情页
    if (activeTab === 'contacts' && showContactProfile && selectedContact) {
      return (
        <ContactProfile 
          contact={selectedContact}
          role={role}
          onBack={handleContactBack}
          onSendMessage={handleContactSendMessage}
        />
      );
    }
    
    // 频道详情页
    if (activeTab === 'channels' && showChannelDetail && selectedChannel) {
      return (
        <ChannelDetail
          channel={selectedChannel}
          role={role}
          onBack={handleChannelBack}
          highlightPostId={highlightChannelPost}
        />
      );
    }
    
    if (activeTab === 'chats') {
      if (showChatDetail && selectedChat) {
        return (
          <ChatDetail 
            chat={selectedChat} 
            onBack={handleBack}
            role={role}
            highlightMsg={highlightMsg}
            onHighlightConsumed={() => setHighlightMsg(null)}
            onAutoActionConsumed={handleAutoActionConsumed}
          />
        );
      }
      return <ChatList role={role} onChatClick={handleChatClick} />;
    }
    
    if (activeTab === 'contacts') {
      return <ContactList role={role} onContactClick={handleContactClick} />;
    }
    
    if (activeTab === 'channels') {
      const channels = CHANNEL_DATA[role?.id] || [];
      return (
        <div className="channels-view">
          <div className="channels-header">
            <span className="back-btn" onClick={() => setActiveTab('chats')}>←</span>
            <span>频道</span>
          </div>
          <div className="channels-list">
            {channels.map((channel) => (
              <div 
                key={channel.id} 
                className="channel-item"
                onClick={() => handleChannelClick(channel)}
              >
                <span className="channel-avatar">{channel.avatar}</span>
                <div className="channel-info">
                  <span className="channel-name">{channel.name}</span>
                  <span className="channel-desc">{channel.description}</span>
                </div>
                <span className="channel-members">{channel.memberCount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    if (activeTab === 'dynamic') {
      const dynamics = DYNAMIC_DATA[role?.id] || [];
      return (
        <div className="dynamic-view">
          <div className="dynamic-header">
            <span className="back-btn" onClick={handleBack}>←</span>
            <span>好友动态</span>
          </div>
          <div className="dynamic-content">
            {dynamics.length === 0 ? (
              <p className="dynamic-empty">暂无动态</p>
            ) : (
              dynamics.map((dyn) => {
                const highlighted = isHighlighted(dyn.author);
                return (
                  <div 
                    key={dyn.id} 
                    className={`dynamic-item ${highlighted ? 'highlighted' : ''}`}
                    ref={(el) => { 
                      if (el) {
                        dynamicRefs.current[dyn.author] = el;
                        dynamicRefs.current[dyn.id] = el;
                      }
                    }}
                  >
                    <div className="dynamic-author">
                      <span className="dynamic-avatar">{dyn.avatar}</span>
                      <div className="dynamic-author-info">
                        <span className="dynamic-name">{dyn.author}</span>
                        <span className="dynamic-time">{dyn.time}</span>
                      </div>
                    </div>
                    <div className="dynamic-text">{dyn.content}</div>
                    {dyn.images && dyn.images.length > 0 && (
                      <div className="dynamic-images">
                        {dyn.images.map((img, idx) => (
                          <span key={idx} className="dynamic-image-placeholder">{img}</span>
                        ))}
                      </div>
                    )}
                    <div className="dynamic-actions">
                      <span className="dynamic-action">👍 {dyn.likes}</span>
                      <span className="dynamic-action">💬 {dyn.comments}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="qq-simulation panel">
      <div className="qq-status-bar">
        <span className="time">10:30</span>
        <div className="status-icons">
          <span>📶</span>
          <span>🔋</span>
        </div>
      </div>
      
      <div className="qq-header">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <span className="search-placeholder">搜索</span>
        </div>
        <div className="user-avatar">
          {role?.avatar || '👤'}
        </div>
      </div>
      
      <div className="qq-content" style={{ display: activeTab === 'qbuddy' ? 'none' : 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        {renderContent()}
      </div>
      
      {/* QBuddyChat始终挂载，通过CSS控制显隐 */}
      <div style={{ display: activeTab === 'qbuddy' ? 'flex' : 'none', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <QBuddyChat 
          key={role?.id}
          role={role} 
          onBack={() => setActiveTab('chats')}
          onNavigateToChat={handleNavigateToChat}
          onNavigateToDynamic={handleNavigateToDynamic}
          onNavigateToChannel={handleNavigateToChannel}
          onQbuddyPhaseChange={onQbuddyPhaseChange}
        />
      </div>
      
      <NavBar 
        activeTab={activeTab} 
        onTabChange={(tab) => {
          setActiveTab(tab);
          // 切换tab时清除详情页状态，避免回来时残留
          setShowChatDetail(false);
          setSelectedChat(null);
          setShowContactProfile(false);
          setSelectedContact(null);
          setShowChannelDetail(false);
          setSelectedChannel(null);
          setHighlightChannelPost(null);
          setFromQBuddy(false);
        }}
        onQBuddyClick={handleQBuddyClick}
        hasNotification={true}
      />
    </div>
  );
}
