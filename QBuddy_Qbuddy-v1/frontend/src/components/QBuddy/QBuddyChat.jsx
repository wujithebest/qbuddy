import React, { useState, useEffect, useRef, useCallback } from 'react';
import { QBUGDY_CARDS } from '../../data/mockData';
import CardMessage from './CardMessage';
import { scanQBuddy } from '../../services/sseClient';
import { api } from '../../services/api';
import './QBuddyChat.css';

// 模块级缓存：同一个role的扫描结果在组件重新挂载时保留
const scanCache = {};

// 进度消息映射
const PROGRESS_MESSAGES = {
  init: '正在读取消息...',
  graph: '正在构建关系图谱...',
  group_extract: '正在分析群聊消息...',
  request_response: '正在检查请求回复...',
  buddy_cooling: '正在检测社交温度...',
  reactivate: '正在扫描沉寂关系...',
  birthday: '正在查看特别日子...',
  buddy_activity: '正在查看好友动态...',
  ecosystem: '正在分析QQ生态同好...',
  channel: '正在推荐频道...',
  done: '正在聚合结果，准备输出...'
};

// 根据卡片类型生成个性化对话文本
const getDialogueForCardType = (card) => {
  const contactName = card?.detail?.contact || card?.detail?.group || '';
  const dialogueTemplates = {
    ddl: [
      '哈咯，这些任务快到截止时间啦，别忘了~',
      '发现一个DDL马上要到期了哦~',
      '有份作业或任务要关注一下，别拖啦~',
      '嘿，这里有个截止日期要到了~',
      '提醒一下，有件事可能需要你尽快处理~'
    ],
    vote: [
      '有个投票需要你参与哦，快去看看吧~',
      '看到个投票还没投呢，一起来决定吧~',
      '嘿，群里有投票等你参与，快去看看~',
      '发现一个投票正在进行中，投个票呗~',
      '有个投票等着你做决定呢~'
    ],
    at: [
      '有人@你了！别错过重要消息~',
      '看到有人@你啦，快去看看说了什么~',
      '嘿，有人找你呢，别漏掉啦~',
      '你被@了！快看看有什么重要的事~',
      '有人提到了你，快去瞅瞅吧~'
    ],
    buddy_cooling: [
      `诶，发现你和${contactName}好久没互动了，要不要主动联系一下？`,
      `你跟${contactName}好像降温了呢，要不要打个招呼~`,
      `好久没和${contactName}联系了，要不要聊几句？`,
      `提醒一下，${contactName}那边好像挺久没互动了~`,
      `嘿，${contactName}好久没找你聊天了，要不要主动一下？`
    ],
    reactivate: [
      `好久没联系${contactName}了，要不要打个招呼？`,
      `发现${contactName}沉寂好久了，发个消息激活一下？`,
      `你和${contactName}好像断联了，要不要重新联系起来~`,
      `嘿，${contactName}那边好像有新动态，要不要去看看？`,
      `感觉${contactName}那边有点动静，要不要打个招呼？`
    ],
    birthday: [
      '你的好朋友快过生日啦，快送上祝福吧~',
      '哇！有人要过生日了，准备好祝福了吗~',
      '有朋友的生日快到了，别忘了送祝福哦~',
      '提醒一下，有个好朋友的生日要到了~',
      '这里有个生日值得庆祝，要不要送上祝福？'
    ],
    channel: [
      '发现了一个你可能感兴趣的频道~',
      '看到个频道内容更新了，可能合你胃口~',
      '有个新内容推荐给你，看看有没有感兴趣的~',
      '这里有个频道推荐给你，一起看看呗~',
      '发现有新内容推送，可能对你有用哦~'
    ],
    accepted_request: [
      `你答应过${contactName}的事别忘了哦~`,
      `提醒一下，${contactName}的忙你说好要帮的~`,
      `你之前答应${contactName}的事还没做呢~`,
      `嘿，${contactName}还等着你呢，别忘了答应的事~`,
      `有个承诺要兑现，${contactName}那边在等着呢~`
    ],
    unreplied_request: [
      `${contactName}找你帮忙呢，有空吗~`,
      `${contactName}给你发消息了，好像在等你回复~`,
      `嘿，${contactName}好像有事找你，看看是什么~`,
      `有人找你帮忙呢，要不要回复一下？~`,
      `${contactName}那边有点急，快去看看吧~`
    ]
  };
  
  const templates = dialogueTemplates[card?.type] || dialogueTemplates.ddl;
  return templates[Math.floor(Math.random() * templates.length)];
};

