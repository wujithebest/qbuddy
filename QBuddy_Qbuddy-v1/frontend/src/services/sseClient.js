/**
 * SSE客户端服务
 * 用于连接后端SSE端点，接收实时扫描结果
 * 支持对话式推送：dialogue（文字）和 card（卡片）
 */

/**
 * 扫描QBuddy并实时接收结果
 * @param {string} roleId - 角色ID
 * @param {function} onProgress - 进度更新回调
 * @param {function} onDialogue - 收到对话消息回调（新增）
 * @param {function} onCard - 收到卡片结果回调
 * @param {function} onDone - 扫描完成回调
 * @param {function} onError - 错误回调
 * @returns {EventSource} - EventSource实例，需要时可调用close()
 */
export function scanQBuddy(roleId, onProgress, onDialogue, onCard, onDone, onError) {
  const password = localStorage.getItem('qbuddy_password') || 'qbuddy2026';
  const url = `/api/qbuddy/scan/${roleId}?password=${encodeURIComponent(password)}`;
  
  const eventSource = new EventSource(url);
  
  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'progress':
          if (onProgress) onProgress(data);
          break;
        case 'dialogue':
          // 新增：对话消息
          if (onDialogue) onDialogue(data);
          break;
        case 'card':
          if (onCard) onCard(data);
          break;
        case 'done':
          if (onDone) onDone(data);
          eventSource.close();
          break;
        case 'error':
          console.error('SSE error:', data.message);
          if (onError) onError(new Error(data.message));
          eventSource.close();
          break;
      }
    } catch (e) {
      console.error('SSE parse error:', e);
    }
  };
  
  eventSource.onerror = (e) => {
    console.warn('SSE连接错误 (后端可能未启动):', e);
    // 不在这里调用onError，因为onmessage也会处理错误类型的数据
    // EventSource会在onerror后自动尝试重连，我们主动关闭它让调用方使用fallback
    eventSource.close();
    if (onError) {
      onError(new Error('后端服务未启动，请刷新页面或启动后端服务'));
    }
  };
  
  return eventSource;
}

/**
 * 带超时控制的SSE扫描
 * @param {string} roleId - 角色ID
 * @param {number} timeoutMs - 超时时间（毫秒），默认30秒
 * @param {function} onProgress - 进度更新回调
 * @param {function} onDialogue - 对话消息回调（新增）
 * @param {function} onCard - 收到卡片结果回调
 * @param {function} onDone - 扫描完成回调
 * @returns {object} - 包含eventSource和timeoutId的对象
 */
export function scanQBuddyWithTimeout(roleId, timeoutMs = 30000, onProgress, onDialogue, onCard, onDone) {
  let timeoutId = null;
  let onTimeoutHandler = null;
  
  const eventSource = scanQBuddy(
    roleId,
    onProgress,
    onDialogue,
    onCard,
    (data) => {
      if (timeoutId) clearTimeout(timeoutId);
      if (onDone) onDone(data);
    },
    (error) => {
      if (timeoutId) clearTimeout(timeoutId);
      if (onError) onError(error);
    }
  );
  
  timeoutId = setTimeout(() => {
    eventSource.close();
    if (onTimeoutHandler) onTimeoutHandler();
  }, timeoutMs);
  
  return {
    eventSource,
    timeoutId,
    setTimeoutHandler: (handler) => { onTimeoutHandler = handler; }
  };
}
