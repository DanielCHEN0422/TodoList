import { useState } from 'react'

interface Todo {
  id: number
  title: string
  description?: string
  completed: boolean
}

function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [titleValue, setTitleValue] = useState('')
  const [descriptionValue, setDescriptionValue] = useState('')

  // 添加待办事项
  const addTodo = () => {
    if (titleValue.trim() === '') return
    
    const newTodo: Todo = {
      id: Date.now(),
      title: titleValue.trim(),
      description: descriptionValue.trim() || undefined,
      completed: false
    }
    
    setTodos([...todos, newTodo])
    setTitleValue('')
    setDescriptionValue('')
  }

  // 切换完成状态
  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  // 删除待办事项
  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  // 处理回车键（在标题输入框中）
  const handleTitleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      addTodo()
    }
  }

  // 统计
  const totalTodos = todos.length
  const completedTodos = todos.filter(todo => todo.completed).length
  const remainingTodos = totalTodos - completedTodos

  return (
    <div className="w-full max-w-600 mx-auto">
      {/* 标题 */}
      <h1 className="text-32 font-bold mb-16 text-center">Todo List</h1>

      {/* 输入区域 */}
      <div className="mb-16 p-16 bg-white border rounded-8">
        <div className="flex flex-col mb-12">
          <label className="text-14 font-medium mb-4 text-gray-700">
            标题 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={titleValue}
            onChange={(e) => setTitleValue(e.target.value)}
            onKeyPress={handleTitleKeyPress}
            placeholder="输入待办事项标题..."
            className="w-full px-12 py-8 text-16 border rounded-4 focus:outline-none focus:border-blue-500"
          />
        </div>
        
        <div className="flex flex-col mb-12">
          <label className="text-14 font-medium mb-4 text-gray-700">
            描述 <span className="text-12 text-gray-500">(可选)</span>
          </label>
          <textarea
            value={descriptionValue}
            onChange={(e) => setDescriptionValue(e.target.value)}
            placeholder="输入待办事项描述..."
            rows={3}
            className="w-full px-12 py-8 text-16 border rounded-4 focus:outline-none focus:border-blue-500 resize-none"
          />
        </div>

        <button
          onClick={addTodo}
          disabled={titleValue.trim() === ''}
          className="w-full px-16 py-8 bg-blue-500 text-white rounded-4 cursor-pointer font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          添加待办事项
        </button>
      </div>

      {/* 统计信息 */}
      {totalTodos > 0 && (
        <div className="flex justify-between items-center mb-12 px-12 py-8 bg-gray-100 rounded-4">
          <span className="text-14">总计: {totalTodos}</span>
          <span className="text-14">已完成: {completedTodos}</span>
          <span className="text-14">待完成: {remainingTodos}</span>
        </div>
      )}

      {/* 待办事项列表 */}
      <div className="flex flex-col">
        {todos.length === 0 ? (
          <div className="text-center py-32 text-gray-500">
            <p className="text-16">暂无待办事项</p>
            <p className="text-14 mt-8">在输入框中添加你的第一个待办事项吧！</p>
          </div>
        ) : (
          todos.map(todo => (
            <div
              key={todo.id}
              className="flex items-start px-16 py-16 mb-8 bg-white border rounded-4 hover:shadow-md transition-shadow"
            >
              {/* 复选框 */}
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="w-20 h-20 mr-12 mt-4 cursor-pointer flex-shrink-0"
              />
              
              {/* 待办内容 */}
              <div className="flex-1 min-w-0">
                <h3
                  className={`text-18 font-semibold mb-4 ${
                    todo.completed 
                      ? 'line-through text-gray-500' 
                      : 'text-gray-800'
                  }`}
                >
                  {todo.title}
                </h3>
                {todo.description && (
                  <p
                    className={`text-14 text-gray-600 ${
                      todo.completed 
                        ? 'line-through text-gray-400' 
                        : ''
                    }`}
                  >
                    {todo.description}
                  </p>
                )}
              </div>
              
              {/* 删除按钮 */}
              <button
                onClick={() => deleteTodo(todo.id)}
                className="px-12 py-6 bg-red-500 text-white rounded-4 cursor-pointer text-14 font-medium hover:bg-red-600 ml-12 flex-shrink-0"
              >
                删除
              </button>
            </div>
          ))
        )}
      </div>

      {/* 清空所有已完成 */}
      {completedTodos > 0 && (
        <div className="mt-16 text-center">
          <button
            onClick={() => setTodos(todos.filter(todo => !todo.completed))}
            className="px-16 py-8 bg-gray-500 text-white rounded-4 cursor-pointer text-14 font-medium hover:bg-gray-600"
          >
            清空已完成 ({completedTodos})
          </button>
        </div>
      )}
    </div>
  )
}

export default TodoList
