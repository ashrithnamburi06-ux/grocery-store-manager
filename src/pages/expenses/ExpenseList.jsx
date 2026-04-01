import { useNavigate } from 'react-router-dom'
import TopBar from '../../components/TopBar'
import BottomNav from '../../components/BottomNav'
import { getExpenses } from '../../data/store'

export default function ExpenseList() {
  const navigate  = useNavigate()
  const expenses  = getExpenses().sort((a, b) => new Date(b.date) - new Date(a.date))
  const total     = expenses.reduce((s, e) => s + Number(e.amount), 0)

  // Group by month
  const grouped = expenses.reduce((acc, exp) => {
    const month = exp.date.slice(0, 7)
    if (!acc[month]) acc[month] = []
    acc[month].push(exp)
    return acc
  }, {})

  const formatMonth = (key) => {
    const [y, m] = key.split('-')
    return new Date(y, m - 1).toLocaleString('default', { month: 'long', year: 'numeric' })
  }

  return (
    <div className="screen">
      <TopBar
        title="Expenses"
        action="+ Add"
        onAction={() => navigate('/expenses/add')}
      />

      <div className="screen-content">
        {expenses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">💸</div>
            <p className="empty-state__title">No expenses recorded</p>
            <button
              id="expense-add-first"
              className="btn btn--primary btn--sm"
              style={{ width: 'auto', marginTop: '8px' }}
              onClick={() => navigate('/expenses/add')}
            >
              Add First Expense
            </button>
          </div>
        ) : (
          <>
            {/* Total */}
            <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: 600 }}>ALL TIME TOTAL</p>
                <p style={{ fontSize: '22px', fontWeight: 800 }}>₹{total.toLocaleString()}</p>
              </div>
              <span style={{ fontSize: '32px' }}>💸</span>
            </div>

            {/* Grouped list */}
            {Object.entries(grouped).map(([month, items]) => {
              const monthTotal = items.reduce((s, e) => s + Number(e.amount), 0)
              return (
                <div key={month}>
                  <div className="section-header" style={{ marginBottom: '8px' }}>
                    <p className="section-title">{formatMonth(month)}</p>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-primary)' }}>
                      ₹{monthTotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="list-container">
                    {items.map(exp => (
                      <div key={exp.id} className="list-item" style={{ cursor: 'default' }}>
                        <div className="list-item__avatar">💸</div>
                        <div className="list-item__body">
                          <div className="list-item__title">{exp.note || 'Expense'}</div>
                          <div className="list-item__subtitle">{exp.date}</div>
                        </div>
                        <div className="list-item__right">
                          <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--color-danger)' }}>
                            ₹{Number(exp.amount).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
