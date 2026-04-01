import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../../components/TopBar'
import BottomNav from '../../components/BottomNav'
import { getInventory } from '../../data/store'

export default function InventoryList() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  // Ensure inventory is always an array
  const allItems = getInventory() || []

  // Safe filtering (handles undefined values)
  const filtered = allItems.filter(item =>
    item?.name?.toLowerCase().includes(search.toLowerCase())
  )

  // Low stock check (safe number conversion)
  const isLow = (item) =>
    Number(item?.quantity || 0) <= Number(item?.minStock || 0)

  return (
    <div className="screen">
      <TopBar
        title="Inventory"
        action="+ Add"
        onAction={() => navigate('/inventory/add')}
      />

      <div className="screen-content">

        {/* Search */}
        <div className="search-bar">
          <span className="search-bar__icon">🔍</span>
          <input
            id="inventory-search"
            className="form-input"
            type="search"
            placeholder="Search items…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Summary */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <div className="badge badge--info">
            {allItems.length} Total
          </div>
          <div className="badge badge--danger">
            {allItems.filter(isLow).length} Low Stock
          </div>
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">📦</div>
            <p className="empty-state__title">No items found</p>
            <p className="empty-state__text">
              {search
                ? 'Try a different search.'
                : 'Add your first inventory item.'}
            </p>

            {!search && (
              <button
                id="inventory-add-first"
                className="btn btn--primary btn--sm"
                style={{ width: 'auto', marginTop: '8px' }}
                onClick={() => navigate('/inventory/add')}
              >
                Add Item
              </button>
            )}
          </div>
        ) : (
          <div className="list-container">
            {filtered.map((item) => (
              <div
                key={item?.id}
                id={`inventory-item-${item?.id}`}
                className="list-item"
                onClick={() => navigate(`/inventory/edit/${item?.id}`)}
              >
                <div className="list-item__avatar">📦</div>

                <div className="list-item__body">
                  <div className="list-item__title">
                    {item?.name || 'Unnamed Item'}
                  </div>
                  <div className="list-item__subtitle">
                    {item?.quantity || 0} {item?.unit || ''} · Min:{' '}
                    {item?.minStock || 0}
                  </div>
                </div>

                <div className="list-item__right">
                  <span
                    className={`badge ${
                      isLow(item) ? 'badge--danger' : 'badge--success'
                    }`}
                  >
                    {isLow(item) ? 'Low' : 'Good'}
                  </span>
                  <span className="list-item__chevron">›</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}