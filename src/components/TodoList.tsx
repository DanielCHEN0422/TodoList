import { useState, useEffect, useMemo, useRef } from 'react'
import * as api from '../services/api'
import type { Todo, ConflictError } from '../services/api'
import { socketService } from '../services/socketService'
import { useModal } from '../hooks/useModal'
import TodoItem from './TodoItem'
import TodoStats from './TodoStats'
import TodoEmpty from './TodoEmpty'
import TodoLoading from './TodoLoading'
import ClearCompletedButton from './ClearCompletedButton'
import ErrorMessage from './ErrorMessage'
import AddTodoModal from './AddTodoModal'
import './TodoList.less'

type SortOption = 'priority' | 'created' | 'none'
type TabType = 'all' | 'active' | 'completed'

function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>('none')
  const [activeTab, setActiveTab] = useState<TabType>('all')
  
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

  // 用于标记是否由本地操作引起的更新（避免循环更新）
  const isLocalUpdate = useRef(false)

  useEffect(() => {
    loadTodos()
    
    // 初始化 WebSocket 连接
    socketService.connect()

    // 监听 Todo 创建事件
    const handleTodoCreated = (newTodo: Todo) => {
      if (!isLocalUpdate.current) {
        setTodos((prevTodos) => {
          // 检查是否已存在（避免重复）
          if (prevTodos.find((t) => t._id === newTodo._id)) {
            return prevTodos
          }
          return [newTodo, ...prevTodos]
        })
      }
      isLocalUpdate.current = false
    }

    // 监听 Todo 更新事件
    const handleTodoUpdated = (updatedTodo: Todo) => {
      if (!isLocalUpdate.current) {
        setTodos((prevTodos) =>
          prevTodos.map((t) => (t._id === updatedTodo._id ? updatedTodo : t))
        )
      }
      isLocalUpdate.current = false
    }

    // 监听 Todo 删除事件
    const handleTodoDeleted = (data: { _id: string }) => {
      if (!isLocalUpdate.current) {
        setTodos((prevTodos) => prevTodos.filter((t) => t._id !== data._id))
      }
      isLocalUpdate.current = false
    }

    socketService.on('todo:created', handleTodoCreated)
    socketService.on('todo:updated', handleTodoUpdated)
    socketService.on('todo:deleted', handleTodoDeleted)

    return () => {
      socketService.off('todo:created', handleTodoCreated)
      socketService.off('todo:updated', handleTodoUpdated)
      socketService.off('todo:deleted', handleTodoDeleted)
      socketService.disconnect()
    }
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
      isLocalUpdate.current = true
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

  // 切换完成状态（支持冲突处理）
  const toggleTodo = async (id: string) => {
    try {
      setError(null)
      const todo = todos.find((t) => t._id === id)
      if (!todo) return

      isLocalUpdate.current = true
      const updatedTodo = await api.updateTodo(id, {
        completed: !todo.completed,
        version: todo.version,
      })
      setTodos(todos.map((t) => (t._id === id ? updatedTodo : t)))
    } catch (err: any) {
      // 处理冲突
      if (err.isConflict) {
        const conflictError = err as ConflictError
        // 使用服务器版本（最后写入获胜策略）
        setTodos(todos.map((t) => 
          t._id === id ? conflictError.serverTodo : t
        ))
        setError('检测到数据冲突，已自动使用最新版本')
        // 3秒后清除错误提示
        setTimeout(() => setError(null), 3000)
      } else {
        setError('更新待办事项失败')
        console.error('Error updating todo:', err)
      }
    }
  }

  // 删除待办事项
  const deleteTodo = async (id: string) => {
    try {
      setError(null)
      isLocalUpdate.current = true
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
      isLocalUpdate.current = true
      await api.deleteCompletedTodos()
      setTodos(todos.filter((todo) => !todo.completed))
    } catch (err) {
      setError('清空已完成待办事项失败')
      console.error('Error clearing completed todos:', err)
    }
  }

  // 根据 tab 过滤任务
  const filteredTodos = useMemo(() => {
    let filtered = todos

    switch (activeTab) {
      case 'active':
        filtered = todos.filter((todo) => !todo.completed)
        break
      case 'completed':
        filtered = todos.filter((todo) => todo.completed)
        break
      default:
        filtered = todos
    }

    return filtered
  }, [todos, activeTab])

  // 排序功能
  const getSortedTodos = () => {
    const todosCopy = [...filteredTodos]
    
    switch (sortBy) {
      case 'priority':
        return todosCopy.sort((a, b) => {
          const priorityOrder = { '高': 3, '中': 2, '低': 1 }
          const aPriority = priorityOrder[a.priority || '中'] || 2
          const bPriority = priorityOrder[b.priority || '中'] || 2
          return bPriority - aPriority // 高优先级在前
        })
      case 'created':
        return todosCopy.sort((a, b) => {
          const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0
          const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0
          return bTime - aTime // 最新的在前
        })
      default:
        return todosCopy
    }
  }

  // 统计
  const totalTodos = todos.length
  const completedTodos = todos.filter((todo) => todo.completed).length
  const remainingTodos = totalTodos - completedTodos
  const sortedTodos = getSortedTodos()

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

      {/* 统计信息和 Tab 切换 */}
      {totalTodos > 0 && (
        <section className="stats-section">
          <TodoStats
            total={totalTodos}
            completed={completedTodos}
            remaining={remainingTodos}
            activeTab={activeTab}
            onTabChange={setActiveTab}
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
          <>

            {/* 表头和排序 */}
            {sortedTodos.length > 0 && (
              <div className="todos-header">
                <div className="header-left">
                  <h2 className="section-title">
                    {activeTab === 'all' ? '全部事项' : activeTab === 'active' ? '待办事项' : '已完成事项'}
                  </h2>
                  <span className="todo-count">({sortedTodos.length})</span>
                </div>
                <div className="header-right">
                  <div className="sort-selector">
                    <label className="sort-label">
                      <span className="sort-icon">🔀</span>
                      <span>排序：</span>
                    </label>
                    <select
                      className="sort-select"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                    >
                      <option value="none">默认</option>
                      <option value="priority">按优先级</option>
                      <option value="created">按创建时间</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* 任务列表 */}
            {sortedTodos.length > 0 ? (
              <div className="todos-list">
                {sortedTodos.map((todo) => (
                  <TodoItem
                    key={todo._id}
                    todo={todo}
                    onToggle={toggleTodo}
                    onDelete={deleteTodo}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-tab-message">
                <div className="empty-tab-icon">
                  {activeTab === 'active' ? '⏰' : '✅'}
                </div>
                <p className="empty-tab-text">
                  {activeTab === 'active' 
                    ? '暂无待办事项，所有任务都已完成！' 
                    : '暂无已完成的事项'}
                </p>
              </div>
            )}
          </>
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
