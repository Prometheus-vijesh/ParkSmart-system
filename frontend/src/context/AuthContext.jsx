import { createContext, useContext, useState, useCallback } from 'react'
import { authAPI } from '../services/api'

const AuthCtx = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ps_user')) } catch { return null }
  })

  const login = useCallback(async (email, password) => {
    const { data: tok } = await authAPI.login({ email, password })
    localStorage.setItem('ps_token', tok.access_token)
    const me = tok.user;
    localStorage.setItem('ps_user', JSON.stringify(me))
    setUser(me)
    return me
  }, [])

  const register = useCallback(async (payload) => {
    await authAPI.register(payload)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('ps_token')
    localStorage.removeItem('ps_user')
    setUser(null)
  }, [])

  return (
    <AuthCtx.Provider value={{ user, login, register, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthCtx.Provider>
  )
}

export const useAuth = () => useContext(AuthCtx)
