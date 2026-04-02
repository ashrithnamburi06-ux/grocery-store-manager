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
    if (!form.itemId) e.itemId = 'Select an item'
    if (isNewItem && !form.newItemName.trim()) e.newItemName = 'Item name required'
    if (!form.quantity || Number(form.quantity) <= 0) e.quantity = 'Enter a valid quantity'
    if (!form.supplierId) e.supplierId = 'Select a supplier'
    if (isNewSupplier && !form.newSupplierName.trim()) e.newSupplierName = 'Supplier name required'
    if (isNewSupplier && form.newSupplierPhone.length < 10) e.newSupplierPhone = 'Enter valid phone number'
    if (!form.amount || Number(form.amount) <= 0) e.amount = 'Enter total amount'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    let finalItemId   = form.itemId
    let finalItemName = inventory.find(it => it.id === form.itemId)?.name || ''

    if (isNewItem) {
      const newItem = addInventoryItem({
        name: form.newItemName.trim(),
        unit: form.newItemUnit,
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
        name: form.newSupplierName.trim(),
        phone: form.newSupplierPhone.trim(),
      })
      finalSupplierId    = newS.id
      finalSupplierName  = newS.name
      finalSupplierPhone = newS.phone
    }

    // ✅ NEW LOGIC ADDED
    const totalAmount   = Number(form.amount)
    const amountPaid    = form.paymentType === 'Cash' ? totalAmount : 0
    const pendingAmount = totalAmount - amountPaid

    addLoad({
      itemId: finalItemId,
      itemName: finalItemName,
      quantity: Number(form.quantity),
      supplierId: finalSupplierId,
      supplierName: finalSupplierName,
      supplierPhone: finalSupplierPhone,
      paymentType: form.paymentType,
      amount: totalAmount,

      // ✅ NEW FIELDS
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

          {/* ALL YOUR EXISTING UI (UNCHANGED) */}

          <button type="submit" className="btn btn--primary" style={{ marginTop: '8px' }}>
            Save Load Entry
          </button>

          <button type="button" className="btn btn--outline" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </form>
      </div>

      {toast && <Toast message={toast} onDone={() => setToast('')} />}
    </div>
  )
}