import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import TopBar from '../../components/TopBar'
import BottomNav from '../../components/BottomNav'
import { getLoads } from '../../data/store'

import {
  getUser,
  getLowStockItems,
  getInventory,
  getAllPendingBalances,
} from '../../data/store'

import { db } from '../../firebase'
import { collection, onSnapshot } from 'firebase/firestore'

export default function Dashboard() {
  const navigate  = useNavigate()
  const user      = getUser()
  const lowStock  = getLowStockItems()
  const allItems  = getInventory()
  const pending   = getAllPendingBalances()

  const [orderCount, setOrderCount] = useState(0)
  const [newOrders, setNewOrders] = useState(0)

  const totalOwed = pending.reduce((s, p) => s + p.remaining, 0)

  const loads = getLoads()
  const now = new Date()

  const monthlyLoads = loads.filter(load => {
    const date = new Date(load.createdAt || Date.now())
    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    )
  })

  const monthlyExpense = monthlyLoads.reduce(
    (sum, l) => sum + (l.amountPaid || 0),
    0
  )

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "orders"), (snapshot) => {
      setOrderCount(snapshot.docs.length)

      const added = snapshot.docChanges().filter(c => c.type === 'added')

      if (added.length > 0) {
        setNewOrders(prev => prev + added.length)

        const audio = new Audio('/notification.mp3')
        audio.play().catch(() => {})
      }
    })

    return () => unsubscribe()
  }, [])

  return (
    <div className="screen">
      <TopBar title={`Hi, ${user?.name?.split(' ')[0] || 'Owner'} 👋`} />

      <div className="screen-content">

        <div className="stat-grid">

          {/* Total Items */}
          <div className="stat-card stat-card--accent">
            <div className="stat-card__icon">📦</div>
            <div className="stat-card__value">{allItems.length}</div>
            <div className="stat-card__label">Total Items</div>
          </div>

          {/* Low Stock */}
          <div className="stat-card">
            <div className="stat-card__icon">⚠️</div>
            <div
              className="stat-card__value"
              style={{ color: lowStock.length > 0 ? 'var(--color-danger)' : 'var(--color-success)' }}
            >
              {lowStock.length}
            </div>
            <div className="stat-card__label">Low Stock</div>
          </div>

          {/* Monthly Expense */}
          <div 
            className="stat-card card--clickable"
            onClick={() => navigate('/monthly-transactions')}
          >
            <div className="stat-card__icon">💸</div>
            <div className="stat-card__value">
              ₹{monthlyExpense.toLocaleString()}
            </div>
            <div className="stat-card__label">This Month's Expenses</div>
          </div>

          {/* 🔥 Send Order (moved + smaller) */}
          <div 
            className="stat-card card--clickable"
            style={{ padding: '10px' }}
            onClick={handleShare}
          >
            <div className="stat-card__icon">📤</div>
            <div className="stat-card__value" style={{ fontSize: '14px' }}>
              Send Order
            </div>
            <div className="stat-card__label" style={{ fontSize: '11px' }}>
              Share Order Link
            </div>
          </div>

          {/* Pending Payments */}
          <div className="stat-card">
            <div className="stat-card__icon">🧾</div>
            <div
              className="stat-card__value"
              style={{ color: totalOwed > 0 ? 'var(--color-danger)' : 'var(--color-success)' }}
            >
              ₹{totalOwed.toLocaleString()}
            </div>
            <div className="stat-card__label">Pending Payments</div>
          </div>

          {/* 🔥 View Orders (moved below pending + badge) */}
          <div 
            className="stat-card card--clickable"
            onClick={() => {
              setNewOrders(0)
              navigate('/orders')
            }}
          >
            <div className="stat-card__icon" style={{ position: 'relative' }}>
              🛒
              {newOrders > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-10px',
                  background: 'red',
                  color: 'white',
                  fontSize: '10px',
                  padding: '2px 6px',
                  borderRadius: '50%',
                  fontWeight: 'bold'
                }}>
                  {newOrders}
                </span>
              )}
            </div>

            <div className="stat-card__value">
              View Orders
            </div>

            <div className="stat-card__label">
              Manage Customer Orders
            </div>
          </div>

        </div>

        {/* Quick Actions */}
        <div>
          <p className="section-title" style={{ marginBottom: '10px' }}>Quick Actions</p>
          <div className="quick-actions">
            <button
              id="dash-add-load"
              className="quick-action-btn"
              onClick={() => navigate('/load/add')}
            >
              <span className="quick-action-btn__icon">📥</span>
              <span className="quick-action-btn__label">Add Load</span>
            </button>
            <button
              id="dash-add-expense"
              className="quick-action-btn"
              onClick={() => navigate('/expenses/add')}
            >
              <span className="quick-action-btn__icon">💸</span>
              <span className="quick-action-btn__label">Add Expense</span>
            </button>
          </div>
        </div>

      </div>

      <BottomNav />
    </div>
  )
}

const handleShare = () => {
  const link = `${window.location.origin}/order`
  const message = `🛒 Please place your order here:\n${link}`
  window.open(`https://wa.me/?text=${encodeURIComponent(message)}`)
}