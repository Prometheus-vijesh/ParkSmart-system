// src/pages/MyBookingsPage.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CalendarCheck } from 'lucide-react'
import Layout from '../components/common/Layout'
import { PageHeader, Spinner, Table } from '../components/common'
import { bookingsAPI } from '../services/api'

const STATUS_BADGE = {
  active:    'badge-blue',
  completed: 'badge-green',
  cancelled: 'badge-red',
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([])
  const [load,     setLoad]     = useState(true)

  useEffect(() => {
    bookingsAPI.myBookings()
      .then(r => setBookings(r.data))
      .finally(() => setLoad(false))
  }, [])

  const rows = bookings.map(b => [
    <span className="font-mono text-xs">BKG-{b.id}</span>,
    new Date(b.in_time + 'Z').toLocaleDateString('en-IN', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' }),
    b.out_time ? getDuration(b.in_time, b.out_time) : '—',
    b.total_amount != null ? `₹${b.total_amount}` : '—',
    <span className={STATUS_BADGE[b.status]}>{b.status}</span>,
    b.status === 'active'
      ? <Link to={`/checkout/${b.id}`} className="btn-primary py-1 text-xs">Checkout</Link>
      : null,
  ])

  return (
    <Layout>
      <PageHeader
        title="My Bookings"
        subtitle="Your full parking history"
        action={<Link to="/book" className="btn-primary"><CalendarCheck size={14}/> New Booking</Link>}
      />

      {load ? (
        <div className="flex justify-center py-20"><Spinner size={28} /></div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <Table
            headers={['Ref', 'In Time', 'Duration', 'Amount', 'Status', '']}
            rows={rows}
            emptyMsg="No bookings yet — go park something! 🚗"
          />
        </div>
      )}
    </Layout>
  )
}

function getDuration(inTime, outTime) {
  const toUTC = t => new Date(t.endsWith('Z') ? t : t + 'Z')
  const mins = Math.max(Math.floor((toUTC(outTime) - toUTC(inTime)) / 60000), 0)
  if (mins < 60) return `${mins}m`
  return `${Math.floor(mins / 60)}h ${mins % 60}m`
}
