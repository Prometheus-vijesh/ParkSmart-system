// src/pages/DashboardPage.jsx
import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Car, CalendarCheck, ParkingSquare, Zap, RefreshCw } from 'lucide-react'
import Layout from '../components/common/Layout'
import { StatCard, OccupancyBar, PageHeader } from '../components/common'
import ParkingGrid from '../components/user/ParkingGrid'
import { parkingAPI, bookingsAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'

const VEHICLE_ICONS = { car: Car, bike: Zap, bicycle: ParkingSquare, ev: Zap }

export default function DashboardPage() {
  const { user } = useAuth()
  const [avail,   setAvail]   = useState([])
  const [active,  setActive]  = useState(null)
  const [loading, setLoading] = useState(true)
  const [refresh, setRefresh] = useState(0)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [a, b] = await Promise.allSettled([
        parkingAPI.availability(),
        bookingsAPI.activeBooking(),
      ])
      if (a.status === 'fulfilled') setAvail(a.value.data)
      if (b.status === 'fulfilled') setActive(b.value.data)
      else setActive(null)
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load, refresh])

  // Totals
  const total    = avail.reduce((s, a) => s + a.total, 0)
  const occupied = avail.reduce((s, a) => s + a.occupied,    0)
  const free     = total - occupied

  // Per-type summary
  const byType = {}
  avail.forEach(a => {
    if (!byType[a.vehicle_type]) byType[a.vehicle_type] = { total: 0, occupied: 0 }
    byType[a.vehicle_type].total    += a.total
    byType[a.vehicle_type].occupied += a.occupied
  })

  const typeLabels = { car: 'Cars', bike: 'Bikes', bicycle: 'Bicycles', ev: 'EVs' }

  return (
    <Layout>
      <PageHeader
        title={`Good ${getGreeting()}, ${user?.full_name?.split(' ')[0]} 👋`}
        subtitle="Live parking overview"
        action={
          <button onClick={() => setRefresh(r => r + 1)} className="btn-secondary">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        }
      />

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Spots"  value={total}    icon={ParkingSquare} color="brand" />
        <StatCard label="Occupied"     value={occupied} icon={Car}           color="red"   />
        <StatCard label="Available"    value={free}     icon={CalendarCheck} color="emerald" />
        <StatCard label="Occupancy"    value={`${total > 0 ? Math.round(occupied/total*100) : 0}%`}
                  icon={Zap} color="amber" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Occupancy by type */}
        <div className="card space-y-4">
          <h2 className="text-lg font-semibold text-slate-800">Occupancy by Type</h2>
          {Object.entries(byType).map(([type, { total, occupied }]) => (
            <OccupancyBar key={type} label={typeLabels[type]} occupied={occupied} total={total} />
          ))}
        </div>

        {/* Active booking widget */}
        <div className="card">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">My Active Booking</h2>
          {active ? (
            <ActiveBookingCard booking={active} />
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <ParkingSquare size={40} className="text-slate-200 mb-3" />
              <p className="text-slate-500 mb-4">No active booking</p>
              <Link to="/book" className="btn-primary">Book a Spot</Link>
            </div>
          )}
        </div>
      </div>

      {/* Grid visualization */}
      <ParkingGrid availability={avail} />
    </Layout>
  )
}

function ActiveBookingCard({ booking }) {
  const elapsed = getElapsed(booking.in_time)
  return (
    <div className="space-y-3">
      <div className="bg-brand-50 rounded-xl p-4 border border-brand-100">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs text-brand-600 font-semibold uppercase tracking-wide">Ref</p>
            <p className="font-mono font-bold text-slate-800">BKG-{booking.id}</p>
          </div>
          <span className="badge-green">Active</span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-slate-400 text-xs">In Time</p>
            <p className="font-medium">{new Date(booking.in_time + 'Z').toLocaleTimeString()}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs">Duration</p>
            <p className="font-medium">{elapsed}</p>
          </div>
        </div>
      </div>
      <Link to={`/checkout/${booking.id}`} className="btn-primary w-full justify-center">
        Checkout & Pay
      </Link>
    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}

function getElapsed(inTimeStr) {
  // Append 'Z' so JS treats the server's UTC timestamp correctly
  const utcStr = inTimeStr.endsWith('Z') ? inTimeStr : inTimeStr + 'Z'
  const mins = Math.floor((Date.now() - new Date(utcStr)) / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m`
  return `${Math.floor(mins/60)}h ${mins%60}m`
}
