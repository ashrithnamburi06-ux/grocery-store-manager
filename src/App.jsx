import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { getUser } from './data/store'

// Auth
import Login    from './pages/auth/Login'
import Welcome  from './pages/auth/Welcome'

// Dashboard
import Dashboard from './pages/dashboard/Dashboard'

// Inventory
import InventoryList from './pages/inventory/InventoryList'
import AddItem       from './pages/inventory/AddItem'
import EditItem      from './pages/inventory/EditItem'

// Load
import AddLoad from './pages/load/AddLoad'

// Suppliers
import SupplierList    from './pages/suppliers/SupplierList'
import SupplierDetails from './pages/suppliers/SupplierDetails'
import AddPayment      from './pages/suppliers/AddPayment'
import AddSupplier     from './pages/suppliers/AddSupplier'

// Expenses
import AddExpense  from './pages/expenses/AddExpense'
import ExpenseList from './pages/expenses/ExpenseList'

// Profile
import Profile from './pages/profile/Profile'

// Route guard component
function ProtectedRoute({ children }) {
  const user = getUser()
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  const user = getUser()

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/login"   element={<Login />} />
        <Route path="/welcome" element={<Welcome />} />

        {/* Root redirect */}
        <Route
          path="/"
          element={<Navigate to={user ? '/dashboard' : '/login'} replace />}
        />

        {/* Protected app routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

        <Route path="/inventory"           element={<ProtectedRoute><InventoryList /></ProtectedRoute>} />
        <Route path="/inventory/add"       element={<ProtectedRoute><AddItem /></ProtectedRoute>} />
        <Route path="/inventory/edit/:id"  element={<ProtectedRoute><EditItem /></ProtectedRoute>} />

        <Route path="/load/add" element={<ProtectedRoute><AddLoad /></ProtectedRoute>} />

        <Route path="/suppliers"                       element={<ProtectedRoute><SupplierList /></ProtectedRoute>} />
        <Route path="/suppliers/new"                   element={<ProtectedRoute><AddSupplier /></ProtectedRoute>} />
        <Route path="/suppliers/:id"                   element={<ProtectedRoute><SupplierDetails /></ProtectedRoute>} />
        <Route path="/suppliers/:id/add-payment"       element={<ProtectedRoute><AddPayment /></ProtectedRoute>} />

        <Route path="/expenses"     element={<ProtectedRoute><ExpenseList /></ProtectedRoute>} />
        <Route path="/expenses/add" element={<ProtectedRoute><AddExpense /></ProtectedRoute>} />

        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
