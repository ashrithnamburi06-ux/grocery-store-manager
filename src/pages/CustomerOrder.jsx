import { useState } from 'react'
import { addOrder } from '../data/store'

export default function CustomerOrder() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [items, setItems] = useState('')
  const [time, setTime] = useState('')

  // 🔥 GET DATA FROM URL (FIX)
  const params = new URLSearchParams(window.location.search)
  const ownerId = params.get('ownerId')
  const shopName = params.get('shop') || "Our Store"

  const handleSubmit = async () => {
    if (!name || !items) {
      alert("Please enter required details")
      return
    }

    // 🚨 PREVENT INVALID LINK
    if (!ownerId) {
      alert("Invalid order link ❌")
      return
    }

    const itemList = items.split('\n').map(i => ({
      name: i.trim(),
      qty: 1,
      unit: 'kg'
    }))

    const now = new Date()

    await addOrder({
      customerName: name,
      phone,
      items: itemList,
      arrivalTime: time,
      status: 'Pending',
      ownerId: ownerId,
      createdAt: now.toISOString()
    })

    alert("Order placed successfully ✅")

    setName('')
    setPhone('')
    setItems('')
    setTime('')
  }

  return (
    <div className="order-page">
      <div className="order-card">

        {/* 🔥 FIXED HEADER */}
        <h2>🛒 Welcome to {shopName}</h2>

        <input
          placeholder="👤 Customer Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <input
          placeholder="📞 Phone Number"
          value={phone}
          maxLength={10}
          onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
        />

        <textarea
          placeholder={`📝 Add items like:
Rice 2kg
Oil 1L
Sugar 1kg`}
          value={items}
          onChange={e => setItems(e.target.value)}
        />

        <label>⏰ Pickup Time</label>

        <input
          type="time"
          value={time}
          onChange={e => setTime(e.target.value)}
        />

        <button onClick={handleSubmit}>
          ✅ Place Order
        </button>

      </div>
    </div>
  )
}