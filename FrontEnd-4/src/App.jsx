import { useState } from 'react'
import './App.css'

function App() {
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    setError('Invalid email/username or password.')
  }

  return (
    <main className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
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
          <p className="login-error" role="alert">
            {error}
          </p>
        )}
      </form>
    </main>
  )
}

export default App
