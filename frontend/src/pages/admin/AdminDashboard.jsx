// src/pages/admin/AdminDashboard.jsx
import { useState, useEffect } from 'react'
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  LineElement, PointElement, ArcElement, Tooltip, Legend, Filler,
} from 'chart.js'
import { Bar, Line, Doughnut } from 'react-chartjs-2'
import {
  Car, DollarSign, Users, CalendarCheck,
  TrendingUp, Clock, RefreshCw, Zap,
} from 'lucide-react'
import { StatCard, OccupancyBar, PageHeader, Spinner } from '../../components/common'
import { adminAPI } from '../../services/api'

ChartJS.register(
  CategoryScale, LinearScale, BarElement,
  LineElement, PointElement, ArcElement, Tooltip, Legend, Filler
)

const CHART_OPTS = {
  responsive: true,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false } },
    y: { grid: { color: '#f1f5f9' }, beginAtZero: true },
  },
}

export default function AdminDashboard() {
  const [summary,  setSummary]  = useState(null)
  const [hourly,   setHourly]   = useState([])
  const [weekly,   setWeekly]   = useState([])
  const [loading,  setLoading]  = useState(true)
  const [refresh,  setRefresh]  = useState(0)

  useEffect(() => {
    setLoading(true)
    Promise.allSettled([
      adminAPI.summary(),
      adminAPI.hourlyRevenue(),
      adminAPI.weeklyBookings(),
    ]).then(([s, h, w]) => {
      if (s.status === 'fulfilled') setSummary(s.value.data)
      if (h.status === 'fulfilled') setHourly(h.value.data)
      if (w.status === 'fulfilled') setWeekly(w.value.data)
    }).finally(() => setLoading(false))
  }, [refresh])

  if (loading && !summary) return (
    <div className="flex justify-center py-32"><Spinner size={36} /></div>
  )

  const occ = summary?.occupancy_rate ?? 0
  const occColor = occ > 85 ? '#ef4444' : occ > 60 ? '#f59e0b' : '#10b981'

  // Doughnut: occupancy
  const doughnutData = {
    labels: ['Occupied', 'Available'],
    datasets: [{
      data: [summary?.occupied_slots ?? 0, summary?.available_slots ?? 0],
      backgroundColor: ['#0ea5e9', '#e0f2fe'],
      borderWidth: 0,
    }],
  }

  // Bar: hourly revenue today
  const hourLabels = Array.from({ length: 24 }, (_, i) => `${i}:00`)
  const hourValues = hourLabels.map((_, i) => {
    const row = hourly.find(r => r.hour === i)
    return row ? parseFloat(row.revenue) : 0
  })
  const barData = {
    labels: hourLabels.filter((_, i) => i % 2 === 0),
    datasets: [{
      label: 'Revenue (₹)',
      data: hourValues.filter((_, i) => i % 2 === 0),
      backgroundColor: '#0ea5e9',
      borderRadius: 6,
    }],
  }

  // Line: weekly bookings
  const lineData = {
    labels: weekly.map(r => new Date(r.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' })),
    datasets: [{
      label: 'Bookings',
      data: weekly.map(r => r.bookings),
      borderColor: '#8b5cf6',
      backgroundColor: 'rgba(139,92,246,0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#8b5cf6',
    }],
  }

  const typeLabels = { car: 'Cars', bike: 'Bikes', bicycle: 'Bicycles', ev: 'EVs' }
  const avail = summary?.availability ?? []
  // Group by type (sum normal+vip)
  const byType = {}
  avail.forEach(a => {
    if (!byType[a.vehicle_type]) byType[a.vehicle_type] = { total: 0, occupied: 0 }
    byType[a.vehicle_type].total    += a.total_slots
    byType[a.vehicle_type].occupied += a.occupied
  })

  return (
    <div>
      <PageHeader
        title="Admin Dashboard"
        subtitle={`Last refreshed: ${new Date().toLocaleTimeString()}`}
        action={
          <button onClick={() => setRefresh(r => r + 1)} className="btn-secondary">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        }
      />

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Revenue Today"  value={`₹${summary?.total_revenue_today ?? 0}`} icon={DollarSign}    color="emerald" />
        <StatCard label="Revenue Month"  value={`₹${summary?.total_revenue_month ?? 0}`} icon={TrendingUp}    color="brand"   />
        <StatCard label="Active Bookings" value={summary?.active_bookings ?? 0}           icon={CalendarCheck} color="amber"   />
        <StatCard label="Occupancy Rate"  value={`${occ}%`}                               icon={Car}           color={occ > 80 ? 'red' : 'brand'} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Doughnut occupancy */}
        <div className="card flex flex-col items-center">
          <h2 className="text-base font-semibold text-slate-800 mb-4 self-start">Overall Occupancy</h2>
          <div className="w-44 h-44">
            <Doughnut data={doughnutData} options={{ plugins: { legend: { position: 'bottom' } }, cutout: '72%' }} />
          </div>
          <p className="mt-3 text-3xl font-bold" style={{ color: occColor }}>{occ}%</p>
          <p className="text-xs text-slate-400">
            {summary?.occupied_slots} / {summary?.total_slots} slots
          </p>
        </div>

        {/* Occupancy by type */}
        <div className="card lg:col-span-2">
          <h2 className="text-base font-semibold text-slate-800 mb-4">Occupancy by Vehicle Type</h2>
          <div className="space-y-4">
            {Object.entries(byType).map(([type, { total, occupied }]) => (
              <OccupancyBar key={type} label={typeLabels[type] ?? type} occupied={occupied} total={total} />
            ))}
          </div>
          {summary?.most_popular_type && (
            <p className="text-xs text-slate-500 mt-4 pt-3 border-t border-slate-100">
              🏆 Most popular this month:{' '}
              <b className="capitalize">{summary.most_popular_type}</b>
              {summary.peak_hour != null && (
                <> &nbsp;·&nbsp; ⏰ Peak hour: <b>{summary.peak_hour}:00–{summary.peak_hour + 1}:00</b></>
              )}
            </p>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Hourly revenue */}
        <div className="card">
          <h2 className="text-base font-semibold text-slate-800 mb-4">Hourly Revenue Today</h2>
          {hourly.length === 0
            ? <p className="text-sm text-slate-400 text-center py-8">No transactions today yet</p>
            : <Bar data={barData} options={CHART_OPTS} />
          }
        </div>

        {/* Weekly bookings */}
        <div className="card">
          <h2 className="text-base font-semibold text-slate-800 mb-4">Bookings – Last 7 Days</h2>
          {weekly.length === 0
            ? <p className="text-sm text-slate-400 text-center py-8">No booking data yet</p>
            : <Line data={lineData} options={CHART_OPTS} />
          }
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Completed Today" value={summary?.completed_today ?? 0} icon={CalendarCheck} color="emerald" />
        <StatCard label="All-time Revenue" value={`₹${Number(summary?.total_revenue_all ?? 0).toLocaleString()}`} icon={DollarSign} color="purple" />
        <StatCard label="Total Slots"     value={summary?.total_slots ?? 0}     icon={Car}           color="brand" />
        <StatCard label="Available Now"   value={summary?.available_slots ?? 0} icon={Zap}           color="amber" />
      </div>
    </div>
  )
}
