import React from 'react';
import './Timeline.css';

const TYPE_ICONS = {
  ddl: '📢',
  at: '@',
  vote: '🗳️',
  buddy: '🔥',
  birthday: '🎂',
  reactivate: '💤',
  channel: '📢',
  conflict: '⚠️'
};

const TYPE_COLORS = {
  ddl: '#fa5151',
  at: '#12b7f5',
  vote: '#07c160',
  buddy: '#ff9500',
  birthday: '#ff2d55',
  reactivate: '#8e8e93',
  channel: '#4A6CF7',
  conflict: '#ff3b30'
};

export default function Timeline({ events, currentIndex, onChange }) {
  if (!events || events.length === 0) {
    return <div className="timeline-empty">暂无推送事件</div>;
  }

  return (
    <div className="timeline fade-in">
      <h4 className="timeline-title">⏰ 今日QBuddy推送</h4>
      <div className="timeline-track">
        <div 
          className="timeline-progress"
          style={{ width: `${((currentIndex + 1) / events.length) * 100}%` }}
        />
      </div>
      <div className="timeline-slider-container">
        <input
          type="range"
          min="0"
          max={events.length - 1}
          value={currentIndex}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="timeline-slider"
        />
      </div>
      <div className="timeline-events">
        {events.map((event, idx) => (
          <div 
            key={idx}
            className={`timeline-event ${idx === currentIndex ? 'active' : ''} ${idx < currentIndex ? 'past' : ''}`}
            onClick={() => onChange(idx)}
          >
            <span 
              className="event-icon"
              style={{ background: idx <= currentIndex ? TYPE_COLORS[event.type] : '#ddd' }}
            >
              {TYPE_ICONS[event.type]}
            </span>
            <div className="event-info">
              <span className="event-time">{event.time}</span>
              <span className="event-title">{event.title}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
