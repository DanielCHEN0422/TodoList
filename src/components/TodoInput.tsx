import './TodoInput.less'

interface TodoInputProps {
  titleValue: string
  descriptionValue: string
  onTitleChange: (value: string) => void
  onDescriptionChange: (value: string) => void
  onAdd: () => void
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void
  loading: boolean
}

function TodoInput({
  titleValue,
  descriptionValue,
  onTitleChange,
  onDescriptionChange,
  onAdd,
  onKeyPress,
  loading,
}: TodoInputProps) {
  const isDisabled = titleValue.trim() === '' || loading

  return (
    <div className="todo-input-container">
      <div className="input-header">
        <div className="header-icon">✨</div>
        <h2 className="header-title">添加新任务</h2>
      </div>

      <div className="input-group">
        <label className="input-label">
          <span className="label-icon">📝</span>
          <span className="label-text">标题</span>
          <span className="label-required">*</span>
        </label>
        <input
          type="text"
          value={titleValue}
          onChange={(e) => onTitleChange(e.target.value)}
          onKeyPress={onKeyPress}
          placeholder="输入待办事项标题..."
          className="todo-input"
        />
      </div>

      <div className="input-group">
        <label className="input-label">
          <span className="label-icon">📄</span>
          <span className="label-text">描述</span>
          <span className="label-optional">(可选)</span>
        </label>
        <textarea
          value={descriptionValue}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="输入待办事项描述..."
          rows={3}
          className="todo-textarea"
        />
      </div>

      <button
        onClick={onAdd}
        disabled={isDisabled}
        className={`add-button ${isDisabled ? 'disabled' : ''}`}
      >
        {loading ? (
          <>
            <span className="button-icon spinning">⏳</span>
            <span>添加中...</span>
          </>
        ) : (
          <>
            <span className="button-icon">➕</span>
            <span>添加待办事项</span>
          </>
        )}
      </button>
    </div>
  )
}

export default TodoInput
