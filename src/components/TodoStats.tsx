import './TodoStats.less'

interface TodoStatsProps {
  total: number
  completed: number
  remaining: number
}

function TodoStats({ total, completed, remaining }: TodoStatsProps) {
  return (
    <div className="todo-stats">
      <div className="stat-item">
        <div className="stat-icon total">📊</div>
        <div className="stat-content">
          <div className="stat-label">总计</div>
          <div className="stat-value">{total}</div>
        </div>
      </div>
      <div className="stat-item">
        <div className="stat-icon completed">✅</div>
        <div className="stat-content">
          <div className="stat-label">已完成</div>
          <div className="stat-value completed">{completed}</div>
        </div>
      </div>
      <div className="stat-item">
        <div className="stat-icon remaining">⏰</div>
        <div className="stat-content">
          <div className="stat-label">待完成</div>
          <div className="stat-value remaining">{remaining}</div>
        </div>
      </div>
    </div>
  )
}

export default TodoStats
