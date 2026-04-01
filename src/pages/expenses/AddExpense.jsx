import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../../components/TopBar'
import Toast from '../../components/Toast'
import { addExpense } from '../../data/store'

export default function AddExpense() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    amount: '',
    date:   new Date().toISOString().slice(0, 10),
    note:   '',
  })
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.amount || Number(form.amount) <= 0) {
      setError('Enter a valid amount')
      return
    }
    addExpense({ amount: Number(form.amount), date: form.date, note: form.note.trim() })
    setToast('Expense added ✓')
    setTimeout(() => navigate('/expenses'), 1500)
  }

  return (
    <div className="screen screen--no-nav">
      <TopBar title="Add Expense" backPath="-1" />

      <div className="screen-content">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="ae-amount">Amount (₹)</label>
            <input
              id="ae-amount"
              className="form-input"
              type="number"
              inputMode="numeric"
              placeholder="0"
              min="1"
              value={form.amount}
              onChange={e => { setForm(f => ({ ...f, amount: e.target.value })); setError('') }}
            />
            {error && <span style={{ color: 'var(--color-danger)', fontSize: '12px' }}>{error}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="ae-date">Date</label>
            <input
              id="ae-date"
              className="form-input"
              type="date"
              value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="ae-note">Note (optional)</label>
            <input
              id="ae-note"
              className="form-input"
              type="text"
              placeholder="e.g. Electricity Bill"
              value={form.note}
              onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
            />
          </div>

          <button id="ae-submit" type="submit" className="btn btn--primary" style={{ marginTop: '8px' }}>
            Save Expense
          </button>
          <button type="button" className="btn btn--outline" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </form>
      </div>

      {toast && <Toast message={toast} onDone={() => setToast('')} />}
    </div>
  )
}
