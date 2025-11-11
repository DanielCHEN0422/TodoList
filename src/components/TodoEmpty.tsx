import './TodoEmpty.less'

function TodoEmpty() {
  return (
    <div className="todo-empty">
      <div className="empty-icon">📋</div>
      <p className="empty-title">暂无待办事项</p>
      <p className="empty-subtitle">在输入框中添加你的第一个待办事项吧！</p>
    </div>
  )
}

export default TodoEmpty