// 用户头像
const USER_AVATAR = '😎';
// QBuddy头像
const QBUDDY_AVATAR = '🐧';

// 分类对话模板
const CATEGORY_DIALOGUE = {
  todo: '你有以下待办事项需要关注~',
  social: '有些社交关系需要你留意一下~',
  birthday: '你有以下的重要日子值得关注~',
  channel: '发现了一些你可能感兴趣的频道~',
  buddy_activity: '你的好友们有新动态哦~'
};

// 分类配置
const CATEGORY_CONFIG = {
  all: { label: '全部', emoji: '📋' },
  todo: { label: '待办提醒', emoji: '📋' },
  social: { label: '社交温度', emoji: '💬' },
  birthday: { label: '特别日子', emoji: '🎂' },
  channel: { label: '频道推荐', emoji: '🔍' },
  buddy_activity: { label: '同好动态', emoji: '🎵' }
};

export default function QBuddyChat({ role, currentTimeIndex, onBack, onNavigateToChat, onNavigateToDynamic, onNavigateToChannel, onQbuddyPhaseChange }) {
  // 对话列表：包含文字对话和卡片
  const [messages, setMessages] = useState([]);
  // 扫描状态
  const [phase, setPhase] = useState('idle'); // idle | scanning | done
  const [progressMsg, setProgressMsg] = useState('');
  const [progressStep, setProgressStep] = useState('');
  // 展开状态
  const [expandedCards, setExpandedCards] = useState({});
  // Toast提示
  const [toast, setToast] = useState(null);
  // 发送动画
  const [sendAnimation, setSendAnimation] = useState(null);
  // 忽略的卡片
  const [dismissedCards, setDismissedCards] = useState(new Set());
  // 用户输入
  const [userInput, setUserInput] = useState('');
  // 是否正在发送
  const [isTyping, setIsTyping] = useState(false);
  // QBuddy眼睛mood状态
  const [mood, setMood] = useState('idle');
  
  const messagesEndRef = useRef(null);
  const eventSourceRef = useRef(null);
  const scanTimeoutRef = useRef(null);
  const inputRef = useRef(null);
  // 收集SSE过程中的卡片，不直接显示
  const pendingCardsRef = useRef([]);
  // 取消标记
  const cancelledRef = useRef(false);
  // 保存messages引用，用于jump查找
  const messagesRef = useRef([]);
  // 耗时统计信息
  const [perfInfo, setPerfInfo] = useState(null);

  // 监听痛点场景直达跳转事件
  useEffect(() => {
    const handleJumpToCard = (e) => {
      const { category, cardKeyword } = e.detail || {};
      
      // 延迟等待消息渲染
      setTimeout(() => {
        const targetMsg = messagesRef.current.find(msg => {
          if (msg.type !== 'card') return false;
          const card = msg.card;
          // 匹配聚合卡片
          if (card?.type === 'grouped_card' && card.category === category) return true;
          // 匹配单张卡片
          if (card?.category === category) return true;
          // 关键词匹配
          const text = JSON.stringify(card);
          return text.includes(cardKeyword);
        });
        
        if (targetMsg) {
          const el = document.getElementById(`msg-${targetMsg.id}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.classList.add('highlighted');
            setTimeout(() => el.classList.remove('highlighted'), 2000);
          }
        }
      }, 300);
    };
    
    window.addEventListener('qbuddy:jump-to-card', handleJumpToCard);
    return () => window.removeEventListener('qbuddy:jump-to-card', handleJumpToCard);
  }, []);

  // 组件挂载时初始化：有缓存就恢复，没有就自动扫描
  useEffect(() => {
    const roleId = role?.id;
    if (!roleId) return;
    
    // 检查缓存：只有done状态才恢复，scanning状态说明上次中断了需要重新扫
    if (scanCache[roleId] && scanCache[roleId].phase === 'done') {
      const cached = scanCache[roleId];
      setPhase('done');
      setMessages([...cached.messages]);
      setProgressMsg(cached.progressMsg || '扫描完成');
      // 恢复耗时信息
      if (cached.perfInfo) {
        setPerfInfo(cached.perfInfo);
      }
      return;
    }
    
    // 清除可能残留的无效缓存（只有非done状态才清除）
    if (scanCache[roleId] && scanCache[roleId].phase !== 'done') {
      delete scanCache[roleId];
    }
    
    // 延迟500ms后自动开始扫描
    const timer = setTimeout(() => {
      startScanWithRole(role);
    }, 500);
    scanTimeoutRef.current = timer;
    
    return () => {
      cancelledRef.current = true;
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
        scanTimeoutRef.current = null;
      }
      // 不删除scanCache —— StrictMode第二次挂载时若缓存是done则直接恢复
    };
  }, []);

  // 当messages或phase变化时，更新缓存
  useEffect(() => {
    const roleId = role?.id;
    // 同步messagesRef
    messagesRef.current = messages;
    if (roleId && messages.length > 0) {
      scanCache[roleId] = {
        phase,
        messages: [...messages],
        progressMsg,
        perfInfo
      };
    }
  }, [messages, phase, progressMsg, role?.id, perfInfo]);

  // phase变化时回调
  useEffect(() => {
    if (onQbuddyPhaseChange) {
      onQbuddyPhaseChange(phase);
    }
  }, [phase, onQbuddyPhaseChange]);

  // 自动滚动到底部
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // 将卡片按category分组，生成聚合卡片
  const groupCardsByCategory = useCallback((cards) => {
    if (!cards || cards.length === 0) return [];
    
    // 按 category 分组
    const grouped = {};
    cards.forEach(card => {
      const cat = card?.category || 'todo';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(card);
    });
    
    // 分类顺序
    const categoryOrder = ['todo', 'social', 'birthday', 'channel', 'buddy_activity'];
    const resultMessages = [];
    
    categoryOrder.forEach(cat => {
      if (grouped[cat] && grouped[cat].length > 0) {
        // 添加分类对话文字
        resultMessages.push({
          id: `dlg_group_${cat}_${Date.now()}`,
          type: 'dialogue',
          sender: 'qbuddy',
          content: CATEGORY_DIALOGUE[cat] || '发现了一些需要关注的事~',
          timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
        });
        
        // 添加聚合卡片（单张卡片不分组）
        if (grouped[cat].length === 1) {
          const singleCard = grouped[cat][0];
          resultMessages.push({
            id: `card_${cat}_single_${Date.now()}`,
            type: 'card',
            sender: 'qbuddy',
            card: singleCard,
            timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
          });
        } else {
          const categoryLabels = {
            todo: '📋 待办提醒',
            social: '💬 社交温度',
            birthday: '🎂 重要日子',
            channel: '🔍 频道推荐',
            buddy_activity: '🎵 同好动态'
          };
          
          resultMessages.push({
            id: `grouped_${cat}_${Date.now()}`,
            type: 'card',
            sender: 'qbuddy',
            card: {
              type: 'grouped_card',
              category: cat,
              categoryLabel: categoryLabels[cat] || cat,
              cards: grouped[cat]
            },
            timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
          });
        }
      }
    });
    
    return resultMessages;
  }, []);

  // 开始扫描（接收role参数，用于角色切换后触发）
  const startScanWithRole = (targetRole) => {
    if (!targetRole) return;
    
    // 重置取消标记
    cancelledRef.current = false;
    
    // 关闭旧的SSE连接
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    if (scanTimeoutRef.current) {
      clearTimeout(scanTimeoutRef.current);
      scanTimeoutRef.current = null;
    }
    
    // 清空收集的卡片
    pendingCardsRef.current = [];
    
    // 缓存初始化状态
    const roleId = targetRole.id;
    scanCache[roleId] = {
      phase: 'scanning',
      messages: [],
      progressMsg: '正在读取消息...'
    };
    
    // 清空消息，添加欢迎语
    const welcomeMsg = {
      id: `dlg_welcome_${targetRole.id}`,
      type: 'dialogue',
      sender: 'qbuddy',
      content: '哈咯~我是QBuddy，让我来帮你看看有什么需要关注的~',
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([welcomeMsg]);
    setPhase('scanning');
    setProgressMsg('正在读取消息...');
    setMood('scanning'); // 开始扫描时眼睛动画
    
    try {
      eventSourceRef.current = scanQBuddy(
        targetRole.id,
        // onProgress - 更新进度条状态
        (data) => {
          try {
            if (cancelledRef.current) return;
            const step = data?.step || '';
            setProgressStep(step);
            
            // 更新状态条文字
            const msg = PROGRESS_MESSAGES[step] || '正在分析...';
            setProgressMsg(msg);
            
            if (data?.graph_data) {
              window.dispatchEvent(new CustomEvent('qbuddy:graph-update', { detail: data.graph_data }));
            }
          } catch (e) { console.error('onProgress error:', e); }
        },
        // onDialogue - 对话消息，忽略不显示
        (data) => {
          try {
            if (cancelledRef.current) return;
            // 不再直接显示对话消息
          } catch (e) { console.error('onDialogue error:', e); }
        },
        // onCard - 收集卡片，不直接显示
        (data) => {
          try {
            if (cancelledRef.current) return;
            
            const newCard = data?.data;
            if (!newCard || !newCard.type) return;
            
            if (!newCard.id) {
              newCard.id = `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            }
            if (!newCard.detail) newCard.detail = {};
            
            // 收集到pendingCards，不直接显示
            pendingCardsRef.current.push(newCard);
            
            if (data?.graph_highlight?.nodes?.length > 0) {
              window.dispatchEvent(new CustomEvent('qbuddy:highlight', { detail: data.graph_highlight }));
            }
          } catch (e) { console.error('onCard error:', e); }
        },
        // onDone - 扫描完成，延迟后一次性显示所有分组卡片
        (data) => {
          try {
            if (cancelledRef.current) return;
            
            // 从SSE事件中提取耗时统计（后端新增performance字段时）
            if (data?.performance) {
              setPerfInfo(data.performance);
            }
            
            // 更新状态为正在聚合
            setProgressMsg('正在聚合结果，准备输出...');
            
            // 延迟800ms后一次性显示所有分组后的卡片
            setTimeout(() => {
              if (cancelledRef.current) return;
              
              // 获取所有收集的卡片并分组
              const groupedMsgs = groupCardsByCategory(pendingCardsRef.current);
              
              // 检查是否有重要卡片类型
              const hasImportantCards = pendingCardsRef.current.some(card => 
                card.type === 'birthday' || card.type === 'channel' || card.type === 'ddl'
              );
              
              // 根据卡片类型设置mood
              if (hasImportantCards) {
                setMood('excited');
              } else {
                setMood('blink'); // 眨眼完成
              }
              
              // 延迟后回idle
              setTimeout(() => {
                setMood('idle');
              }, 2000);
              
              // 保留欢迎语，添加分组后的消息
              const welcomeMessage = {
                id: `dlg_welcome_${targetRole.id}`,
                type: 'dialogue',
                sender: 'qbuddy',
                content: '哈咯~我是QBuddy，让我来帮你看看有什么需要关注的~',
                timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
              };
              
              // 如果没有卡片，只显示欢迎语
              if (groupedMsgs.length === 0) {
                setMessages([welcomeMessage]);
              } else {
                setMessages([welcomeMessage, ...groupedMsgs]);
              }
              
              setPhase('done');
              setProgressMsg('扫描完成');
            }, 800);
            
            if (eventSourceRef.current) {
              eventSourceRef.current.close();
              eventSourceRef.current = null;
            }
          } catch (e) { console.error('onDone error:', e); }
        },
        // onError - fallback to local mock data
        (error) => {
          console.warn('SSE failed, using local fallback:', error);
          if (!cancelledRef.current) {
            useLocalFallback(targetRole);
          }
        }
      );
      
      // Set timeout - 60秒
      scanTimeoutRef.current = setTimeout(() => {
        cancelledRef.current = true;
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
          eventSourceRef.current = null;
        }
        useLocalFallback(targetRole);
      }, 60000);
      
    } catch (e) {
      console.error('SSE init error:', e);
      if (!cancelledRef.current) {
        useLocalFallback(targetRole);
      }
    }
  };

  // 向后兼容的startScan包装函数
  const startScan = () => {
    if (role) {
      startScanWithRole(role);
    }
  };

  // Local fallback
  const useLocalFallback = (targetRole) => {
    try {
      const localCards = QBUGDY_CARDS[targetRole?.id] || [];
      
      // 重置收集的卡片
      pendingCardsRef.current = [...localCards];
      
      // 欢迎消息
      const welcomeMsg = {
        id: `dlg_welcome_fallback`,
        type: 'dialogue',
        sender: 'qbuddy',
        content: '哈咯~让我看看你的消息~',
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      };
      
      if (localCards.length === 0) {
        setMessages([welcomeMsg]);
        setPhase('done');
        setProgressMsg('后端未启动，本地暂无模拟数据。请启动后端以获得完整体验。');
        return;
      }
      
      setMessages([welcomeMsg]);
      setPhase('scanning');
      setProgressMsg('正在读取消息...');
      
      // 模拟逐步更新状态
      const steps = [
        { delay: 1000, step: 'graph', msg: '正在构建关系图谱...' },
        { delay: 2000, step: 'group_extract', msg: '正在分析群聊消息...' },
        { delay: 3000, step: 'buddy_cooling', msg: '正在检测社交温度...' },
        { delay: 4000, step: 'done', msg: '正在聚合结果，准备输出...' },
      ];
      
      steps.forEach((step) => {
        setTimeout(() => {
          if (cancelledRef.current) return;
          setProgressStep(step.step);
          setProgressMsg(step.msg);
        }, step.delay);
      });
      
      // 扫描完成后延迟显示分组卡片
      setTimeout(() => {
        if (cancelledRef.current) return;
        
        const groupedMsgs = groupCardsByCategory(pendingCardsRef.current);
        
        // 设置模拟的耗时统计
        setPerfInfo({
          graph_build_time: 0.8,
          card_gen_time: 1.2,
          total_time: 2.0,
          source: 'local_fallback'
        });
        
        setMessages([welcomeMsg, ...groupedMsgs]);
        setPhase('done');
        setProgressMsg('扫描完成');
      }, 4000 + 800);
      
    } catch (e) {
      console.error('Local fallback error:', e);
      setPhase('done');
      setProgressMsg('扫描出错，请刷新重试');
    }
  };

  // 切换卡片展开状态
  const toggleExpand = (cardId) => {
    setExpandedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  // 显示Toast
  const showToast = useCallback((message, duration = 2000) => {
    setToast(message);
    setTimeout(() => setToast(null), duration);
  }, []);

  // 重新扫描
  const handleRescan = () => {
    // 清除当前角色的缓存
    const roleId = role?.id;
    if (roleId && scanCache[roleId]) {
      delete scanCache[roleId];
    }
    // 重置状态
    setMessages([]);
    setPhase('idle');
    setProgressMsg('');
    setExpandedCards({});
    setDismissedCards(new Set());
    setPerfInfo(null);
    // 重新开始扫描
    setTimeout(() => startScanWithRole(role), 300);
  };

  // 处理卡片操作
  const handleAction = (card, action, actionData, cardId) => {
    console.log(`Action: ${action} for card:`, card, 'data:', actionData);
    
    switch (action) {
      case 'jump':
      case 'view_channel':
        // channel类型使用专门的频道跳转
        if (card.type === 'channel' && card.detail?.channelId && onNavigateToChannel) {
          onNavigateToChannel({ 
            channelId: card.detail.channelId,
            postId: null
          });
          showToast('已跳转到频道');
        } else if (onNavigateToChat) {
          onNavigateToChat({ 
            group: card.detail?.group || card.detail?.channelName, 
            groupName: card.detail?.group || card.detail?.channelName, 
            contact: card.contact_name || card.detail?.contact,
            chatInfo: card,
            type: card.type
          });
          showToast('已跳转到对应消息');
        }
        break;
        
      case 'send_greeting':
      case 'send_blessing':
        setSendAnimation(cardId);
        
        // 获取祝福/问候内容
        const messageText = actionData || card.detail?.blessing || card.detail?.suggestedGreeting || '你好！';
        const contactName = card.contact_name || card.detail?.contact || '好友';
        
        if (onNavigateToChat) {
          onNavigateToChat({ 
            contact: contactName,
            autoMessage: messageText,
            autoAction: action === 'send_blessing' ? 'send_blessing' : 'send_greeting'
          });
        }
        
        showToast('正在发送...', 1500);
        setTimeout(() => setSendAnimation(null), 1000);
        break;
        
      case 'mark_done':
        showToast('已标记完成 ✓', 1500);
        break;
        
      case 'reply':
        showToast('回复成功 ✓', 1500);
        break;
        
      case 'not_interested': {
        // 使用msg.id而非card.id，因为后端card可能没有id字段
        const dismissId = cardId || card?.title || Math.random().toString(36).slice(2);
        setDismissedCards(prev => new Set([...prev, dismissId]));
        // 发送反馈消息
        const feedbackMsg = {
          id: `feedback_${Date.now()}`,
          type: 'dialogue',
          sender: 'qbuddy',
          content: `好的，已记录你的反馈 📝 我会根据你的偏好调整后续推荐，类似的内容不会再打扰你了。`,
          timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, feedbackMsg]);
        break;
      }
        
      case 'view_dynamic': {
        // 获取作者信息并跳转到动态页面
        const author = card.detail?.author || card.contact_name || card.detail?.contact || '';
        if (onNavigateToDynamic) {
          onNavigateToDynamic({ author });
          showToast(`正在查看 ${author} 的动态`);
        } else {
          showToast('查看好友动态');
        }
        break;
      }
        
      default:
        showToast(`已执行: ${action}`);
    }
  };

  // 发送用户消息
  const handleSend = async () => {
    if (!userInput.trim() || isTyping) return;
    
    const text = userInput.trim();
    setUserInput('');
    
    // 添加用户消息到对话列表
    const userMsg = {
      id: `user_${Date.now()}`,
      type: 'dialogue',
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    
    setIsTyping(true);
    
    try {
      const result = await api.qbuddyChat(text, role?.id);
      
      if (result && result.data && result.data.reply) {
        const replyMsg = {
          id: `qbuddy_reply_${Date.now()}`,
          type: 'dialogue',
          sender: 'qbuddy',
          content: result.data.reply,
          timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, replyMsg]);
      } else {
        const fallbackMsg = {
          id: `qbuddy_reply_${Date.now()}`,
          type: 'dialogue',
          sender: 'qbuddy',
          content: '嗯嗯，我听到了~还有什么需要帮忙的吗？',
          timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, fallbackMsg]);
      }
    } catch (e) {
      console.error('Chat error:', e);
      const errorMsg = {
        id: `qbuddy_error_${Date.now()}`,
        type: 'dialogue',
        sender: 'qbuddy',
        content: '抱歉，刚才没听清~可以再说一遍吗？',
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  // 处理回车发送
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 消息列表（不再过滤已标记的卡片，而是传递isDismissed状态让其变灰）
  const filteredMessages = messages;

  // 渲染消息
  const renderMessage = (msg) => {
    if (msg.type === 'card') {
      return (
        <div key={msg.id} id={`msg-${msg.id}`} className="chat-bubble qbuddy card-bubble">
          <div className="bubble-avatar">{QBUDDY_AVATAR}</div>
          <div className="bubble-content">
            <CardMessage 
              card={msg.card}
              isExpanded={expandedCards[msg.card?.id]}
              onToggle={() => toggleExpand(msg.card?.id)}
              onAction={(action, actionData) => handleAction(msg.card, action, actionData, msg.card?.id)}
              onNavigateToChat={onNavigateToChat}
              onNavigateToChannel={onNavigateToChannel}
              onNavigateToDynamic={onNavigateToDynamic}
              isDismissed={dismissedCards.has(msg.card?.id || msg.card?.title)}
              index={0}
            />
            <div className="bubble-time">{msg.timestamp}</div>
          </div>
        </div>
      );
    }
    
    // 对话消息
    const isQBuddy = msg.sender === 'qbuddy';
    return (
      <div key={msg.id} id={`msg-${msg.id}`} className={`chat-bubble ${isQBuddy ? 'qbuddy' : 'user'}`}>
        <div className="bubble-avatar">{isQBuddy ? QBUDDY_AVATAR : USER_AVATAR}</div>
        <div className="bubble-content">
          <div className="bubble-text">{msg.content}</div>
          <div className="bubble-time">{msg.timestamp}</div>
        </div>
      </div>
    );
  };

  if (!role) {
    return (
      <div className="qbuddy-chat">
        <div className="qbuddy-chat-header">
          <div className="qbuddy-avatar">{QBUDDY_AVATAR}</div>
          <div className="qbuddy-info">
            <span className="qbuddy-name">QBuddy</span>
            <span className="qbuddy-status">帮你不错过</span>
          </div>
        </div>
        <div className="qbuddy-empty">
          <p>请先选择一个角色</p>
        </div>
      </div>
    );
  }

  return (
    <div className="qbuddy-chat">
      <div className="qbuddy-chat-header">
        <span className="back-btn" onClick={onBack}>←</span>
        {/* QBuddy形象头部 - 豆豆眼 */}
        <div className="qbuddy-header">
          <div className="qbuddy-eyes">
            <div className={`qbuddy-eye ${mood}`}></div>
            <div className={`qbuddy-eye ${mood}`}></div>
          </div>
          <span className="qbuddy-name">QBuddy</span>
        </div>
        {phase === 'done' && (
          <button className="rescan-btn" onClick={handleRescan} title="重新扫描">
            🔄
          </button>
        )}
      </div>

      <div className="qbuddy-messages">
        {/* 扫描状态条 - 只在scanning阶段显示 */}
        {phase === 'scanning' && (
          <div className="scan-status-bar fade-in">
            <div className="scan-spinner" />
            <span className="scan-status-text">{progressMsg}</span>
          </div>
        )}

        {/* 消息列表 */}
        {filteredMessages.map(renderMessage)}

        {/* 耗时统计信息 */}
        {perfInfo && phase === 'done' && (
          <div className="chat-bubble qbuddy system-info">
            <div className="bubble-avatar">{QBUDDY_AVATAR}</div>
            <div className="bubble-content">
              <div className="bubble-text" style={{fontSize: '12px', color: '#6B7280'}}>
                ⏱️ 图谱构建: {perfInfo.graph_build_time}s · 卡片生成: {perfInfo.card_gen_time}s · 总计: {perfInfo.total_time}s
              </div>
            </div>
          </div>
        )}

        {/* 正在输入提示 */}
        {isTyping && (
          <div className="chat-bubble qbuddy typing">
            <div className="bubble-avatar">{QBUDDY_AVATAR}</div>
            <div className="bubble-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 底部输入框 */}
      <div className="qbuddy-input-area">
        <input
          ref={inputRef}
          type="text"
          className="qbuddy-input"
          placeholder="输入消息...（Enter发送）"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isTyping}
        />
        <button 
          className="qbuddy-send-btn"
          onClick={handleSend}
          disabled={!userInput.trim() || isTyping}
        >
          ➤
        </button>
      </div>

      {/* Toast通知 */}
      {toast && <div className="qbuddy-toast fade-in">{toast}</div>}
    </div>
  );
}
