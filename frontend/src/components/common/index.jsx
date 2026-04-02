// src/components/common/index.jsx  – reusable UI primitives

import { clsx } from 'clsx'
import { Loader2, AlertCircle, CheckCircle2, Info } from 'lucide-react'

// ── Spinner ───────────────────────────────────────────────────────────────────
export function Spinner({ size = 20 }) {
  return <Loader2 size={size} className="animate-spin text-brand-600" />
}

export function FullPageSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Spinner size={36} />
    </div>
  )
}

// ── Alert ─────────────────────────────────────────────────────────────────────
const alertMap = {
  error:   { icon: AlertCircle,    cls: 'bg-red-50   border-red-200   text-red-800'   },
  success: { icon: CheckCircle2,   cls: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
  info:    { icon: Info,           cls: 'bg-blue-50  border-blue-200  text-blue-800'  },
}
export function Alert({ type = 'info', message }) {
  if (!message) return null
  const { icon: Icon, cls } = alertMap[type]
  return (
    <div className={clsx('flex items-start gap-3 rounded-lg border px-4 py-3 text-sm', cls)}>
      <Icon size={16} className="mt-0.5 flex-shrink-0" />
      <span>{message}</span>
    </div>
  )
}

// ── StatCard ──────────────────────────────────────────────────────────────────
export function StatCard({ label, value, icon: Icon, color = 'brand', sub }) {
  const colors = {
    brand:   'bg-brand-50   text-brand-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber:   'bg-amber-50   text-amber-600',
    red:     'bg-red-50     text-red-600',
    purple:  'bg-purple-50  text-purple-600',
  }
  return (
    <div className="card flex items-center gap-4">
      <div className={clsx('rounded-xl p-3', colors[color])}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-slate-800 leading-tight">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

// ── OccupancyBar ──────────────────────────────────────────────────────────────
export function OccupancyBar({ label, occupied, total, color }) {
  const pct = total > 0 ? Math.round((occupied / total) * 100) : 0
  const barColor = pct > 85 ? 'bg-red-500' : pct > 60 ? 'bg-amber-400' : 'bg-emerald-500'
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="text-slate-500">{occupied}/{total} · <b>{pct}%</b></span>
      </div>
      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={clsx('h-full rounded-full transition-all duration-500', barColor)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

// ── VehicleTypeBadge ──────────────────────────────────────────────────────────
const vehicleEmoji = { car: '🚗', bike: '🏍️', bicycle: '🚲', ev: '⚡' }
export function VehicleTypeBadge({ type }) {
  return (
    <span className="inline-flex items-center gap-1 capitalize">
      {vehicleEmoji[type]} {type}
    </span>
  )
}

// ── Table ─────────────────────────────────────────────────────────────────────
export function Table({ headers, rows, emptyMsg = 'No data found' }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-100">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-100">
            {headers.map((h, i) => (
              <th key={`table_header_${i}`} className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={headers.length} className="px-4 py-10 text-center text-slate-400">{emptyMsg}</td></tr>
          ) : rows.map((row, i) => (
            <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 text-slate-700">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Modal ─────────────────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10">
        <h2 className="text-lg font-bold text-slate-800 mb-4">{title}</h2>
        {children}
      </div>
    </div>
  )
}

// ── PageHeader ────────────────────────────────────────────────────────────────
export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
        {subtitle && <p className="text-slate-500 text-sm mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}
