import './ClearCompletedButton.less'

interface ClearCompletedButtonProps {
  count: number
  onClick: () => void
}

function ClearCompletedButton({ count, onClick }: ClearCompletedButtonProps) {
  return (
    <button className="clear-completed-btn" onClick={onClick}>
      <span className="btn-icon">🧹</span>
      <span className="btn-text">清空已完成 ({count})</span>
    </button>
  )
}

export default ClearCompletedButton
