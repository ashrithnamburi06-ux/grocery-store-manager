import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../../components/TopBar'
import Toast from '../../components/Toast'
import { addSupplier } from '../../data/store'

export default function AddSupplier() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', phone: '' })
  const [errors,  setErrors] = useState({})
  const [toast,   setToast]  = useState('')

  const set = (field, value) => {
    setForm(f => ({ ...f, [field]: value }))
    setErrors(e => ({ ...e, [field]: '' }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.name.trim())        errs.name  = 'Name is required'
    if (form.phone.length < 10)   errs.phone = 'Enter a valid 10-digit number'
    if (Object.keys(errs).length) { setErrors(errs); return }

    addSupplier({ name: form.name.trim(), phone: form.phone.trim() })
    setToast('Supplier added ✓')
    setTimeout(() => navigate('/suppliers'), 1500)
  }

  return (
    <div className="screen screen--no-nav">
      <TopBar title="Add Supplier" backPath="/suppliers" />

      <div className="screen-content">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="as-name">Supplier Name</label>
            <input
              id="as-name"
              className="form-input"
              type="text"
              placeholder="e.g. Sharma & Sons"
              value={form.name}
              onChange={e => set('name', e.target.value)}
            />
            {errors.name && <span style={{ color: 'var(--color-danger)', fontSize: '12px' }}>{errors.name}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="as-phone">Phone Number</label>
            <input
              id="as-phone"
              className="form-input"
              type="tel"
              inputMode="numeric"
              placeholder="10-digit mobile number"
              value={form.phone}
              onChange={e => set('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
            />
            {errors.phone && <span style={{ color: 'var(--color-danger)', fontSize: '12px' }}>{errors.phone}</span>}
          </div>

          <button id="as-submit" type="submit" className="btn btn--primary" style={{ marginTop: '8px' }}>
            Save Supplier
          </button>
          <button type="button" className="btn btn--outline" onClick={() => navigate('/suppliers')}>
            Cancel
          </button>
        </form>
      </div>

      {toast && <Toast message={toast} onDone={() => setToast('')} />}
    </div>
  )
}
