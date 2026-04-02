import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ParkingSquare } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Alert, Spinner } from '../components/common'
import { getErrorMessage } from '../services/api'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', password: '' })
  const [err,  setErr]  = useState('')
  const [ok,   setOk]   = useState(false)
  const [busy, setBusy] = useState(false)

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    if (form.phone.length !== 10) return setErr('Phone must be exactly 10 digits')
    if (form.password.length < 8)  return setErr('Password must be at least 8 characters')
    setBusy(true); setErr('')
    try {
      await register(form)
      setOk(true)
      setTimeout(() => navigate('/login'), 2000)
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
          <h1 className="text-2xl font-bold text-slate-800">Create account</h1>
          <p className="text-slate-500 text-sm mt-1">Join ParkSmart for free</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {ok && <Alert type="success" message="Registered! Redirecting to login…" />}
          <Alert type="error" message={err} />

          {[
            { name: 'full_name', label: 'Full Name',         type: 'text',     placeholder: 'Arjun Kumar' },
            { name: 'email',     label: 'Email',              type: 'email',    placeholder: 'you@example.com' },
            { name: 'phone',     label: 'Phone (10 digits)',  type: 'tel',      placeholder: '9876543210' },
            { name: 'password',  label: 'Password',           type: 'password', placeholder: 'Min 8 characters' },
          ].map(({ name, label, type, placeholder }) => (
            <div key={name}>
              <label className="label">{label}</label>
              <input name={name} type={type} className="input" placeholder={placeholder}
                value={form[name]} onChange={handle} required />
            </div>
          ))}

          <button type="submit" disabled={busy || ok} className="btn-primary w-full justify-center py-2.5 mt-2">
            {busy ? <Spinner size={16} /> : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-600 font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
