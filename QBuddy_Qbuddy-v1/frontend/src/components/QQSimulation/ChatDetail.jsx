import React, { useState, useRef, useEffect } from 'react';
import { CHAT_DETAILS } from '../../data/mockData';
import { api } from '../../services/api';
import './ChatDetail.css';

export default function ChatDetail({ chat, onBack, role, highlightMsg, onHighlightConsumed, onAutoActionConsumed }) {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesRef = useRef([]);
  const [highlightedMsgId, setHighlightedMsgId] = useState(null);
  const messagesEndRef = useRef(null);
  const highlightRef = useRef(null);
  // 处理自动发送消息（如QBuddy卡片跳转后自动发送祝福）
  const autoActionExecutedRef = useRef(false);
  // 保存定时器ID，用于cleanup防重复
  const autoSendTimerRef = useRef(null);
  const replyTimerRef = useRef(null);

  // 初始化消息
  useEffect(() => {
    let chatData = role ? CHAT_DETAILS[role.id]?.[chat.id] : null;
    
    // 兜底：如果id匹配失败，尝试按名称匹配
    if (!chatData?.messages && role) {
      const roleDetails = CHAT_DETAILS[role.id];
      if (roleDetails) {
        const cleanChatName = chat.name.replace(/[\u{1F000}-\u{1FFFF}]|👥|🎮|📚|🏀|🎨|🏸|🎸|👦|👧|🎂|👩‍🎓|👨‍🏫|🎵|📷|🧑‍💼|👾/gu, '').trim();
        for (const [detailId, detail] of Object.entries(roleDetails)) {
          const detailName = (detail.groupName || '').trim();
          if (detailName && (cleanChatName.includes(detailName) || detailName.includes(cleanChatName))) {
            chatData = detail;
            break;
          }
        }
      }
    }
    
    if (chatData?.messages) {
      setMessages(chatData.messages);
    } else {
      const cleanName = chat.name.replace(/[\u{1F000}-\u{1FFFF}]|👥|🎮|📚|🏀|🎨|🏸|🎸|👦|👧|🎂|👩‍🎓|👨‍🏫|🎵|📷|🧑‍💼|👾/gu, '').trim();
      setMessages([
        { id: 1, sender: cleanName, type: 'text', content: chat.lastMsg, time: chat.time },
        { id: 2, sender: role?.name || '我', type: 'text', content: '好的~', time: chat.time }
      ]);
    }
    setInputValue('');
    // 重置autoAction标记
    autoActionExecutedRef.current = false;
  }, [chat?.id, role?.id]);
  
  // 处理自动发送
  // 注意：不能用 [chat] 作为依赖，因为 onAutoActionConsumed 会修改 chat 对象，
  // 导致 useEffect cleanup 被触发，误杀 replyTimerRef
  useEffect(() => {
    if (autoActionExecutedRef.current) return;
    
    const autoMessage = chat?.autoMessage;
    const autoAction = chat?.autoAction;
    
    if (autoMessage && autoAction) {
      autoActionExecutedRef.current = true;
      
      const autoSend = async () => {
        const msgText = autoMessage;
        const senderName = role?.name || '我';
        const cleanName = chat.name.replace(/ 👥| 🎨| 🏸| 🎸| 👦| 👧| 🎂| 👩‍🎓| 👨‍🏫|🎮|📚|🏀/gu, '').trim();
        
        // 添加用户消息（防重复：检查是否已有相同内容的消息）
        setMessages(prev => {
          const alreadyExists = prev.some(m => m.content === msgText && m.sender === senderName);
          if (alreadyExists) return prev;
          return [...prev, {
            id: Date.now(),
            sender: senderName,
            type: 'text',
            content: msgText,
            time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
          }];
        });
        
        // 通知父组件清除autoAction标记（这会修改chat对象，但不会影响本effect后续逻辑）
        if (onAutoActionConsumed) {
          onAutoActionConsumed();
        }
        
        // 模拟对方回复（1.5秒后，再给LLM最多8秒）
        replyTimerRef.current = setTimeout(async () => {
          let replyText = null;
          
          try {
            // 传入真实聊天历史，让LLM基于上下文回复
            const currentMessages = messagesRef.current;
            const chatHistory = currentMessages.slice(-8).map(m => ({
              sender: m.sender,
              content: m.content
            }));
            
            const result = await api.chatReply({
              contact_name: cleanName,
              relationship: chat.relationship || '好友',
              message: msgText,
              chat_history: chatHistory
            });
            
            if (result?.data?.reply) {
              replyText = result.data.reply;
            }
          } catch (e) {
            console.warn('LLM回复失败，使用模板回复:', e);
          }
          
          // 如果LLM失败，使用模板回复
          if (!replyText) {
            replyText = getContextualReply(msgText, chat.relationship);
          }
          
          setMessages(prev => [...prev, {
            id: Date.now() + 1,
            sender: cleanName,
            type: 'text',
            content: replyText,
            time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
          }]);
        }, 1500);
      };
      
      // 延迟执行，确保消息已加载
      autoSendTimerRef.current = setTimeout(autoSend, 800);
    }
    
    // 清理函数：只清理 autoSendTimer（防止StrictMode双mount重复发送）
    // 不清理 replyTimerRef —— 一旦 autoSend 已执行，reply 应该正常完成
    return () => {
      if (autoSendTimerRef.current) {
        clearTimeout(autoSendTimerRef.current);
        autoSendTimerRef.current = null;
      }
    };
  }, [chat?.id, chat?.autoMessage]);

  // 同步messages到ref，供异步回调中使用
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);
  
  // 处理高亮跳转
  useEffect(() => {
    if (highlightMsg && messages.length > 0) {
      const keyword = highlightMsg.keyword || '';
      const msgType = highlightMsg.type || '';
      const searchIn = highlightMsg.searchIn || '';
      
      let targetMsg = null;
      
      // 策略1：清理keyword后匹配（去掉emoji、特殊符号、【】等）
      if (keyword && keyword.length > 2) {
        // 清理：去除emoji、特殊字符、【】符号
        const cleanedKeyword = keyword
          .replace(/[\u{1F000}-\u{1FFFF}]|[\u{2600}-\u{27BF}]|[\u{FE00}-\u{FE0F}]|[\u{1F900}-\u{1F9FF}]/gu, '')
          .replace(/【|】|\[|\]/g, '')
          .trim();
        
        if (cleanedKeyword.length > 2) {
          const trySegments = [
            cleanedKeyword,
            cleanedKeyword.substring(0, 30),
            cleanedKeyword.substring(0, 20),
          ].filter(s => s.length > 3);
          
          for (const seg of trySegments) {
            targetMsg = messages.find(m => m.content && m.content.includes(seg));
            if (targetMsg) break;
          }
        }
      }
      
      // 策略2：按sender名字匹配（如果有联系人信息）
      if (!targetMsg && searchIn) {
        const cleanSearch = searchIn.replace(/[\u{1F000}-\u{1FFFF}]|👥|🎮|📚|🏀|🎨|🏸|🎸|👦|👧|🎂|👩‍🎓|👨‍🏫|🎵|📷|🧑‍💼|👾|👨|👩|🧑|🏀/gu, '').trim();
        if (cleanSearch.length >= 2) {
          targetMsg = messages.find(m => m.sender && (
            m.sender.replace(/[\u{1F000}-\u{1FFFF}]|👥|🎮|📚|🏀|🎨|🏸|🎸|👦|👧|🎂|👩‍🎓|👨‍🏫|🎵|📷|🧑‍💼|👾/gu, '').trim().includes(cleanSearch) ||
            cleanSearch.includes(m.sender.replace(/[\u{1F000}-\u{1FFFF}]|👥|🎮|📚|🏀|🎨|🏸|🎸|👦|👧|🎂|👩‍🎓|👨‍🏫|🎵|📷|🧑‍💼|👾/gu, '').trim())
          ));
        }
      }
      
      // 策略3：按消息的msgType字段匹配（群聊帖子/动态）
      if (!targetMsg && msgType) {
        targetMsg = messages.find(m => m.msgType === msgType || m.type === msgType);
      }
      
      // 策略4：按类型关键词匹配
      if (!targetMsg && msgType) {
        const typeKeywords = {
          'ddl': ['【重要】', 'DDL', '截止', '提前到'],
          'vote': ['【投票】', '投票', '扣1', '扣2'],
          'at': ['@', '有人@你'],
          'announcement': ['【重要】', '通知'],
          'buddy_cooling': [],
          'reactivate': [],
          'birthday': ['生日'],
          'channel': [],
        };
        const keywords = typeKeywords[msgType] || [];
        for (const kw of keywords) {
          targetMsg = messages.find(m => m.content && m.content.includes(kw));
          if (targetMsg) break;
        }
      }
      
      if (targetMsg) {
        setHighlightedMsgId(targetMsg.id);
        // 延迟滚动到目标消息
        setTimeout(() => {
          const el = document.getElementById(`msg-${targetMsg.id}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.classList.add('highlighted-msg');
            // 3秒后移除高亮背景
            setTimeout(() => {
              el.classList.remove('highlighted-msg');
            }, 3000);
          }
        }, 300);
        // 4秒后取消高亮状态
        setTimeout(() => {
          setHighlightedMsgId(null);
        }, 4000);
      }
      
      // 通知消费完毕
      if (onHighlightConsumed) onHighlightConsumed();
    }
  }, [highlightMsg, messages]);

  // 自动滚动到底部（没有高亮消息时才自动滚动）
  useEffect(() => {
    if (!highlightMsg) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, highlightMsg]);

  // 上下文模板回复（作为LLM失败的fallback）
  const getContextualReply = (message, relationship) => {
    const msgLower = message.toLowerCase();
    
    if (/生日|祝福|快乐/.test(msgLower)) {
      const replies = ['哈哈谢谢！感动了😭', '太棒了！今晚一起开黑！', '谢谢！开心！', '收到！友谊万岁！', '太感动了！'];
      return replies[Math.floor(Math.random() * replies.length)];
    }
    if (/帮忙|帮/.test(msgLower)) {
      const replies = ['好呀没问题~', '交给我！', '收到！', '好的~'];
      return replies[Math.floor(Math.random() * replies.length)];
    }
    if (/在哪|什么时候|几点/.test(msgLower)) {
      const replies = ['在老地方！', '下午三点？', '老地方见~', '晚上？'];
      return replies[Math.floor(Math.random() * replies.length)];
    }
    if (/[?？]/.test(msgLower)) {
      const replies = ['让我想想...', '嗯...有道理！', '好问题！', '我也不太确定'];
      return replies[Math.floor(Math.random() * replies.length)];
    }
    
    // 根据关系类型选择默认回复
    const defaultReplies = {
      '搭子': ['哈哈', 'ok', '走起！', 'xswl', '收到！'],
      '好友': ['好的！', '收到~', '嗯嗯', '哈哈'],
      '同学': ['好的', '收到', '嗯嗯'],
      '家人': ['知道了', '放心吧', '好~'],
      '室友': ['哈哈', 'ok', '好嘞'],
      'default': ['好的！', '收到~', '嗯嗯', '哈哈']
    };
    
    const replies = defaultReplies[relationship] || defaultReplies['default'];
    return replies[Math.floor(Math.random() * replies.length)];
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    
    const text = inputValue.trim();
    setInputValue('');
    
    // 添加用户消息
    setMessages(prev => [...prev, {
      id: Date.now(),
      sender: role?.name || '我',
      type: 'text',
      content: text,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    }]);
    
    // 模拟对方回复（1.5秒延迟），非群聊时
    if (!chat.isGroup) {
      const cleanName = chat.name.replace(/ 👥| 🎨| 🏸| 🎸| 👦| 👧| 🎂| 👩‍🎓| 👨‍🏫|🎮|📚|🏀/gu, '').trim();
      
      // 尝试调用LLM获取上下文感知回复
      let replyText = null;
      
      try {
        const currentMsgs = messagesRef.current;
        const chatHistory = currentMsgs.slice(-8).map(m => ({
          sender: m.sender,
          content: m.content
        }));
        
        const result = await api.chatReply({
          contact_name: cleanName,
          relationship: chat.relationship || '好友',
          message: text,
          chat_history: chatHistory
        });
        
        if (result?.data?.reply) {
          replyText = result.data.reply;
        }
      } catch (e) {
        console.warn('LLM回复失败，使用模板回复:', e);
      }
      
      // 如果LLM失败或无回复，使用上下文模板
      if (!replyText) {
        replyText = getContextualReply(text, chat.relationship);
      }
      
      const replyTimer = setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          sender: cleanName,
          type: 'text',
          content: replyText,
          time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
        }]);
      }, 1500);
      replyTimerRef.current = replyTimer;
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-detail">
      <div className="chat-detail-header">
        <span className="back-btn" onClick={onBack}>←</span>
        <div className="chat-header-info">
          <span className="chat-header-avatar">{chat.avatar}</span>
          <span className="chat-header-name">{chat.name}</span>
        </div>
        <span className="more-btn">⋯</span>
      </div>

      <div className="messages">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            id={`msg-${msg.id}`}
            className={`message ${msg.sender === role?.name || msg.sender === '我' ? 'sent' : 'received'} ${highlightedMsgId === msg.id ? 'highlighted-msg' : ''}`}
          >
            {msg.type === 'vote' ? (
              <div className="vote-message">
                <div className="vote-content">{msg.content}</div>
              </div>
            ) : (
              <>
                <span className="msg-avatar">
                  {msg.sender === role?.name ? role.avatar : '👤'}
                </span>
                <div className="message-content">
                  {chat.isGroup && msg.sender !== role?.name && (
                    <div className="sender-name">{msg.sender}</div>
                  )}
                  <div className="message-bubble">
                    {msg.content.startsWith('[有人@你]') ? (
                      <>
                        <span className="at-highlight">@{role?.name || '你'}</span>
                        {msg.content.replace('[有人@你] ', '')}
                      </>
                    ) : msg.content}
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <span className="input-icon">😊</span>
        <input 
          className="chat-input"
          type="text"
          placeholder="输入消息..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button 
          className={`send-button ${inputValue.trim() ? 'active' : ''}`}
          onClick={handleSend}
          disabled={!inputValue.trim()}
        >
          发送
        </button>
      </div>
    </div>
  );
}
