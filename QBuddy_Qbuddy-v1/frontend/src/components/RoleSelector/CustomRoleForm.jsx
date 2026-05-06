import React, { useState } from 'react';
import './CustomRoleForm.css';

const SLOTS = {
  // 槽位1：身份 — 决定群聊类型和场景方向
  identity: {
    label: '身份',
    options: [
      { value: 'college', label: '大学生', desc: '课程群、社团、搭子为主' },
      { value: 'young_worker', label: '工作年轻人', desc: '工作群、同事、兴趣圈为主' },
      { value: 'interest_focused', label: '兴趣领域年轻人', desc: '兴趣圈群、同好、创作交流为主' },
    ]
  },
  // 槽位2：信息密度 — 影响群消息量和信息淹没程度
  infoDensity: {
    label: '信息密度',
    options: [
      { value: 'overload', label: '信息过载', desc: '群多消息多，重要信息经常被淹没' },
      { value: 'normal', label: '适中', desc: '信息量正常，偶尔漏看' },
      { value: 'light', label: '比较清闲', desc: '群少消息少，基本都能看到' },
    ]
  },
  // 槽位3：社交风格 — 影响搭子类型和数量
  socialStyle: {
    label: '社交风格',
    options: [
      { value: 'active', label: '社牛型', desc: '好友多、搭子多，但容易顾不过来' },
      { value: 'moderate', label: '适中型', desc: '有固定圈子，关系稳定' },
      { value: 'introvert', label: '社恐型', desc: '好友少但深，不主动社交' },
    ]
  },
  // 槽位4：兴趣领域 — 影响频道推荐和搭子类型
  interests: {
    label: '主要兴趣（可多选）',
    multi: true,
    options: [
      { value: 'gaming', label: '🎮 游戏' },
      { value: 'anime', label: '🎭 动漫' },
      { value: 'music', label: '🎵 音乐/乐器' },
      { value: 'sports', label: '🏸 运动' },
      { value: 'reading', label: '📚 阅读' },
      { value: 'food', label: '🍜 美食探店' },
    ]
  },
  // 槽位5：痛点聚焦 — 预设选项勾选
  painFocus: {
    label: '最想体验的痛点（至少选1个）',
    multi: true,
    options: [
      { value: 'missed_ddl', label: '📋 DDL/通知被群消息淹没' },
      { value: 'missed_vote', label: '🗳️ 投票/意见收集被忽略' },
      { value: 'buddy_cooling', label: '💔 搭子关系逐渐降温' },
      { value: 'silent_friend', label: '🤝 好友沉寂但生活有了变化' },
      { value: 'missed_birthday', label: '🎂 好友生日忘记' },
      { value: 'new_interest', label: '🔍 有新兴趣想找同好频道' },
    ]
  }
};

