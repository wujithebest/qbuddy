import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { GRAPH_DATA } from '../../data/mockData';
import './GraphView.css';

export default function GraphView({ role, highlightedNodes, highlightedLinks }) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [tooltipInfo, setTooltipInfo] = useState(null);

  // 统一颜色配置 - 用户节点用渐变，其他统一蓝色
  const COLORS = {
    user: '#2D4AE0',       // 用户节点深蓝
    unified: '#4A6CF7',   // 所有联系人/DDL/事件/频道统一蓝色
  };

  // 事件类型配置
  const EVENT_CONFIG = {
    ddl: { color: '#4A6CF7', label: 'DDL' },
    vote: { color: '#4A6CF7', label: '投票' },
    birthday: { color: '#4A6CF7', label: '生日' },
    signal: { color: '#4A6CF7', label: '信号' },
    at: { color: '#4A6CF7', label: '@提及' },
    channel: { color: '#4A6CF7', label: '频道' }
  };

  // 温度状态标签和图标
  const TEMP_STATUS = {
    normal: { label: '正常', icon: '✓' },
    cooling: { label: '降温', icon: '⚠️' },
    cold: { label: '沉寂', icon: '❄️' },
    hot: { label: '热门', icon: '🔥' }
  };

  // 获取联系人详情数据（参考 graph_builder.py 的 Edge properties）
  const getContactDetails = (contactNode, linkData) => {
    const relationshipMap = {
      1: '搭子(游戏)',
      2: '搭子(考研)',
      3: '同学',
      4: '室友',
      5: '老师'
    };
    
    // 从 graph_builder.py 的 create_social_links 获取真实数据
    const edgeProps = linkData?.properties || {};
    const edgeType = edgeProps.edge_type || relationshipMap[contactNode.group] || '好友';
    const coolingRatio = edgeProps.cooling_ratio || (() => {
      const strength = linkData?.strength || 0.5;
      const baselineDays = 3;
      const actualDays = Math.round(3 + (1 - strength) * 30);
      return actualDays / baselineDays;
    })();
    const daysSince = edgeProps.days_since_interaction || (() => {
      const strength = linkData?.strength || 0.5;
      return Math.round(3 + (1 - strength) * 30);
    })();
    const lambda = edgeProps.λ || 0.01; // 衰减系数
    
    const temp = linkData?.temp || 'normal';
    const ratio = typeof coolingRatio === 'number' ? coolingRatio : 1;
    
    return {
      relationship: edgeType,
      edge_type: edgeType,
      cooling_ratio: typeof coolingRatio === 'number' ? coolingRatio.toFixed(2) : '1.00',
      days_since_interaction: typeof daysSince === 'number' ? `${daysSince}天` : daysSince,
      lambda: typeof lambda === 'number' ? lambda.toFixed(3) : '0.010',
      interactionIndex: `${(linkData?.strength || 0.5).toFixed(2)}/1.0`,
      baselineFreq: '每3天',
      actualInterval: typeof daysSince === 'number' ? `${daysSince}天` : '未知',
      status: ratio > 2.5 ? `⚠️ 降温 (${ratio.toFixed(1)}倍)` : '正常',
      threshold: '>2.5倍基线'
    };
  };

  // 获取DDL/事件详情
  const getEventDetails = (eventNode) => {
    const eventName = eventNode.name || '';
    const isDDL = eventNode.eventType === 'ddl';
    
    // 模拟计算
    const daysLeft = isDDL ? Math.floor(Math.random() * 7) + 1 : 7;
    const urgencyLevel = daysLeft <= 2 ? '高' : daysLeft <= 5 ? '中' : '低';
    
    // 提取群组名称（参考 graph_builder.py _create_ddl_event）
    let sourceGroup = '未知来源';
    if (eventName.includes('数据库')) sourceGroup = '数据库课程群';
    else if (eventName.includes('操作')) sourceGroup = '操作系统课程群';
    else if (eventName.includes('算法')) sourceGroup = '算法讨论群';
    else if (eventName.includes('投票')) sourceGroup = '课程群';
    
    // 事件节点 properties（参考 graph_builder.py Event properties）
    const eventProps = eventNode.properties || {};
    
    return {
      event_type: eventNode.eventType?.toUpperCase() || 'EVENT',
      source_group: sourceGroup,
      source_group_name: eventProps.source_group_name || sourceGroup,
      deadline: '2026-05-06 12:00',
      urgency: urgencyLevel,
      daysLeft: `还有${daysLeft}天`,
      threshold: isDDL ? 'DDL≤7天' : '常规检测',
      urgency_raw: daysLeft <= 2 ? 'high' : daysLeft <= 5 ? 'medium' : 'low'
    };
  };

  useEffect(() => {
    if (!role || !svgRef.current || !containerRef.current) return;

    const data = GRAPH_DATA[role.id];
    if (!data) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Clear previous
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    const g = svg.append('g');

    // Zoom
    const zoom = d3.zoom()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Create simulation
    const simulation = d3.forceSimulation(data.nodes)
      .force('link', d3.forceLink(data.links).id(d => d.id).distance(120))
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(60));

    // Define defs (no gradients or glow filters - flat design)
    const defs = svg.append('defs');

    // Helper function to get link data for a node
    const getLinkForNode = (nodeId) => {
      return data.links.find(l => 
        (l.source.id === nodeId || l.source === nodeId || l.source.name === nodeId) || 
        (l.target.id === nodeId || l.target === nodeId || l.target.name === nodeId)
      );
    };

    // Draw links with hover interaction
    const linkGroup = g.append('g').attr('class', 'links');
    
    const link = linkGroup
      .selectAll('line')
      .data(data.links)
      .enter()
      .append('line')
      .attr('class', d => {
        const isHighlighted = highlightedLinks.some(h => 
          h === d.source.name || h === d.target.name ||
          (d.source.id && h === d.source.id) || (d.target.id && h === d.target.id)
        );
        return `link ${isHighlighted ? 'highlighted' : ''}`;
      })
      .attr('stroke', COLORS.unified)
      .attr('stroke-width', d => Math.max(2, d.strength * 5))
      .attr('stroke-opacity', 0.6)
      .style('filter', 'none')
      .style('cursor', 'pointer');

    // Link hover events for edge info
    link.on('mouseover', (event, d) => {
      const rect = container.getBoundingClientRect();
      const sourceName = d.source.name || d.source;
      const targetName = d.target.name || d.target;
      const edgeType = d.source.type === 'event' || d.target.type === 'event' ? 'event_link' : 'social_link';
      
      setTooltipInfo({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        type: 'edge',
        edgeData: {
          source: sourceName,
          target: targetName,
          edge_type: edgeType,
          strength: d.strength,
          threshold: edgeType === 'event_link' ? '强度>0.5 且 DDL≤7天' : '强度>0.5',
          dataSource: edgeType === 'event_link' ? 'Group Parse → Entity Extraction' : '消息流/互动记录'
        }
      });
    })
    .on('mouseout', () => {
      setTooltipInfo(null);
    });

    // Draw nodes
    const nodeGroup = g.append('g').attr('class', 'nodes');
    
    const node = nodeGroup
      .selectAll('g')
      .data(data.nodes)
      .enter()
      .append('g')
      .attr('class', d => {
        const isHighlighted = highlightedNodes.some(h => 
          h === d.name || h === d.id
        );
        return `node ${d.type} ${d.eventType || ''} ${isHighlighted ? 'highlighted' : ''}`;
      })
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    // Helper to get temperature for contact nodes
    const getContactTemp = (d) => {
      if (d.type !== 'contact') return 'normal';
      const link = getLinkForNode(d.id || d.name);
      return link?.temp || 'normal';
    };

    // Node circles with unified color scheme
    node.append('circle')
      .attr('r', d => d.type === 'user' ? 38 : 28)
      .attr('fill', d => {
        if (d.type === 'user') return COLORS.user;
        return COLORS.unified; // 统一蓝色
      })
      .style('filter', 'none');

    // Add pulse ring for highlighted nodes
    node.filter(d => highlightedNodes.some(h => h === d.name || h === d.id))
      .append('circle')
      .attr('class', 'pulse-ring')
      .attr('r', d => d.type === 'user' ? 45 : 35)
      .attr('fill', 'none')
      .attr('stroke', d => d.type === 'user' ? COLORS.user : COLORS.unified)
      .attr('stroke-width', 3)
      .attr('opacity', 0)
      .style('filter', 'none');

    // Emoji for user and contact nodes
    node.filter(d => d.type === 'user')
      .append('text')
      .text('👤')
      .attr('text-anchor', 'middle')
      .attr('dy', 8)
      .attr('font-size', 24)
      .attr('fill', 'white');

    node.filter(d => d.type === 'contact')
      .append('text')
      .text('👤')
      .attr('text-anchor', 'middle')
      .attr('dy', 4)
      .attr('font-size', 16)
      .attr('fill', 'white');

    // Event type badge for event nodes
    node.filter(d => d.type === 'event')
      .append('text')
      .text(d => EVENT_CONFIG[d.eventType]?.label || '📌')
      .attr('text-anchor', 'middle')
      .attr('dy', 4)
      .attr('font-size', 10)
      .attr('fill', 'white')
      .attr('font-weight', 600);

    // Node labels
    node.append('text')
      .text(d => {
        const name = d.name || '';
        return name.length > 6 ? name.substring(0, 6) + '..' : name;
      })
      .attr('text-anchor', 'middle')
      .attr('dy', d => d.type === 'user' ? 58 : 45)
      .attr('font-size', d => d.type === 'user' ? 13 : 11)
      .attr('fill', d => d.type === 'event' ? '#666' : '#333')
      .attr('font-weight', d => d.type === 'user' ? 600 : 400);

    // Pulse animation for highlighted nodes
    node.filter(d => highlightedNodes.some(h => h === d.name || h === d.id))
      .select('.pulse-ring')
      .attr('opacity', 0.6)
      .attr('class', 'pulse-ring animated');

    // Node hover events for structured info
    node.on('mouseover', (event, d) => {
      const rect = container.getBoundingClientRect();
      const linkData = getLinkForNode(d.id || d.name);
      const isHighlighted = highlightedNodes.some(h => h === d.name || h === d.id);
      
      let nodeInfo = { name: d.name || '未知', type: d.type };

      if (d.type === 'user') {
        // 用户节点详情（参考 graph_builder.py add_user_node properties）
        const friendCount = data.nodes.filter(n => n.type === 'contact').length;
        const eventCount = data.nodes.filter(n => n.type === 'event').length;
        const userProps = d.properties || {};
        
        nodeInfo = {
          ...nodeInfo,
          identity: userProps.identity || `${role?.grade || '学生'}·${role?.major || '未知'}`,
          personality: userProps.personality || '活泼开朗',
          interest_tags: userProps.interest_tags || userProps.interests?.slice(0, 3) || ['游戏', '音乐', '学习'],
          threshold_multiplier: userProps.threshold_multiplier || 1.0,
          ddl_sensitivity: userProps.ddl_sensitivity || 1.0,
          friends: `${friendCount}人`,
          pending: `${eventCount}项`,
          status: '活跃'
        };
      } else if (d.type === 'event') {
        // 事件/DDL节点详情
        const details = getEventDetails(d);
        nodeInfo = { ...nodeInfo, ...details };
      } else if (d.type === 'contact') {
        // 联系人节点详情
        const details = getContactDetails(d, linkData);
        nodeInfo = { ...nodeInfo, ...details };
      }

      if (isHighlighted) {
        nodeInfo.highlighted = true;
      }

      setTooltipInfo({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        type: 'node',
        nodeData: nodeInfo,
        linkData: linkData
      });
    })
    .on('mousemove', (event) => {
      if (!tooltipInfo || tooltipInfo.type !== 'node') return;
      const rect = container.getBoundingClientRect();
      setTooltipInfo(prev => prev ? {
        ...prev,
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      } : null);
    })
    .on('mouseout', () => {
      setTooltipInfo(null);
    });

    // Simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [role, highlightedNodes, highlightedLinks]);

  if (!role) {
    return (
      <div className="graph-view">
        <div className="graph-view-empty">
          <p>选择角色查看关系图谱</p>
        </div>
      </div>
    );
  }

  // Calculate tooltip position (fixed positioning to escape panel bounds)
  const getTooltipStyle = () => {
    if (!tooltipInfo) return {};
    const tooltipWidth = 280;
    const tooltipHeight = tooltipInfo.type === 'node' && tooltipInfo.nodeData?.type === 'user' ? 280 : 
                         tooltipInfo.type === 'node' && tooltipInfo.nodeData?.type === 'contact' ? 260 : 220;
    const padding = 15;
    
    // 使用 position:fixed，基于 viewport 绝对坐标
    // tooltipInfo.x/y 是相对于 container 的坐标，需要加上 container 的 viewport offset
    const containerRect = containerRef.current?.getBoundingClientRect() || { left: 0, top: 0 };
    let x = tooltipInfo.x + containerRect.left + padding;
    let y = tooltipInfo.y + containerRect.top - tooltipHeight / 2;
    
    // 边界检测：确保 tooltip 不超出视口
    const viewportWidth = window.innerWidth || 1200;
    const viewportHeight = window.innerHeight || 800;
    
    if (x + tooltipWidth > viewportWidth - padding) {
      x = tooltipInfo.x + containerRect.left - tooltipWidth - padding;
    }
    if (x < padding) x = padding;
    
    if (y < padding) y = padding;
    if (y + tooltipHeight > viewportHeight - padding) {
      y = viewportHeight - tooltipHeight - padding;
    }
    
    return { position: 'fixed', left: `${x}px`, top: `${y}px`, zIndex: 9999 };
  };

  return (
    <div className="graph-view" ref={containerRef}>
      <svg ref={svgRef} />
      
      {/* Node Tooltip - User */}
      {tooltipInfo && tooltipInfo.type === 'node' && tooltipInfo.nodeData?.type === 'user' && (
        <div className="graph-tooltip-card user-tooltip" style={getTooltipStyle()}>
          <div className="tooltip-header user-header">
            <span className="tooltip-icon">👤</span>
            <span className="tooltip-name">{tooltipInfo.nodeData?.name}</span>
          </div>
          <div className="tooltip-divider"></div>
          <div className="tooltip-content">
            <div className="tooltip-row">
              <span className="tooltip-label">身份</span>
              <span className="tooltip-value">{tooltipInfo.nodeData?.identity}</span>
            </div>
            <div className="tooltip-row">
              <span className="tooltip-label">个性</span>
              <span className="tooltip-value">{tooltipInfo.nodeData?.personality}</span>
            </div>
            <div className="tooltip-row">
              <span className="tooltip-label">兴趣标签</span>
              <span className="tooltip-value">{Array.isArray(tooltipInfo.nodeData?.interest_tags) ? tooltipInfo.nodeData.interest_tags.join(' · ') : tooltipInfo.nodeData?.interest_tags}</span>
            </div>
            <div className="tooltip-row">
              <span className="tooltip-label">好友</span>
              <span className="tooltip-value">{tooltipInfo.nodeData?.friends}</span>
            </div>
            <div className="tooltip-row">
              <span className="tooltip-label">待处理</span>
              <span className="tooltip-value">{tooltipInfo.nodeData?.pending}</span>
            </div>
            <div className="tooltip-row">
              <span className="tooltip-label">阈值乘数</span>
              <span className="tooltip-value">{tooltipInfo.nodeData?.threshold_multiplier || 1.0}×</span>
            </div>
            <div className="tooltip-row">
              <span className="tooltip-label">DDL敏感度</span>
              <span className="tooltip-value">{tooltipInfo.nodeData?.ddl_sensitivity || 1.0}</span>
            </div>
            <div className="tooltip-row">
              <span className="tooltip-label">状态</span>
              <span className="tooltip-value status-active">{tooltipInfo.nodeData?.status}</span>
            </div>
          </div>
        </div>
      )}

      {/* Node Tooltip - Contact */}
      {tooltipInfo && tooltipInfo.type === 'node' && tooltipInfo.nodeData?.type === 'contact' && (
        <div className="graph-tooltip-card contact-tooltip" style={getTooltipStyle()}>
          <div className="tooltip-header contact-header">
            <span className="tooltip-icon">👥</span>
            <span className="tooltip-name">{tooltipInfo.nodeData?.name}</span>
          </div>
          <div className="tooltip-divider"></div>
          <div className="tooltip-content">
            <div className="tooltip-row">
              <span className="tooltip-label">关系类型</span>
              <span className="tooltip-value">{tooltipInfo.nodeData?.edge_type || tooltipInfo.nodeData?.relationship}</span>
            </div>
            <div className="tooltip-row">
              <span className="tooltip-label">冷却比</span>
              <span className="tooltip-value">{tooltipInfo.nodeData?.cooling_ratio || '1.00'}</span>
            </div>
            <div className="tooltip-row">
              <span className="tooltip-label">上次互动</span>
              <span className="tooltip-value">{tooltipInfo.nodeData?.days_since_interaction || tooltipInfo.nodeData?.actualInterval}</span>
            </div>
            <div className="tooltip-row">
              <span className="tooltip-label">衰减系数λ</span>
              <span className="tooltip-value">{tooltipInfo.nodeData?.lambda || '0.010'}</span>
            </div>
            <div className="tooltip-row">
              <span className="tooltip-label">互动指数</span>
              <span className="tooltip-value">{tooltipInfo.nodeData?.interactionIndex}</span>
            </div>
            <div className="tooltip-row">
              <span className="tooltip-label">状态</span>
              <span className={`tooltip-value ${tooltipInfo.nodeData?.status?.includes('⚠️') ? 'status-warning' : 'status-active'}`}>
                {tooltipInfo.nodeData?.status}
              </span>
            </div>
            <div className="tooltip-row threshold-row">
              <span className="tooltip-label">触发阈值</span>
              <span className="tooltip-value threshold">{tooltipInfo.nodeData?.threshold}</span>
            </div>
          </div>
        </div>
      )}

      {/* Node Tooltip - Event */}
      {tooltipInfo && tooltipInfo.type === 'node' && tooltipInfo.nodeData?.type === 'event' && (
        <div className="graph-tooltip-card event-tooltip" style={getTooltipStyle()}>
          <div className="tooltip-header event-header">
            <span className="tooltip-icon">📌</span>
            <span className="tooltip-name">{tooltipInfo.nodeData?.name}</span>
          </div>
          <div className="tooltip-divider"></div>
          <div className="tooltip-content">
            <div className="tooltip-row">
              <span className="tooltip-label">事件类型</span>
              <span className="tooltip-value">{tooltipInfo.nodeData?.event_type}</span>
            </div>
            <div className="tooltip-row">
              <span className="tooltip-label">来源群组</span>
              <span className="tooltip-value">{tooltipInfo.nodeData?.source_group_name || tooltipInfo.nodeData?.source_group}</span>
            </div>
            <div className="tooltip-row">
              <span className="tooltip-label">截止</span>
              <span className="tooltip-value">{tooltipInfo.nodeData?.deadline}</span>
            </div>
            <div className="tooltip-row">
              <span className="tooltip-label">紧急度</span>
              <span className={`tooltip-value urgency-${tooltipInfo.nodeData?.urgency_raw || 'medium'}`}>
                {tooltipInfo.nodeData?.urgency} ({tooltipInfo.nodeData?.daysLeft})
              </span>
            </div>
            <div className="tooltip-row threshold-row">
              <span className="tooltip-label">触发阈值</span>
              <span className="tooltip-value threshold">{tooltipInfo.nodeData?.threshold}</span>
            </div>
          </div>
        </div>
      )}

      {/* Edge Tooltip */}
      {tooltipInfo && tooltipInfo.type === 'edge' && (
        <div className="graph-tooltip-card edge-tooltip" style={getTooltipStyle()}>
          <div className="tooltip-header edge-header">
            <span className="tooltip-icon">🔗</span>
            <span className="tooltip-name">连线信息</span>
          </div>
          <div className="tooltip-divider"></div>
          <div className="tooltip-content">
            <div className="tooltip-row">
              <span className="tooltip-label">起点</span>
              <span className="tooltip-value">{tooltipInfo.edgeData?.source}</span>
            </div>
            <div className="tooltip-row">
              <span className="tooltip-label">终点</span>
              <span className="tooltip-value">{tooltipInfo.edgeData?.target}</span>
            </div>
            <div className="tooltip-row">
              <span className="tooltip-label">关联类型</span>
              <span className="tooltip-value">{tooltipInfo.edgeData?.edge_type}</span>
            </div>
            <div className="tooltip-row">
              <span className="tooltip-label">关联强度</span>
              <span className="tooltip-value">{tooltipInfo.edgeData?.strength?.toFixed(2)}</span>
            </div>
            <div className="tooltip-row">
              <span className="tooltip-label">触发条件</span>
              <span className="tooltip-value threshold">{tooltipInfo.edgeData?.threshold}</span>
            </div>
            <div className="tooltip-row">
              <span className="tooltip-label">数据来源</span>
              <span className="tooltip-value small">{tooltipInfo.edgeData?.dataSource}</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
