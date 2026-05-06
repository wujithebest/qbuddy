# QBuddy Demo

> 帮你不错过 —— 基于关系增强图谱的QQ智能助手

## 项目简介

QBuddy 是一个参加腾讯PCG校园AI产品创意大赛的Demo项目，核心定位是"帮你不错过"——在QQ生态中，基于关系增强图谱，主动为用户提供DDL提醒、投票收集、搭子降温提醒、沉寂关系激活、生日提醒、频道推荐等服务。

## 技术架构

```
┌─────────────────────────────────────────────┐
│                 React 前端 (Vite)            │
│  ┌──────┐  ┌──────────┐  ┌───────────────┐  │
│  │左栏   │  │中间QQ仿真 │  │右栏分析视图    │  │
│  │用户画像│  │+QBuddy交互│  │+图谱可视化    │  │
│  └──────┘  └──────────┘  └───────────────┘  │
└──────────────────┬──────────────────────────┘
                   │ REST API
┌──────────────────┴──────────────────────────┐
│             Python Flask 后端                 │
│  ┌──────────┐ ┌────────┐ ┌───────────────┐  │
│  │图谱引擎   │ │场景检测 │ │DeepSeek API   │  │
│  │(关系增强) │ │(5个场景)│ │(LLM调用层)    │  │
│  └──────────┘ └────────┘ └───────────────┘  │
└─────────────────────────────────────────────┘
```

## 快速开始

### 方式一：前端独立运行（推荐Demo演示用）

前端内置了完整的mock数据，可以脱离后端独立运行：

```bash
cd QBuddy/frontend
npm install
npm run dev     # 开发模式，访问 http://localhost:3000
npm run build   # 生产构建
npm run preview # 预览生产构建
```

访问密码：`qbuddy2026`

### 方式二：前后端联调运行

```bash
# 1. 启动后端
cd QBuddy/backend
pip install -r requirements.txt
python app.py   # 运行在 http://localhost:5000

# 2. 启动前端（新终端）
cd QBuddy/frontend
npm install
npm run dev     # 运行在 http://localhost:3000
```

## 部署到线上

### 使用 Vercel 部署前端（推荐）

1. 将 `QBuddy/frontend` 推送到 GitHub
2. 在 Vercel 中导入该项目
3. Framework 选择 Vite
4. 部署完成，获得线上访问链接

### 使用 Railway/Render 部署后端

1. 将 `QBuddy/backend` 推送到 GitHub
2. 在 Railway/Render 中导入
3. 设置环境变量：
   - `DEEPSEEK_API_KEY`：DeepSeek API密钥
   - `ACCESS_PASSWORD`：qbuddy2026
4. 部署完成后获得API地址
5. 修改前端 `src/services/api.js` 中的 `API_BASE` 为后端地址

## Demo演示指南

### 三面板布局

| 面板 | 内容 | 说明 |
|------|------|------|
| 左栏 | 用户画像 + 角色切换 | 选择3个典型角色之一，查看痛点描述 |
| 中间 | QQ手机端仿真 | 可交互的QQ界面，点击QBuddy体验主动服务 |
| 右栏 | 分析视图 + 图谱 | 展示QBuddy的分析洞察和关系图谱 |

### 操作流程

1. 输入密码 `qbuddy2026` 进入
2. 在左栏选择一个角色（小陈/小林/小周）
3. 点击中间面板底部导航栏的QBuddy按钮（带眼睛的小圆圈）
4. 查看QBuddy主动推送的提醒卡片
5. 点击卡片展开详情，体验一键操作
6. 观察右栏图谱高亮和分析推理链

### 三个角色场景

| 角色 | 类型 | 核心场景 |
|------|------|---------|
| 小陈 | 课业繁忙型 | DDL提前提醒 + 调课投票 + @分组提醒 + 搭子降温 + 考研朋友沉寂激活 |
| 小林 | 社交活跃型 | @遗漏 + 生日祝福 + 动漫搭子降温 + 羽毛球搭子降温 + 时间冲突 |
| 小周 | 兴趣探索型 | 频道推荐 + 学长@提醒 + 开学搭子降温 + 新生见面会DDL |

## 项目结构

```
QBuddy/
├── backend/
│   ├── app.py              # Flask主入口
│   ├── graph_engine.py     # 关系增强图谱引擎
│   ├── scenario_detector.py # 5个场景检测器
│   ├── llm_service.py      # DeepSeek API封装
│   ├── requirements.txt
│   ├── .env                # 环境变量
│   └── mock_data/
│       ├── chen/           # 小陈
│       ├── lin/            # 小林
│       └── zhou/           # 小周
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── LoginScreen/
│   │   │   ├── LeftPanel/
│   │   │   ├── QQSimulation/
│   │   │   ├── QBuddy/
│   │   │   ├── RightPanel/
│   │   │   └── RoleSelector/
│   │   ├── data/mockData.js
│   │   └── services/api.js
│   ├── dist/               # 构建产物
│   └── package.json
└── README.md
```
