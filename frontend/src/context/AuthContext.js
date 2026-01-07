import React, { createContext, useState, useEffect } from 'react'
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from '../utils/constants'

export const AuthContext = createContext()

export const AuthProvider = ({ children, onAuthChange }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Initialize auth state from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem(AUTH_TOKEN_KEY)
    const savedUser = localStorage.getItem(AUTH_USER_KEY)

    if (savedToken && savedUser) {
      try {
        setToken(savedToken)
        setUser(JSON.parse(savedUser))
        setIsAuthenticated(true)
        onAuthChange?.(true)
      } catch (error) {
        console.error('Failed to restore auth state:', error)
        localStorage.removeItem(AUTH_TOKEN_KEY)
        localStorage.removeItem(AUTH_USER_KEY)
      }
    }
    setIsLoading(false)
  }, [])

  // Login function
  const login = (userData, authToken) => {
    setUser(userData)
    setToken(authToken)
    setIsAuthenticated(true)
    localStorage.setItem(AUTH_TOKEN_KEY, authToken)
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData))
    onAuthChange?.(true)
  }

  // Logout function
  const logout = () => {
    setUser(null)
    setToken(null)
    setIsAuthenticated(false)
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(AUTH_USER_KEY)
    onAuthChange?.(false)
  }

  // Update user profile
  const updateUser = (userData) => {
    setUser(userData)
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData))
  }

  // Update token
  const updateToken = (newToken) => {
    setToken(newToken)
    localStorage.setItem(AUTH_TOKEN_KEY, newToken)
  }

  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser,
    updateToken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use auth context
export const useAuth = () => {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
