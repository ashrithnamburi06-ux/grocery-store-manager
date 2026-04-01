import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../../components/TopBar'
import BottomNav from '../../components/BottomNav'
import { getSuppliers, getSupplierBalance } from '../../data/store'

export default function SupplierList() {
  const navigate  = useNavigate()
  const [search, setSearch] = useState('')

  const suppliers = getSuppliers().filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="screen">
      <TopBar
        title="Suppliers"
        action="+ Add"
        onAction={() => navigate('/suppliers/new')}
      />

      <div className="screen-content">
        {/* Search */}
        <div className="search-bar">
          <span className="search-bar__icon">🔍</span>
          <input
            id="supplier-search"
            className="form-input"
            type="search"
            placeholder="Search suppliers…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {suppliers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">🤝</div>
            <p className="empty-state__title">No suppliers yet</p>
            <p className="empty-state__text">Suppliers are added when you record a load entry.</p>
          </div>
        ) : (
          <div className="list-container">
            {suppliers.map(s => {
              const { remaining } = getSupplierBalance(s.id)
              return (
                <div
                  key={s.id}
                  id={`supplier-${s.id}`}
                  className="list-item"
                  onClick={() => navigate(`/suppliers/${s.id}`)}
                >
                  <div className="list-item__avatar">🤝</div>
                  <div className="list-item__body">
                    <div className="list-item__title">{s.name}</div>
                    <div className="list-item__subtitle">📞 {s.phone}</div>
                  </div>
                  <div className="list-item__right">
                    {remaining > 0 && (
                      <span className="badge badge--danger">₹{remaining.toLocaleString()}</span>
                    )}
                    {remaining === 0 && (
                      <span className="badge badge--success">Clear</span>
                    )}
                    <span className="list-item__chevron">›</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
