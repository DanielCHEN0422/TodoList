import express from 'express';
import Todo from '../models/Todo.js';

const router = express.Router();

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
    const { title, description, completed } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Title is required' });
    }

    const todo = new Todo({
      title: title.trim(),
      description: description?.trim() || '',
      completed: completed || false,
    });

    const savedTodo = await todo.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 更新待办事项
router.put('/:id', async (req, res) => {
  try {
    const { title, description, completed } = req.body;

    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    if (title !== undefined) todo.title = title.trim();
    if (description !== undefined) todo.description = description?.trim() || '';
    if (completed !== undefined) todo.completed = completed;

    const updatedTodo = await todo.save();
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
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 删除所有已完成的待办事项
router.delete('/completed/all', async (req, res) => {
  try {
    const result = await Todo.deleteMany({ completed: true });
    res.json({ 
      message: 'All completed todos deleted successfully',
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

