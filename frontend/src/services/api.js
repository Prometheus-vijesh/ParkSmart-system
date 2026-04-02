import axios from 'axios'

const api = axios.create({ baseURL: 'http://127.0.0.1:8000/api' })

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('ps_token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

api.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('ps_token')
      localStorage.removeItem('ps_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ── Helper: always returns a plain string from any FastAPI error ──────────────
export function getErrorMessage(ex) {
  const detail = ex?.response?.data?.detail
  if (!detail) return ex?.message || 'Something went wrong'
  if (typeof detail === 'string') return detail
  // FastAPI 422 returns an array of validation error objects
  if (Array.isArray(detail)) {
    return detail.map(d => d.msg || JSON.stringify(d)).join(', ')
  }
  return JSON.stringify(detail)
}

export const authAPI = {
  register: d  => api.post('/auth/register', d),
  login:    d  => api.post('/auth/login', d),
  me:       () => api.get('/auth/me'),
  logout:   () => api.post('/auth/logout'),
}

export const vehiclesAPI = {
  list:   ()  => api.get('/vehicles'),
  add:    d   => api.post('/vehicles', d),
  remove: id  => api.delete(`/vehicles/${id}`),
}

export const bookingsAPI = {
  create:         d  => api.post('/bookings', d),
  checkout:       d  => api.post('/bookings/checkout', d),
  myBookings:     () => api.get('/bookings/my'),
  activeBooking:  () => api.get('/bookings/active'),
  getById:        id => api.get(`/bookings/${id}`),
  validateCoupon: d  => api.post('/bookings/validate-coupon', d),
}

export const parkingAPI = {
  availability: ()         => api.get('/parking/slots/summary'),
  slots:        (type, st) => api.get(`/parking/slots/${type}?slot_type=${st}`),
  recommend:    type       => api.get(`/parking/recommend?vehicle_type=${type}`),
}

export const adminAPI = {
  users:          ()        => api.get('/admin/users'),
  toggleUser:     id        => api.patch(`/admin/users/${id}/toggle`),
  activeBookings: ()        => api.get('/admin/bookings/active'),
  getPricing:     ()        => api.get('/admin/pricing'),
  updatePricing:  (type, d) => api.patch(`/admin/pricing/${type}`, d),
  getCoupons:     ()        => api.get('/admin/coupons'),
  toggleCoupon:   id        => api.patch(`/admin/coupons/${id}/toggle`),
  summary:        ()        => api.get('/admin/analytics/summary'),
  hourlyRevenue:  ()        => api.get('/admin/analytics/hourly-revenue'),
  weeklyBookings: ()        => api.get('/admin/analytics/weekly-bookings'),
}
