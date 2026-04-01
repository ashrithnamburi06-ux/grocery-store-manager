import { useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'

export default function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [addOpen, setAddOpen] = useState(false)

  const tabs = [
    { id: 'dashboard', label: 'Home',      icon: '🏠', path: '/dashboard' },
    { id: 'inventory', label: 'Inventory', icon: '📦', path: '/inventory' },
    { id: 'suppliers', label: 'Suppliers', icon: '🤝', path: '/suppliers' },
    { id: 'profile',   label: 'Profile',   icon: '👤', path: '/profile'   },
  ]

  const isActive = (path) => pathname.startsWith(path)

  return (
    <>
      {addOpen && (
        <div className="add-menu-overlay" onClick={() => setAddOpen(false)}>
          <div className="add-menu" onClick={e => e.stopPropagation()}>
            <p className="add-menu__title">Quick Add</p>
            <button
              id="quick-add-load"
              className="btn btn--primary"
              onClick={() => { setAddOpen(false); navigate('/load/add') }}
            >
              📥 Add Load
            </button>
            <button
              id="quick-add-expense"
              className="btn btn--outline"
              onClick={() => { setAddOpen(false); navigate('/expenses/add') }}
            >
              💸 Add Expense
            </button>
            <button
              id="quick-add-item"
              className="btn btn--ghost"
              onClick={() => { setAddOpen(false); navigate('/inventory/add') }}
            >
              ➕ Add Inventory Item
            </button>
          </div>
        </div>
      )}

      <nav className="bottom-nav" role="navigation" aria-label="Main navigation">
        {/* Dashboard */}
        <button
          id="nav-dashboard"
          className={`bottom-nav__item ${isActive('/dashboard') ? 'active' : ''}`}
          onClick={() => navigate('/dashboard')}
          aria-label="Dashboard"
        >
          <span className="bottom-nav__icon">{tabs[0].icon}</span>
          <span>{tabs[0].label}</span>
        </button>

        {/* Inventory */}
        <button
          id="nav-inventory"
          className={`bottom-nav__item ${isActive('/inventory') ? 'active' : ''}`}
          onClick={() => navigate('/inventory')}
          aria-label="Inventory"
        >
          <span className="bottom-nav__icon">{tabs[1].icon}</span>
          <span>{tabs[1].label}</span>
        </button>

        {/* Add FAB */}
        <button
          id="nav-add"
          className="bottom-nav__item bottom-nav__item--add"
          onClick={() => setAddOpen(true)}
          aria-label="Quick add"
        >
          <div className="bottom-nav__add-btn">➕</div>
          <span>Add</span>
        </button>

        {/* Suppliers */}
        <button
          id="nav-suppliers"
          className={`bottom-nav__item ${isActive('/suppliers') ? 'active' : ''}`}
          onClick={() => navigate('/suppliers')}
          aria-label="Suppliers"
        >
          <span className="bottom-nav__icon">{tabs[2].icon}</span>
          <span>{tabs[2].label}</span>
        </button>

        {/* Profile */}
        <button
          id="nav-profile"
          className={`bottom-nav__item ${isActive('/profile') ? 'active' : ''}`}
          onClick={() => navigate('/profile')}
          aria-label="Profile"
        >
          <span className="bottom-nav__icon">{tabs[3].icon}</span>
          <span>{tabs[3].label}</span>
        </button>
      </nav>
    </>
  )
}
