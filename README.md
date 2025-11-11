# TodoList - MERN Stack Application

一个基于 MERN 技术栈（MongoDB + Express + React + Node.js）的待办事项管理应用。

## 技术栈

- **前端**: React 19 + TypeScript + Vite + Less
- **后端**: Node.js + Express
- **数据库**: MongoDB
- **样式**: 模块化 CSS 工具类系统

## 功能特性

- ✅ 添加待办事项（包含标题和可选描述）
- ✅ 标记完成/未完成
- ✅ 删除待办事项
- ✅ 清空所有已完成的待办事项
- ✅ 数据持久化（MongoDB）
- ✅ 实时统计（总计、已完成、待完成）
- ✅ 响应式设计
- ✅ 模块化 CSS 工具类

## 项目结构

```
TODOList/
├── src/                    # 前端源代码
│   ├── components/         # React 组件
│   ├── services/           # API 服务
│   └── styles/             # 样式文件
├── server/                 # 后端源代码
│   ├── config/             # 配置文件
│   ├── models/             # 数据模型
│   └── routes/             # API 路由
└── package.json            # 前端依赖
```

## 安装和运行

### 前置要求

- Node.js (v20.19+ 或 v22.12+)
- MongoDB (本地安装或使用 MongoDB Atlas)

### 1. 安装依赖

```bash
# 安装前端依赖
npm install

# 安装后端依赖
npm run server:install
```

### 2. 配置 MongoDB

#### 选项 A: 本地 MongoDB

1. 安装并启动 MongoDB
2. 确保 MongoDB 运行在 `mongodb://localhost:27017`

#### 选项 B: MongoDB Atlas (云数据库)

1. 在 [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) 创建免费账户
2. 创建集群并获取连接字符串
3. 在 `server/.env` 文件中配置连接字符串

### 3. 配置环境变量

在 `server` 目录下创建 `.env` 文件：

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/todolist
NODE_ENV=development
```

如果使用 MongoDB Atlas，将 `MONGODB_URI` 替换为你的 Atlas 连接字符串。

### 4. 运行应用

#### 开发模式（推荐）

打开两个终端窗口：

**终端 1 - 启动后端服务器：**
```bash
npm run server
```

**终端 2 - 启动前端开发服务器：**
```bash
npm run dev
```

#### 生产模式

**启动后端：**
```bash
npm run server:start
```

**构建并预览前端：**
```bash
npm run build
npm run preview
```

## API 端点

后端服务器运行在 `http://localhost:5000`

- `GET /api/todos` - 获取所有待办事项
- `GET /api/todos/:id` - 获取单个待办事项
- `POST /api/todos` - 创建待办事项
- `PUT /api/todos/:id` - 更新待办事项
- `DELETE /api/todos/:id` - 删除待办事项
- `DELETE /api/todos/completed/all` - 删除所有已完成的待办事项
- `GET /api/health` - 健康检查

## 使用说明

1. 在输入框中输入待办事项标题（必填）
2. 可选：添加描述信息
3. 点击"添加待办事项"按钮或按回车键添加
4. 点击复选框标记为完成/未完成
5. 点击"删除"按钮删除单个待办事项
6. 点击"清空已完成"按钮批量删除已完成的待办事项

## 开发说明

### 模块化 CSS 工具类

项目使用自定义的模块化 CSS 工具类系统，类似于 Tailwind CSS。所有样式都通过工具类配置，无需编写自定义 CSS。

常用工具类示例：
- `mb-8` → `margin-bottom: 8px`
- `px-16` → `padding-left: 16px; padding-right: 16px`
- `flex items-center` → `display: flex; align-items: center`
- `bg-blue-500` → `background-color: #3b82f6`

详细工具类定义请查看 `src/styles/utilities.less`

## 许可证

MIT
