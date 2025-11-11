import './TodoEmpty.less'

function TodoEmpty() {
  return (
    <div className="todo-empty">
      <div className="empty-icon-wrapper">
        <div className="empty-icon">📋</div>
        <div className="empty-icon-shadow" />
      </div>
      <h2 className="empty-title">暂无待办事项</h2>
      <p className="empty-subtitle">点击上方按钮添加你的第一个待办事项吧！</p>
    </div>
  )
}

export default TodoEmpty
