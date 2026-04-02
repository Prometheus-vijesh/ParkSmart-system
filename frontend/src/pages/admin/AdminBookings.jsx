// src/pages/admin/AdminBookings.jsx
import { useState, useEffect, useRef } from 'react'
import { RefreshCw, Activity } from 'lucide-react'
import { PageHeader, Spinner, Table } from '../../components/common'
import { adminAPI } from '../../services/api'

export default function AdminBookings() {
  const [bookings, setBookings] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [last,     setLast]     = useState('')
  const timerRef = useRef(null)

  const load = () => {
    adminAPI.activeBookings()
      .then(r => { setBookings(r.data); setLast(new Date().toLocaleTimeString()) })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
    timerRef.current = setInterval(load, 30_000) // auto-refresh every 30s
    return () => clearInterval(timerRef.current)
  }, [])

  const rows = bookings.map(b => [
    <span className="font-mono text-xs font-semibold">{b.booking_ref}</span>,
    b.driver_name,
    <span className="font-mono text-xs">{b.plate_number}</span>,
    <span className="capitalize">{b.vehicle_type} – {b.vehicle_name}</span>,
    <span className="font-medium">{b.slot_code} (Floor {b.floor})</span>,
    <span className="capitalize">{b.parking_type === 'vip' ? '⭐ VIP' : 'Normal'}</span>,
    new Date(b.in_time).toLocaleTimeString('en-IN'),
    <span className="font-semibold">{parseFloat(b.hours_parked).toFixed(1)}h</span>,
    <span className="font-bold text-emerald-700">₹{parseFloat(b.estimated_amount).toFixed(0)}</span>,
    <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded">{b.pin}</span>,
  ])

  return (
    <div>
      <PageHeader
        title="Live Bookings"
        subtitle={
          <span className="flex items-center gap-1.5 text-emerald-600 font-medium text-xs">
            <Activity size={12} className="animate-pulse" />
            Auto-refreshes every 30s · Last: {last}
          </span>
        }
        action={
          <button onClick={load} className="btn-secondary">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh Now
          </button>
        }
      />

      <div className="mb-4 flex items-center gap-3">
        <div className="card py-3 px-5 flex-1 text-center">
          <p className="text-3xl font-bold text-brand-600">{bookings.length}</p>
          <p className="text-xs text-slate-500 mt-1">Currently parked</p>
        </div>
        <div className="card py-3 px-5 flex-1 text-center">
          <p className="text-3xl font-bold text-emerald-600">
            ₹{bookings.reduce((s, b) => s + parseFloat(b.estimated_amount || 0), 0).toFixed(0)}
          </p>
          <p className="text-xs text-slate-500 mt-1">Estimated revenue pending</p>
        </div>
        <div className="card py-3 px-5 flex-1 text-center">
          <p className="text-3xl font-bold text-amber-600">
            {bookings.filter(b => b.parking_type === 'vip').length}
          </p>
          <p className="text-xs text-slate-500 mt-1">VIP spots occupied</p>
        </div>
      </div>

      {loading && bookings.length === 0 ? (
        <div className="flex justify-center py-20"><Spinner size={28} /></div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <Table
            headers={['Ref','Driver','Plate','Vehicle','Slot','Type','In','Duration','Est. Amount','PIN']}
            rows={rows}
            emptyMsg="🎉 No active bookings right now"
          />
        </div>
      )}
    </div>
  )
}
