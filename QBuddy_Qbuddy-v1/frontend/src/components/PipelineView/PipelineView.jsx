import React, { useState, useEffect } from 'react';
import './PipelineView.css';

// 4阶段数据定义
const STAGES = [
  {
    id: 'collect',
    number: 1,
    label: '收集数据',
    funcName: 'run_collect()',
    color: '#4A6CF7',
    subComponents: [
      { id: 'profile', icon: '👤', label: 'Profile', desc: '用户画像' },
      { id: 'contacts', icon: '👥', label: 'Contacts', desc: '联系人列表', details: {
        items: ['聊天频率', '聊天数据']
      }},
      { id: 'groups', icon: '💬', label: 'Groups', desc: '群聊消息' },
      { id: 'dynamics', icon: '📊', label: 'Dynamics', desc: '好友动态' },
      { id: 'ecosystem', icon: '🌐', label: 'Ecosystem', desc: 'QQ生态数据', details: {
        items: ['QQ音乐最近在听', 'QQ游戏最近在玩', '腾讯视频最近在追']
      }},
    ],
    output: { label: 'LLM结构化输出', isLLM: true },
    details: {
      input: '5个JSON原始数据文件',
      output: 'collected dict: {profile, contacts, groups, dynamics, ecosystem}',
      description: '5个数据源统一收集，结构化原始数据为统一格式'
    }
  },
  {
    id: 'build',
    number: 2,
    label: '分析构建',
    funcName: 'run_build()',
    color: '#3B5AE0',
    subComponents: [
      { id: 'graph', icon: '🕸️', label: '关系增强图谱构建', desc: 'Node(5种) + Edge(4种) → Graph', funcName: 'build_graph_from_data()' },
      { id: 'detectors', icon: '🔍', label: '8场景检测器', desc: 'ScenarioDetectorManager.detect_all()', badges: ['DDL提取','请求检测','搭子降温','沉寂激活','生日提醒','好友动态','生态同好','频道推荐'] },
      { id: 'algorithm', icon: '🧮', label: '核心算法引擎', desc: '温度衰减/冷却比/权重/优先级', formulas: ['T = e^(-λ·Δt)', '冷却比 = actual / baseline', 'weight = 0.8×时效 + 0.2×频率', 'priority = 0.35×u + 0.30×i + 0.20×p + 0.15×r'] },
      { id: 'sort', icon: '📊', label: '优先级排序', desc: '按priority降序 → TriggerEvent[]' },
    ],
    output: { label: 'triggered_events', isLLM: false },
    details: {
      input: 'Graph图谱数据',
      output: 'TriggerEvent[] (按优先级排序)',
      description: '构建5种Node+4种Edge的关系图谱，8个场景检测器并行运行，核心算法引擎计算温度衰减/冷却比/优先级'
    }
  },
  {
    id: 'trigger',
    number: 3,
    label: '触发推送',
    funcName: 'run_trigger()',
    color: '#2D4AE0',
    subComponents: [
      { id: 'cardbuilder', icon: '💳', label: 'CardBuilder', desc: '.generate_card()' },
      { id: 'llm', icon: '✨', label: 'LLM文案生成', desc: 'generate_greeting() | generate_blessing()', isLLM: true },
      { id: 'llm_output', icon: '📝', label: 'LLM生成内容', desc: '破冰话术 + 生日祝福 (icebreaker / blessing)' },
      { id: 'card_types', icon: '🎴', label: '卡片类型输出', badges: ['DDL提醒','投票','@提及','搭子降温 +LLM','生日 +LLM','好友动态','频道推荐'], isLLMBadges: [3,4] },
      { id: 'aggregate', icon: '📦', label: '聚合', desc: 'aggregate_cards()' },
    ],
    output: { label: 'cards (按优先级排序的卡片列表)', isLLM: false },
    details: {
      input: 'TriggerEvent[] + 用户画像(persona/兴趣/习惯)',
      output: 'Card[] (按优先级排序)',
      description: '根据事件类型生成对应卡片，LLM生成破冰话术和生日祝福，同类型卡片聚合'
    }
  },
  {
    id: 'iterate',
    number: 4,
    label: '反馈迭代',
    funcName: 'run_iterate()',
    color: '#1A3AB5',
    subComponents: [
      { id: 'feedback', icon: '👆', label: '用户反馈收集', desc: 'click / ignore / jump / complete / dismiss' },
      { id: 'learning', icon: '🧠', label: '在线学习更新', desc: '贝叶斯更新·温度调整·阈值自适应', funcName: 'OnlineLearning + BayesianUpdater', formulas: ["α' = α + w₁·lr", "β' = β + w₂·lr", "P(θ|data) ∝ P(data|θ)·P(θ)"] },
      { id: 'coldstart', icon: '▶️', label: '冷启动初始化', desc: 'ColdStartInitializer' },
    ],
    output: { label: '反馈回路 → 调整阈值与温度', isFeedbackLoop: true },
    details: {
      input: '用户交互行为数据',
      output: '更新后的参数: α\', β\', 温度, 阈值',
      description: '5种用户反馈驱动贝叶斯更新，温度调整与触发阈值自适应，反馈回路回到阶段2持续优化'
    }
  }
];

