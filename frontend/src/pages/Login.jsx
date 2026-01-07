import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../services/api'
import { validateLoginForm } from '../utils/validation'
import './Auth.css'

const Login = ({ onAuthChange }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const { isValid, errors: validationErrors } = validateLoginForm(email, password)
    if (!isValid) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    try {
      const response = await authAPI.login({ email, password })
      const { token, user } = response.data
      login(user, token)
      onAuthChange?.(true)
      navigate('/')
    } catch (error) {
      setErrors({ form: error.response?.data?.message || 'Login failed' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='auth-container'>
      <div className='auth-card'>
        <h1 className='auth-title'>💹 Price Tracker</h1>
        <p className='auth-subtitle'>Monitor Flipkart prices in real-time</p>
        
        <form onSubmit={handleSubmit} className='auth-form'>
          {errors.form && <div className='error-message'>{errors.form}</div>}
          
          <div className='form-group'>
            <label htmlFor='email'>Email Address</label>
            <input
              id='email'
              type='email'
              placeholder='your@email.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <span className='field-error'>{errors.email}</span>}
          </div>

          <div className='form-group'>
            <label htmlFor='password'>Password</label>
            <input
              id='password'
              type='password'
              placeholder='••••••••'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={errors.password ? 'input-error' : ''}
            />
            {errors.password && <span className='field-error'>{errors.password}</span>}
          </div>

          <button type='submit' className='auth-btn' disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className='auth-footer'>
          <p>Don't have an account? <Link to='/register'>Register here</Link></p>
        </div>
      </div>
    </div>
  )
}

export default Login
