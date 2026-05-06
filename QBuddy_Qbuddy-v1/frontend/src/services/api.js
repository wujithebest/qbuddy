// API服务封装
const API_BASE = 'http://localhost:5000/api';

// 模拟延迟
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 通用请求方法
async function request(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.warn('API请求失败，使用mock数据:', error.message);
    return null;
  }
}

// API接口
export const api = {
  // 初始化角色数据
  async initialize() {
    const result = await request('/initialize', { method: 'POST' });
    return result;
  },
  
  // 获取角色画像
  async getProfile(roleId) {
    const result = await request(`/profile/${roleId}`);
    return result;
  },
  
  // 触发场景检测
  async triggerScenario(params) {
    const result = await request('/qbuddy/trigger', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    return result;
  },
  
  // 用户操作
  async submitAction(params) {
    const result = await request('/qbuddy/action', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    return result;
  },
  
  // LLM提取群消息
  async extractMessages(messages) {
    const result = await request('/llm/extract', {
      method: 'POST',
      body: JSON.stringify({ messages }),
    });
    return result;
  },
  
  // 生成祝福
  async generateBlessing(params) {
    const result = await request('/llm/blessing', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    return result;
  },
  
  // 生成问候
  async generateGreeting(params) {
    const result = await request('/llm/greeting', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    return result;
  },
  
  // 获取图谱数据
  async getGraphData(roleId) {
    const result = await request(`/graph/${roleId}`);
    return result;
  },
  
  // 自定义角色
  async customizeRole(params) {
    const result = await request('/customize', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    return result;
  },
  
  // QBuddy聊天 - 发送消息获取回复
  async qbuddyChat(message, role) {
    const password = localStorage.getItem('qbuddy_password') || 'qbuddy2026';
    try {
      const response = await fetch(`${API_BASE}/qbuddy/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Access-Password': password,
        },
        body: JSON.stringify({ message, role }),
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.warn('聊天API调用失败:', error.message);
      return null;
    }
  },
  
  // 聊天回复 - 生成上下文感知的回复
  async chatReply(params) {
    const password = localStorage.getItem('qbuddy_password') || 'qbuddy2026';
    try {
      const response = await fetch(`${API_BASE}/chat/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Access-Password': password,
        },
        body: JSON.stringify(params),
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.warn('聊天回复API调用失败:', error.message);
      return null;
    }
  },
};

export default api;
