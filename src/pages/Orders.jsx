import { useEffect, useState } from 'react'
import { db } from '../firebase'
import { collection, onSnapshot } from 'firebase/firestore'
import { completeOrderAndNotify } from '../data/store'

export default function Orders() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "orders"), (snapshot) => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      setOrders(list)

      // 🔔 Notification
      if (snapshot.docChanges().some(change => change.type === 'added')) {
        alert("🔔 New Order Received!")
      }
    })

    return () => unsubscribe()
  }, [])

  return (
    <div style={{ padding: '20px' }}>
      <h2>Customer Orders</h2>

      {orders.map(order => (
        <div key={order.id} style={{ border: '1px solid #ccc', marginBottom: '10px', padding: '10px' }}>
          <b>{order.customerName}</b>
          <p>{order.phone}</p>
          <p>{order.items.map(i => i.name).join(', ')}</p>
          <p>Arrival: {order.arrivalTime}</p>
          <p>Status: {order.status === "Completed" && <span>✅ Done</span>}</p>
         <button onClick={() => completeOrderAndNotify(order)}>
  ✅ Complete & Notify
</button>
        </div>
        
      ))}
    </div>
    
  )
}
