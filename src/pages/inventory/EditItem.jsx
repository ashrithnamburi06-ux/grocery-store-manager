import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import TopBar from '../../components/TopBar'
import Toast from '../../components/Toast'
import { getInventory, updateInventoryItem, deleteInventoryItem } from '../../data/store'

const UNITS = ['kg', 'pieces', 'boxes', 'liters', 'packets']

export default function EditItem() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const item     = getInventory().find(it => it.id === id)

  const [form, setForm] = useState({
    name:     item?.name     ?? '',
    unit:     item?.unit     ?? 'kg',
    quantity: item?.quantity ?? '',
    minStock: item?.minStock ?? '',
  })
  const [toast, setToast] = useState('')
  const [errors, setErrors] = useState({})
  const [confirmDelete, setConfirmDelete] = useState(false)

  if (!item) {
    return (
      <div className="screen screen--no-nav">
        <TopBar title="Edit Item" backPath="/inventory" />
        <div className="empty-state">
          <div className="empty-state__icon">❓</div>
          <p className="empty-state__title">Item not found</p>
          <button className="btn btn--outline btn--sm" onClick={() => navigate('/inventory')}>
            Back to Inventory
          </button>
        </div>
      </div>
    )
  }

  const set = (field, value) => {
    setForm(f => ({ ...f, [field]: value }))
    setErrors(e => ({ ...e, [field]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim())         e.name    = 'Item name is required'
    if (form.quantity === '')      e.quantity = 'Quantity is required'
    if (form.minStock === '')      e.minStock = 'Minimum stock level is required'
    return e
  }

  const handleSave = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    updateInventoryItem(id, {
      name:     form.name.trim(),
      unit:     form.unit,
      quantity: Number(form.quantity),
      minStock: Number(form.minStock),
    })
    setToast('Item updated ✓')
    setTimeout(() => navigate('/inventory'), 1500)
  }

  const handleDelete = () => {
    deleteInventoryItem(id)
    navigate('/inventory')
  }

  return (
    <div className="screen screen--no-nav">
      <TopBar title="Edit Item" backPath="/inventory" />

      <div className="screen-content">
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="ei-name">Item Name</label>
            <input
              id="ei-name"
              className="form-input"
              type="text"
              value={form.name}
              onChange={e => set('name', e.target.value)}
            />
            {errors.name && <span style={{ color: 'var(--color-danger)', fontSize: '12px' }}>{errors.name}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="ei-unit">Unit</label>
            <select
              id="ei-unit"
              className="form-select"
              value={form.unit}
              onChange={e => set('unit', e.target.value)}
            >
              {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="ei-qty">Quantity</label>
            <input
              id="ei-qty"
              className="form-input"
              type="number"
              inputMode="numeric"
              min="0"
              value={form.quantity}
              onChange={e => set('quantity', e.target.value)}
            />
            {errors.quantity && <span style={{ color: 'var(--color-danger)', fontSize: '12px' }}>{errors.quantity}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="ei-min">Minimum Stock Level</label>
            <input
              id="ei-min"
              className="form-input"
              type="number"
              inputMode="numeric"
              min="0"
              value={form.minStock}
              onChange={e => set('minStock', e.target.value)}
            />
            {errors.minStock && <span style={{ color: 'var(--color-danger)', fontSize: '12px' }}>{errors.minStock}</span>}
          </div>

          <button id="ei-save" type="submit" className="btn btn--primary" style={{ marginTop: '8px' }}>
            Save Changes
          </button>

          <button
            type="button"
            className="btn btn--danger"
            onClick={() => setConfirmDelete(true)}
          >
            🗑 Delete Item
          </button>

          <button
            type="button"
            className="btn btn--outline"
            onClick={() => navigate('/inventory')}
          >
            Cancel
          </button>
        </form>

        {/* Confirm Delete Dialog */}
        {confirmDelete && (
          <div
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 400, padding: '24px',
            }}
          >
            <div className="card" style={{ width: '100%', maxWidth: '360px' }}>
              <p style={{ fontWeight: 700, fontSize: '17px', marginBottom: '8px' }}>Delete Item?</p>
              <p className="text-muted" style={{ fontSize: '14px', marginBottom: '20px' }}>
                This will permanently remove <strong>{form.name}</strong> from inventory.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn btn--outline" style={{ flex: 1 }} onClick={() => setConfirmDelete(false)}>
                  Cancel
                </button>
                <button id="confirm-delete" className="btn btn--danger" style={{ flex: 1 }} onClick={handleDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {toast && <Toast message={toast} onDone={() => setToast('')} />}
    </div>
  )
}
