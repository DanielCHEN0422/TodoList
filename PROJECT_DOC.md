# TODO List 项目说明文档

## 1. 技术选型

### 编程语言
- **前端**：TypeScript，理由：提供类型安全，减少运行时错误，提升代码可维护性和开发体验。
- **后端**：JavaScript (Node.js)，理由：与前端技术栈统一，生态成熟，快速开发，支持异步 I/O 适合实时通信场景。

### 框架/库
- **前端框架**：React 19.2.0，理由：
  - 组件化开发，代码复用性强
  - 丰富的生态系统和社区支持
  - Hooks API 使状态管理更简洁
  - 虚拟 DOM 提供良好的性能
- **构建工具**：Vite 7.2.2，理由：
  - 极快的开发服务器启动速度
  - 基于 ESM 的热模块替换（HMR）
  - 优化的生产构建
- **后端框架**：Express.js 4.18.2，理由：
  - 轻量级、灵活的路由系统
  - 丰富的中间件生态
  - 易于集成 WebSocket 等实时通信功能

### 数据库/存储
- **数据库**：MongoDB，理由：
  - NoSQL 数据库，适合灵活的文档结构
  - 易于扩展，支持水平扩展
  - 与 Node.js 生态集成良好（Mongoose ODM）
  - 支持复杂查询和索引
- **替代方案对比**：
  - **SQLite**：轻量但缺乏实时同步能力，不适合多设备协作场景
  - **本地文件存储**：无法实现多设备同步，数据安全性差
  - **PostgreSQL**：关系型数据库，对于简单的待办事项结构来说过于复杂

### 实时通信
- **WebSocket 库**：Socket.IO 4.7.2，理由：
  - 自动降级到轮询，兼容性更好
  - 支持房间（Room）机制，便于广播
  - 自动重连机制，提升用户体验
  - 与 Express 集成简单

### 样式方案
- **CSS 预处理器**：Less 4.4.2，理由：
  - 支持变量、嵌套、混入等特性
  - 模块化工具类系统，类似 Tailwind CSS
  - 编译速度快，开发体验好

## 2. 项目结构设计

### 整体架构
采用前后端分离的架构：
- **前端**：React SPA（单页应用），通过 RESTful API 和 WebSocket 与后端通信
- **后端**：Express.js RESTful API + Socket.IO WebSocket 服务器
- **数据库**：MongoDB 存储持久化数据
- **实时同步**：通过 Socket.IO 实现多设备间的实时数据同步

```
前端 (React + TypeScript)
    ↓ HTTP/REST API
后端 (Express.js)
    ↓ WebSocket (Socket.IO)
    ↓
数据库 (MongoDB)
```

### 目录结构

```
TODOList/
├── src/                          # 前端源代码
│   ├── components/              # React 组件
│   │   ├── TodoList.tsx         # 主列表组件
│   │   ├── TodoItem.tsx         # 单个待办项组件
│   │   ├── TodoStats.tsx        # 统计和 Tab 切换组件
│   │   ├── AddTodoModal.tsx     # 添加任务模态框
│   │   ├── TodoEmpty.tsx        # 空状态组件
│   │   ├── TodoLoading.tsx      # 加载状态组件
│   │   ├── ClearCompletedButton.tsx
│   │   └── ErrorMessage.tsx
│   ├── services/                # 服务层
│   │   ├── api.ts               # REST API 调用
│   │   └── socketService.ts     # WebSocket 客户端服务
│   ├── hooks/                   # 自定义 Hooks
│   │   └── useModal.ts          # 模态框状态管理
│   ├── contexts/                # React Context
│   │   └── ThemeContext.tsx     # 主题上下文
│   ├── styles/                  # 样式文件
│   │   ├── utilities.less       # 工具类定义
│   │   └── *.less               # 组件样式
│   ├── App.tsx                  # 根组件
│   └── main.tsx                 # 入口文件
│
├── server/                       # 后端源代码
│   ├── config/                   # 配置文件
│   │   └── database.js          # MongoDB 连接配置
│   ├── models/                  # 数据模型
│   │   └── Todo.js              # Todo Mongoose Schema
│   ├── routes/                  # 路由定义
│   │   └── todoRoutes.js        # Todo CRUD 路由
│   ├── services/                # 业务逻辑服务
│   │   └── socketService.js     # WebSocket 服务
│   └── server.js                # 服务器入口
│
├── dist/                        # 前端构建输出
├── package.json                # 前端依赖配置
└── README.md                    # 项目说明
```

