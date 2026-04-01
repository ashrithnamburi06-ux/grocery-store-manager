import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUser } from '../../data/store'

export default function Welcome() {
  const navigate = useNavigate()
  const user = getUser()

  useEffect(() => {
    if (!user) { navigate('/login', { replace: true }); return }
    // Auto-navigate to dashboard after 2 seconds
    const timer = setTimeout(() => navigate('/dashboard', { replace: true }), 2000)
    return () => clearTimeout(timer)
  }, [navigate, user])

  if (!user) return null

  return (
    <div className="welcome-screen">
      <div className="welcome-screen__icon">🛒</div>
      <div>
        <p className="welcome-screen__greeting">Welcome back</p>
        <p className="welcome-screen__name">{user.name}</p>
      </div>
      <p className="welcome-screen__sub">Taking you to your dashboard…</p>
    </div>
  )
}
