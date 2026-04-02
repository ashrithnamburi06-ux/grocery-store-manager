import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import TopBar from '../../components/TopBar'
import Toast from '../../components/Toast'
import { getSupplierById, getSupplierBalance, addPayment } from '../../data/store'

export default function AddPayment() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const supplier = getSupplierById(id)
  const { remaining } = id ? getSupplierBalance(id) : { remaining: 0 }

  const [amount, setAmount] = useState('')
  const [date,   setDate]   = useState(new Date().toISOString().slice(0, 10))
  const [billImage, setBillImage] = useState('')   // ✅ NEW
  const [error,  setError]  = useState('')
  const [toast,  setToast]  = useState('')

  if (!supplier) {
    return (
      <div className="screen screen--no-nav">
        <TopBar title="Add Payment" backPath="/suppliers" />
        <div className="empty-state">
          <p className="empty-state__title">Supplier not found</p>
        </div>
      </div>
    )
  }

  // ✅ NEW FUNCTION
  const handleImageChange = (e) => {
  const file = e.target.files[0]
  if (!file) return

  // 🚨 FIX: prevent large image crash
  if (file.size > 1000000) {
    alert("Image too large. Please select a smaller image.")
    return
  }

  const reader = new FileReader()
  reader.onloadend = () => {
    setBillImage(reader.result)
  }
  reader.readAsDataURL(file)
}

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!amount || Number(amount) <= 0) {
      setError('Enter a valid amount')
      return
    }

    addPayment({
      supplierId:   id,
      supplierName: supplier.name,
      amount:       Number(amount),
      date,
      billImage:    billImage, // ✅ NEW (IMPORTANT)
      createdAt:    new Date().toISOString()
    })

    setToast('Payment recorded ✓')
    setTimeout(() => navigate(`/suppliers/${id}`), 1500)
  }

  return (
    <div className="screen screen--no-nav">
      <TopBar title="Record Payment" backPath={`/suppliers/${id}`} />

      <div className="screen-content">
        <div className="card">
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', fontWeight: 600 }}>PAYING TO</p>
          <p style={{ fontSize: '18px', fontWeight: 700, marginTop: '4px' }}>{supplier.name}</p>

          {remaining > 0 && (
            <p style={{ fontSize: '13px', color: 'var(--color-danger)', fontWeight: 600, marginTop: '4px' }}>
              Remaining balance: ₹{remaining.toLocaleString()}
            </p>
          )}

          {remaining === 0 && (
            <p style={{ fontSize: '13px', color: 'var(--color-success)', fontWeight: 600, marginTop: '4px' }}>
              ✅ No pending balance
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div className="form-group">
            <label className="form-label" htmlFor="ap-amount">Amount Paid (₹)</label>
            <input
              id="ap-amount"
              className="form-input"
              type="number"
              inputMode="numeric"
              placeholder="0"
              min="1"
              value={amount}
              onChange={e => { setAmount(e.target.value); setError('') }}
            />
            {error && <span style={{ color: 'var(--color-danger)', fontSize: '12px' }}>{error}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="ap-date">Date</label>
            <input
              id="ap-date"
              className="form-input"
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </div>

          {/* ✅ NEW IMAGE INPUT */}
          <div className="form-group">
            <label className="form-label">Upload Bill Image</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange}
            />
          </div>

          {/* ✅ OPTIONAL PREVIEW */}
          {billImage && (
            <img src={billImage} alt="preview" width="100" style={{ borderRadius: '6px' }} />
          )}

          <button id="ap-submit" type="submit" className="btn btn--primary" style={{ marginTop: '8px' }}>
            Confirm Payment
          </button>

          <button type="button" className="btn btn--outline" onClick={() => navigate(`/suppliers/${id}`)}>
            Cancel
          </button>
        </form>
      </div>

      {toast && <Toast message={toast} onDone={() => setToast('')} />}
    </div>
  )
}