export default function CustomRoleForm({ onGenerate, onBack }) {
  const [selections, setSelections] = useState({
    identity: 'college',
    infoDensity: 'overload',
    socialStyle: 'moderate',
    interests: ['gaming'],
    painFocus: ['missed_ddl', 'buddy_cooling'],
    // 自由填写
    name: '',
    major: '',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateProgress, setGenerateProgress] = useState('');

  const handleSingleSelect = (slot, value) => {
    setSelections(prev => ({ ...prev, [slot]: value }));
  };

  const handleMultiSelect = (slot, value) => {
    setSelections(prev => {
      const current = prev[slot] || [];
      const next = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [slot]: next };
    });
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerateProgress('正在生成你的专属数据...');
    
    try {
      // 调用后端API生成数据
      const response = await fetch('/api/customize/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Access-Password': 'qbuddy2026'
        },
        body: JSON.stringify(selections)
      });
      
      if (response.ok) {
        const result = await response.json();
        onGenerate(result.data);
      } else {
        // Fallback: 前端本地生成简化版
        setGenerateProgress('后端未启动，使用本地生成...');
        const localData = generateLocalMock(selections);
        onGenerate(localData);
      }
    } catch (e) {
      // Fallback
      setGenerateProgress('后端未启动，使用本地生成...');
      const localData = generateLocalMock(selections);
      onGenerate(localData);
    }
    
    setIsGenerating(false);
  };

  // 本地fallback生成简化mock数据
  const generateLocalMock = (sels) => {
    const name = sels.name || '自定义用户';
    const id = 'custom_' + Date.now();
    const isCollege = sels.identity === 'college';
    const isInterestFocused = sels.identity === 'interest_focused';
    
    // 基于选择生成基础数据
    const groupCount = sels.infoDensity === 'overload' ? 4 : sels.infoDensity === 'normal' ? 2 : 1;
    const buddyCount = sels.socialStyle === 'active' ? 4 : sels.socialStyle === 'moderate' ? 2 : 1;
    
    // 生成联系人
    const buddyNames = isCollege 
      ? ['小王', '小李', '小张', '小赵', '小刘'] 
      : isInterestFocused
      ? ['画友阿雪', '琴友小鹿', '漫友阿泽', '摄友小鱼', '圈友阿北']
      : ['阿杰', '阿豪', '小陈', '老杨', '小何'];
    const groupNames = isCollege
      ? ['课程群A', '课程群B', '课程群C', '课程群D']
      : isInterestFocused
      ? ['创作交流群', '同好打卡群', '投稿资讯群', '兴趣活动群']
      : ['项目组', '部门群', '客户对接群', '行业交流群'];
    const interestEmojis = {
      gaming: '🎮', anime: '🎭', music: '🎵', sports: '🏸', reading: '📚', food: '🍜'
    };
    
    const contacts = [];
    for (let i = 0; i < buddyCount; i++) {
      const interestVal = sels.interests[i % sels.interests.length] || 'gaming';
      contacts.push({
        id: `buddy_${i}`,
        name: buddyNames[i],
        relationship_type: `${interestVal}搭子`,
        tags: sels.interests.slice(0, 2),
        last_interaction_time: new Date(Date.now() - (7 + i * 5) * 86400000).toISOString(),
        baseline_interval: 48 + i * 24,
        birthday: i === 0 && sels.painFocus.includes('missed_birthday') ? '2026-05-06' : null,
        chat_history_summary: `最近和${buddyNames[i]}聊了关于${interestVal}的话题`,
        interest_tags: sels.interests.slice(0, 2),
        temperature: sels.painFocus.includes('buddy_cooling') ? 0.3 + i * 0.1 : 0.5 + i * 0.1,
        recent_events: sels.painFocus.includes('silent_friend') && i === buddyCount - 1 ? ['考研出分'] : []
      });
    }
    
    // 添加沉寂好友
    if (sels.painFocus.includes('silent_friend')) {
      contacts.push({
        id: 'buddy_silent',
        name: '老同学小陈',
        relationship_type: '好友',
        tags: ['考研'],
        last_interaction_time: new Date(Date.now() - 60 * 86400000).toISOString(),
        baseline_interval: 720,
        birthday: null,
        chat_history_summary: '上次聊到他在准备考研，已经2个月没联系了',
        interest_tags: [],
        temperature: 0.15,
        recent_events: ['考研出分']
      });
    }
    
    // 生成群聊
    const groups = [];
    for (let i = 0; i < groupCount; i++) {
      const messages = [];
      const senderNames = isCollege 
        ? ['同学A', '同学B', '同学C', '同学D', '同学E', '助教', '老师']
        : isInterestFocused
        ? ['同好A', '同好B', '同好C', '同好D', '群主', '管理员', '大大']
        : ['同事A', '同事B', '同事C', '同事D', '主管', '产品经理', '前端同学'];
      const idleMsgs = ['哈哈哈哈', '笑死', '+1', '确实', '666', '牛', '？？？', '好的', '嗯嗯', '[表情包]', '👍', 'xswl', 'tql', '绝绝子', '救命', '蚌埠住了'];
      
      let msgId = 1;
      
      // 生成80-120条消息
      const totalMsgs = 80 + Math.floor(Math.random() * 40);
      for (let j = 0; j < totalMsgs; j++) {
        const sender = senderNames[Math.floor(Math.random() * senderNames.length)];
        const midPoint = Math.floor(totalMsgs * 0.4);
        const votePoint = Math.floor(totalMsgs * 0.6);
        const atPoint = Math.floor(totalMsgs * 0.7);
        
        if (sels.painFocus.includes('missed_ddl') && j === midPoint) {
          const ddlContent = isCollege
            ? `【重要】${groupNames[i]}作业DDL提前到下周三！请大家注意时间！`
            : isInterestFocused
            ? `【重要】${groupNames[i]}投稿截止日期提前到本周五！请尽快提交作品！`
            : `【重要】${groupNames[i]}项目交付节点提前到下周一！请注意进度！`;
          const ddlSender = isCollege ? '助教' : isInterestFocused ? '管理员' : '主管';
          messages.push({ id: msgId++, sender: ddlSender, type: 'announcement', content: ddlContent, time: '08:00', urgency: 'high' });
        } else if (sels.painFocus.includes('missed_vote') && j === votePoint) {
          const voteContent = isCollege
            ? '【投票】下周上课时间调整：周一扣1，周三扣2'
            : isInterestFocused
            ? '【投票】下次线下聚选哪里：咖啡馆扣1，展览馆扣2'
            : '【投票】下周团建时间：周五扣1，周六扣2';
          const voteSender = isCollege ? '助教' : isInterestFocused ? '群主' : 'HR';
          messages.push({ id: msgId++, sender: voteSender, type: 'vote', content: voteContent, time: '10:00', deadline: '明天18:00' });
        } else if (j === atPoint) {
          const atContent = isCollege
            ? `@${name} 第三组同学注意准备答辩`
            : isInterestFocused
            ? `@${name} 你的作品被选上了！快看群公告`
            : `@${name} 这个方案你看看有没有问题`;
          const atSender = isCollege ? '老师' : isInterestFocused ? '大大' : '主管';
          messages.push({ id: msgId++, sender: atSender, type: 'at_reminder', content: atContent, time: '11:00' });
        } else {
          messages.push({
            id: msgId++,
            sender: sender,
            type: 'normal',
            content: idleMsgs[Math.floor(Math.random() * idleMsgs.length)],
            time: `${8 + Math.floor(j / 15)}:${String(j % 60).padStart(2, '0')}`
          });
        }
      }
      
      groups.push({
        id: `group_${i}`,
        name: groupNames[i],
        type: '课程群',
        member_count: 30 + Math.floor(Math.random() * 30),
        recent_messages: messages
      });
    }
    
    // 生成图谱节点和边
    const nodes = [
      { id: 'user', name: name, type: 'user', group: 0 }
    ];
    const links = [];
    
    contacts.forEach((c) => {
      nodes.push({
        id: c.id,
        name: c.name,
        type: c.relationship_type,
        group: 2,
        temperature: c.temperature,
        weight: 0.5 + c.temperature * 0.5
      });
      links.push({
        source: 'user',
        target: c.id,
        strength: 0.3 + c.temperature * 0.7,
        temp: c.temperature < 0.4 ? 'cooling' : 'normal'
      });
    });
    
    // 注入painFocus相关的事件节点
    if (sels.painFocus.includes('missed_ddl')) {
      nodes.push({ id: 'event_ddl', name: 'DDL: 课程作业', type: 'event', eventType: 'ddl', shape: 'rect' });
      links.push({ source: 'event_ddl', target: 'buddy_0', strength: 0.8, temp: 'hot' });
      links.push({ source: 'user', target: 'event_ddl', strength: 0.6, temp: 'normal' });
    }
    if (sels.painFocus.includes('missed_vote')) {
      nodes.push({ id: 'event_vote', name: '投票: 调课', type: 'event', eventType: 'vote', shape: 'rect' });
      links.push({ source: 'event_vote', target: 'buddy_0', strength: 0.7, temp: 'hot' });
      links.push({ source: 'user', target: 'event_vote', strength: 0.5, temp: 'normal' });
    }
    if (sels.painFocus.includes('new_interest')) {
      nodes.push({ id: 'event_channel', name: '频道: 吉他入门', type: 'event', eventType: 'channel', shape: 'rect' });
      links.push({ source: 'event_channel', target: 'buddy_1', strength: 0.7, temp: 'hot' });
    }
    
    return {
      id,
      name,
      identity: sels.identity,
      infoDensity: sels.infoDensity,
      major: sels.major || '未指定专业',
      avatar: sels.identity === 'college' ? '🧑‍🎓' : sels.identity === 'interest_focused' ? '🎨' : '👨‍💻',
      profile: {
        id,
        name,
        persona: { identity: sels.identity, infoDensity: sels.infoDensity, personality: sels.socialStyle, interests: sels.interests, habits: [] },
        stats: { total_contacts: contacts.length, active_groups: groups.length },
        current_context: { date: '2026-05-04' },
        graph_summary: { total_nodes: nodes.length }
      },
      contacts: { contacts },
      groups: { groups },
      graph: { nodes, links },
      painPoints: sels.painFocus.map(p => {
        const map = {
          'missed_ddl': '课程群消息太多，DDL总是看不到',
          'missed_vote': '投票和意见收集经常错过',
          'buddy_cooling': '和搭子互动越来越少',
          'silent_friend': '有好友很久没联系了',
          'missed_birthday': '朋友生日总是忘记',
          'new_interest': '想找同好圈子'
        };
        return map[p] || p;
      })
    };
  };

  return (
    <div className="custom-role-form">
      <div className="form-header">
        <span className="back-btn" onClick={onBack}>← 返回</span>
        <h2>🧪 自定义角色生成</h2>
        <p className="form-desc">根据你的选择生成专属模拟数据，验证QBuddy框架的通用性</p>
      </div>

      {/* 基础信息 */}
      <div className="form-section">
        <h3>基本信息</h3>
        <div className="form-row">
          <input
            className="form-input"
            type="text"
            placeholder="角色昵称（可选）"
            value={selections.name}
            onChange={e => setSelections(prev => ({ ...prev, name: e.target.value }))}
          />
          <input
            className="form-input"
            type="text"
            placeholder={selections.identity === 'college' ? '专业（可选）' : selections.identity === 'interest_focused' ? '兴趣领域，如漫画、摄影…（可选）' : '行业/岗位（可选）'}
            value={selections.major}
            onChange={e => setSelections(prev => ({ ...prev, major: e.target.value }))}
          />
        </div>
      </div>

      {/* 痛点维度槽位 */}
      {Object.entries(SLOTS).map(([key, slot]) => (
        <div key={key} className="form-section">
          <h3>{slot.label}</h3>
          {slot.multi ? (
            <div className="option-grid multi">
              {slot.options.map(opt => (
                <div
                  key={opt.value}
                  className={`option-card ${(selections[key] || []).includes(opt.value) ? 'selected' : ''}`}
                  onClick={() => handleMultiSelect(key, opt.value)}
                >
                  <span className="option-label">{opt.label}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="option-grid">
              {slot.options.map(opt => (
                <div
                  key={opt.value}
                  className={`option-card ${selections[key] === opt.value ? 'selected' : ''}`}
                  onClick={() => handleSingleSelect(key, opt.value)}
                >
                  <span className="option-label">{opt.label}</span>
                  <span className="option-desc">{opt.desc}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* 生成按钮 */}
      <div className="form-actions">
        <button
          className="generate-btn"
          onClick={handleGenerate}
          disabled={isGenerating || selections.painFocus.length === 0}
        >
          {isGenerating ? (
            <span className="generating">
              <span className="spinner" />
              {generateProgress}
            </span>
          ) : (
            '🧪 生成专属数据并体验'
          )}
        </button>
        <p className="generate-hint">
          ⏱️ 预计需要5-15秒生成数据，LLM将根据你的选择实时构建场景
        </p>
      </div>
    </div>
  );
}
