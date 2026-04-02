import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lightbulb, Tag, ParkingSquare } from 'lucide-react'
import Layout from '../components/common/Layout'
import { Alert, Spinner, PageHeader } from '../components/common'
import { vehiclesAPI, bookingsAPI, parkingAPI, getErrorMessage } from '../services/api'

const EMOJIS = { car: '🚗', bike: '🏍️', bicycle: '🚲', ev: '⚡' }

export default function BookPage() {
  const navigate = useNavigate()
  const [vehicles, setVehicles]   = useState([])
  const [form,     setForm]       = useState({ vehicle_id: '', parking_type: 'normal', coupon_code: '' })
  const [rec,      setRec]        = useState(null)
  const [couponRes, setCouponRes] = useState(null)
  const [err,      setErr]        = useState('')
  const [busy,     setBusy]       = useState(false)
  const [loadV,    setLoadV]      = useState(true)
  const [bookingSuccess, setBookingSuccess] = useState(null)

  useEffect(() => {
    vehiclesAPI.list()
      .then(r => { setVehicles(r.data); if (r.data[0]) setForm(f => ({ ...f, vehicle_id: r.data[0].id })) })
      .finally(() => setLoadV(false))
  }, [])

  useEffect(() => {
    if (!form.vehicle_id) return
    const v = vehicles.find(v => v.id === Number(form.vehicle_id))
    if (!v) return
    parkingAPI.recommend(v.vehicle_type).then(r => setRec(r.data)).catch(() => {})
  }, [form.vehicle_id, vehicles])

  const validateCoupon = async () => {
    if (!form.coupon_code) return
    try {
      const res = await bookingsAPI.validateCoupon({ code: form.coupon_code, amount: 100 })
      setCouponRes(res.data)
    } catch { setCouponRes({ valid: false, message: 'Could not validate' }) }
  }

  const submit = async e => {
    e.preventDefault()
    if (!form.vehicle_id) return setErr('Select a vehicle')
    setBusy(true); setErr('')
    try {
      const payload = {
        vehicle_id:   Number(form.vehicle_id),
        parking_type: form.parking_type,
        coupon_code:  form.coupon_code || undefined,
      }
      const res = await bookingsAPI.create(payload)
      setBookingSuccess(res.data)
    } catch (ex) {
      setErr(getErrorMessage(ex))
    } finally { setBusy(false) }
  }

  if (bookingSuccess) {
    return (
      <Layout>
        <div className="max-w-md mx-auto mt-10">
          <div className="card text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4">
              <ParkingSquare size={32} className="text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Slot Booked!</h2>
            <p className="text-slate-500 mb-6">Your spot is secured and ready.</p>
            
            <div className="bg-slate-50 rounded-xl p-5 text-left space-y-3 mb-8">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Booking Ref</span>
                <span className="font-mono font-bold text-slate-800">BKG-{bookingSuccess.id}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">In Time</span>
                <span className="font-medium text-slate-800">{new Date(bookingSuccess.in_time).toLocaleString()}</span>
              </div>
            </div>

            <button onClick={() => navigate('/dashboard')} className="btn-primary w-full justify-center py-3">
              Return to Dashboard
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <PageHeader title="Book a Parking Spot" subtitle="Choose your vehicle and slot type" />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <form onSubmit={submit} className="space-y-5">
            <Alert type="error" message={err} />

            <div>
              <label className="label">Select Vehicle</label>
              {loadV ? <Spinner /> : vehicles.length === 0 ? (
                <div className="bg-amber-50 rounded-lg p-4 text-sm text-amber-700">
                  No vehicles found.{' '}
                  <a href="/vehicles" className="font-semibold underline">Add a vehicle first →</a>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3">
                  {vehicles.map(v => (
                    <label key={v.id}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        Number(form.vehicle_id) === v.id ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-slate-300'
                      }`}>
                      <input type="radio" name="vehicle" value={v.id} className="sr-only"
                        checked={Number(form.vehicle_id) === v.id}
                        onChange={e => setForm(f => ({ ...f, vehicle_id: e.target.value }))} />
                      <span className="text-2xl">{EMOJIS[v.vehicle_type]}</span>
                      <div>
                        <p className="font-semibold text-slate-800">{v.vehicle_name}</p>
                        <p className="text-xs text-slate-500 font-mono">{v.plate_number}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="label">Parking Type</label>
              <div className="grid sm:grid-cols-2 gap-3">
                {['normal', 'vip'].map(type => (
                  <label key={type}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      form.parking_type === type ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-slate-300'
                    }`}>
                    <input type="radio" name="parking_type" value={type} className="sr-only"
                      checked={form.parking_type === type}
                      onChange={e => setForm(f => ({ ...f, parking_type: e.target.value }))} />
                    <p className="font-semibold capitalize text-slate-800">
                      {type === 'vip' ? '⭐ VIP' : '🅿️ Normal'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {type === 'vip' ? 'Premium spot, 1.5× rate, near entrance' : 'Standard rate, all floors'}
                    </p>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="label flex items-center gap-1.5"><Tag size={14}/> Coupon Code (optional)</label>
              <div className="flex gap-2">
                <input className="input" placeholder="e.g. SAVE15"
                  value={form.coupon_code}
                  onChange={e => { setForm(f => ({ ...f, coupon_code: e.target.value })); setCouponRes(null) }} />
                <button type="button" onClick={validateCoupon} className="btn-secondary whitespace-nowrap">Apply</button>
              </div>
              {couponRes && (
                <p className={`text-xs mt-1 ${couponRes.valid ? 'text-emerald-600' : 'text-red-500'}`}>
                  {couponRes.valid ? `✓ ${couponRes.message} (saves ₹${couponRes.discount_amount})` : `✗ ${couponRes.message}`}
                </p>
              )}
            </div>

            <button type="submit" disabled={busy || vehicles.length === 0} className="btn-primary w-full justify-center py-3 text-base">
              {busy ? <Spinner size={16} /> : <><ParkingSquare size={16}/> Confirm Booking</>}
            </button>
          </form>
        </div>

        <div className="space-y-4">
          {rec && (
            <div className="card bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb size={18} className="text-amber-500" />
                <h3 className="font-semibold text-slate-800">Smart Recommendation</h3>
              </div>
              {rec.peak_warning && <div className="badge-amber mb-3">⚠️ Peak hour traffic detected</div>}
              <p className="text-sm text-slate-700 mb-2">{rec.reason}</p>
              <div className="text-xs text-slate-500 space-y-1">
                <p>🎯 Suggested: <b className="capitalize">{rec.recommended_slot_type}</b> slot</p>
                <p>⏱️ Est. wait: {rec.estimated_wait}</p>
              </div>
            </div>
          )}

          <div className="card">
            <h3 className="font-semibold text-slate-800 mb-3">Pricing Guide</h3>
            <div className="space-y-2 text-sm">
              {[
                { type: 'car',     rate: 50,  label: 'Cars'     },
                { type: 'bike',    rate: 20,  label: 'Bikes'    },
                { type: 'bicycle', rate: 10,  label: 'Bicycles' },
                { type: 'ev',      rate: 80,  label: 'EVs'      },
              ].map(p => (
                <div key={p.type} className="flex justify-between">
                  <span className="text-slate-600">{EMOJIS[p.type]} {p.label}</span>
                  <span className="font-semibold">₹{p.rate}/hr</span>
                </div>
              ))}
              <p className="text-xs text-slate-400 pt-2 border-t border-slate-100">
                VIP slots: 1.5× rate. Minimum 1 hour billing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
