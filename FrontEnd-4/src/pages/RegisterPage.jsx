import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/useAuth'
import { createDemoAccount, createDemoToken } from '../utils/demoAuth'

function RegisterPage() {
  const [error, setError] = useState('')
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    const formData = new FormData(event.currentTarget)
    const email = formData.get('email')
    const username = formData.get('username')
    const password = formData.get('password')

    try {
      const user = await createDemoAccount({ email, username, password })
      login(user, createDemoToken(user))
      navigate('/dashboard', { replace: true })
    } catch (registerError) {
      setError(registerError.message)
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-heading">
          <h1>Create account</h1>
          <p>The account is stored locally for this demo.</p>
        </div>

        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required />

        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength="4"
          required
        />

        <button type="submit">Create account</button>

        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}

        <p className="auth-switch">
          Already have one? <Link to="/login">Log in</Link>
        </p>
      </form>
    </main>
  )
}

export default RegisterPage
