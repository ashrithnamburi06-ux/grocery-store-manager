import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../../components/TopBar'
import Toast from '../../components/Toast'
import {
  getInventory, getSuppliers,
  addLoad, addInventoryItem, addSupplier,
} from '../../data/store'

export default function AddLoad() {
  const navigate  = useNavigate()
  const inventory = getInventory()
  const suppliers = getSuppliers()

  const [form, setForm] = useState({
    itemId:        '',
    newItemName:   '',
    newItemUnit:   'kg',
    quantity:      '',
    supplierId:    '',
    newSupplierName:  '',
    newSupplierPhone: '',
    paymentType:   'Cash',
    amount:        '',
  })
  const [toast,  setToast]  = useState('')
  const [errors, setErrors] = useState({})

  const isNewItem     = form.itemId === '__new__'
  const isNewSupplier = form.supplierId === '__new__'

  const set = (field, value) =>
    setForm(f => ({ ...f, [field]: value }))

  const validate = () => {
    const e = {}
    if (!form.itemId)                                    e.itemId   = 'Select an item'
    if (isNewItem && !form.newItemName.trim())           e.newItemName = 'Item name required'
    if (!form.quantity || Number(form.quantity) <= 0)   e.quantity = 'Enter a valid quantity'
    if (!form.supplierId)                                e.supplierId = 'Select a supplier'
    if (isNewSupplier && !form.newSupplierName.trim())  e.newSupplierName  = 'Supplier name required'
    if (isNewSupplier && form.newSupplierPhone.length < 10) e.newSupplierPhone = 'Enter valid phone number'
    if (!form.amount || Number(form.amount) <= 0)        e.amount   = 'Enter total amount'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    // Create new item if needed
    let finalItemId   = form.itemId
    let finalItemName = inventory.find(it => it.id === form.itemId)?.name || ''

    if (isNewItem) {
      const newItem = addInventoryItem({
        name:     form.newItemName.trim(),
        unit:     form.newItemUnit,
        quantity: 0,
        minStock: 5,
      })
      finalItemId   = newItem.id
      finalItemName = newItem.name
    }

    // Create new supplier if needed
    let finalSupplierId   = form.supplierId
    let finalSupplierName = suppliers.find(s => s.id === form.supplierId)?.name || ''
    let finalSupplierPhone = suppliers.find(s => s.id === form.supplierId)?.phone || ''

    if (isNewSupplier) {
      const newS = addSupplier({
        name:  form.newSupplierName.trim(),
        phone: form.newSupplierPhone.trim(),
      })
      finalSupplierId    = newS.id
      finalSupplierName  = newS.name
      finalSupplierPhone = newS.phone
    }

    // 🔥 NEW LOGIC (ADDED ONLY)
    const totalAmount = Number(form.amount)
    const amountPaid  = form.paymentType === 'Cash' ? totalAmount : 0
    const pendingAmount = totalAmount - amountPaid

    addLoad({
      itemId:        finalItemId,
      itemName:      finalItemName,
      quantity:      Number(form.quantity),
      supplierId:    finalSupplierId,
      supplierName:  finalSupplierName,
      supplierPhone: finalSupplierPhone,
      paymentType:   form.paymentType,
      amount:        totalAmount,

      // ✅ NEW FIELDS (ADDED)
      totalAmount,
      amountPaid,
      pendingAmount,
    })

    setToast('Load added ✓')
    setTimeout(() => navigate('/dashboard'), 1500)
  }

  const UNITS = ['kg', 'pieces', 'boxes', 'liters', 'packets']

  return (
    <div className="screen screen--no-nav">
      <TopBar title="Add Load" backPath="-1" />

      <div className="screen-content">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* ── Item ── */}
          <div className="form-group">
            <label className="form-label" htmlFor="al-item">Item</label>
            <select
              id="al-item"
              className="form-select"
              value={form.itemId}
              onChange={e => set('itemId', e.target.value)}
            >
              <option value="">-- Select Item --</option>
              {inventory.map(it => (
                <option key={it.id} value={it.id}>{it.name} ({it.unit})</option>
              ))}
              <option value="__new__">+ Create New Item</option>
            </select>
            {errors.itemId && <span style={{ color: 'var(--color-danger)', fontSize: '12px' }}>{errors.itemId}</span>}
          </div>

          {isNewItem && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-primary)' }}>New Item Details</p>
              <div className="form-group">
                <label className="form-label" htmlFor="al-new-item-name">Item Name</label>
                <input
                  id="al-new-item-name"
                  className="form-input"
                  type="text"
                  placeholder="e.g. Basmati Rice"
                  value={form.newItemName}
                  onChange={e => set('newItemName', e.target.value)}
                />
                {errors.newItemName && <span style={{ color: 'var(--color-danger)', fontSize: '12px' }}>{errors.newItemName}</span>}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="al-new-item-unit">Unit</label>
                <select
                  id="al-new-item-unit"
                  className="form-select"
                  value={form.newItemUnit}
                  onChange={e => set('newItemUnit', e.target.value)}
                >
                  {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* ── Quantity ── */}
          <div className="form-group">
            <label className="form-label" htmlFor="al-qty">Quantity</label>
            <input
              id="al-qty"
              className="form-input"
              type="number"
              inputMode="numeric"
              placeholder="0"
              min="1"
              value={form.quantity}
              onChange={e => set('quantity', e.target.value)}
            />
            {errors.quantity && <span style={{ color: 'var(--color-danger)', fontSize: '12px' }}>{errors.quantity}</span>}
          </div>

          {/* ── Supplier ── */}
          <div className="form-group">
            <label className="form-label" htmlFor="al-supplier">Supplier</label>
            <select
              id="al-supplier"
              className="form-select"
              value={form.supplierId}
              onChange={e => set('supplierId', e.target.value)}
            >
              <option value="">-- Select Supplier --</option>
              {suppliers.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
              <option value="__new__">+ Add New Supplier</option>
            </select>
            {errors.supplierId && <span style={{ color: 'var(--color-danger)', fontSize: '12px' }}>{errors.supplierId}</span>}
          </div>

          {isNewSupplier && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-primary)' }}>New Supplier Details</p>
              <div className="form-group">
                <label className="form-label">Supplier Name</label>
                <input className="form-input" value={form.newSupplierName} onChange={e => set('newSupplierName', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" value={form.newSupplierPhone} onChange={e => set('newSupplierPhone', e.target.value)} />
              </div>
            </div>
          )}

          {/* ── Payment Type ── */}
          <div className="form-group">
            <label className="form-label">Payment Type</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              {['Cash', 'Credit'].map(type => (
                <label key={type}>
                  <input
                    type="radio"
                    value={type}
                    checked={form.paymentType === type}
                    onChange={() => set('paymentType', type)}
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>

          {/* ── Amount ── */}
          <div className="form-group">
            <label className="form-label">Amount</label>
            <input
              className="form-input"
              type="number"
              value={form.amount}
              onChange={e => set('amount', e.target.value)}
            />
          </div>

          <button type="submit">Save</button>
        </form>
      </div>

      {toast && <Toast message={toast} onDone={() => setToast('')} />}
    </div>
  )
}