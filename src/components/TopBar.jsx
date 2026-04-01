import { useNavigate } from 'react-router-dom'

export default function TopBar({ title, backPath, action, onAction }) {
  const navigate = useNavigate()

  return (
    <header className="topbar">
      {backPath !== undefined && (
        <button
          id="topbar-back"
          className="topbar__back"
          onClick={() => backPath ? navigate(backPath) : navigate(-1)}
          aria-label="Go back"
        >
          ←
        </button>
      )}
      <h1 className="topbar__title">{title}</h1>
      {action && (
        <button
          id="topbar-action"
          className="topbar__action"
          onClick={onAction}
        >
          {action}
        </button>
      )}
    </header>
  )
}