### 模块职责说明

#### 前端模块
- **components/**：UI 组件，负责展示和用户交互
- **services/api.ts**：封装所有 REST API 调用，统一处理错误和请求头
- **services/socketService.ts**：管理 WebSocket 连接，提供事件监听接口
- **hooks/useModal.ts**：可复用的模态框状态管理 Hook
- **contexts/ThemeContext.tsx**：全局主题状态管理

#### 后端模块
- **models/Todo.js**：定义 Todo 数据模型和验证规则
- **routes/todoRoutes.js**：定义 RESTful API 端点，处理 CRUD 操作
- **services/socketService.js**：管理 WebSocket 连接，广播数据变更事件
- **config/database.js**：数据库连接配置

## 3. 需求细节与决策

### 描述字段处理
- **是否必填**：描述字段为可选（optional）
- **空输入处理**：
  - 前端：如果用户未输入描述，传递 `undefined` 或空字符串
  - 后端：使用 Mongoose 的 `default: ''` 处理空值
  - 显示：如果描述为空，在 UI 中不显示描述区域

### 已完成任务显示
- **视觉区分**：
  - 已完成任务：标题添加删除线（`text-decoration: line-through`）
  - 降低不透明度（`opacity: 0.6`）
  - 背景色变淡，边框颜色变浅
- **Tab 过滤**：提供"已完成" Tab，可单独查看已完成的任务
- **统计信息**：在统计卡片中显示已完成数量

### 任务排序逻辑
- **默认排序**：按创建时间倒序（最新的在前）
- **可选排序**：
  - 按优先级排序（高 > 中 > 低）
  - 按创建时间排序（最新/最旧）
- **实现方式**：前端排序，使用 `Array.sort()` 方法，避免频繁请求后端

### 扩展功能设计

#### 多设备同步
- **设计思路**：
  1. 使用 WebSocket 实现实时双向通信
  2. 每个操作（创建/更新/删除）都会广播给所有连接的客户端
  3. 使用 `isLocalUpdate` 标记避免本地操作触发循环更新
- **冲突处理策略**：
  - 使用版本号（version）机制检测冲突
  - 采用"最后写入获胜"（Last Write Wins）策略
  - 当检测到冲突时，自动使用服务器最新版本并提示用户

#### 任务分类和优先级
- **分类系统**：
  - 预设分类：工作、学习、生活
  - 自定义分类：允许用户输入自定义分类名称
  - 分类显示：使用不同颜色的标签区分
- **优先级系统**：
  - 三级优先级：低、中、高
  - 视觉区分：不同优先级使用不同的颜色和图标
  - 排序支持：可按优先级排序

#### 主题切换
- **实现方式**：使用 React Context API 管理主题状态
- **持久化**：主题偏好保存在 `localStorage`
- **样式实现**：使用 CSS 变量（`--bg-primary`, `--text-primary` 等）实现主题切换

## 4. AI 使用说明

### AI 工具使用
- **主要工具**：Cursor

### 使用 AI 的环节

#### 1. 代码片段生成
- **组件结构**：使用 AI 生成基础组件框架（如 `TodoItem`、`AddTodoModal`）
- **样式编写**：生成 Less 样式代码，特别是复杂的动画和响应式布局
- **工具类定义**：生成模块化 CSS 工具类系统（`utilities.less`）

#### 2. Bug 定位
- **类型错误**：使用 AI 分析 TypeScript 类型错误，快速定位问题
- **运行时错误**：描述错误现象，AI 帮助分析可能原因
- **逻辑错误**：如 WebSocket 循环更新问题，AI 建议使用 `isLocalUpdate` 标记

#### 3. 文档初稿编写
- **README.md**：AI 生成基础结构，手动补充细节
- **代码注释**：生成函数和组件的 JSDoc 注释

#### 4. 架构设计
- **多设备同步方案**：AI 建议使用 Socket.IO + 版本号机制
- **冲突处理策略**：AI 提供多种方案（CRDT、操作日志、版本号），最终选择版本号方案

### AI 输出如何修改

#### 样式方案
- **AI 建议**：使用 Tailwind CSS
- **实际实现**：使用 Less + 自定义工具类系统
- **原因**：自定义工具类系统更灵活，可以精确控制样式

#### 状态管理
- **AI 建议**：使用 Redux 或 Zustand
- **实际实现**：使用 React Hooks + Context API
- **原因**：项目规模较小，Hooks + Context 足够使用，避免引入额外依赖

## 5. 运行与测试方式

### 本地运行方式

#### 前置要求
- Node.js 20.19+ 或 22.12+
- MongoDB（本地安装或 MongoDB Atlas）
- npm 或 yarn

#### 安装依赖
```bash
# 安装前端依赖
npm install

# 安装后端依赖
cd server
npm install
cd ..
```

#### 配置环境变量

**server/.env**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/todolist
CLIENT_URL=http://localhost:5173
```

**前端 .env（可选）**
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

#### 启动应用

**终端 1 - 启动后端**
```bash
cd server
npm run dev
```

**终端 2 - 启动前端**
```bash
npm run dev
```

#### 访问应用
- 前端：http://localhost:5173
- 后端 API：http://localhost:5000/api
- 健康检查：http://localhost:5000/api/health

### 已测试过的环境
- **操作系统**：Windows 10/11
- **Node.js**：v20.18.0（有警告，但可正常运行）
- **MongoDB**：本地 MongoDB 6.0+
- **浏览器**：Chrome、Edge、Firefox（最新版本）

### 测试场景
1. ✅ 基本的 CRUD 操作（创建、读取、更新、删除）
2. ✅ 多设备实时同步（两个浏览器窗口同时打开）
3. ✅ 冲突处理（两个设备同时修改同一条待办事项）
4. ✅ 主题切换（亮色/暗色模式）
5. ✅ Tab 切换（全部/待办/已完成）
6. ✅ 排序功能（按优先级、按创建时间）
7. ✅ 响应式设计（移动端适配）

### 已知问题与不足

#### 1. Node.js 版本警告
- **问题**：Node.js v20.18.0 低于 Vite 要求的 v20.19+
- **影响**：仅警告，不影响功能
- **解决方案**：升级到 Node.js v20.19+ 或 v22.12+

#### 2. 离线操作不支持
- **问题**：当前版本不支持离线操作队列
- **影响**：离线时无法操作，重新连接后需要手动刷新
- **改进方向**：实现 Service Worker + IndexedDB 离线支持

#### 3. 冲突处理策略简单
- **问题**：使用"最后写入获胜"可能丢失用户修改
- **影响**：多设备同时编辑时，后提交的修改会覆盖先提交的
- **改进方向**：实现更智能的合并策略（如字段级合并）

#### 4. 无用户认证
- **问题**：所有设备共享同一数据，无法区分用户
- **影响**：不适合多用户场景
- **改进方向**：添加用户注册/登录功能，实现多用户隔离

#### 5. WebSocket 连接状态未显示
- **问题**：用户无法知道当前是否已连接
- **影响**：连接断开时用户可能不知道
- **改进方向**：添加连接状态指示器

## 6. 总结与反思

### 如果有更多时间，你会如何改进？

#### 1. 离线支持
- 实现 Service Worker 缓存
- 使用 IndexedDB 存储离线操作队列
- 网络恢复后自动同步离线操作

#### 2. 更智能的冲突处理
- 实现字段级合并（如标题和描述分别合并）
- 支持操作日志（Operation Log）实现更精确的冲突解决
- 提供冲突解决界面，让用户选择保留哪些修改

#### 3. 用户系统
- 添加用户注册/登录功能
- 实现多用户协作（共享待办列表）
- 添加权限管理（只读/编辑权限）

#### 4. 数据导出/导入
- 支持导出为 JSON、CSV 格式
- 支持从其他待办应用导入数据
- 定期自动备份

#### 5. 性能优化
- 实现虚拟滚动（Virtual Scrolling）处理大量待办事项
- 添加数据分页
- 优化 WebSocket 消息大小，减少网络传输

#### 6. 功能增强
- 添加任务提醒功能（基于时间）
- 支持任务标签（Tags）系统
- 添加任务搜索和过滤功能
- 支持任务拖拽排序
- 添加任务模板功能

#### 7. 测试覆盖
- 添加单元测试（Jest + React Testing Library）
- 添加集成测试（API 测试）
- 添加 E2E 测试（Playwright / Cypress）

#### 8. 部署和 DevOps
- 添加 Docker 容器化
- 配置 CI/CD 流水线
- 添加监控和日志系统

### 你觉得这个实现的最大亮点是什么？

#### 1. 多设备实时同步
- **亮点**：使用 WebSocket 实现真正的实时同步，无需手动刷新
- **技术价值**：展示了现代 Web 应用的实时通信能力
- **用户体验**：多设备协作时体验流畅，接近原生应用

