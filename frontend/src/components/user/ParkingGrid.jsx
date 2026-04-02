// src/components/user/ParkingGrid.jsx
import { clsx } from 'clsx'

const TYPE_COLORS = {
  car:     { free: 'bg-blue-100  border-blue-200  text-blue-700',  occ: 'bg-blue-400  text-white border-blue-400'  },
  bike:    { free: 'bg-green-100 border-green-200 text-green-700', occ: 'bg-green-500 text-white border-green-500' },
  bicycle: { free: 'bg-amber-100 border-amber-200 text-amber-700', occ: 'bg-amber-400 text-white border-amber-400' },
  ev:      { free: 'bg-purple-100 border-purple-200 text-purple-700', occ: 'bg-purple-500 text-white border-purple-500'},
}

const EMOJIS = { car: '🚗', bike: '🏍', bicycle: '🚲', ev: '⚡' }

export default function ParkingGrid({ availability = [] }) {
  // Build a visual summary per vehicle type
  const groups = ['car', 'bike', 'bicycle', 'ev'].map(type => {
    const rows = availability.filter(a => a.vehicle_type === type)
    const total    = rows.reduce((s, r) => s + r.total, 0)
    const occupied = rows.reduce((s, r) => s + r.occupied,    0)
    return { type, total, occupied, free: total - occupied }
  })

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">Live Parking Grid</h2>
      <div className="space-y-6">
        {groups.map(({ type, total, occupied, free }) => {
          const cols = TYPE_COLORS[type]
          const slots = Array.from({ length: Math.min(total, 60) }, (_, i) => i < occupied)
          return (
            <div key={type}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-slate-700 flex items-center gap-1.5">
                  {EMOJIS[type]} <span className="capitalize">{type === 'ev' ? 'EV' : type + 's'}</span>
                </span>
                <span className="text-sm text-slate-500">
                  <span className="text-red-500 font-semibold">{occupied}</span> occupied ·{' '}
                  <span className="text-emerald-600 font-semibold">{free}</span> free
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {slots.map((isOcc, i) => (
                  <div
                    key={i}
                    title={isOcc ? 'Occupied' : 'Available'}
                    className={clsx(
                      'w-5 h-5 rounded border text-[8px] flex items-center justify-center cursor-default',
                      isOcc ? cols.occ : cols.free
                    )}
                  />
                ))}
                {total > 60 && (
                  <span className="text-xs text-slate-400 self-center ml-1">+{total - 60} more</span>
                )}
              </div>
              {/* Progress bar */}
              <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={clsx('h-full rounded-full transition-all', cols.occ)}
                  style={{ width: `${total > 0 ? (occupied / total) * 100 : 0}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
      <p className="text-xs text-slate-400 mt-4">
        🟩 Free &nbsp;&nbsp; 🟦 Occupied &nbsp;&nbsp; Grid shows up to 60 slots per type
      </p>
    </div>
  )
}
