import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

// Pages
import LoginPage       from './pages/LoginPage'
import RegisterPage    from './pages/RegisterPage'
import DashboardPage   from './pages/DashboardPage'
import BookPage        from './pages/BookPage'
import MyBookingsPage  from './pages/MyBookingsPage'
import VehiclesPage    from './pages/VehiclesPage'
import CheckoutPage    from './pages/CheckoutPage'
import AdminLayout     from './pages/admin/AdminLayout'
import AdminDashboard  from './pages/admin/AdminDashboard'
import AdminBookings   from './pages/admin/AdminBookings'
import AdminPricing    from './pages/admin/AdminPricing'
import AdminUsers      from './pages/admin/AdminUsers'
import AdminCoupons    from './pages/admin/AdminCoupons'

function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

function AdminRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Driver */}
          <Route path="/dashboard"  element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/book"       element={<PrivateRoute><BookPage /></PrivateRoute>} />
          <Route path="/bookings"   element={<PrivateRoute><MyBookingsPage /></PrivateRoute>} />
          <Route path="/vehicles"   element={<PrivateRoute><VehiclesPage /></PrivateRoute>} />
          <Route path="/checkout/:id" element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />

          {/* Admin */}
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index          element={<AdminDashboard />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="pricing"  element={<AdminPricing />} />
            <Route path="users"    element={<AdminUsers />} />
            <Route path="coupons"  element={<AdminCoupons />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
