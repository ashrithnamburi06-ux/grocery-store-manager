import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../../data/store'

export default function Login() {
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [name, setName]   = useState('')
  const [error, setError] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    setError('')

    if (phone.length < 10) {
      setError('Please enter a valid 10-digit phone number.')
      return
    }
    if (!name.trim()) {
      setError('Please enter your name.')
      return
    }

    loginUser(phone.trim(), name.trim())
    navigate('/welcome', { replace: true })
  }

  return (
    <div className="auth-screen">
      {/* Hero */}
      <div className="auth-hero">
        <div className="auth-hero__icon">🛒</div>
        <h1 className="auth-hero__title">Grocery Manager</h1>
        <p className="auth-hero__subtitle">Manage your store with ease</p>
      </div>

      {/* Form */}
      <div className="auth-body">
        <p className="auth-body__heading">Sign In</p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-name">Your Name</label>
            <input
              id="login-name"
              className="form-input"
              type="text"
              placeholder="e.g. Ramesh Kumar"
              value={name}
              onChange={e => setName(e.target.value)}
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-phone">Phone Number</label>
            <input
              id="login-phone"
              className="form-input"
              type="tel"
              placeholder="10-digit mobile number"
              value={phone}
              onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              inputMode="numeric"
              autoComplete="tel"
            />
          </div>

          {error && (
            <p style={{ color: 'var(--color-danger)', fontSize: '13px', fontWeight: 600 }}>
              ⚠ {error}
            </p>
          )}

          <button
            id="login-submit"
            type="submit"
            className="btn btn--primary"
            style={{ marginTop: '8px' }}
          >
            Continue →
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '8px' }}>
          No OTP or password required
        </p>
      </div>
    </div>
  )
}
