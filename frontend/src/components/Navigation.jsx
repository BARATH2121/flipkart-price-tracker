import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navigation.css'

const Navigation = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className='navbar'>
      <div className='navbar-container'>
        <Link to='/' className='navbar-logo'>
          <span className='logo-icon'>💹</span>
          <span className='logo-text'>Price Tracker</span>
        </Link>
        <div className='navbar-menu'>
          <Link to='/' className='nav-link'>
            Dashboard
          </Link>
        </div>
        <div className='navbar-profile'>
          {user && (
            <>
              <span className='user-email'>{user.email}</span>
              <button onClick={handleLogout} className='logout-btn'>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navigation
