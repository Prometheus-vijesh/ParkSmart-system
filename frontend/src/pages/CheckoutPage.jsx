// src/pages/CheckoutPage.jsx
import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { CheckCircle2, Receipt } from 'lucide-react'
import Layout from '../components/common/Layout'
import { Alert, Spinner, PageHeader } from '../components/common'
import { bookingsAPI, getErrorMessage } from '../services/api'

const PAYMENT_METHODS = [
  { value: 'cash',   label: '💵 Cash'   },
  { value: 'upi',    label: '📱 UPI'    },
  { value: 'card',   label: '💳 Card'   },
]

export default function CheckoutPage() {
  const { id }           = useParams()
  const [params]         = useSearchParams()
  const navigate         = useNavigate()
  const justBooked       = params.get('booked') === '1'

  const [booking,  setBooking]  = useState(null)
  const [method,   setMethod]   = useState('cash')
  const [err,      setErr]      = useState('')
  const [busy,     setBusy]     = useState(false)
  const [done,     setDone]     = useState(false)
  const [receipt,  setReceipt]  = useState(null)
  const [load,     setLoad]     = useState(true)

  useEffect(() => {
    bookingsAPI.getById(id)
      .then(r => { setBooking(r.data); if (r.data.status !== 'active') navigate('/bookings') })
      .catch(() => navigate('/bookings'))
      .finally(() => setLoad(false))
  }, [id])

  const checkout = async e => {
    e.preventDefault()
    setBusy(true); setErr('')
    try {
      const res = await bookingsAPI.checkout({ booking_id: Number(id), payment_method: method })
      setReceipt(res.data)
      setDone(true)
    } catch (ex) {
      setErr(getErrorMessage(ex) || 'Checkout failed')
    } finally { setBusy(false) }
  }

  if (load) return <Layout><div className="flex justify-center py-20"><Spinner size={32} /></div></Layout>

  if (done && receipt) {
    return (
      <Layout>
        <div className="max-w-md mx-auto">
          <div className="card text-center">
            <CheckCircle2 size={56} className="text-emerald-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 mb-1">Payment Successful!</h2>
            <p className="text-slate-500 mb-6">Thank you for using ParkSmart</p>

            <div className="bg-slate-50 rounded-xl p-5 text-left space-y-3 mb-6">
              <Row label="Booking Ref"  value={`BKG-${receipt.id}`} mono />
              <Row label="Duration"     value={getDuration(receipt.in_time, receipt.out_time)} />
              <Row label="Base Amount"  value={`₹${receipt.base_amount}`} />
              <Row label="Discount"     value={`-₹${receipt.discount_amount}`} green />
              <div className="border-t pt-3">
                <Row label="Total Paid" value={`₹${receipt.total_amount}`} large />
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => navigate('/dashboard')} className="btn-secondary flex-1 justify-center">
                Go Home
              </button>
              <button onClick={() => navigate('/bookings')} className="btn-primary flex-1 justify-center">
                <Receipt size={14}/> My Bookings
              </button>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <PageHeader title="Checkout" subtitle={booking?.booking_ref} />

      <div className="max-w-md mx-auto">
        {justBooked && (
          <Alert type="success" message={`Booking confirmed! Your slot is ready.`} />
        )}

        <div className="card mt-4">
          {/* Booking summary */}
          <div className="mb-5 p-4 bg-slate-50 rounded-xl space-y-2 text-sm">
            <Row label="In Time"  value={new Date(booking?.in_time).toLocaleString()} />
            <Row label="Duration" value={getDuration(booking?.in_time, null)} />
            <p className="text-xs text-slate-400 pt-1">
              ℹ️ Final amount calculated at checkout based on actual duration
            </p>
          </div>

          <form onSubmit={checkout} className="space-y-5">
            <Alert type="error" message={err} />

            <div>
              <label className="label">Payment Method</label>
              <div className="grid grid-cols-2 gap-3">
                {PAYMENT_METHODS.map(m => (
                  <label key={m.value}
                    className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer text-sm transition-all ${
                      method === m.value ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-slate-300'
                    }`}>
                    <input type="radio" name="method" value={m.value} className="sr-only"
                      checked={method === m.value}
                      onChange={e => setMethod(e.target.value)} />
                    <span>{m.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" disabled={busy} className="btn-primary w-full justify-center py-3 text-base">
              {busy ? <Spinner size={16} /> : 'Confirm Checkout & Pay'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  )
}

function Row({ label, value, mono, green, large }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-slate-500">{label}</span>
      <span className={`${mono ? 'font-mono' : ''} ${green ? 'text-emerald-600' : ''} ${large ? 'font-bold text-lg text-slate-800' : 'font-medium'}`}>
        {value}
      </span>
    </div>
  )
}

function getDuration(inTime, outTime) {
  const end  = outTime ? new Date(outTime) : new Date()
  const mins = Math.max(Math.floor((end - new Date(inTime)) / 60000), 0)
  if (mins < 60) return `${mins} min`
  return `${Math.floor(mins / 60)}h ${mins % 60}m`
}
