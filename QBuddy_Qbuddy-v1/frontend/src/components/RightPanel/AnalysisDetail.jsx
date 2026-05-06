import React from 'react';
import './AnalysisDetail.css';

// 标签颜色配置
const TAG_COLORS = {
  KG: { bg: '#e3f2fd', color: '#1565c0', border: '#90caf9' },    // 蓝色 - 知识图谱
  Graph: { bg: '#e8f5e9', color: '#2e7d32', border: '#a5d6a7' }, // 绿色 - 图计算
  RAG: { bg: '#EEF2FF', color: '#2D4AE0', border: '#4A6CF7' },   // 紫色 - RAG检索
  NLP: { bg: '#fff3e0', color: '#e65100', border: '#ffb74d' },  // 橙色 - NLP处理
  LLM: { bg: '#ffebee', color: '#c62828', border: '#ef9a9a' },   // 红色 - LLM生成
  Search: { bg: '#e0f7fa', color: '#00838f', border: '#80deea' }, // 青色 - 搜索
  Match: { bg: '#fce4ec', color: '#ad1457', border: '#f48fb1' }, // 粉色 - 匹配
};

// 场景类型配置
const TYPE_CONFIG = {
  ddl: { icon: '📢', label: 'DDL提醒' },
  vote: { icon: '🗳️', label: '投票提醒' },
  at: { icon: '@', label: '@提及' },
  buddy_cooling: { icon: '🔥', label: '搭子降温' },
  reactivate: { icon: '💤', label: '沉寂激活' },
  birthday: { icon: '🎂', label: '生日提醒' },
  channel: { icon: '📢', label: '频道推荐' },
  buddy_activity: { icon: '📱', label: '好友动态' },
  ecosystem: { icon: '🎵', label: 'QQ生态同好' },
  conflict: { icon: '⚠️', label: '冲突提醒' }
};

// LLM处理管线配置
const PIPELINE_CONFIG = {
  birthday: {
    title: '生日祝福',
    icon: '🎂',
    nodes: 'User Node → Contact Node ← Birthday Event',
    steps: [
      { term: 'Node Query', desc: '从图谱读取好友节点，提取birthday属性', tag: 'KG' },
      { term: 'Edge Weight', desc: '查询User→Contact边的交互频率权重，判断推送优先级', tag: 'Graph' },
      { term: 'RAG Retrieval', desc: '从User节点的chat_history中检索与该好友的历史对话片段', tag: 'RAG' },
      { term: 'Style Transfer', desc: '基于历史对话做风格迁移，提取用户语言特征向量', tag: 'NLP' },
      { term: 'LLM Generate', desc: '组合好友关系+语言风格+祝福意图，生成个性化祝福', tag: 'LLM' },
    ]
  },
  ddl: {
    title: 'DDL提醒',
    icon: '📢',
    nodes: 'User Node → Event Node ← Group Node',
    steps: [
      { term: 'Group Parse', desc: '对Group Node的recent_messages做NLP语义解析', tag: 'NLP' },
      { term: 'Entity Extraction', desc: 'Entity Extraction + Time NER，识别DDL内容和截止时间', tag: 'NLP' },
      { term: 'Node Create', desc: '将DDL创建为Event Node，连接User-Event-Group三元边', tag: 'KG' },
      { term: 'Edge Propagation', desc: '基于Group→Event关联权重+User→Group参与度计算推送权重', tag: 'Graph' },
      { term: 'Push Decision', desc: '权重超过阈值则触发push，生成提醒卡片', tag: 'LLM' },
    ]
  },
  buddy_cooling: {
    title: '搭子降温',
    icon: '🔥',
    nodes: 'User Node → Contact Node (温度边)',
    steps: [
      { term: 'Temperature Calc', desc: '读取User→Contact边的温度值 T(i,j,t) = Σw_k·f(type)·e^(-λΔt)', tag: 'Graph' },
      { term: 'Baseline Compare', desc: '对比当前温度与baseline_interval计算冷却比 cooling_ratio', tag: 'Graph' },
      { term: 'Threshold Check', desc: 'cooling_ratio > threshold 触发降温预警', tag: 'Search' },
      { term: 'Topic Retrieval', desc: '基于Contact的tags做Semantic Match，检索共同话题', tag: 'RAG' },
      { term: 'Icebreaker Generate', desc: 'LLM基于话题+关系类型+语气生成破冰消息', tag: 'LLM' },
    ]
  },
  channel: {
    title: '频道推荐',
    icon: '📢',
    nodes: 'User Node → Channel Node ← Contact Node',
    steps: [
      { term: 'Interest Extract', desc: '从User Node的interests属性提取兴趣向量', tag: 'NLP' },
      { term: 'Semantic Match', desc: '计算兴趣向量与Channel库的Cosine Similarity', tag: 'Match' },
      { term: 'Friend Graph', desc: '查询同兴趣好友的Channel订阅关系，提升推荐权重', tag: 'Graph' },
      { term: 'Rank & Push', desc: '按匹配度×社交权重排序，生成Top-K推荐卡片', tag: 'LLM' },
    ]
  },
  ecosystem: {
    title: 'QQ生态同好',
    icon: '🎵',
    nodes: 'User Node → Ecosystem Data → Contact Node',
    steps: [
      { term: 'Data Read', desc: '读取User的ecosystem数据（QQ音乐/QQ阅读/腾讯视频）', tag: 'Search' },
      { term: 'Friend Compare', desc: '遍历Contact Nodes的interest_tags，做交叉匹配', tag: 'Match' },
      { term: 'Jaccard Similarity', desc: '计算用户与好友的生态偏好重叠度', tag: 'Graph' },
      { term: 'Social Recommend', desc: '生成"xxx也在看/听"的推送卡片', tag: 'LLM' },
    ]
  },
  buddy_activity: {
    title: '好友动态',
    icon: '📱',
    nodes: 'User Node → Contact Node → Activity Feed',
    steps: [
      { term: 'Dynamics Fetch', desc: '从Dynamics数据源拉取好友最近发布的内容', tag: 'Search' },
      { term: 'Interest Filter', desc: '基于User.interests做内容相关性过滤', tag: 'NLP' },
      { term: 'Edge Weight', desc: '动态作者与User的边权重越高，推送优先级越高', tag: 'Graph' },
      { term: 'Card Generate', desc: '结合动态内容+关系描述+用户语气生成提醒文案', tag: 'LLM' },
    ]
  },
  vote: {
    title: '投票提醒',
    icon: '🗳️',
    nodes: 'User Node → Vote Event ← Group Node',
    steps: [
      { term: 'Group Message Parse', desc: '解析群消息中的投票内容，提取投票主题和选项', tag: 'NLP' },
      { term: 'Vote Entity Create', desc: '创建Vote Event节点，关联Group和发起人', tag: 'KG' },
      { term: 'Member Filter', desc: '基于User→Group参与度筛选需要提醒的成员', tag: 'Graph' },
      { term: 'LLM Summarize', desc: '生成投票摘要卡片，包含选项和截止时间', tag: 'LLM' },
    ]
  },
  reactivate: {
    title: '沉寂激活',
    icon: '💤',
    nodes: 'User Node → Contact Node (沉寂边)',
    steps: [
      { term: 'Inactivity Query', desc: '查询User→Contact边的last_interaction时间戳', tag: 'Graph' },
      { term: 'Threshold Detect', desc: '对比沉默阈值，筛选沉寂超过N天的联系人', tag: 'Search' },
      { term: 'Topic Retrieval', desc: '从chat_history检索最近共同话题作为开口素材', tag: 'RAG' },
      { term: 'Style Match', desc: '分析历史对话风格，生成符合用户习惯的激活文案', tag: 'NLP' },
      { term: 'Activate Generate', desc: 'LLM生成自然且符合关系的激活消息', tag: 'LLM' },
    ]
  },
  at: {
    title: '@提及提醒',
    icon: '@',
    nodes: 'User Node ← At Event ← Group Node',
    steps: [
      { term: 'Message Parse', desc: '实时解析群消息流，检测@提及事件', tag: 'NLP' },
      { term: 'Context Extract', desc: '提取@提及的上下文内容和意图', tag: 'NLP' },
      { term: 'Priority Calc', desc: '基于Group重要性+发送者关系计算响应优先级', tag: 'Graph' },
      { term: 'Response Generate', desc: '生成回复建议或提醒卡片', tag: 'LLM' },
    ]
  },
  conflict: {
    title: '冲突提醒',
    icon: '⚠️',
    nodes: 'User Node ← Contact A | Contact B',
    steps: [
      { term: 'Sentiment Analyze', desc: '分析双方与User的交互情感倾向', tag: 'NLP' },
      { term: 'Conflict Detect', desc: '检测消息中的冲突关键词和语气', tag: 'NLP' },
      { term: 'Graph Relation', desc: '分析Contact A→Contact B的边关系和历史冲突', tag: 'Graph' },
      { term: 'Resolution Generate', desc: '生成调解建议或提醒用户注意', tag: 'LLM' },
    ]
  }
};

