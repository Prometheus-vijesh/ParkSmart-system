// src/pages/admin/AdminPricing.jsx
import { useState, useEffect } from 'react'
import { Save, DollarSign } from 'lucide-react'
import { Alert, PageHeader, Spinner } from '../../components/common'
import { adminAPI } from '../../services/api'

const EMOJIS = { car: '🚗', bike: '🏍️', bicycle: '🚲', ev: '⚡' }

export default function AdminPricing() {
  const [pricing,  setPricing]  = useState([])
  const [edits,    setEdits]    = useState({})
  const [saving,   setSaving]   = useState({})
  const [msg,      setMsg]      = useState({ type: '', text: '' })
  const [load,     setLoad]     = useState(true)

  useEffect(() => {
    adminAPI.getPricing()
      .then(r => {
        setPricing(r.data)
        const e = {}
        r.data.forEach(p => { e[p.vehicle_type] = { rate_per_hour: p.rate_per_hour, vip_multiplier: p.vip_multiplier } })
        setEdits(e)
      })
      .finally(() => setLoad(false))
  }, [])

  const handleChange = (type, field, val) => {
    setEdits(e => ({ ...e, [type]: { ...e[type], [field]: val } }))
  }

  const save = async (type) => {
    setSaving(s => ({ ...s, [type]: true }))
    setMsg({ type: '', text: '' })
    try {
      await adminAPI.updatePricing(type, {
        rate_per_hour:  parseFloat(edits[type].rate_per_hour),
        vip_multiplier: parseFloat(edits[type].vip_multiplier),
      })
      setMsg({ type: 'success', text: `${type} pricing updated!` })
    } catch (ex) {
      setMsg({ type: 'error', text: ex.response?.data?.detail || 'Update failed' })
    } finally {
      setSaving(s => ({ ...s, [type]: false }))
    }
  }

  return (
    <div>
      <PageHeader title="Pricing Management" subtitle="Edit hourly rates and VIP multipliers" />
      <Alert type={msg.type || 'info'} message={msg.text} />

      {load ? (
        <div className="flex justify-center py-20"><Spinner size={28} /></div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-6 mt-4">
          {pricing.map(p => (
            <div key={p.vehicle_type} className="card">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-3xl">{EMOJIS[p.vehicle_type]}</span>
                <div>
                  <h3 className="font-semibold text-slate-800 capitalize">
                    {p.vehicle_type === 'ev' ? 'Electric Vehicle (EV)' : p.vehicle_type + 's'}
                  </h3>
                  <p className="text-xs text-slate-500">Adjust parking rate</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="label flex items-center gap-1.5">
                    <DollarSign size={13} /> Base Rate (₹/hour)
                  </label>
                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-brand-500">
                    <span className="px-3 bg-slate-50 text-slate-500 text-sm border-r border-slate-200 py-2">₹</span>
                    <input
                      type="number" min={1} step={1}
                      className="flex-1 px-3 py-2 text-sm outline-none"
                      value={edits[p.vehicle_type]?.rate_per_hour ?? ''}
                      onChange={e => handleChange(p.vehicle_type, 'rate_per_hour', e.target.value)}
                    />
                    <span className="px-3 bg-slate-50 text-slate-500 text-sm border-l border-slate-200 py-2">/hr</span>
                  </div>
                </div>

                <div>
                  <label className="label">VIP Multiplier</label>
                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-brand-500">
                    <span className="px-3 bg-slate-50 text-slate-500 text-sm border-r border-slate-200 py-2">×</span>
                    <input
                      type="number" min={1} step={0.1} max={5}
                      className="flex-1 px-3 py-2 text-sm outline-none"
                      value={edits[p.vehicle_type]?.vip_multiplier ?? ''}
                      onChange={e => handleChange(p.vehicle_type, 'vip_multiplier', e.target.value)}
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    VIP rate = ₹{((edits[p.vehicle_type]?.rate_per_hour ?? 0) * (edits[p.vehicle_type]?.vip_multiplier ?? 1)).toFixed(0)}/hr
                  </p>
                </div>

                <button
                  onClick={() => save(p.vehicle_type)}
                  disabled={saving[p.vehicle_type]}
                  className="btn-primary w-full justify-center"
                >
                  {saving[p.vehicle_type] ? <Spinner size={14} /> : <><Save size={14} /> Save Changes</>}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
