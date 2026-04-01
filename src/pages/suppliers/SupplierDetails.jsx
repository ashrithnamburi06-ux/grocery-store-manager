import { useNavigate, useParams } from 'react-router-dom'
import TopBar from '../../components/TopBar'
import { getSupplierById, getSupplierBalance, getLoads, getPayments } from '../../data/store'

export default function SupplierDetails() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const supplier = getSupplierById(id)

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

  const creditLoads = getLoads().filter(l => l.supplierId === id && l.paymentType === 'Credit')
  const paymentsMade = getPayments().filter(p => p.supplierId === id)

  // Combined transaction history, sorted desc
  const history = [
    ...creditLoads.map(l => ({ ...l, _type: 'credit' })),
    ...paymentsMade.map(p => ({ ...p, _type: 'payment' })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <div className="screen screen--no-nav">
      <TopBar
        title={supplier.name}
        backPath="/suppliers"
        action="Pay"
        onAction={() => navigate(`/suppliers/${id}/add-payment`)}
      />

      <div className="screen-content">
        {/* Contact */}
        <div className="card">
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', fontWeight: 600, marginBottom: '6px' }}>
            CONTACT
          </p>
          <a
            id="supplier-call"
            href={`tel:${supplier.phone}`}
            className="phone-link"
            style={{ fontSize: '17px' }}
          >
            📞 {supplier.phone}
          </a>
        </div>

        {/* Balance summary */}
        <div className="card">
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', fontWeight: 600, marginBottom: '4px' }}>
            ACCOUNT BALANCE
          </p>

          <div className="balance-row">
            <span className="balance-row__label">Total Credit (Loads)</span>
            <span className="balance-row__value balance-row__value--danger">
              ₹{totalCredit.toLocaleString()}
            </span>
          </div>
          <div className="balance-row">
            <span className="balance-row__label">Total Paid</span>
            <span className="balance-row__value balance-row__value--success">
              ₹{totalPaid.toLocaleString()}
            </span>
          </div>
          <div className="balance-row" style={{ borderBottom: 'none', marginTop: '4px' }}>
            <span style={{ fontWeight: 700, fontSize: '15px' }}>Remaining Balance</span>
            <span
              className={`balance-row__value ${remaining > 0 ? 'balance-row__value--danger' : 'balance-row__value--success'}`}
              style={{ fontSize: '20px' }}
            >
              ₹{remaining.toLocaleString()}
            </span>
          </div>

          {remaining > 0 && (
            <button
              id="sd-pay-btn"
              className="btn btn--primary btn--sm"
              style={{ marginTop: '12px' }}
              onClick={() => navigate(`/suppliers/${id}/add-payment`)}
            >
              Record Payment
            </button>
          )}
        </div>

        {/* Transaction history */}
        {history.length > 0 && (
          <div>
            <p className="section-title" style={{ marginBottom: '8px' }}>Transaction History</p>
            <div className="list-container txn-list">
              {history.map(item => (
                <div key={item.id} className="txn-item">
                  <div>
                    <div className="txn-item__type">
                      {item._type === 'credit' ? `📥 Load — ${item.itemName}` : '💳 Payment'}
                    </div>
                    <div className="txn-item__date">{item.date}</div>
                  </div>
                  <div className={`txn-item__amount ${item._type === 'credit' ? 'txn-item__amount--credit' : 'txn-item__amount--payment'}`}>
                    {item._type === 'credit' ? '−' : '+'}₹{Number(item.amount).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {history.length === 0 && (
          <div className="empty-state">
            <p className="empty-state__title">No transactions yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
