import { useAuth } from '../contexts/useAuth'

function DashboardPage() {
  const { user, token } = useAuth()

  return (
    <main className="dashboard-page">
      <section className="dashboard-panel">
        <div className="auth-heading">
          <h1>You are logged in</h1>
          <p>{user.username} has an active demo JWT.</p>
        </div>

        <dl className="account-details">
          <div>
            <dt>Username</dt>
            <dd>{user.username}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{user.email}</dd>
          </div>
        </dl>

        <div className="token-panel">
          <span>Bearer token</span>
          <code>{token}</code>
        </div>
      </section>
    </main>
  )
}

export default DashboardPage
