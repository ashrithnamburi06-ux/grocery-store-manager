import { useNavigate, useParams } from 'react-router-dom'
import TopBar from '../../components/TopBar'

import {
  getSupplierById,
  getSupplierBalance,
  getLoads,
  getPayments,
  updateSupplier
} from '../../data/store'
import { useState } from 'react'

export default function SupplierDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const supplier = getSupplierById(id)

  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(supplier?.name || '')
  const [phone, setPhone] = useState(supplier?.phone || '')
  const [products, setProducts] = useState(supplier?.products || [])
  const [newProduct, setNewProduct] = useState('')

  if (!supplier) {
    return (
      <div className="screen screen--no-nav">
        <TopBar title="Supplier" backPath="/suppliers" />
        <div className="empty-state">
          <p className="empty-state__title">Supplier not found</p>
        </div>
      </div>
    )
  }

  const { totalCredit, totalPaid, remaining } = getSupplierBalance(id)

  const creditLoads = getLoads().filter(
    l => l.supplierId === id && l.paymentType === 'Credit'
  )

  const paymentsMade = getPayments().filter(
    p => p.supplierId === id
  )

  const history = [
    ...creditLoads.map(l => ({ ...l, _type: 'credit' })),
    ...paymentsMade.map(p => ({ ...p, _type: 'payment' })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date))

  const handleSave = () => {
    updateSupplier(id, {
      name,
      phone,
      products
    })
    setIsEditing(false)
  }

  return (
    <div className="screen screen--no-nav">
      <TopBar
        title={isEditing ? (
          <input value={name} onChange={e => setName(e.target.value)} />
        ) : supplier.name}
        backPath="/suppliers"
        action={isEditing ? "Save" : "Edit"}
        onAction={() => isEditing ? handleSave() : setIsEditing(true)}
      />

      <div className="screen-content">

        {/* Contact */}
        <div className="card">
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
            CONTACT
          </p>

          {isEditing ? (
            <input
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="form-input"
            />
          ) : (
            <a href={`tel:${supplier.phone}`} className="phone-link">
              📞 {supplier.phone}
            </a>
          )}
        </div>

        {/* Products */}
        <div className="card">
          <p style={{ fontSize: '13px', fontWeight: 600 }}>Products</p>

          {products.length === 0 && <p style={{ fontSize: '12px' }}>No products added</p>}

          {products.map((p, i) => (
            <div key={i}>• {p}</div>
          ))}

          {isEditing && (
            <>
              <input
                className="form-input"
                placeholder="Add product"
                value={newProduct}
                onChange={e => setNewProduct(e.target.value)}
              />

              <button
                className="btn btn--outline"
                style={{ marginTop: '8px' }}
                onClick={() => {
                  if (!newProduct.trim()) return
                  setProducts([...products, newProduct])
                  setNewProduct('')
                }}
              >
                Add Product
              </button>
            </>
          )}
        </div>

        {/* Balance */}
        <div className="card">
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
            ACCOUNT BALANCE
          </p>

          <div className="balance-row">
            <span>Total Credit</span>
            <span>₹{totalCredit.toLocaleString()}</span>
          </div>

          <div className="balance-row">
            <span>Total Paid</span>
            <span>₹{totalPaid.toLocaleString()}</span>
          </div>

          <div className="balance-row">
            <span>Remaining</span>
            <span>₹{remaining.toLocaleString()}</span>
          </div>

          {remaining > 0 && (
            <button
              className="btn btn--primary btn--sm"
              onClick={() => navigate(`/suppliers/${id}/add-payment`)}
            >
              Record Payment
            </button>
          )}
        </div>

        {/* Capture Bill */}
        <button
          className="btn btn--outline btn--sm"
          style={{ marginTop: '10px' }}
          onClick={() => navigate(`/suppliers/${id}/add-bill`)}
        >
          📸 Capture Bill
        </button>

        {/* Transaction History */}
        {history.length > 0 && (
          <div>
            <p className="section-title">Transaction History</p>

            {history.map(item => (
              <div
                key={item.id}
                className="txn-item"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >

                {/* LEFT */}
                <div>
                  <div>
                    {item._type === 'credit'
                      ? `📥 Load — ${item.itemName}`
                      : '💳 Payment'}
                  </div>

                  {item._type === 'payment' && item.date && (
                    <div style={{ fontSize: '12px', color: 'gray' }}>
                      {new Date(item.date).toLocaleDateString()}
                    </div>
                  )}
                </div>

                {/* RIGHT */}
                <div style={{ textAlign: 'right' }}>
                  <div>
                    {item._type === 'credit' ? '-' : '+'}₹{item.amount}
                  </div>

                  {/* ✅ IMAGE */}
                  {item._type === 'payment' && item.billImage && (
                    <img
                      src={item.billImage}
                      alt="bill"
                      style={{
                        width: '80px',
                        height: '80px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        marginTop: '5px'
                      }}
                    />
                  )}
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}