import { useState, useEffect } from 'react'
import './AddTodoModal.less'

interface AddTodoModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (title: string, description?: string, category?: string, customCategory?: string, priority?: string) => Promise<void>
  loading?: boolean
}

const CATEGORIES = ['工作', '学习', '生活', '自定义'] as const
const PRIORITIES = ['低', '中', '高'] as const

function AddTodoModal({ isOpen, onClose, onAdd, loading = false }: AddTodoModalProps) {
  const [titleValue, setTitleValue] = useState('')
  const [descriptionValue, setDescriptionValue] = useState('')
  const [category, setCategory] = useState<'工作' | '学习' | '生活' | '自定义'>('生活')
  const [customCategory, setCustomCategory] = useState('')
  const [priority, setPriority] = useState<'低' | '中' | '高'>('中')
  const [error, setError] = useState<string | null>(null)

  // 当 modal 打开时重置表单
  useEffect(() => {
    if (isOpen) {
      setTitleValue('')
      setDescriptionValue('')
      setCategory('生活')
      setCustomCategory('')
      setPriority('中')
      setError(null)
    }
  }, [isOpen])

  // 处理 ESC 键关闭
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // 阻止背景点击关闭（可选，如果需要点击背景关闭可以移除）
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (titleValue.trim() === '') {
      setError('标题不能为空')
      return
    }

    if (category === '自定义' && customCategory.trim() === '') {
      setError('请输入自定义分类名称')
      return
    }

    try {
      setError(null)
      await onAdd(
        titleValue.trim(),
        descriptionValue.trim() || undefined,
        category,
        category === '自定义' ? customCategory.trim() : undefined,
        priority
      )
      onClose()
    } catch (err) {
      setError('添加待办事项失败')
      console.error('Error adding todo:', err)
    }
  }

  const handleTitleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            <span className="title-icon">✨</span>
            添加新任务
          </h2>
          <button
            className="modal-close-btn"
            onClick={onClose}
            aria-label="关闭"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && (
            <div className="form-error">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">📝</span>
              <span className="label-text">标题</span>
              <span className="label-required">*</span>
            </label>
            <input
              type="text"
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onKeyPress={handleTitleKeyPress}
              placeholder="输入待办事项标题..."
              className="form-input"
              autoFocus
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">📄</span>
              <span className="label-text">描述</span>
              <span className="label-optional">(可选)</span>
            </label>
            <textarea
              value={descriptionValue}
              onChange={(e) => setDescriptionValue(e.target.value)}
              placeholder="输入待办事项描述..."
              rows={4}
              className="form-textarea"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">🏷️</span>
              <span className="label-text">分类</span>
            </label>
            <div className="category-selector">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`category-option ${category === cat ? 'active' : ''}`}
                  onClick={() => setCategory(cat)}
                  disabled={loading}
                >
                  {cat}
                </button>
              ))}
            </div>
            {category === '自定义' && (
              <input
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="输入自定义分类名称..."
                className="form-input custom-category-input"
                disabled={loading}
              />
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">⚡</span>
              <span className="label-text">优先级</span>
            </label>
            <div className="priority-selector">
              {PRIORITIES.map((pri) => (
                <button
                  key={pri}
                  type="button"
                  className={`priority-option priority-${pri} ${priority === pri ? 'active' : ''}`}
                  onClick={() => setPriority(pri)}
                  disabled={loading}
                >
                  <span className="priority-icon">
                    {pri === '高' ? '🔴' : pri === '中' ? '🟡' : '🟢'}
                  </span>
                  <span className="priority-text">{pri}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={loading}
            >
              取消
            </button>
            <button
              type="submit"
              className={`btn-submit ${loading ? 'loading' : ''}`}
              disabled={titleValue.trim() === '' || loading}
            >
              {loading ? (
                <>
                  <span className="btn-icon spinning">⏳</span>
                  <span>添加中...</span>
                </>
              ) : (
                <>
                  <span className="btn-icon">➕</span>
                  <span>添加任务</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddTodoModal
