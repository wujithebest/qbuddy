import React, { useState, useRef, useEffect } from 'react';
import './QBuddyEntry.css';

export default function QBuddyEntry({ isActive, hasNotification, disabled, mood = 'normal' }) {
  const [rotation, setRotation] = useState({ rotate: 0, translateX: 0, translateY: 0 });
  const [isPressed, setIsPressed] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current || disabled) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // 计算鼠标相对中心的偏移
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      
      // 计算角度（度数）
      const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
      
      // 限制旋转角度在 ±8° 以内
      const clampedRotate = Math.max(-8, Math.min(8, angle * 0.15));
      
      // 微小的平移偏移（±3px 以内）
      const maxTranslate = 3;
      const translateX = Math.max(-maxTranslate, Math.min(maxTranslate, deltaX * 0.03));
      const translateY = Math.max(-maxTranslate, Math.min(maxTranslate, deltaY * 0.03));
      
      setRotation({
        rotate: clampedRotate,
        translateX,
        translateY
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [disabled]);

  const handleMouseDown = () => {
    if (!disabled) setIsPressed(true);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  // Kimi风格：竖向长条豆豆眼
  const getEyeClass = () => {
    if (mood === 'happy' || isPressed) return 'bar-eye happy';
    if (mood === 'worried') return 'bar-eye worried';
    return 'bar-eye';
  };

  // 计算眼睛的 transform 样式
  const getEyeStyle = () => {
    const { rotate, translateX, translateY } = rotation;
    return {
      transform: `rotate(${rotate}deg) translate(${translateX}px, ${translateY}px)`
    };
  };

  return (
    <div className="qbuddy-entry-wrapper">
      {hasNotification && !disabled && (
        <span className="notification-dot">•</span>
      )}
      <div
        ref={containerRef}
        className={`qbuddy-entry ${isActive ? 'active' : ''} ${isPressed ? 'pressed' : ''} ${disabled ? 'disabled' : ''} ${hasNotification && !disabled ? 'has-notification' : ''}`}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* 极简风格：蓝色圆形底板 + 竖向长条豆豆眼 */}
        <div className="qbuddy-eyes" style={getEyeStyle()}>
          <div className={getEyeClass()} />
          <div className={getEyeClass()} />
        </div>
      </div>
      <span className="qbuddy-label">QBuddy</span>
    </div>
  );
}
