import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../../components/TopBar'
import Toast from '../../components/Toast'
import { addInventoryItem } from '../../data/store'


const UNITS = ['kg', 'pieces', 'boxes', 'liters', 'packets']

export default function AddItem() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    unit: 'kg',
    quantity: '',
    minStock: '',
    total: '',
    amountPaid: ''
  })
  const [toast, setToast] = useState('')
  const [errors, setErrors] = useState({})
  
  const set = (field, value) => {
    setForm(f => ({ ...f, [field]: value }))
    setErrors(e => ({ ...e, [field]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim())         e.name = 'Item name is required'
    if (!form.quantity)            e.quantity = 'Quantity is required'
    if (!form.minStock)            e.minStock = 'Minimum stock level is required'
    if (Number(form.quantity) < 0) e.quantity = 'Cannot be negative'
    if (Number(form.minStock) < 0) e.minStock = 'Cannot be negative'

    // ✅ New validations
    if (!form.total) e.total = 'Total amount required'
    if (Number(form.total) < 0) e.total = 'Cannot be negative'

    if (Number(form.amountPaid) < 0) e.amountPaid = 'Cannot be negative'
    if (Number(form.amountPaid) > Number(form.total))
      e.amountPaid = 'Paid cannot exceed total'

    return e
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    const total = Number(form.total)
    const paid = Number(form.amountPaid)
    const remaining = total - paid

    addInventoryItem({
      name: form.name.trim(),
      unit: form.unit,
      quantity: Number(form.quantity),
      minStock: Number(form.minStock),

      // ✅ New fields
      total,
      amountPaid: paid,
      remaining,
      status: remaining > 0 ? 'pending' : 'paid'
    })

    setToast('Item added ✓')
    setTimeout(() => navigate('/inventory'), 1500)
  }

  return (
    <div className="screen screen--no-nav">
      <TopBar title="Add Inventory Item" backPath="/inventory" />

      <div className="screen-content">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Item Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="ai-name">Item Name</label>
            <input
              id="ai-name"
              className="form-input"
              type="text"
              placeholder="e.g. Basmati Rice"
              value={form.name}
              onChange={e => set('name', e.target.value)}
            />
            {errors.name && <span style={{ color: 'var(--color-danger)', fontSize: '12px' }}>{errors.name}</span>}
          </div>

          {/* Unit */}
          <div className="form-group">
            <label className="form-label" htmlFor="ai-unit">Unit</label>
            <select
              id="ai-unit"
              className="form-select"
              value={form.unit}
              onChange={e => set('unit', e.target.value)}
            >
              {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>

          {/* Quantity */}
          <div className="form-group">
            <label className="form-label" htmlFor="ai-qty">Current Quantity</label>
            <input
              id="ai-qty"
              className="form-input"
              type="number"
              inputMode="numeric"
              placeholder="0"
              min="0"
              value={form.quantity}
              onChange={e => set('quantity', e.target.value)}
            />
            {errors.quantity && <span style={{ color: 'var(--color-danger)', fontSize: '12px' }}>{errors.quantity}</span>}
          </div>

          {/* Min Stock */}
          <div className="form-group">
            <label className="form-label" htmlFor="ai-min">Minimum Stock Level</label>
            <input
              id="ai-min"
              className="form-input"
              type="number"
              inputMode="numeric"
              placeholder="Alert when below this"
              min="0"
              value={form.minStock}
              onChange={e => set('minStock', e.target.value)}
            />
            {errors.minStock && <span style={{ color: 'var(--color-danger)', fontSize: '12px' }}>{errors.minStock}</span>}
          </div>

          {/* ✅ Total */}
          <div className="form-group">
            <label className="form-label">Total Amount (₹)</label>
            <input
              className="form-input"
              type="number"
              placeholder="0"
              min="0"
              value={form.total}
              onChange={e => set('total', e.target.value)}
            />
            {errors.total && <span style={{ color: 'var(--color-danger)', fontSize: '12px' }}>{errors.total}</span>}
          </div>

          {/* ✅ Paid */}
          <div className="form-group">
            <label className="form-label">Amount Paid (₹)</label>
            <input
              className="form-input"
              type="number"
              placeholder="0"
              min="0"
              value={form.amountPaid}
              onChange={e => set('amountPaid', e.target.value)}
            />
            {errors.amountPaid && <span style={{ color: 'var(--color-danger)', fontSize: '12px' }}>{errors.amountPaid}</span>}
          </div>

          {/* ✅ Remaining */}
          <div className="form-group">
            <label className="form-label">Remaining (₹)</label>
            <input
              className="form-input"
              type="number"
              value={
                Math.max(
                  0,
                  Number(form.total || 0) - Number(form.amountPaid || 0)
                )
              }
              disabled
            />
          </div>

          {/* Buttons */}
          <button
            id="ai-submit"
            type="submit"
            className="btn btn--primary"
            style={{ marginTop: '8px' }}
          >
            Save Item
          </button>

          <button
            type="button"
            className="btn btn--outline"
            onClick={() => navigate('/inventory')}
          >
            Cancel
          </button>
        </form>
      </div>

      {toast && <Toast message={toast} onDone={() => setToast('')} />}
    </div>
  )
}