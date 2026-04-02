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
    amountPaid:    '',
    date:          '',
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

  const totalAmount   = Number(form.amount) || 0
  const amountPaid    = Number(form.amountPaid) || 0
  const pendingAmount = totalAmount - amountPaid

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

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

    addLoad({
      itemId:        finalItemId,
      itemName:      finalItemName,
      quantity:      Number(form.quantity),
      supplierId:    finalSupplierId,
      supplierName:  finalSupplierName,
      supplierPhone: finalSupplierPhone,
      paymentType:   pendingAmount > 0 ? 'Credit' : 'Cash',
      amount:        totalAmount,
      amountPaid:    amountPaid,
      pendingAmount: pendingAmount,
      date:          form.date,
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

          <div className="form-group">
            <label className="form-label">Item</label>
            <select className="form-select" value={form.itemId} onChange={e => set('itemId', e.target.value)}>
              <option value="">-- Select Item --</option>
              {inventory.map(it => (
                <option key={it.id} value={it.id}>{it.name} ({it.unit})</option>
              ))}
              <option value="__new__">+ Create New Item</option>
            </select>
          </div>

          {isNewItem && (
            <div className="card">
              <input className="form-input" placeholder="Item Name" value={form.newItemName} onChange={e => set('newItemName', e.target.value)} />
              <select className="form-select" value={form.newItemUnit} onChange={e => set('newItemUnit', e.target.value)}>
                {UNITS.map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Quantity</label>
            <input className="form-input" type="number" value={form.quantity} onChange={e => set('quantity', e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Supplier</label>
            <select className="form-select" value={form.supplierId} onChange={e => set('supplierId', e.target.value)}>
              <option value="">-- Select Supplier --</option>
              {suppliers.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
              <option value="__new__">+ Add New Supplier</option>
            </select>
          </div>

          {isNewSupplier && (
            <div className="card">
              <input className="form-input" placeholder="Supplier Name" value={form.newSupplierName} onChange={e => set('newSupplierName', e.target.value)} />
              <input className="form-input" placeholder="Phone" value={form.newSupplierPhone} onChange={e => set('newSupplierPhone', e.target.value)} />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Payment Type</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              {['Cash', 'Credit'].map(type => (
                <button type="button" key={type} onClick={() => set('paymentType', type)}>
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Total Amount (₹)</label>
            <input className="form-input" type="number" value={form.amount} onChange={e => set('amount', e.target.value)} />
          </div>

          {/* NEW BLOCKS */}
          <div className="form-group">
            <label className="form-label">Amount Paid (₹)</label>
            <input className="form-input" type="number" value={form.amountPaid} onChange={e => set('amountPaid', e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Pending Amount (₹)</label>
            <input className="form-input" type="number" value={pendingAmount} readOnly />
          </div>

          <div className="form-group">
            <label className="form-label">Date</label>
            <input className="form-input" type="date" value={form.date} onChange={e => set('date', e.target.value)} />
          </div>

          <button type="submit" className="btn btn--primary">Save Load Entry</button>
        </form>
      </div>

      {toast && <Toast message={toast} onDone={() => setToast('')} />}
    </div>
  )
}