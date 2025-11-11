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
