import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/useAuth'
import { createDemoToken, validateDemoLogin } from '../utils/demoAuth'

function LoginPage() {
  const [error, setError] = useState('')
  const { isAuthenticated, login } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    const formData = new FormData(event.currentTarget)
    const loginId = formData.get('login-id')
    const password = formData.get('password')

    try {
      const user = await validateDemoLogin(loginId, password)
      login(user, createDemoToken(user))
      navigate(location.state?.from?.pathname ?? '/dashboard', { replace: true })
    } catch (loginError) {
      setError(loginError.message)
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-heading">
          <h1>Log in</h1>
          <p>Use an account created in this browser.</p>
        </div>

        <label htmlFor="login-id">Email or username</label>
        <input
          id="login-id"
          name="login-id"
          type="text"
          autoComplete="username"
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />

        <button type="submit">Submit</button>

        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}

        <p className="auth-switch">
          Need an account? <Link to="/register">Create one</Link>
        </p>
      </form>
    </main>
  )
}

export default LoginPage
