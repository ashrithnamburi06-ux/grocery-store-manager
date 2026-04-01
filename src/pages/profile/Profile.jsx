import { useNavigate } from 'react-router-dom'
import TopBar from '../../components/TopBar'
import BottomNav from '../../components/BottomNav'
import { getUser, logoutUser, getInventory, getExpenses, getAllPendingBalances } from '../../data/store'

export default function Profile() {
  const navigate = useNavigate()
  const user = getUser()

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logoutUser()
      navigate('/login', { replace: true })
    }
  }

  const menuItems = [
    { id: 'profile-inventory', icon: '📦', label: 'Inventory', sub: `${getInventory().length} items`, path: '/inventory' },
    { id: 'profile-suppliers', icon: '🤝', label: 'Suppliers', sub: `${getAllPendingBalances().length} pending`, path: '/suppliers' },
    { id: 'profile-expenses',  icon: '💸', label: 'Expenses',  sub: `${getExpenses().length} records`,  path: '/expenses'   },
  ]

  return (
    <div className="screen">
      <TopBar title="Profile" />

      {/* Header */}
      <div className="profile-header">
        <div className="profile-avatar">👤</div>
        <p className="profile-name">{user?.name || 'Shop Owner'}</p>
        <p className="profile-phone">📞 {user?.phone || '—'}</p>
      </div>

      <div className="screen-content" style={{ paddingTop: '0' }}>
        {/* Menu items */}
        <div className="list-container" style={{ marginTop: '16px' }}>
          {menuItems.map(item => (
            <button
              key={item.id}
              id={item.id}
              className="profile-menu-item"
              onClick={() => navigate(item.path)}
            >
              <div className="profile-menu-item__icon">{item.icon}</div>
              <span className="profile-menu-item__label">{item.label}</span>
              <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{item.sub}</span>
              <span style={{ color: 'var(--color-text-muted)', marginLeft: '4px' }}>›</span>
            </button>
          ))}
        </div>

        {/* App info */}
        <div className="card" style={{ textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '13px' }}>
          <p style={{ fontWeight: 600 }}>Grocery Store Manager</p>
          <p style={{ marginTop: '4px' }}>v1.0.0 · Built for shop owners</p>
        </div>

        {/* Logout */}
        <button
          id="profile-logout"
          className="btn btn--danger"
          onClick={handleLogout}
        >
          🚪 Log Out
        </button>
      </div>

      <BottomNav />
    </div>
  )
}
