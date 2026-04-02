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
  const [billImage, setBillImage] = useState('')
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

  // ✅ PWA SAFE IMAGE HANDLER
  const handleImageChange = (e) => {
    const file = e.target.files?.[0]

    if (!file) {
      alert("No image selected")
      return
    }

    console.log("Selected file:", file)

    // 🚨 Prevent large image crash (important for mobile/PWA)
    if (file.size > 2000000) {
      alert("Image too large. Please select a smaller image.")
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      setBillImage(reader.result)
      console.log("Image stored")
    }

    reader.onerror = () => {
      alert("Error reading image")
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
      billImage:    billImage
    })

    setToast('Payment recorded ✓')
    setTimeout(() => navigate(`/suppliers/${id}`), 1500)
  }

  return (
    <div className="screen screen--no-nav">
      <TopBar title="Record Payment" backPath={`/suppliers/${id}`} />

      <div className="screen-content">
        <div className="card">
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
            PAYING TO
          </p>
          <p style={{ fontSize: '18px', fontWeight: 700 }}>{supplier.name}</p>

          {remaining > 0 && (
            <p style={{ fontSize: '13px', color: 'red' }}>
              Remaining balance: ₹{remaining.toLocaleString()}
            </p>
          )}

          {remaining === 0 && (
            <p style={{ fontSize: '13px', color: 'green' }}>
              ✅ No pending balance
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div className="form-group">
            <label>Amount Paid (₹)</label>
            <input
              type="number"
              value={amount}
              onChange={e => { setAmount(e.target.value); setError('') }}
            />
            {error && <span style={{ color: 'red', fontSize: '12px' }}>{error}</span>}
          </div>

          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </div>

          {/* ✅ PWA SAFE INPUT */}
          <div className="form-group">
            <label>Upload Bill Image</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          {/* ✅ IMAGE PREVIEW */}
          {billImage && (
            <img src={billImage} alt="preview" width="100" />
          )}

          <button type="submit" className="btn btn--primary">
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