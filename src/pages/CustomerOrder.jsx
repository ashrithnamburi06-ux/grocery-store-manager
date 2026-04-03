import { useState } from 'react'
import { addOrder } from '../data/store'

export default function CustomerOrder() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [items, setItems] = useState('')
  const [time, setTime] = useState('')

  const handleSubmit = async () => {
    if (!name || !items) {
      alert("Please enter required details")
      return
    }

    const itemList = items.split('\n').map(i => ({
      name: i.trim(),
      qty: 1,
      unit: 'kg'
    }))

    const now = new Date() // 🔥 ADD THIS ABOVE

await addOrder({
  customerName: name,
  phone,
  items: itemList,
  arrivalTime: time,
  status: 'Pending',

  // ✅ ADD THIS LINE
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
        <h2>🛒 Place Your Order</h2>

        <input
          placeholder="👤 Customer Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <input
          placeholder="📞 Phone Number"
          value={phone}
          maxLength={10}
           pattern="[0-9]{10}"
          onChange={e => setPhone(e.target.value)}
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
<p style={{ fontSize: '12px', color: '#666' }}>
</p>

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