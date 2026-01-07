import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navigation from './components/Navigation'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'))

  const handleAuthChange = (authenticated) => {
    setIsAuthenticated(authenticated)
  }

  return (
    <AuthProvider onAuthChange={handleAuthChange}>
      <Router>
        <div className='min-h-screen bg-dark-bg text-white'>
          {isAuthenticated && <Navigation />}
          <Routes>
            <Route path='/login' element={<Login onAuthChange={handleAuthChange} />} />
            <Route path='/register' element={<Register onAuthChange={handleAuthChange} />} />
            <Route
              path='/'
              element={
                isAuthenticated ? (
                  <Dashboard />
                ) : (
                  <Navigate to='/login' />
                )
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
