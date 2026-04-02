// src/pages/admin/AdminLayout.jsx
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, CalendarCheck, DollarSign,
  Users, Tag, LogOut, ParkingSquare, ArrowLeft,
} from 'lucide-react'
import { clsx } from 'clsx'
import { useAuth } from '../../context/AuthContext'

const links = [
  { to: '/admin',          end: true, icon: LayoutDashboard, label: 'Dashboard'    },
  { to: '/admin/bookings',            icon: CalendarCheck,   label: 'Live Bookings' },
  { to: '/admin/pricing',             icon: DollarSign,      label: 'Pricing'       },
  { to: '/admin/coupons',             icon: Tag,             label: 'Coupons'       },
  { to: '/admin/users',               icon: Users,           label: 'Users'         },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div className="flex min-h-screen bg-slate-900">
      {/* Dark admin sidebar */}
      <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
        <div className="px-6 py-5 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <div className="bg-purple-600 text-white rounded-lg p-1.5">
              <ParkingSquare size={20} />
            </div>
            <div>
              <span className="font-bold text-white text-lg">ParkSmart</span>
              <p className="text-xs text-purple-400 font-medium">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {links.map(({ to, end, icon: Icon, label }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) => clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                isActive
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-400 hover:bg-slate-700 hover:text-white'
              )}>
              <Icon size={17} />
              {label}
            </NavLink>
          ))}

          <div className="pt-4 mt-4 border-t border-slate-700">
            <NavLink to="/dashboard"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-slate-700 hover:text-white transition-all">
              <ArrowLeft size={17} />
              Driver View
            </NavLink>
          </div>
        </nav>

        <div className="px-3 py-4 border-t border-slate-700">
          <div className="flex items-center gap-3 px-3 py-2 mb-2 rounded-xl bg-slate-700">
            <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">
              {user?.full_name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.full_name}</p>
              <p className="text-xs text-slate-400">Administrator</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-xl text-sm text-red-400 hover:bg-red-900/30 transition-colors">
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 bg-slate-50 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
