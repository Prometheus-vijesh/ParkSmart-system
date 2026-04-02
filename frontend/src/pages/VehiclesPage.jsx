import { useState, useEffect } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import Layout from '../components/common/Layout'
import { Alert, Modal, PageHeader, Spinner, Table } from '../components/common'
import { vehiclesAPI, getErrorMessage } from '../services/api'

const TYPES   = ['car', 'bike', 'bicycle', 'ev']
const EMOJIS  = { car: '🚗', bike: '🏍️', bicycle: '🚲', ev: '⚡' }
const BLANK   = { plate_number: '', vehicle_type: 'car', vehicle_name: '', color: '' }

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([])
  const [modal,    setModal]    = useState(false)
  const [form,     setForm]     = useState(BLANK)
  const [err,      setErr]      = useState('')
  const [ok,       setOk]       = useState('')
  const [busy,     setBusy]     = useState(false)
  const [load,     setLoad]     = useState(true)

  const reload = () => vehiclesAPI.list().then(r => setVehicles(r.data)).finally(() => setLoad(false))
  useEffect(() => { reload() }, [])

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const addVehicle = async e => {
    e.preventDefault()
    setBusy(true); setErr('')
    try {
      await vehiclesAPI.add(form)
      setOk('Vehicle added successfully!'); setModal(false); setForm(BLANK); reload()
    } catch (ex) {
      setErr(getErrorMessage(ex))
    } finally { setBusy(false) }
  }

  const removeVehicle = async (id, name) => {
    if (!confirm(`Remove ${name}?`)) return
    try {
      await vehiclesAPI.remove(id); setOk('Vehicle removed.'); reload()
    } catch (ex) {
      setErr(getErrorMessage(ex))
    }
  }

  const rows = vehicles.map(v => [
    <span className="text-lg">{EMOJIS[v.vehicle_type]}</span>,
    <span className="font-mono font-semibold">{v.plate_number}</span>,
    <span className="capitalize">{v.vehicle_type}</span>,
    v.vehicle_name,
    v.color || '—',
    <button onClick={() => removeVehicle(v.id, v.vehicle_name)} className="btn-danger py-1 text-xs">
      <Trash2 size={12}/> Remove
    </button>,
  ])

  return (
    <Layout>
      <PageHeader
        title="My Vehicles"
        subtitle="Manage registered vehicles"
        action={<button onClick={() => setModal(true)} className="btn-primary"><Plus size={14}/> Add Vehicle</button>}
      />

      <Alert type="success" message={ok} />
      <Alert type="error"   message={err} />

      {load ? (
        <div className="flex justify-center py-20"><Spinner size={28} /></div>
      ) : (
        <div className="card p-0 overflow-hidden mt-4">
          <Table
            headers={['', 'Plate', 'Type', 'Name', 'Color', '']}
            rows={rows}
            emptyMsg="No vehicles yet — add one!"
          />
        </div>
      )}

      <Modal open={modal} onClose={() => { setModal(false); setErr('') }} title="Add New Vehicle">
        <form onSubmit={addVehicle} className="space-y-4">
          <Alert type="error" message={err} />

          <div>
            <label className="label">Plate Number</label>
            <input name="plate_number" className="input uppercase" placeholder="TN01AB1234"
              value={form.plate_number} onChange={handle} required maxLength={20} />
          </div>

          <div>
            <label className="label">Vehicle Type</label>
            <select name="vehicle_type" className="input" value={form.vehicle_type} onChange={handle}>
              {TYPES.map(t => <option key={t} value={t}>{EMOJIS[t]} {t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
          </div>

          <div>
            <label className="label">Vehicle Name / Model</label>
            <input name="vehicle_name" className="input" placeholder="Honda City" value={form.vehicle_name} onChange={handle} required />
          </div>

          <div>
            <label className="label">Color (optional)</label>
            <input name="color" className="input" placeholder="White" value={form.color} onChange={handle} />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModal(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button type="submit" disabled={busy} className="btn-primary flex-1 justify-center">
              {busy ? <Spinner size={14} /> : 'Add Vehicle'}
            </button>
          </div>
        </form>
      </Modal>
    </Layout>
  )
}
