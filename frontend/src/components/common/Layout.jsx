// src/components/common/Layout.jsx
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Car, CalendarCheck, ParkingSquare,
  LogOut, ChevronRight, ShieldCheck,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { clsx } from 'clsx'

const driverLinks = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/book',      icon: ParkingSquare,   label: 'Book Spot'  },
  { to: '/bookings',  icon: CalendarCheck,   label: 'My Bookings' },
  { to: '/vehicles',  icon: Car,             label: 'My Vehicles' },
]

export default function Layout({ children }) {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col shadow-sm">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="bg-brand-600 text-white rounded-lg p-1.5">
              <ParkingSquare size={20} />
            </div>
            <span className="font-bold text-xl text-slate-800">ParkSmart</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {driverLinks.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                isActive
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
              )}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}

          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) => clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mt-4',
                isActive
                  ? 'bg-purple-50 text-purple-700'
                  : 'text-slate-600 hover:bg-slate-50'
              )}
            >
              <ShieldCheck size={18} />
              Admin Panel
            </NavLink>
          )}
        </nav>

        {/* User footer */}
        <div className="px-3 py-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-3 py-2 mb-2 rounded-xl bg-slate-50">
            <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center text-sm font-bold">
              {user?.full_name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate">{user?.full_name}</p>
              <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 w-full rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors">
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
