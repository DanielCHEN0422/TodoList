# Todo List 应用

一个基于 MERN 技术栈（MongoDB + Express + React + Node.js）构建的现代化待办事项管理应用，支持多设备实时同步和冲突处理。

## 功能特性

- ✅ 待办事项的增删改查
- ✅ 任务分类（工作/学习/生活/自定义）
- ✅ 优先级设置（低/中/高）
- ✅ 任务完成状态切换
- ✅ 按优先级和时间排序
- ✅ Tab 切换查看（全部/待办/已完成）
- ✅ 亮色/暗色主题切换
- ✅ 多设备实时同步
- ✅ 数据冲突自动处理
- ✅ 响应式设计，支持移动端

## 技术栈

### 前端
- React 19.2.0
- TypeScript 5.9.3
- Vite 7.2.2
- Less 4.4.2
- Socket.IO Client 4.8.1

### 后端
- Node.js 20.18.0+
- Express.js 4.18.2
- MongoDB + Mongoose 8.0.3
- Socket.IO 4.7.2

## 快速开始

### 前置要求

- Node.js 20.19+ 或 22.12+（推荐）
- MongoDB（本地安装或使用 MongoDB Atlas）
- npm 或 yarn

### 安装依赖

#### 1. 安装前端依赖
```bash
npm install
```

#### 2. 安装后端依赖
```bash
cd server
npm install
cd ..
```

### 配置环境变量

#### 后端配置（server/.env）
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/todolist
CLIENT_URL=http://localhost:5173
```

#### 前端配置（.env）
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 启动应用

#### 方式一：分别启动（推荐用于开发）

**终端 1 - 启动后端服务器**
```bash
cd server
npm run dev
```

**终端 2 - 启动前端开发服务器**
```bash
npm run dev
```

#### 方式二：使用 npm scripts

**启动后端**
```bash
npm run server
```

**启动前端**
```bash
npm run dev
```

### 访问应用

- 前端地址：http://localhost:5173
- 后端 API：http://localhost:5000/api
- 健康检查：http://localhost:5000/api/health

## 项目结构

```
TODOList/
├── src/                    # 前端源代码
│   ├── components/         # React 组件
│   ├── services/           # API 和 WebSocket 服务
│   ├── hooks/              # 自定义 Hooks
│   ├── contexts/           # React Context
│   └── styles/             # 样式文件
├── server/                 # 后端源代码
│   ├── config/             # 配置文件
│   ├── models/             # Mongoose 模型
│   ├── routes/              # Express 路由
│   └── services/           # 业务逻辑服务
├── dist/                   # 前端构建输出
└── package.json            # 前端依赖配置
```

## 主要功能说明

### 多设备同步
应用支持多设备实时同步，当你在一个设备上操作时，其他设备会自动更新。详情请查看 [MULTI_DEVICE_SYNC.md](./MULTI_DEVICE_SYNC.md)

### 冲突处理
当多个设备同时修改同一条待办事项时，系统会自动检测冲突并使用最新版本，避免数据丢失。

### 主题切换
点击页面上的主题切换按钮，可以在亮色和暗色主题之间切换，主题偏好会保存在本地。

## 开发命令

```bash
# 前端开发
npm run dev              # 启动开发服务器

# 前端构建
npm run build            # 构建生产版本

# 后端开发
cd server
npm run dev              # 启动后端开发服务器（带热重载）

# 后端生产
cd server
npm start                # 启动后端生产服务器
```

## 常见问题

### MongoDB 连接失败
- 确保 MongoDB 服务正在运行
- 检查 `server/.env` 中的 `MONGODB_URI` 配置是否正确
- 如果使用 MongoDB Atlas，确保网络访问列表已配置

### WebSocket 连接失败
- 确保后端服务器正在运行
- 检查防火墙设置
- 确认 `VITE_SOCKET_URL` 配置正确

### 端口被占用
- 修改 `server/.env` 中的 `PORT` 配置
- 或修改 `vite.config.ts` 中的前端端口配置

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！
