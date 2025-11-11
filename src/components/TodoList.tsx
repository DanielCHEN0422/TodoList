import { useState, useEffect } from 'react'
import * as api from '../services/api'
import type { Todo } from '../services/api'
import { useModal } from '../hooks/useModal'
import TodoItem from './TodoItem'
import TodoStats from './TodoStats'
import TodoEmpty from './TodoEmpty'
import TodoLoading from './TodoLoading'
import ClearCompletedButton from './ClearCompletedButton'
import ErrorMessage from './ErrorMessage'
import AddTodoModal from './AddTodoModal'
import './TodoList.less'

function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  
  // 使用 useModal hook
  const addTodoModal = useModal({
    onOpen: () => {
      setError(null)
    },
    onClose: () => {
      setError(null)
    },
  })

  // 加载待办事项
  const loadTodos = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await api.getTodos()
      setTodos(data)
    } catch (err) {
      setError('加载待办事项失败，请检查后端服务是否运行')
      console.error('Error loading todos:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTodos()
  }, [])

  // 添加待办事项
  const handleAddTodo = async (
    title: string,
    description?: string,
    category?: string,
    customCategory?: string,
    priority?: string
  ) => {
    try {
      setAdding(true)
      setError(null)
      const newTodo = await api.createTodo({
        title,
        description,
        completed: false,
        category: category as '工作' | '学习' | '生活' | '自定义',
        customCategory,
        priority: priority as '低' | '中' | '高',
      })
      setTodos([newTodo, ...todos])
    } catch (err) {
      setError('添加待办事项失败')
      console.error('Error creating todo:', err)
      throw err // 重新抛出错误，让 modal 处理
    } finally {
      setAdding(false)
    }
  }

  // 切换完成状态
  const toggleTodo = async (id: string) => {
    try {
      setError(null)
      const todo = todos.find((t) => t._id === id)
      if (!todo) return

      const updatedTodo = await api.updateTodo(id, {
        completed: !todo.completed,
      })
      setTodos(todos.map((t) => (t._id === id ? updatedTodo : t)))
    } catch (err) {
      setError('更新待办事项失败')
      console.error('Error updating todo:', err)
    }
  }

  // 删除待办事项
  const deleteTodo = async (id: string) => {
    try {
      setError(null)
      await api.deleteTodo(id)
      setTodos(todos.filter((todo) => todo._id !== id))
    } catch (err) {
      setError('删除待办事项失败')
      console.error('Error deleting todo:', err)
    }
  }

  // 清空所有已完成的待办事项
  const clearCompleted = async () => {
    try {
      setError(null)
      await api.deleteCompletedTodos()
      setTodos(todos.filter((todo) => !todo.completed))
    } catch (err) {
      setError('清空已完成待办事项失败')
      console.error('Error clearing completed todos:', err)
    }
  }


  // 统计
  const totalTodos = todos.length
  const completedTodos = todos.filter((todo) => todo.completed).length
  const remainingTodos = totalTodos - completedTodos

  return (
    <div className="todo-list-container">
      {/* 标题区域 */}
      <header className="todo-header">
        <div className="header-content">
          <h1 className="header-title">
            <span className="title-icon">✨</span>
            <span className="title-text">Todo List</span>
            <span className="title-icon">✨</span>
          </h1>
          <p className="header-subtitle">记录你的每一个想法和任务 🎯</p>
        </div>
      </header>

      {/* 错误提示 */}
      {error && (
        <div className="error-container">
          <ErrorMessage message={error} />
        </div>
      )}

      {/* 添加任务按钮 */}
      <section className="add-button-section">
        <button
          className="add-todo-button"
          onClick={addTodoModal.open}
          aria-label="添加新任务"
        >
          <span className="button-icon">➕</span>
          <span className="button-text">添加新任务</span>
        </button>
      </section>

      {/* 统计信息 */}
      {totalTodos > 0 && (
        <section className="stats-section">
          <TodoStats
            total={totalTodos}
            completed={completedTodos}
            remaining={remainingTodos}
          />
        </section>
      )}

      {/* 内容区域 */}
      <section className="todos-section">
        {loading && todos.length === 0 ? (
          <TodoLoading />
        ) : todos.length === 0 ? (
          <TodoEmpty />
        ) : (
          <div className="todos-list">
            {todos.map((todo) => (
              <TodoItem
                key={todo._id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
              />
            ))}
          </div>
        )}
      </section>

      {/* 清空已完成按钮 */}
      {completedTodos > 0 && (
        <section className="clear-section">
          <ClearCompletedButton count={completedTodos} onClick={clearCompleted} />
        </section>
      )}

      {/* 添加任务 Modal */}
      <AddTodoModal
        isOpen={addTodoModal.isOpen}
        onClose={addTodoModal.close}
        onAdd={handleAddTodo}
        loading={adding}
      />
    </div>
  )
}

export default TodoList
