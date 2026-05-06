import React, { useState } from 'react';
import './LoginScreen.css';

export default function LoginScreen({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isLogging, setIsLogging] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.toLowerCase() === 'qbuddy2026') {
      setIsLogging(true);
      setTimeout(() => {
        setLoginSuccess(true);
        setTimeout(() => {
          onLogin();
        }, 500);
      }, 800);
    } else {
      setError(true);
      setTimeout(() => setError(false), 1000);
    }
  };

  return (
    <div className={`login-screen ${loginSuccess ? 'success' : ''}`}>
      <div className="login-container">
        <div className="login-header">
          <div className={`qbuddy-logo ${isLogging ? 'logging' : ''} ${loginSuccess ? 'logged' : ''}`}>
            {loginSuccess ? '✓' : '🧡'}
          </div>
          <h1>QBuddy</h1>
          <p className="login-subtitle">帮你不错过</p>
        </div>
        
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="password"
              placeholder="请输入访问密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${error ? 'shake' : ''} ${isLogging ? 'logging' : ''}`}
              disabled={isLogging}
            />
          </div>
          <button 
            type="submit" 
            className={`login-btn ${isLogging ? 'logging' : ''}`}
            disabled={isLogging}
          >
            {isLogging ? (
              <span className="btn-content">
                <span className="spinner" />
                登录中...
              </span>
            ) : (
              '进入Demo'
            )}
          </button>
        </form>
      </div>
      
      <div className="login-footer">
        <p>腾讯PCG校园AI产品创意大赛</p>
        <p>QBuddy - 基于关系增强图谱的QQ智能助手</p>
      </div>
      
      <div className="login-decoration">
        <div className="deco-circle circle-1" />
        <div className="deco-circle circle-2" />
        <div className="deco-circle circle-3" />
      </div>
    </div>
  );
}
