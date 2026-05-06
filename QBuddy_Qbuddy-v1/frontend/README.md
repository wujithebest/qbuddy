# QBuddy Demo - React前端

QBuddy智能助手的React前端Demo，用于腾讯PCG校园AI产品创意大赛。

## 功能特性

- 🎭 **角色选择** - 3个典型用户角色，体验不同痛点场景
- 📱 **QQ仿真UI** - 高度还原的QQ手机端界面
- 🧡 **QBuddy入口** - 带眼睛跟随鼠标特效的智能助手按钮
- 💬 **卡片消息** - DDL提醒、投票提醒、搭子降温、生日提醒等
- 🕸️ **关系图谱** - D3.js可视化的社交关系网络
- 🔍 **场景分析** - 完整的推理链和温度值展示
- ⏰ **时间线** - 可拖动查看不同时段的推送

## 快速开始

```bash
# 安装依赖
cd QBuddy/frontend
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 访问

- 开发服务器: http://localhost:3000
- 访问密码: `qbuddy2026`

## 技术栈

- React 18
- Vite 5
- D3.js 7
- 纯JavaScript (无TypeScript)

## 项目结构

```
frontend/
├── src/
│   ├── App.jsx           # 主布局
│   ├── components/
│   │   ├── LoginScreen/  # 登录页
│   │   ├── RoleSelector/ # 角色选择
│   │   ├── LeftPanel/    # 左面板(用户画像)
│   │   ├── QQSimulation/ # QQ仿真
│   │   ├── QBuddy/       # QBuddy卡片
│   │   └── RightPanel/   # 右面板(图谱+分析)
│   ├── data/
│   │   └── mockData.js   # Mock数据
│   └── styles/
│       └── global.css    # 全局样式
└── public/
    └── favicon.svg
```

## 交互流程

1. 输入密码 `qbuddy2026` 进入
2. 选择一个角色
3. 体验QQ消息列表的99+未读淹没效果
4. 点击QBuddy入口查看智能提醒卡片
5. 展开卡片查看详情，点击操作按钮
6. 观察右侧图谱和分析视图
7. 拖动时间线查看不同时段的推送

## 设计亮点

- QBuddy按钮的眼睛跟随鼠标特效
- 卡片展开/收起的平滑动画
- 图谱节点的脉冲高亮效果
- 温度计可视化
- 完整的推理链展示
