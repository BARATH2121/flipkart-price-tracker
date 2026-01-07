// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
export const API_TIMEOUT = 30000 // 30 seconds

// Authentication
export const AUTH_TOKEN_KEY = 'token'
export const AUTH_REFRESH_TOKEN_KEY = 'refreshToken'
export const AUTH_USER_KEY = 'user'

// Price Tracking
export const PRICE_UPDATE_INTERVAL = 60000 // 1 minute
export const MIN_PRICE_CHANGE_THRESHOLD = 1 // 1 rupee

// Alert Types
export const ALERT_TYPES = {
  PRICE_DROP: 'price_drop',
  THRESHOLD_REACHED: 'threshold_reached',
  OUT_OF_STOCK: 'out_of_stock',
  BACK_IN_STOCK: 'back_in_stock',
}

// Notification Methods
export const NOTIFICATION_METHODS = {
  EMAIL: 'email',
  SMS: 'sms',
  BOTH: 'both',
}

// UI Colors
export const COLORS = {
  PRIMARY_BG: '#0a0e27',
  SECONDARY_BG: '#1a1f3a',
  ACCENT: '#00d4ff',
  BORDER: '#2d3561',
  TEXT_PRIMARY: '#e0e0e0',
  SUCCESS: '#10b981',
  ERROR: '#ef4444',
  WARNING: '#f59e0b',
}

// Routes
export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/',
  PRODUCT_DETAIL: '/product/:id',
}

// Pagination
export const ITEMS_PER_PAGE = 12

// Validation Regex
export const VALIDATION = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  PASSWORD_MIN_LENGTH: 6,
}

// Toast Message Duration
export const TOAST_DURATION = 3000 // 3 seconds


// ============================================
// API Endpoints
// ============================================
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    PROFILE: '/auth/profile',
    LOGOUT: '/auth/logout',
  },
  // Products
  PRODUCTS: {
    BASE: '/products',
    LIST: '/products',
    DETAIL: (id) => `/products/${id}`,
    DELETE: (id) => `/products/${id}`,
    PRICE_HISTORY: (id) => `/products/${id}/price-history`,
    ANALYTICS: (id) => `/products/${id}/analytics`,
  },
  // Alerts
  ALERTS: {
    BASE: '/alerts',
    LIST: '/alerts',
    CREATE: '/alerts',
    DETAIL: (id) => `/alerts/${id}`,
    UPDATE: (id) => `/alerts/${id}`,
    DELETE: (id) => `/alerts/${id}`,
    PRODUCT: (productId) => `/alerts/product/${productId}`,
    NOTIFICATIONS: '/alerts/notifications',
  },
  // User
  USER: {
    PROFILE: '/user/profile',
    PREFERENCES: '/user/preferences',
  },
}

// ============================================
// API Request Config
// ============================================
export const API_CONFIG = {
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
}
