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

// ============================================
// Authentication endpoints
// ============================================
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  logout: () => api.post('/auth/logout'),
}

// ============================================
// Product endpoints
// ============================================
export const productAPI = {
  // Add new product with Flipkart URL
  addProduct: (productData) => api.post('/products', productData),
  
  // Get all user products with pagination
  getProducts: (params) => api.get('/products', { params }),
  
  // Get single product with full details and price history
  getProductById: (id) => api.get(`/products/${id}`),
  
  // Delete product and related data
  deleteProduct: (id) => api.delete(`/products/${id}`),
  
  // Get price history for chart visualization
  getPriceHistory: (productId, params) => 
    api.get(`/products/${productId}/price-history`, { params }),
  
  // Get price analytics and trends
  getAnalytics: (productId) => api.get(`/products/${productId}/analytics`),
}

// ============================================
// Alert endpoints
// ============================================
export const alertAPI = {
  // Create new price alert
  createAlert: (alertData) => api.post('/alerts', alertData),
  
  // Get all alerts for user with pagination
  getAlerts: (params) => api.get('/alerts', { params }),
  
  // Get single alert details
  getAlertById: (id) => api.get(`/alerts/${id}`),
  
  // Update alert threshold and settings
  updateAlert: (id, alertData) => api.put(`/alerts/${id}`, alertData),
  
  // Delete alert
  deleteAlert: (id) => api.delete(`/alerts/${id}`),
  
  // Get all alerts for specific product
  getProductAlerts: (productId) => api.get(`/alerts/product/${productId}`),
  
  // Get user notifications (alert triggers)
  getNotifications: (params) => api.get('/alerts/notifications', { params }),
}

// ============================================
// User endpoints
// ============================================
export const userAPI = {
  // Get user profile information
  getProfile: () => api.get('/user/profile'),
  
  // Update user profile
  updateProfile: (userData) => api.put('/user/profile', userData),
  
  // Update notification preferences
  updatePreferences: (preferences) => api.put('/user/preferences', preferences),
}

// ============================================
// Convenience wrapper functions
// ============================================

// Get product detail with all information
export const getProductDetail = (productId) => 
  productAPI.getProductById(productId)

// Update notification settings for a product
export const updateNotificationSettings = (productId, settings) => 
  alertAPI.updateAlert(productId, settings)

// Get all product data for dashboard
export const getDashboardData = async (params = {}) => {
  try {
    const [products, alerts] = await Promise.all([
      productAPI.getProducts(params),
      alertAPI.getAlerts(params),
    ])
    return { products: products.data, alerts: alerts.data }
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    throw error
  }
}

export default api
