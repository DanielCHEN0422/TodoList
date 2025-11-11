import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    completed: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      default: '生活',
      enum: ['工作', '学习', '生活', '自定义'],
    },
    customCategory: {
      type: String,
      default: '',
      trim: true,
    },
    priority: {
      type: String,
      default: '中',
      enum: ['低', '中', '高'],
    },
    version: {
      type: Number,
      default: 1,
    },
    lastModifiedBy: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Todo = mongoose.model('Todo', todoSchema);

export default Todo;

