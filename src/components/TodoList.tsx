import { useState, useEffect } from 'react'
import * as api from '../services/api'
import type { Todo } from '../services/api'
import TodoItem from './TodoItem'
import TodoInput from './TodoInput'
import TodoStats from './TodoStats'
import TodoEmpty from './TodoEmpty'
import TodoLoading from './TodoLoading'
import ClearCompletedButton from './ClearCompletedButton'
import ErrorMessage from './ErrorMessage'
import './TodoList.less'

function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [titleValue, setTitleValue] = useState('')
  const [descriptionValue, setDescriptionValue] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
  const addTodo = async () => {
    if (titleValue.trim() === '') return

    try {
      setError(null)
      const newTodo = await api.createTodo({
        title: titleValue.trim(),
        description: descriptionValue.trim() || undefined,
        completed: false,
      })
      setTodos([newTodo, ...todos])
      setTitleValue('')
      setDescriptionValue('')
    } catch (err) {
      setError('添加待办事项失败')
      console.error('Error creating todo:', err)
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

  // 处理回车键
  const handleTitleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      addTodo()
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

      {/* 输入区域 */}
      <section className="input-section">
        <TodoInput
          titleValue={titleValue}
          descriptionValue={descriptionValue}
          onTitleChange={setTitleValue}
          onDescriptionChange={setDescriptionValue}
          onAdd={addTodo}
          onKeyPress={handleTitleKeyPress}
          loading={loading}
        />
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
    </div>
  )
}

export default TodoList
