import axios from 'axios'
import { API_BASE_URL, AUTH_TOKEN_KEY } from '../utils/constants'

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear local storage
      localStorage.removeItem(AUTH_TOKEN_KEY)
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Authentication endpoints
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  refreshToken: () => api.post('/auth/refresh'),
  logout: () => api.post('/auth/logout'),
}

// Product endpoints
export const productAPI = {
  addProduct: (productData) => api.post('/products/add', productData),
  getProducts: (params) => api.get('/products', { params }),
  getProductById: (id) => api.get(`/products/${id}`),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  getPriceHistory: (productId, params) => api.get(`/products/${productId}/price-history`, { params }),
  getAnalytics: (productId) => api.get(`/products/${productId}/analytics`),
}

// Alert endpoints
export const alertAPI = {
  createAlert: (alertData) => api.post('/alerts', alertData),
  getAlerts: (params) => api.get('/alerts', { params }),
  getAlertById: (id) => api.get(`/alerts/${id}`),
  updateAlert: (id, alertData) => api.put(`/alerts/${id}`, alertData),
  deleteAlert: (id) => api.delete(`/alerts/${id}`),
  getNotifications: (params) => api.get('/alerts/notifications', { params }),
}

// User profile endpoints
export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (userData) => api.put('/user/profile', userData),
  updatePreferences: (preferences) => api.put('/user/preferences', preferences),
}

// Convenience wrapper functions for ProductDetail page
export const getProductDetail = (productId) => productAPI.getProductById(productId)

export const updateNotificationSettings = (productId, settings) =>
  alertAPI.updateAlert(productId, settings)

export default api
