import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authAPI } from '../services/api'
import { validateRegisterForm } from '../utils/validation'
import './Auth.css'

const Register = ({ onAuthChange }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { isValid, errors: validationErrors } = validateRegisterForm(
      formData.username,
      formData.email,
      formData.password,
      formData.confirmPassword,
      formData.phone
    )

    if (!isValid) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    try {
      await authAPI.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      })
      navigate('/login')
    } catch (error) {
      setErrors({ form: error.response?.data?.message || 'Registration failed' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='auth-container'>
      <div className='auth-card'>
        <h1 className='auth-title'>💹 Create Account</h1>
        <p className='auth-subtitle'>Start tracking prices today</p>

        <form onSubmit={handleSubmit} className='auth-form'>
          {errors.form && <div className='error-message'>{errors.form}</div>}

          <div className='form-group'>
            <label htmlFor='username'>Username</label>
            <input
              id='username'
              type='text'
              name='username'
              placeholder='your_username'
              value={formData.username}
              onChange={handleChange}
              className={errors.username ? 'input-error' : ''}
            />
            {errors.username && <span className='field-error'>{errors.username}</span>}
          </div>

          <div className='form-group'>
            <label htmlFor='email'>Email Address</label>
            <input
              id='email'
              type='email'
              name='email'
              placeholder='your@email.com'
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <span className='field-error'>{errors.email}</span>}
          </div>

          <div className='form-group'>
            <label htmlFor='phone'>Phone (Optional)</label>
            <input
              id='phone'
              type='tel'
              name='phone'
              placeholder='10-digit number'
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? 'input-error' : ''}
            />
            {errors.phone && <span className='field-error'>{errors.phone}</span>}
          </div>

          <div className='form-group'>
            <label htmlFor='password'>Password</label>
            <input
              id='password'
              type='password'
              name='password'
              placeholder='••••••••'
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'input-error' : ''}
            />
            {errors.password && <span className='field-error'>{errors.password}</span>}
          </div>

          <div className='form-group'>
            <label htmlFor='confirmPassword'>Confirm Password</label>
            <input
              id='confirmPassword'
              type='password'
              name='confirmPassword'
              placeholder='••••••••'
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? 'input-error' : ''}
            />
            {errors.confirmPassword && <span className='field-error'>{errors.confirmPassword}</span>}
          </div>

          <button type='submit' className='auth-btn' disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <div className='auth-footer'>
          <p>Already have an account? <Link to='/login'>Login here</Link></p>
        </div>
      </div>
    </div>
  )
}

export default Register
