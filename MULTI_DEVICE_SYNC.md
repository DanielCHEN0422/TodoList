# 多设备协作功能说明

## 功能概述

本 Todo List 应用已实现多设备实时同步功能，支持多个设备同时协作编辑待办事项，并自动处理数据冲突。

## 核心特性

### 1. 实时同步
- 使用 WebSocket (Socket.IO) 实现实时双向通信
- 当任一设备创建、更新或删除待办事项时，其他设备会自动同步更新
- 无需手动刷新页面

### 2. 冲突检测与处理
- **版本号机制**：每个待办事项都有一个版本号（version）
- **冲突检测**：当多个设备同时修改同一条待办事项时，系统会检测到版本冲突
- **冲突解决策略**：采用"最后写入获胜"（Last Write Wins）策略
  - 当检测到冲突时，自动使用服务器上的最新版本
  - 显示冲突提示信息，3秒后自动消失

### 3. 设备标识
- 每个设备都有唯一的设备ID（存储在 localStorage）
- 服务器记录最后修改的设备ID（lastModifiedBy）

## 技术实现

### 后端
1. **Socket.IO 服务器**：`server/services/socketService.js`
   - 管理 WebSocket 连接
   - 广播 Todo 变更事件

2. **数据模型增强**：`server/models/Todo.js`
   - 添加 `version` 字段（版本号）
   - 添加 `lastModifiedBy` 字段（最后修改设备ID）

3. **API 路由增强**：`server/routes/todoRoutes.js`
   - 创建/更新/删除操作时广播事件
   - 更新操作时检查版本号，检测冲突（返回 409 状态码）

### 前端
1. **WebSocket 客户端服务**：`src/services/socketService.ts`
   - 管理 Socket.IO 客户端连接
   - 提供事件监听和取消监听接口

2. **API 服务增强**：`src/services/api.ts`
   - 所有请求自动携带设备ID（x-device-id 头）
   - 更新操作时发送版本号
   - 处理冲突错误（409 状态码）

3. **TodoList 组件**：`src/components/TodoList.tsx`
   - 集成 WebSocket 实时同步
   - 监听 `todo:created`、`todo:updated`、`todo:deleted` 事件
   - 实现冲突检测和自动解决逻辑
   - 使用 `isLocalUpdate` 标记避免循环更新

## 使用方法

### 启动服务器
```bash
cd server
npm install
npm run dev
```

### 启动前端
```bash
npm install
npm run dev
```

### 测试多设备同步
1. 在浏览器中打开应用（设备A）
2. 在另一个浏览器窗口或标签页中打开应用（设备B）
3. 在设备A中创建、更新或删除待办事项
4. 观察设备B是否自动同步更新
5. 尝试在两个设备同时修改同一条待办事项，观察冲突处理

## 冲突处理示例

当两个设备同时修改同一条待办事项时：

1. **设备A**：将待办事项标记为完成（version: 1）
2. **设备B**：同时修改标题（version: 1）
3. **服务器检测**：设备B的请求到达时，服务器版本已经是 2（设备A已更新）
4. **冲突响应**：服务器返回 409 状态码和冲突信息
5. **自动解决**：设备B自动使用服务器最新版本，显示冲突提示

## 注意事项

1. **网络连接**：确保所有设备都能连接到同一个服务器
2. **设备ID**：每个设备的ID存储在 localStorage，清除浏览器数据会生成新ID
3. **离线处理**：当前版本不支持离线操作队列，离线时的操作会失败
4. **性能考虑**：大量设备同时连接时，建议使用 Redis 适配器进行 Socket.IO 扩展

## 未来改进方向

1. 实现离线操作队列（Operation Queue）
2. 使用 CRDT（Conflict-free Replicated Data Type）实现更智能的冲突合并
3. 添加用户认证，支持多用户协作
4. 实现操作历史记录和撤销功能
5. 添加连接状态指示器

