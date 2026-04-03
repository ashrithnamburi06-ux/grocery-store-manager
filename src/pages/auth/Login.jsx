import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../../data/store'

export default function Login() {
  const navigate = useNavigate()

  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [shopName, setShopName] = useState('')
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

    if (!shopName.trim()) {
      setError('Please enter your shop name.')
      return
    }

    const userId = Date.now().toString()

    // 🔥 Save user
    loginUser(phone.trim(), name.trim(), userId)

    // 🔥 Save shop name
    localStorage.setItem('shopName', shopName.trim())

    navigate('/welcome', { replace: true })
  }

  return (
    <div className="auth-screen">
      <div className="auth-hero">
        <div className="auth-hero__icon">🛒</div>
        <h1 className="auth-hero__title">Grocery Manager</h1>
        <p className="auth-hero__subtitle">Manage your store with ease</p>
      </div>

      <div className="auth-body">
        <p className="auth-body__heading">Sign In</p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Name */}
          <div className="form-group">
            <label className="form-label">Your Name</label>
            <input
              className="form-input"
              placeholder="e.g. Ramesh Kumar"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          {/* Phone */}
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              className="form-input"
              placeholder="10-digit mobile number"
              value={phone}
              onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
            />
          </div>

          {/* 🔥 NEW FIELD */}
          <div className="form-group">
            <label className="form-label">Shop Name</label>
            <input
              className="form-input"
              placeholder="e.g. Sri Sai Kirana Store"
              value={shopName}
              onChange={e => setShopName(e.target.value)}
            />
          </div>

          {error && (
            <p style={{ color: 'red', fontSize: '13px' }}>
              ⚠ {error}
            </p>
          )}

          <button type="submit" className="btn btn--primary">
            Continue →
          </button>
        </form>
      </div>
    </div>
  )
}