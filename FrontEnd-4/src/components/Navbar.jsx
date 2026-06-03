import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/useAuth'

function Navbar() {
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <nav className="navbar" aria-label="Main navigation">
      <Link className="navbar-brand" to="/dashboard">
        Frontend 4
      </Link>
      <div className="navbar-actions">
        {isAuthenticated ? (
          <>
            <NavLink className="nav-link" to="/dashboard">
              Dashboard
            </NavLink>
            <button type="button" className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink className="nav-link" to="/login">
              Log in
            </NavLink>
            <NavLink className="nav-link" to="/register">
              Create account
            </NavLink>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
