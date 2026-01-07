import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navigation from './components/Navigation'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import ProductDetail from './pages/ProductDetail'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated by checking for token in localStorage
    const token = localStorage.getItem('token')
    setIsAuthenticated(!!token)
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return <div className='app-loading'>Loading...</div>
  }

  return (
    <AuthProvider>
      <Router>
        {isAuthenticated && <Navigation onLogout={() => setIsAuthenticated(false)} />}
        <Routes>
          {/* Public Routes */}
          <Route
            path='/login'
            element={isAuthenticated ? <Navigate to='/dashboard' /> : <Login onLoginSuccess={() => setIsAuthenticated(true)} />}
          />
          <Route
            path='/register'
            element={isAuthenticated ? <Navigate to='/dashboard' /> : <Register onRegisterSuccess={() => setIsAuthenticated(true)} />}
          />

          {/* Protected Routes */}
          <Route
            path='/dashboard'
            element={isAuthenticated ? <Dashboard /> : <Navigate to='/login' />}
          />
          <Route
            path='/product/:productId'
            element={isAuthenticated ? <ProductDetail /> : <Navigate to='/login' />}
          />

          {/* Default Route */}
          <Route path='/' element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} />} />
          <Route path='*' element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
