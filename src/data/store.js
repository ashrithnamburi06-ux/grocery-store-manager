/**
 * store.js — Mock data layer with localStorage persistence
 */

// ─── Helpers ────────────────────────────────────────────────────────────────
import { db } from '../firebase'
import { collection, addDoc } from 'firebase/firestore'

import { doc, updateDoc } from 'firebase/firestore'

export const completeOrderAndNotify = async (order) => {
  const ref = doc(db, "orders", order.id)

  // ✅ update status
  await updateDoc(ref, {
    status: "Completed"
  })

  // 📲 WhatsApp message
  const message = `🛒 Hello ${order.customerName},\n\n✅ Your order is ready for pickup.\nPlease come and collect it.\n\nThank you 🙏`

  // ⚠️ ensure phone format (India)
  const phone = order.phone.startsWith('91') ? order.phone : `91${order.phone}`

  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`)
}

const uid = () => Math.random().toString(36).slice(2, 9)

const read = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

const write = (key, value) => localStorage.setItem(key, JSON.stringify(value))

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const getUser = () => read('currentUser', null)



export const loginUser = (phone, name, id) => {
  const user = {
    phone,
    name: name || 'Shop Owner',
    id: id || Date.now().toString() // 🔥 IMPORTANT FIX
  }

  write('currentUser', user)
  return user
}

export const logoutUser = () => localStorage.removeItem('currentUser')



// ─── Suppliers ────────────────────────────────────────────────────────────────

export const getSuppliers = () => read('suppliers', [])

export const addSupplier = (data) => {
  const suppliers = getSuppliers()
  const newSupplier = { id: uid(), ...data }
  write('suppliers', [...suppliers, newSupplier])
  return newSupplier
}

export const getSupplierById = (id) =>
  getSuppliers().find(s => s.id === id) || null

// ─── Inventory ────────────────────────────────────────────────────────────────

export const getInventory = () => read('inventory', [])

export const addInventoryItem = (data) => {
  const items = getInventory()
  const newItem = { id: uid(), ...data }
  write('inventory', [...items, newItem])
  return newItem
}

export const updateInventoryItem = (id, updates) => {
  const items = getInventory().map(it =>
    it.id === id ? { ...it, ...updates } : it
  )
  write('inventory', items)
}

export const deleteInventoryItem = (id) => {
  write('inventory', getInventory().filter(it => it.id !== id))
}

export const getLowStockItems = () =>
  getInventory().filter(
    it => Number(it.quantity) <= Number(it.minStock)
  )

// ─── Loads ────────────────────────────────────────────────────────────────────

export const addLoad = (data) => {
  const loads = getLoads()

  const totalAmount = Number(data.amount) || 0

  const amountPaid =
    data.paymentType === 'Cash'
      ? totalAmount
      : Number(data.amountPaid) || 0

  const pendingAmount = Math.max(totalAmount - amountPaid, 0)

  const newLoad = {
    id: uid(),
    date: new Date().toISOString().slice(0, 10),

    ...data,

    totalAmount,
    amountPaid,
    pendingAmount
  }

  write('loads', [...loads, newLoad])

  // inventory update (keep same)
  const inventory = getInventory()
  const idx = inventory.findIndex(it => it.id === data.itemId)

  if (idx !== -1) {
    inventory[idx].quantity =
      Number(inventory[idx].quantity) + Number(data.quantity)
    write('inventory', inventory)
  }

  return newLoad
}

// ─── Payments (🔥 FIX ADDED) ─────────────────────────────────────────────────

// ─── Payments (FINAL FIX) ─────────────────────────────────────────────────

export const getPayments = () => read('payments', [])
export const addPayment = (data) => {
  const payments = getPayments()

  const newPayment = {
    id: uid(),
    supplierId: data.supplierId,

    amount: Number(data.amount) || 0,

    note: data.note || '',
    date: data.date || new Date().toISOString().slice(0, 10),

    createdAt: new Date().toISOString()
  }

  write('payments', [...payments, newPayment])
  return newPayment
}

// ─── Bills ────────────────────────────────────────────────────────────────

export const getBills = () => read('bills', [])

export const addBill = (data) => {
  const bills = getBills()

  const newBill = {
    id: uid(),
    date: new Date().toISOString().slice(0, 10),
    createdAt: new Date().toISOString(),
    ...data,
  }

  write('bills', [...bills, newBill])
  return newBill
}

// ─── Supplier Balance Helpers ─────────────────────────────────────────────────

export const getSupplierBalance = (supplierId) => {
  const loads = getLoads().filter(
    l => l.supplierId === supplierId && Number(l.pendingAmount || 0) > 0
  )

  const payments = getPayments().filter(
    p => p.supplierId === supplierId
  )

  const totalCredit = loads.reduce(
    (s, l) => s + Number(l.pendingAmount || 0),
    0
  )

  const totalPaid = payments.reduce(
    (s, p) => s + Number(p.amount),
    0
  )

  return {
    totalCredit,
    totalPaid,
    remaining: Math.max(totalCredit - totalPaid, 0),
  }
}

export const getAllPendingBalances = () =>
  getSuppliers()
    .map(s => ({ ...s, ...getSupplierBalance(s.id) }))
    .filter(s => s.remaining > 0)

// ─── Expenses ─────────────────────────────────────────────────────────────────

export const getExpenses = () => read('expenses', [])

export const addExpense = (data) => {
  const expenses = getExpenses()
  const newExpense = {
    id: uid(),
    date: new Date().toISOString().slice(0, 10),
    ...data,
  }

  write('expenses', [...expenses, newExpense])
  return newExpense
}

export const getMonthlyExpenses = () => {
  const now = new Date()
  const month = now.toISOString().slice(0, 7)

  return getExpenses()
    .filter(e => e.date.startsWith(month))
    .reduce((s, e) => s + Number(e.amount), 0)
}

export const updateSupplier = (id, updatedData) => {
  const suppliers = JSON.parse(localStorage.getItem('suppliers') || '[]')

  const updated = suppliers.map(s =>
    s.id === id ? { ...s, ...updatedData } : s
  )

  localStorage.setItem('suppliers', JSON.stringify(updated))
}
export const addOrder = async (data) => {
  try {
    const docRef = await addDoc(collection(db, "orders"), {
      ...data,
      createdAt: new Date().toISOString() // 🔥 FINAL FIX
    })

    return docRef
  } catch (err) {
    console.error("Firestore Error ❌:", err)
    throw err
  }
}
export const setShopName = (name) => {
  localStorage.setItem('shopName', name)
}

export const getShopName = () => {
  return localStorage.getItem('shopName') || ''
}