// 渲染标签
const StepTag = ({ tag }) => {
  const style = TAG_COLORS[tag] || TAG_COLORS.LLM;
  return (
    <span 
      className="step-tag"
      style={{ 
        background: style.bg,
        color: style.color,
        borderColor: style.border
      }}
    >
      {tag}
    </span>
  );
};

export default function AnalysisDetail({ scenario, role }) {
  if (!scenario || !role) {
    return (
      <div className="analysis-detail">
        <div className="empty-analysis">
          <p>选择角色和时间点查看分析</p>
        </div>
      </div>
    );
  }

  const config = TYPE_CONFIG[scenario.type] || TYPE_CONFIG.ddl;
  const pipeline = PIPELINE_CONFIG[scenario.type] || PIPELINE_CONFIG.ddl;

  return (
    <div className="analysis-detail fade-in">
      {/* 场景标题 */}
      <div className="scenario-header">
        <span 
          className="scenario-icon"
          style={{ background: scenario.type === 'ddl' ? '#fa5151' : scenario.type === 'vote' ? '#07c160' : '#12b7f5' }}
        >
          {config.icon}
        </span>
        <div className="scenario-info">
          <span className="scenario-type">{config.label}</span>
          <span className="scenario-title">{scenario.title}</span>
        </div>
      </div>

      {/* 管线标题 */}
      <div className="pipeline-title">
        <span className="pipeline-label">LLM处理管线</span>
        <span className="pipeline-badge">Powered by Graph + RAG + LLM</span>
      </div>

      {/* LLM处理管线 */}
      <div className="llm-pipeline">
        <div className="pipeline-steps">
          {pipeline.steps.map((step, idx) => (
            <div key={idx} className="pipeline-step">
              {/* 步骤编号 */}
              <div className="step-indicator">
                <div className="step-number">{idx + 1}</div>
                {idx < pipeline.steps.length - 1 && <div className="step-line" />}
              </div>
              
              {/* 步骤内容 */}
              <div className="step-content">
                <div className="step-header">
                  <span className="step-term">{step.term}</span>
                  <StepTag tag={step.tag} />
                </div>
                <p className="step-desc">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
