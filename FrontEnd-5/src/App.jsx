import { useState } from 'react'
import './App.css'

const SESSION_STORAGE_KEY = 'course-api-user'
const ACCOUNT_STORAGE_KEY = 'course-api-accounts'

const getStoredUser = () => {
  const savedUser = localStorage.getItem(SESSION_STORAGE_KEY)

  if (!savedUser) {
    return null
  }

  try {
    return JSON.parse(savedUser)
  } catch {
    localStorage.removeItem(SESSION_STORAGE_KEY)
    return null
  }
}

const getStoredAccounts = () => {
  const savedAccounts = localStorage.getItem(ACCOUNT_STORAGE_KEY)

  if (!savedAccounts) {
    return []
  }

  try {
    return JSON.parse(savedAccounts)
  } catch {
    localStorage.removeItem(ACCOUNT_STORAGE_KEY)
    return []
  }
}

const saveSession = (account) => {
  const nextUser = {
    email: account.email,
    name: account.name,
  }

  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(nextUser))
  return nextUser
}

function App() {
  const [user, setUser] = useState(getStoredUser)
  const [authMode, setAuthMode] = useState('login')
  const [formData, setFormData] = useState({
    name: '',
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
    const email = formData.email.trim().toLowerCase()
    const password = formData.password.trim()

    if (!email || !password) {
      setError('Enter an email and password to continue.')
      return
    }

    const account = getStoredAccounts().find(
      (storedAccount) => storedAccount.email === email,
    )

    if (!account || account.password !== password) {
      setError('No account found with that email and password.')
      return
    }

    setUser(saveSession(account))
    setFormData({ name: '', email: '', password: '' })
    setError('')
  }

  const handleSignup = (event) => {
    event.preventDefault()
    const name = formData.name.trim()
    const email = formData.email.trim().toLowerCase()
    const password = formData.password.trim()

    if (!name || !email || !password) {
      setError('Enter your name, email, and password to create an account.')
      return
    }

    if (password.length < 6) {
      setError('Use a password with at least 6 characters.')
      return
    }

    const accounts = getStoredAccounts()
    const accountExists = accounts.some(
      (storedAccount) => storedAccount.email === email,
    )

    if (accountExists) {
      setError('An account with that email already exists. Sign in instead.')
      return
    }

    const nextAccount = { name, email, password }
    localStorage.setItem(
      ACCOUNT_STORAGE_KEY,
      JSON.stringify([...accounts, nextAccount]),
    )
    setUser(saveSession(nextAccount))
    setFormData({ name: '', email: '', password: '' })
    setError('')
  }

  const handleLogout = () => {
    localStorage.removeItem(SESSION_STORAGE_KEY)
    setUser(null)
  }

  const handleAuthModeChange = (nextMode) => {
    setAuthMode(nextMode)
    setFormData({ name: '', email: '', password: '' })
    setError('')
  }

  return (
    <ProtectedDashboard
      authMode={authMode}
      error={error}
      formData={formData}
      onAuthModeChange={handleAuthModeChange}
      onInputChange={handleInputChange}
      onLogin={handleLogin}
      onLogout={handleLogout}
      onSignup={handleSignup}
      user={user}
    />
  )
}

function ProtectedDashboard({
  authMode,
  error,
  formData,
  onAuthModeChange,
  onInputChange,
  onLogin,
  onLogout,
  onSignup,
  user,
}) {
  if (!user) {
    return (
      <LoginPage
        authMode={authMode}
        error={error}
        formData={formData}
        onAuthModeChange={onAuthModeChange}
        onInputChange={onInputChange}
        onLogin={onLogin}
        onSignup={onSignup}
      />
    )
  }

  return <Dashboard onLogout={onLogout} user={user} />
}

function LoginPage({
  authMode,
  error,
  formData,
  onAuthModeChange,
  onInputChange,
  onLogin,
  onSignup,
}) {
  const isSignup = authMode === 'signup'
  const title = isSignup ? 'Create account' : 'Sign in'
  const intro = isSignup
    ? 'Create an account to access your protected course dashboard.'
    : 'Access your protected course dashboard.'

  return (
    <main className="auth-page">
      <section className="login-panel" aria-labelledby="login-title">
        <p className="eyebrow">Course API</p>
        <h1 id="login-title">{title}</h1>
        <p className="intro">{intro}</p>

        <form
          className="login-form"
          onSubmit={isSignup ? onSignup : onLogin}
        >
          {isSignup ? (
            <>
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={formData.name}
                onChange={onInputChange}
                placeholder="Your name"
              />
            </>
          ) : null}

          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={onInputChange}
            placeholder="student@example.com"
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={onInputChange}
            placeholder="Enter your password"
          />

          {error ? <p className="form-error">{error}</p> : null}

          <button className="primary-button" type="submit">
            {isSignup ? 'Sign up' : 'Login'}
          </button>
        </form>

        <p className="auth-switch">
          {isSignup ? 'Already have an account?' : 'Need an account?'}
          <button
            type="button"
            onClick={() => onAuthModeChange(isSignup ? 'login' : 'signup')}
          >
            {isSignup ? 'Sign in' : 'Sign up'}
          </button>
        </p>
      </section>
    </main>
  )
}

function Dashboard({ onLogout, user }) {
  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Course API</p>
          <h1>Dashboard</h1>
        </div>

        <button className="secondary-button" type="button" onClick={onLogout}>
          Logout
        </button>
      </header>

      <section className="dashboard-panel" aria-labelledby="welcome-title">
        <div className="dashboard-status">
          <p className="eyebrow">Signed in as {user.email}</p>
          <span className="status-pill">Protected</span>
        </div>
        <h2 id="welcome-title">Welcome, {user.name}</h2>
        <p>
          This dashboard is only available after login. The course data views
          can plug into this protected area next.
        </p>
      </section>
    </main>
  )
}

export default App
