import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ParkingSquare, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Alert, Spinner } from '../components/common'
import { getErrorMessage } from '../services/api'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [form, setForm]   = useState({ email: '', password: '' })
  const [show, setShow]   = useState(false)
  const [err,  setErr]    = useState('')
  const [busy, setBusy]   = useState(false)

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    setBusy(true); setErr('')
    try {
      const user = await login(form.email, form.password)
      navigate(user.role === 'admin' ? '/admin' : '/dashboard')
    } catch (ex) {
      setErr(getErrorMessage(ex))
    } finally { setBusy(false) }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-900 via-brand-700 to-brand-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-600 text-white mb-3">
            <ParkingSquare size={28} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Welcome back</h1>
          <p className="text-slate-500 text-sm mt-1">Sign in to ParkSmart</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <Alert type="error" message={err} />

          <div>
            <label className="label">Email</label>
            <input name="email" type="email" className="input" placeholder="you@example.com"
              value={form.email} onChange={handle} required />
          </div>

          <div>
            <label className="label">Password</label>
            <div className="relative">
              <input name="password" type={show ? 'text' : 'password'} className="input pr-10"
                placeholder="••••••••" value={form.password} onChange={handle} required />
              <button type="button" onClick={() => setShow(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={busy} className="btn-primary w-full justify-center py-2.5 mt-2">
            {busy ? <Spinner size={16} /> : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800">
          <p className="font-semibold mb-1">🔑 Demo credentials</p>
          <p>Admin: <b>admin@parksmart.local</b> / <b>Admin@123</b></p>
          <p className="mt-1">Register a new driver account below</p>
        </div>

        <p className="text-center text-sm text-slate-500 mt-4">
          No account?{' '}
          <Link to="/register" className="text-brand-600 font-semibold hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  )
}
