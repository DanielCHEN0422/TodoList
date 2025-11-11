# 快速启动指南

## 前置要求

1. **Node.js** (v20.19+ 或 v22.12+)
2. **MongoDB** - 选择以下方式之一：
   - 本地安装 MongoDB
   - 使用 MongoDB Atlas (云数据库，推荐)

## 快速开始

### 步骤 1: 安装依赖

```bash
# 安装前端依赖
npm install

# 安装后端依赖
npm run server:install
```

### 步骤 2: 配置 MongoDB

#### 方式 A: 使用本地 MongoDB

1. 确保 MongoDB 已安装并运行
2. 默认连接: `mongodb://localhost:27017/todolist`

#### 方式 B: 使用 MongoDB Atlas (推荐)

1. 访问 [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. 注册/登录账户
3. 创建免费集群
4. 获取连接字符串（格式: `mongodb+srv://username:password@cluster.mongodb.net/todolist`）
5. 在 `server` 目录创建 `.env` 文件：

```env
PORT=5000
MONGODB_URI=你的MongoDB连接字符串
NODE_ENV=development
```

### 步骤 3: 启动应用

打开**两个终端窗口**：

**终端 1 - 启动后端：**
```bash
npm run server
```

**终端 2 - 启动前端：**
```bash
npm run dev
```

### 步骤 4: 访问应用

- 前端: http://localhost:5173
- 后端 API: http://localhost:5000

## 常见问题

### MongoDB 连接失败

- 检查 MongoDB 是否运行（本地）或连接字符串是否正确（Atlas）
- 检查防火墙设置
- 确保 MongoDB 端口（27017）未被占用

### 后端启动失败

- 确保已安装后端依赖: `npm run server:install`
- 检查 `.env` 文件配置是否正确
- 检查端口 5000 是否被占用

### 前端无法连接后端

- 确保后端服务正在运行
- 检查 Vite 代理配置（`vite.config.ts`）
- 检查浏览器控制台错误信息

## API 测试

使用以下命令测试 API：

```bash
# 健康检查
curl http://localhost:5000/api/health

# 获取所有待办事项
curl http://localhost:5000/api/todos

# 创建待办事项
curl -X POST http://localhost:5000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"测试待办","description":"这是一个测试"}'
```

