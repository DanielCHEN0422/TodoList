import './ErrorMessage.less'

interface ErrorMessageProps {
  message: string
}

function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null

  return (
    <div className="error-message">
      <div className="error-accent" />
      <span className="error-icon">⚠️</span>
      <span className="error-text">{message}</span>
    </div>
  )
}

export default ErrorMessage
