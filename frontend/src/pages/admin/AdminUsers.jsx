// src/pages/admin/AdminUsers.jsx
import { useState, useEffect } from 'react'
import { UserCheck, UserX } from 'lucide-react'
import { Alert, PageHeader, Spinner, Table } from '../../components/common'
import { adminAPI } from '../../services/api'

export default function AdminUsers() {
  const [users,   setUsers]   = useState([])
  const [load,    setLoad]    = useState(true)
  const [msg,     setMsg]     = useState({ type: '', text: '' })

  const reload = () => {
    adminAPI.users()
      .then(r => setUsers(r.data))
      .finally(() => setLoad(false))
  }

  useEffect(() => { reload() }, [])

  const toggle = async (id, name, isActive) => {
    try {
      await adminAPI.toggleUser(id)
      setMsg({ type: 'success', text: `${name} ${isActive ? 'deactivated' : 'activated'}` })
      reload()
    } catch {
      setMsg({ type: 'error', text: 'Action failed' })
    }
  }

  const rows = users.map(u => [
    u.full_name,
    <span className="text-xs text-slate-500">{u.email}</span>,
    u.phone,
    <span className={`badge ${u.role === 'admin' ? 'badge-purple' : 'badge-blue'}`}>{u.role}</span>,
    <span className={`badge ${u.is_active ? 'badge-green' : 'badge-red'}`}>
      {u.is_active ? 'Active' : 'Inactive'}
    </span>,
    new Date(u.created_at).toLocaleDateString('en-IN'),
    u.role !== 'admin' && (
      <button
        onClick={() => toggle(u.id, u.full_name, u.is_active)}
        className={`btn py-1 text-xs ${u.is_active ? 'btn-danger' : 'btn-secondary'}`}
      >
        {u.is_active ? <><UserX size={12}/> Deactivate</> : <><UserCheck size={12}/> Activate</>}
      </button>
    ),
  ])

  return (
    <div>
      <PageHeader title="User Management" subtitle={`${users.length} registered users`} />
      <Alert type={msg.type || 'info'} message={msg.text} />

      {load ? (
        <div className="flex justify-center py-20"><Spinner size={28} /></div>
      ) : (
        <div className="card p-0 overflow-hidden mt-4">
          <Table
            headers={['Name', 'Email', 'Phone', 'Role', 'Status', 'Joined', '']}
            rows={rows}
            emptyMsg="No users found"
          />
        </div>
      )}
    </div>
  )
}
