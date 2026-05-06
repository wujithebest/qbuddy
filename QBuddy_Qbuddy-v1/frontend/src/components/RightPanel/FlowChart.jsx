import React from 'react';
import './FlowChart.css';

/**
 * 数据处理流程图 - 展示从原始数据到卡片推送的完整数据流转
 * 
 * 核心逻辑：
 * 1. 收集数据：QQ消息流 → NLP提取实体/意图 → 构建图谱节点和边
 * 2. 分析构建：7个检测器并行扫描图谱 → 计算阈值/权重 → LLM function calling分析
 * 3. 触发推送：阈值超限触发 → 优先级排序 → 聚合分组 → 生成卡片
 * 4. 反馈迭代：用户操作反馈 → 更新权重 → 调整阈值 → 优化推荐
 */

const FLOW_STEPS = [
  {
    id: 'collect',
    icon: '📥',
    label: '收集数据',
    color: '#4A6CF7',
    dataIn: 'QQ消息JSON',
    dataOut: '{entities, intent, contacts}',
    transform: 'NLP分词 → 实体提取 → 意图识别',
    example: '"明天DDL" → {type:DDL, deadline:5/8, source:数据库群}',
    detail: '原始消息经NLP处理后，提取出人名/时间/事件等实体，识别意图（提醒/请求/社交），作为图谱构建的输入'
  },
  {
    id: 'build',
    icon: '🕸️',
    label: '分析构建',
    color: '#2D4AE0',
    dataIn: '{entities, intent}',
    dataOut: '{nodes[], edges[], weights{}}',
    transform: 'KG节点创建 → 边权重计算 → 温度更新',
    example: 'User→小王: weight=0.82, temp=0.35(↓), baseline=3d',
    detail: '实体映射为图谱节点(User/Contact/Event/Channel)，计算交互频率权重w=Σf(type)·e^(-λΔt)，温度T=w·cooling_ratio'
  },
  {
    id: 'trigger',
    icon: '🚀',
    label: '触发推送',
    color: '#4A6CF7',
    dataIn: '{nodes[], edges[], weights{}}',
    dataOut: '{cards[], priority[], actions[]}',
    transform: '7检测器并行 → 阈值判断 → LLM分析 → 聚合排序',
    example: 'cooling_ratio=3.2>阈值2.5 → 触发搭子降温 → LLM生成破冰话术',
    detail: '7个场景检测器并行扫描图谱边：DDL≤7天、cooling_ratio>2.5、沉寂>30天、生日≤7天等阈值触发，LLM function calling生成个性化内容'
  },
  {
    id: 'iterate',
    icon: '🔄',
    label: '反馈迭代',
    color: '#2D4AE0',
    dataIn: '{user_actions[], click_rates}',
    dataOut: '{updated_weights, adjusted_thresholds}',
    transform: '操作反馈 → 权重更新 → 阈值冷启动+在线调优',
    example: '用户忽略3次同类卡片 → 阈值2.5→3.0, 权重×0.8',
    detail: '冷启动：基于角色画像初始化阈值；在线学习：用户点击/忽略/跳转行为反馈→贝叶斯更新阈值，确保推送精准度持续提升'
  },
];

export default function FlowChart() {
  return (
    <div className="flow-chart">
      {FLOW_STEPS.map((step, i) => (
        <React.Fragment key={step.id}>
          <div className="flow-node" style={{ '--node-color': step.color }}>
            <div className="flow-node-header">
              <span className="flow-icon">{step.icon}</span>
              <span className="flow-label">{step.label}</span>
            </div>
            <div className="flow-data">
              <div className="flow-data-row">
                <span className="data-tag in">IN</span>
                <code className="data-val">{step.dataIn}</code>
              </div>
              <div className="flow-data-row">
                <span className="data-tag out">OUT</span>
                <code className="data-val">{step.dataOut}</code>
              </div>
            </div>
            <div className="flow-transform">{step.transform}</div>
          </div>
          {i < FLOW_STEPS.length - 1 && (
            <div className="flow-connector">
              <div className="connector-line"></div>
              <div className="connector-arrow">▶</div>
              <div className="connector-data">
                <code>{FLOW_STEPS[i].dataOut.split('}')[0]}…</code>
              </div>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
