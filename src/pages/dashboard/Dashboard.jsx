import { useNavigate } from 'react-router-dom'
import TopBar from '../../components/TopBar'
import BottomNav from '../../components/BottomNav'
import { getLoads } from '../../data/store'
import {
  getUser,
  getLowStockItems,
  getInventory,
  getAllPendingBalances,
} from '../../data/store'

export default function Dashboard() {
  const navigate  = useNavigate()
  const user      = getUser()
  const lowStock  = getLowStockItems()
  const allItems  = getInventory()
  const pending   = getAllPendingBalances()

  const totalOwed = pending.reduce((s, p) => s + p.remaining, 0)

  const loads = getLoads()
  const now = new Date()

  // 🔥 FILTER CURRENT MONTH
  const monthlyLoads = loads.filter(load => {
    const date = new Date(load.createdAt || Date.now())

    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    )
  })

  // 🔥 ONLY PAID AMOUNT = EXPENSE
  const monthlyExpense = monthlyLoads.reduce(
    (sum, l) => sum + (l.amountPaid || 0),
    0
  )

  return (
    <div className="screen">
      <TopBar title={`Hi, ${user?.name?.split(' ')[0] || 'Owner'} 👋`} />

      <div className="screen-content">

        {/* ── Stats grid ── */}
        <div className="stat-grid">
          <div className="stat-card stat-card--accent">
            <div className="stat-card__icon">📦</div>
            <div className="stat-card__value">{allItems.length}</div>
            <div className="stat-card__label">Total Items</div>
          </div>

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

          {/* ✅ FIXED HERE */}
          <div className="stat-card">
            <div className="stat-card__icon">💸</div>
            <div className="stat-card__value">
              ₹{monthlyExpense.toLocaleString()}
            </div>
            <div className="stat-card__label">This Month's Expenses</div>
          </div>

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
        </div>

        {/* ── Quick Actions ── */}
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

        {/* ── Low Stock Alerts ── */}
        {lowStock.length > 0 && (
          <div>
            <div className="section-header">
              <p className="section-title">Low Stock Alerts</p>
              <button
                className="section-link"
                onClick={() => navigate('/inventory')}
              >
                View All
              </button>
            </div>
            <div className="alert-card">
              <div className="alert-card__title">🚨 Needs Restocking</div>
              {lowStock.map(item => (
                <div key={item.id} className="alert-item">
                  <span className="alert-item__name">{item.name}</span>
                  <span className="alert-item__qty">
                    {item.quantity} {item.unit} left (min {item.minStock})
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Pending Supplier Payments ── */}
        {pending.length > 0 && (
          <div>
            <div className="section-header">
              <p className="section-title">Pending Payments</p>
              <button
                className="section-link"
                onClick={() => navigate('/suppliers')}
              >
                Manage
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {pending.map(s => (
                <div
                  key={s.id}
                  className="pending-card card--clickable"
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/suppliers/${s.id}`)}
                >
                  <div>
                    <div className="pending-card__label">You owe</div>
                    <div className="pending-card__name">{s.name}</div>
                  </div>
                  <div className="pending-card__amount">
                    ₹{s.remaining.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All clear state */}
        {lowStock.length === 0 && pending.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: '24px' }}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>✅</div>
            <p style={{ fontWeight: 700 }}>All Good!</p>
            <p className="text-muted" style={{ fontSize: '13px', marginTop: '4px' }}>
              No low stock or pending payments.
            </p>
          </div>
        )}
        
      </div>

      <BottomNav />
    </div>
  )
}