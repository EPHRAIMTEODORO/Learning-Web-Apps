import { useState } from 'react'
import './App.css'

const STORAGE_KEY = 'course-api-user'

const getStoredUser = () => {
  const savedUser = localStorage.getItem(STORAGE_KEY)

  if (!savedUser) {
    return null
  }

  try {
    return JSON.parse(savedUser)
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

function App() {
  const [user, setUser] = useState(getStoredUser)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')

  const handleInputChange = (event) => {
    const { name, value } = event.target

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }))
  }

  const handleLogin = (event) => {
    event.preventDefault()

    if (!formData.email.trim() || !formData.password.trim()) {
      setError('Enter an email and password to continue.')
      return
    }

    const nextUser = {
      email: formData.email.trim(),
      name: formData.email.trim().split('@')[0],
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser))
    setUser(nextUser)
    setFormData({ email: '', password: '' })
    setError('')
  }

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }

  if (!user) {
    return (
      <main className="auth-page">
        <section className="login-panel" aria-labelledby="login-title">
          <p className="eyebrow">Course API</p>
          <h1 id="login-title">Sign in</h1>
          <p className="intro">
            Access your course tools with your class account.
          </p>

          <form className="login-form" onSubmit={handleLogin}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="student@example.com"
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
            />

            {error ? <p className="form-error">{error}</p> : null}

            <button className="primary-button" type="submit">
              Login
            </button>
          </form>
        </section>
      </main>
    )
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Course API</p>
          <h1>Dashboard</h1>
        </div>

        <button className="secondary-button" type="button" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <section className="dashboard-panel" aria-labelledby="welcome-title">
        <p className="eyebrow">Signed in as {user.email}</p>
        <h2 id="welcome-title">Welcome, {user.name}</h2>
        <p>
          Login and logout are ready. The course data views can plug into this
          page next.
        </p>
      </section>
    </main>
  )
}

export default App
