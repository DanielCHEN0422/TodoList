import './TodoStats.less'

type TabType = 'all' | 'active' | 'completed'

interface TodoStatsProps {
  total: number
  completed: number
  remaining: number
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

function TodoStats({ total, completed, remaining, activeTab, onTabChange }: TodoStatsProps) {
  return (
    <div className="todo-stats">
      <button
        className={`stat-item ${activeTab === 'all' ? 'active' : ''}`}
        onClick={() => onTabChange('all')}
      >
        <div className="stat-icon total">📋</div>
        <div className="stat-content">
          <div className="stat-label">全部</div>
          <div className="stat-value">{total}</div>
        </div>
      </button>
      <button
        className={`stat-item ${activeTab === 'active' ? 'active' : ''}`}
        onClick={() => onTabChange('active')}
      >
        <div className="stat-icon remaining">⏰</div>
        <div className="stat-content">
          <div className="stat-label">待办</div>
          <div className="stat-value remaining">{remaining}</div>
        </div>
      </button>
      <button
        className={`stat-item ${activeTab === 'completed' ? 'active' : ''}`}
        onClick={() => onTabChange('completed')}
      >
        <div className="stat-icon completed">✅</div>
        <div className="stat-content">
          <div className="stat-label">已完成</div>
          <div className="stat-value completed">{completed}</div>
        </div>
      </button>
    </div>
  )
}

export default TodoStats
