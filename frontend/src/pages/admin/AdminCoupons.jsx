// src/pages/admin/AdminCoupons.jsx
import { useState, useEffect } from 'react'
import { Tag, ToggleLeft, ToggleRight } from 'lucide-react'
import { Alert, PageHeader, Spinner, Table } from '../../components/common'
import { adminAPI } from '../../services/api'

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([])
  const [load,    setLoad]    = useState(true)
  const [msg,     setMsg]     = useState({ type: '', text: '' })

  const reload = () => adminAPI.getCoupons().then(r => setCoupons(r.data)).finally(() => setLoad(false))
  useEffect(() => { reload() }, [])

  const toggle = async (id, code, active) => {
    try {
      await adminAPI.toggleCoupon(id)
      setMsg({ type: 'success', text: `Coupon ${code} ${active ? 'disabled' : 'enabled'}` })
      reload()
    } catch { setMsg({ type: 'error', text: 'Failed to update coupon' }) }
  }

  const rows = coupons.map(c => [
    <span className="font-mono font-bold text-brand-700">{c.code}</span>,
    <span className="capitalize badge badge-blue">{c.discount_type}</span>,
    c.discount_type === 'flat'
      ? `₹${c.discount_value} off`
      : `${c.discount_value}% off`,
    c.min_amount > 0 ? `₹${c.min_amount}` : '—',
    <span>
      <span className="font-semibold text-slate-800">{c.used_count}</span>
      <span className="text-slate-400"> / {c.max_uses}</span>
    </span>,
    c.valid_until
      ? new Date(c.valid_until).toLocaleDateString('en-IN')
      : <span className="text-slate-400">No expiry</span>,
    <span className={`badge ${c.is_active ? 'badge-green' : 'badge-red'}`}>
      {c.is_active ? 'Active' : 'Disabled'}
    </span>,
    <button
      onClick={() => toggle(c.id, c.code, c.is_active)}
      className={`inline-flex items-center gap-1 text-xs ${c.is_active ? 'text-red-500 hover:text-red-700' : 'text-emerald-600 hover:text-emerald-800'} transition-colors`}
    >
      {c.is_active
        ? <><ToggleRight size={16}/> Disable</>
        : <><ToggleLeft  size={16}/> Enable</>
      }
    </button>,
  ])

  return (
    <div>
      <PageHeader
        title="Coupon Management"
        subtitle="Enable or disable discount coupons"
        action={
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Tag size={14} />
            {coupons.filter(c => c.is_active).length} active coupons
          </div>
        }
      />

      <Alert type={msg.type || 'info'} message={msg.text} />

      {/* Usage summary */}
      <div className="grid grid-cols-3 gap-4 mb-6 mt-4">
        <div className="card text-center py-4">
          <p className="text-2xl font-bold text-slate-800">{coupons.length}</p>
          <p className="text-xs text-slate-500 mt-1">Total Coupons</p>
        </div>
        <div className="card text-center py-4">
          <p className="text-2xl font-bold text-emerald-600">{coupons.filter(c => c.is_active).length}</p>
          <p className="text-xs text-slate-500 mt-1">Active</p>
        </div>
        <div className="card text-center py-4">
          <p className="text-2xl font-bold text-brand-600">{coupons.reduce((s, c) => s + c.used_count, 0)}</p>
          <p className="text-xs text-slate-500 mt-1">Total Redemptions</p>
        </div>
      </div>

      {load ? (
        <div className="flex justify-center py-20"><Spinner size={28} /></div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <Table
            headers={['Code', 'Type', 'Discount', 'Min Amount', 'Usage', 'Valid Until', 'Status', '']}
            rows={rows}
            emptyMsg="No coupons found"
          />
        </div>
      )}
    </div>
  )
}
