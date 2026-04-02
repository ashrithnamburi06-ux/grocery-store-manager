import { useEffect, useState } from 'react'
import TopBar from '../components/TopBar'
import { getLoads, getPayments, getExpenses } from '../data/store'

export default function MonthlyTransactions() {
  const [data, setData] = useState([])
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7))

  useEffect(() => {
    const loads = getLoads().map(l => ({ ...l, type: 'Load' }))
    const payments = getPayments().map(p => ({ ...p, type: 'Payment' }))
    const expenses = getExpenses().map(e => ({ ...e, type: 'Expense' }))

    const all = [...loads, ...payments, ...expenses]

    const filtered = all.filter(item => {
      if (!item.date) return false
      return item.date.slice(0, 7) === month
    })

    const sorted = filtered.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    )

    setData(sorted)
  }, [month])

  // 💰 CALCULATIONS
  const totalIncome = data
    .filter(d => d.type === 'Payment')
    .reduce((sum, d) => sum + Number(d.amount), 0)

  const totalExpense = data
    .filter(d => d.type === 'Load' || d.type === 'Expense')
    .reduce((sum, d) => sum + Number(d.amount), 0)

  const profit = totalIncome - totalExpense

  return (
    <div className="screen screen--no-nav">
      <TopBar title="Monthly Transactions" backPath="/dashboard" />

      <div className="screen-content">

        {/* 📅 Month Selector */}
        <div className="card">
          <label>Select Month</label>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
        </div>

        {/* 📊 Summary */}
        <div className="card">
          <div>💰 Income: ₹{totalIncome.toLocaleString()}</div>
          <div>💸 Expense: ₹{totalExpense.toLocaleString()}</div>
          <div style={{ color: profit >= 0 ? 'green' : 'red' }}>
            📊 {profit >= 0 ? 'Profit' : 'Loss'}: ₹{Math.abs(profit).toLocaleString()}
          </div>
        </div>

        {/* 📋 Transactions */}
        {data.length === 0 && (
          <p style={{ textAlign: 'center' }}>
            No transactions for this month
          </p>
        )}

        {data.map(item => (
          <div key={item.id} className="txn-item">

            <div>
              {item.type === 'Load' && `📥 Load — ${item.itemName}`}
              {item.type === 'Payment' && '💳 Payment'}
              {item.type === 'Expense' && `💸 Expense — ${item.category}`}
            </div>

            <div>
              {item.type === 'Payment'
                ? `+₹${item.amount}`
                : `-₹${item.amount}`}
            </div>

            <div style={{ fontSize: '12px', color: 'gray' }}>
              {new Date(item.date).toLocaleDateString()}
            </div>

          </div>
        ))}

      </div>
    </div>
  )
}