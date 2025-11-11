import express from 'express';
import Todo from '../models/Todo.js';
import { broadcastTodoChange } from '../services/socketService.js';

const router = express.Router();

// 生成设备ID（简单实现，实际应该从请求头或认证中获取）
const getDeviceId = (req) => {
  return req.headers['x-device-id'] || req.ip || 'unknown';
};

// 获取所有待办事项
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 获取单个待办事项
router.get('/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 创建待办事项
router.post('/', async (req, res) => {
  try {
    const { title, description, completed, category, customCategory, priority } = req.body;
    const deviceId = getDeviceId(req);

    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Title is required' });
    }

    const todo = new Todo({
      title: title.trim(),
      description: description?.trim() || '',
      completed: completed || false,
      category: category || '生活',
      customCategory: customCategory?.trim() || '',
      priority: priority || '中',
      version: 1,
      lastModifiedBy: deviceId,
    });

    const savedTodo = await todo.save();
    
    // 广播创建事件
    broadcastTodoChange('todo:created', savedTodo);
    
    res.status(201).json(savedTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 更新待办事项（支持冲突检测）
router.put('/:id', async (req, res) => {
  try {
    const { title, description, completed, category, customCategory, priority, version } = req.body;
    const deviceId = getDeviceId(req);

    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    // 冲突检测：如果客户端版本号小于服务器版本号，说明有冲突
    if (version !== undefined && version < todo.version) {
      // 返回冲突信息，让客户端决定如何处理
      return res.status(409).json({
        message: 'Conflict detected',
        conflict: true,
        serverVersion: todo.version,
        clientVersion: version,
        serverTodo: todo,
      });
    }

    // 更新字段
    if (title !== undefined) todo.title = title.trim();
    if (description !== undefined) todo.description = description?.trim() || '';
    if (completed !== undefined) todo.completed = completed;
    if (category !== undefined) todo.category = category;
    if (customCategory !== undefined) todo.customCategory = customCategory?.trim() || '';
    if (priority !== undefined) todo.priority = priority;
    
    // 增加版本号
    todo.version = (todo.version || 1) + 1;
    todo.lastModifiedBy = deviceId;

    const updatedTodo = await todo.save();
    
    // 广播更新事件
    broadcastTodoChange('todo:updated', updatedTodo);
    
    res.json(updatedTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 删除待办事项
router.delete('/:id', async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    // 广播删除事件
    broadcastTodoChange('todo:deleted', { _id: req.params.id });
    
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 删除所有已完成的待办事项
router.delete('/completed/all', async (req, res) => {
  try {
    const completedTodos = await Todo.find({ completed: true });
    const result = await Todo.deleteMany({ completed: true });
    
    // 广播批量删除事件
    completedTodos.forEach(todo => {
      broadcastTodoChange('todo:deleted', { _id: todo._id });
    });
    
    res.json({ 
      message: 'All completed todos deleted successfully',
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

