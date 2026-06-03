import { useAuth } from '../contexts/useAuth'

function Navbar() {
  const { logout } = useAuth()

  return (
    <nav className="navbar" aria-label="Main navigation">
      <span className="navbar-brand">Frontend 4</span>
      <button type="button" className="logout-button" onClick={logout}>
        Logout
      </button>
    </nav>
  )
}

export default Navbar
