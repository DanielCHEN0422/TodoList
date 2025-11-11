import { useState } from 'react'
import type { Todo } from '../services/api'
import './TodoItem.less'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const [isHovered, setIsHovered] = useState(false)

  const getCategoryDisplay = () => {
    if (todo.category === '自定义' && todo.customCategory) {
      return todo.customCategory
    }
    return todo.category || '生活'
  }

  const getPriorityColor = () => {
    switch (todo.priority) {
      case '高':
        return 'priority-high'
      case '中':
        return 'priority-medium'
      case '低':
        return 'priority-low'
      default:
        return 'priority-medium'
    }
  }

  const getPriorityIcon = () => {
    switch (todo.priority) {
      case '高':
        return '🔴'
      case '中':
        return '🟡'
      case '低':
        return '🟢'
      default:
        return '🟡'
    }
  }

  const getCategoryClass = () => {
    return `category-${todo.category || '生活'}`
  }

  return (
    <div
      className={`todo-item ${todo.completed ? 'completed' : ''} ${isHovered ? 'hovered' : ''} ${getPriorityColor()}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`todo-item-accent ${getPriorityColor()}`} />
      
      {/* 左侧：复选框 */}
      <div className="todo-checkbox-wrapper">
        <button
          className={`todo-checkbox ${todo.completed ? 'checked' : ''}`}
          onClick={() => onToggle(todo._id)}
          aria-label={todo.completed ? '标记为未完成' : '标记为完成'}
        >
          {todo.completed && <span className="checkmark">✓</span>}
        </button>
      </div>

      {/* 中间：标题和描述 */}
      <div className="todo-content">
        <h3 className={`todo-title ${todo.completed ? 'completed' : ''}`}>
          {todo.title}
        </h3>
        {todo.description && (
          <p className={`todo-description ${todo.completed ? 'completed' : ''}`}>
            {todo.description}
          </p>
        )}
      </div>

      {/* 右侧：分类 */}
      <div className="todo-category-wrapper">
        <span className={`todo-category ${getCategoryClass()}`}>
          <span className="category-icon">🏷️</span>
          <span className="category-text">{getCategoryDisplay()}</span>
        </span>
      </div>

      {/* 右侧：优先级 */}
      <div className="todo-priority-wrapper">
        <span className={`todo-priority ${getPriorityColor()}`}>
          <span className="priority-icon">{getPriorityIcon()}</span>
          <span className="priority-text">{todo.priority || '中'}</span>
        </span>
      </div>

      {/* 最右边：删除按钮 */}
      <div className="todo-actions">
        <button
          className={`todo-delete-btn ${isHovered ? 'visible' : ''}`}
          onClick={() => onDelete(todo._id)}
          aria-label="删除待办事项"
        >
          <span className="delete-icon">🗑️</span>
          <span className="delete-text">删除</span>
        </button>
      </div>
    </div>
  )
}

export default TodoItem