export default function PipelineView({ role }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeStage, setActiveStage] = useState(null);
  const [expandedComponent, setExpandedComponent] = useState(null);

  const startAnimation = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveStage(0);
  };

  useEffect(() => {
    if (!isAnimating || activeStage === null) return;
    
    if (activeStage < STAGES.length) {
      const timer = setTimeout(() => {
        setActiveStage(prev => prev + 1);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      // 动画完成，保持激活状态，只标记动画结束
      setIsAnimating(false);
    }
  }, [isAnimating, activeStage]);

  const handleComponentClick = (stageId, componentId) => {
    const key = stageId + '-' + componentId;
    setExpandedComponent(expandedComponent === key ? null : key);
  };

  const getExpandedData = () => {
    if (!expandedComponent) return null;
    const parts = expandedComponent.split('-');
    const stageId = parts[0];
    const componentId = parts.slice(1).join('-');
    const stage = STAGES.find(s => s.id === stageId);
    if (!stage) return null;
    
    if (componentId === 'stage') {
      return { ...stage, isStage: true };
    }
    
    const component = stage.subComponents.find(c => c.id === componentId);
    if (!component) return null;
    
    return { stage, component, isStage: false };
  };

  const expandedData = getExpandedData();

  const renderSubComponent = (stage, comp, stageIndex, compIndex) => {
    const isLLM = comp.isLLM;
    const key = stage.id + '-' + comp.id;
    const isExpanded = expandedComponent === key;
    const isCurrentActive = activeStage === stageIndex;
    
    return (
      <div 
        key={comp.id}
        className={'sub-component-card' + (isLLM ? ' llm-highlight' : '') + (isExpanded ? ' expanded' : '')}
        onClick={(e) => {
          e.stopPropagation();
          handleComponentClick(stage.id, comp.id);
        }}
        style={{ animationDelay: isCurrentActive ? (compIndex * 0.15) + 's' : '0s' }}
      >
        <div className="sub-comp-icon">{comp.icon}</div>
        <div className="sub-comp-label">{comp.label}</div>
        <div className="sub-comp-desc">{comp.desc}</div>
        {comp.funcName && (
          <div className="sub-comp-func">{comp.funcName}</div>
        )}
        {comp.badges && (
          <div className="sub-comp-badges">
            {comp.badges.map((badge, i) => (
              <span key={i} className={'badge' + (comp.isLLMBadges && comp.isLLMBadges.includes(i) ? ' llm-badge' : '')}>
                {badge}
              </span>
            ))}
          </div>
        )}
        {comp.formulas && (
          <div className="sub-comp-formulas">
            {comp.formulas.map((formula, i) => (
              <span key={i} className="formula-badge">{formula}</span>
            ))}
          </div>
        )}
        {isExpanded && <div className="sub-comp-shine"></div>}
      </div>
    );
  };

  const renderStage = (stage, stageIndex) => {
    const isActive = activeStage !== null && activeStage >= stageIndex;
    const isCurrentActive = activeStage === stageIndex;
    
    return (
      <div 
        key={stage.id}
        className={'stage-card' + (isActive ? ' active' : '') + (isCurrentActive ? ' current' : '')}
        style={{ '--stage-color': stage.color }}
        onClick={() => handleComponentClick(stage.id, 'stage')}
      >
        <div className="stage-top-bar"></div>
        <div className="stage-header">
          <div className="stage-number">{stage.number}</div>
          <div className="stage-title-group">
            <span className="stage-title">{stage.label}</span>
            <span className="stage-func">{stage.funcName}</span>
          </div>
        </div>
        
        <div className="stage-body">
          <div className="sub-components-grid">
            {stage.subComponents.map((comp, compIndex) => 
              renderSubComponent(stage, comp, stageIndex, compIndex)
            )}
          </div>
          
          <div className="stage-output">
            <div className={'output-box' + (stage.output.isLLM ? ' llm-output' : '') + (stage.output.isFeedbackLoop ? ' feedback-output' : '')}>
              {stage.output.isFeedbackLoop && <span className="feedback-arrow">↩️</span>}
              <span className="output-label">{stage.output.label}</span>
              {stage.output.isLLM && <span className="llm-indicator">✨LLM</span>}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderConnector = (stageIndex) => {
    const isActive = activeStage !== null && activeStage > stageIndex;
    return (
      <div key={'connector-' + stageIndex} className={'stage-connector' + (isActive ? ' active' : '')}>
        <div className="connector-line">
          <div className="connector-particle"></div>
        </div>
      </div>
    );
  };

  const renderDetailPanel = () => {
    if (!expandedData) return null;
    
    return (
      <div className="detail-panel" onClick={() => setExpandedComponent(null)}>
        <div className="detail-content" onClick={(e) => e.stopPropagation()}>
          <div className="detail-header">
            {expandedData.isStage ? (
              <React.Fragment>
                <span className="detail-icon">{STAGES.find(s => s.id === expandedData.id).number}</span>
                <span className="detail-title">{expandedData.label}</span>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <span className="detail-icon">{expandedData.component.icon}</span>
                <span className="detail-title">{expandedData.stage.label} - {expandedData.component.label}</span>
              </React.Fragment>
            )}
            <button className="detail-close" onClick={() => setExpandedComponent(null)}>×</button>
          </div>
          <div className="detail-body">
            {expandedData.isStage ? (
              <React.Fragment>
                <p className="detail-desc">{expandedData.details.description}</p>
                <div className="detail-section">
                  <div className="section-label">📥 输入</div>
                  <code className="section-content">{expandedData.details.input}</code>
                </div>
                <div className="detail-section">
                  <div className="section-label">📤 输出</div>
                  <code className="section-content">{expandedData.details.output}</code>
                </div>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <p className="detail-desc">{expandedData.component.desc}</p>
                {expandedData.component.funcName && (
                  <div className="detail-section">
                    <div className="section-label">🔧 函数</div>
                    <code className="section-content">{expandedData.component.funcName}</code>
                  </div>
                )}
                {expandedData.component.badges && (
                  <div className="detail-section">
                    <div className="section-label">🏷️ 场景/类型</div>
                    <div className="badges-display">
                      {expandedData.component.badges.map((badge, i) => (
                        <span key={i} className={'badge' + (expandedData.component.isLLMBadges && expandedData.component.isLLMBadges.includes(i) ? ' llm-badge' : '')}>
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {expandedData.component.formulas && (
                  <div className="detail-section">
                    <div className="section-label">📐 公式</div>
                    <div className="formulas-display">
                      {expandedData.component.formulas.map((formula, i) => (
                        <span key={i} className="formula-badge">{formula}</span>
                      ))}
                    </div>
                  </div>
                )}
                {expandedData.component.details && expandedData.component.details.items && (
                  <div className="detail-section">
                    <div className="section-label">📋 数据项</div>
                    <ul className="detail-items-list">
                      {expandedData.component.details.items.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="pipeline-view">
      <div className="pipeline-bg">
        <div className="bg-grid"></div>
      </div>

      <div className="pipeline-header">
        <h1 className="pipeline-title">
          <span className="title-icon">⚙️</span>
          QBuddy 数据处理管线
        </h1>
        <p className="pipeline-subtitle">
          Collect → Build → Trigger → Iterate &nbsp;|&nbsp; 4阶段 AI Agent 引擎
        </p>
        <button 
          className={'animate-btn' + (isAnimating ? ' running' : '')}
          onClick={() => {
            if (isAnimating) return;
            setActiveStage(null);  // 先重置
            setTimeout(() => {
              setIsAnimating(true);
              setActiveStage(0);
            }, 50);  // 短暂延迟确保state先清零
          }}
          disabled={isAnimating}
        >
          {isAnimating ? '🔄 数据流动中...' : (activeStage !== null && activeStage >= STAGES.length ? '▶️ 重新演示' : '▶️ 数据流演示')}
        </button>
      </div>

      <div className="pipeline-container">
        {STAGES.map((stage, stageIndex) => (
          <React.Fragment key={stage.id}>
            {renderStage(stage, stageIndex)}
            {stageIndex < STAGES.length - 1 && renderConnector(stageIndex)}
          </React.Fragment>
        ))}

        <div className={'feedback-loop' + (activeStage >= 3 ? ' active' : '')}>
          <div className="feedback-loop-line">
            <div className="feedback-particle"></div>
          </div>
          <div className="feedback-label">反馈回路 → 调整阈值与温度</div>
        </div>
      </div>

      {renderDetailPanel()}

      <div className="pipeline-footer">
        <div className="footer-note">
          💡 点击任意阶段或子组件查看详细信息，或点击"数据流演示"观看完整处理流程
        </div>
      </div>
    </div>
  );
}
