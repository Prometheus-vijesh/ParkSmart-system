// src/components/common/Layout.jsx
import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Car, CalendarCheck, ParkingSquare,
  LogOut, ShieldCheck, Menu, X,
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
  const [open, setOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/login') }
  const close = () => setOpen(false)

  const SidebarContent = () => (
    <>
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
            onClick={close}
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
            onClick={close}
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
    </>
  )

  return (
    <div className="flex min-h-screen bg-slate-50">

      {/* ── Desktop sidebar (hidden on mobile) ── */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-100 flex-col shadow-sm flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* ── Mobile: slide-in drawer ── */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={close}
        />
      )}
      <aside className={clsx(
        'fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-xl flex flex-col transition-transform duration-300 md:hidden',
        open ? 'translate-x-0' : '-translate-x-full'
      )}>
        <button
          onClick={close}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600"
        >
          <X size={20} />
        </button>
        <SidebarContent />
      </aside>

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Mobile top bar */}
        <header className="md:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-slate-100 shadow-sm">
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2">
            <div className="bg-brand-600 text-white rounded-lg p-1">
              <ParkingSquare size={16} />
            </div>
            <span className="font-bold text-lg text-slate-800">ParkSmart</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
