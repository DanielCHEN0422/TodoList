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

  return (
    <div
      className={`todo-item ${todo.completed ? 'completed' : ''} ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="todo-item-accent" />
      
      <div className="todo-checkbox-wrapper">
        <button
          className={`todo-checkbox ${todo.completed ? 'checked' : ''}`}
          onClick={() => onToggle(todo._id)}
          aria-label={todo.completed ? '标记为未完成' : '标记为完成'}
        >
          {todo.completed && <span className="checkmark">✓</span>}
        </button>
      </div>

      <div className="todo-content">
        <div className="todo-header-row">
          <span className="todo-icon">{todo.completed ? '🎉' : '📌'}</span>
          <h3 className={`todo-title ${todo.completed ? 'completed' : ''}`}>
            {todo.title}
          </h3>
        </div>
        {todo.description && (
          <p className={`todo-description ${todo.completed ? 'completed' : ''}`}>
            {todo.description}
          </p>
        )}
        <div className="todo-meta">
          <span className={`todo-category category-${todo.category || '生活'}`}>
            <span className="category-icon">🏷️</span>
            <span className="category-text">{getCategoryDisplay()}</span>
          </span>
          <span className={`todo-priority ${getPriorityColor()}`}>
            <span className="priority-icon">{getPriorityIcon()}</span>
            <span className="priority-text">{todo.priority || '中'}</span>
          </span>
        </div>
      </div>

      <button
        className={`todo-delete-btn ${isHovered ? 'visible' : ''}`}
        onClick={() => onDelete(todo._id)}
        aria-label="删除待办事项"
      >
        <span className="delete-icon">🗑️</span>
        <span className="delete-text">删除</span>
      </button>
    </div>
  )
}

export default TodoItem
