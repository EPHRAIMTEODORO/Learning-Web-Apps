import { useEffect, useState } from 'react'
import './App.css'

const SESSION_STORAGE_KEY = 'course-api-user'
const ACCOUNT_STORAGE_KEY = 'course-api-accounts'
const CREATED_RESOURCES_STORAGE_KEY = 'course-api-created-resources'
const RESOURCE_API_URL =
  'https://api.sampleapis.com/codingresources/codingResources'

const emptyResourceForm = {
  description: '',
  url: '',
  types: '',
  topics: '',
  levels: '',
}

const base64UrlEncode = (value) => {
  const stringValue = typeof value === 'string' ? value : JSON.stringify(value)
  const bytes = new TextEncoder().encode(stringValue)
  const binaryValue = Array.from(bytes, (byte) =>
    String.fromCharCode(byte),
  ).join('')

  return btoa(binaryValue)
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '')
}

const createDemoJwt = (account) => {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  }
  const payload = {
    sub: account.email,
    name: account.name,
    scope: 'codingresources:read',
    iat: Math.floor(Date.now() / 1000),
  }
  const signature = 'course-api-demo-signature'

  return `${base64UrlEncode(header)}.${base64UrlEncode(
    payload,
  )}.${base64UrlEncode(signature)}`
}

const fetchWithAuth = (url, token, options = {}) =>
  fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  })

const getStoredUser = () => {
  const savedUser = localStorage.getItem(SESSION_STORAGE_KEY)

  if (!savedUser) {
    return null
  }

  try {
    const user = JSON.parse(savedUser)

    if (user.token) {
      return user
    }

    const userWithToken = {
      ...user,
      token: createDemoJwt(user),
    }

    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(userWithToken))
    return userWithToken
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

const getStoredCreatedResources = () => {
  const savedResources = localStorage.getItem(CREATED_RESOURCES_STORAGE_KEY)

  if (!savedResources) {
    return []
  }

  try {
    return JSON.parse(savedResources)
  } catch {
    localStorage.removeItem(CREATED_RESOURCES_STORAGE_KEY)
    return []
  }
}

const saveCreatedResources = (resources) => {
  localStorage.setItem(CREATED_RESOURCES_STORAGE_KEY, JSON.stringify(resources))
}

const saveSession = (account) => {
  const nextUser = {
    email: account.email,
    name: account.name,
    token: createDemoJwt(account),
  }

  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(nextUser))
  return nextUser
}

const parseList = (value) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

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
  const authToken = user.token
  const [resources, setResources] = useState([])
  const [resourcesStatus, setResourcesStatus] = useState('loading')
  const [resourcesError, setResourcesError] = useState('')
  const [resourceFormData, setResourceFormData] = useState(emptyResourceForm)
  const [createError, setCreateError] = useState('')
  const [createSuccess, setCreateSuccess] = useState('')
  const [selectedResourceId, setSelectedResourceId] = useState(null)
  const [selectedResource, setSelectedResource] = useState(null)
  const [selectedResourceStatus, setSelectedResourceStatus] = useState('idle')
  const [selectedResourceError, setSelectedResourceError] = useState('')

  useEffect(() => {
    const loadResources = async () => {
      try {
        setResourcesStatus('loading')
        setResourcesError('')

        const response = await fetchWithAuth(RESOURCE_API_URL, authToken)

        if (!response.ok) {
          throw new Error('Unable to load coding resources.')
        }

        const resourceData = await response.json()
        setResources([...getStoredCreatedResources(), ...resourceData])
        setResourcesStatus('success')
      } catch {
        setResourcesError('Could not load resources. Please try again.')
        setResourcesStatus('error')
      }
    }

    loadResources()
  }, [authToken])

  useEffect(() => {
    if (!selectedResourceId) {
      return
    }

    if (String(selectedResourceId).startsWith('local-')) {
      return
    }

    const loadResourceDetail = async () => {
      try {
        setSelectedResource(null)
        setSelectedResourceStatus('loading')
        setSelectedResourceError('')

        const response = await fetchWithAuth(
          `${RESOURCE_API_URL}/${selectedResourceId}`,
          authToken,
        )

        if (!response.ok) {
          throw new Error('Unable to load this resource.')
        }

        const resourceData = await response.json()
        setSelectedResource(resourceData)
        setSelectedResourceStatus('success')
      } catch {
        setSelectedResourceError('Could not load this resource. Try again.')
        setSelectedResourceStatus('error')
      }
    }

    loadResourceDetail()
  }, [authToken, selectedResourceId])

  const handleResourceFormChange = (event) => {
    const { name, value } = event.target

    setResourceFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }))
  }

  const handleCreateResource = (event) => {
    event.preventDefault()
    const description = resourceFormData.description.trim()
    const url = resourceFormData.url.trim()

    if (!description || !url) {
      setCreateError('Enter a title and URL for the resource.')
      setCreateSuccess('')
      return
    }

    try {
      new URL(url)
    } catch {
      setCreateError('Enter a valid URL.')
      setCreateSuccess('')
      return
    }

    const nextResource = {
      id: `local-${Date.now()}`,
      description,
      url,
      types: parseList(resourceFormData.types),
      topics: parseList(resourceFormData.topics),
      levels: parseList(resourceFormData.levels),
      isLocal: true,
    }
    const nextCreatedResources = [nextResource, ...getStoredCreatedResources()]

    saveCreatedResources(nextCreatedResources)
    setResources((currentResources) => [nextResource, ...currentResources])
    setResourceFormData(emptyResourceForm)
    setCreateError('')
    setCreateSuccess('Resource created and added to the list.')

    if (resourcesStatus === 'error') {
      setResourcesStatus('success')
    }
  }

  const handleSelectResource = (resourceId) => {
    const existingResource = resources.find(
      (resource) => String(resource.id) === String(resourceId),
    )

    if (existingResource?.isLocal) {
      setSelectedResource(existingResource)
      setSelectedResourceError('')
      setSelectedResourceStatus('success')
      setSelectedResourceId(resourceId)
      return
    }

    setSelectedResourceId(resourceId)
  }

  const showResourceList = () => {
    setSelectedResource(null)
    setSelectedResourceError('')
    setSelectedResourceStatus('idle')
    setSelectedResourceId(null)
  }

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
          This dashboard is only available after login. Resource API requests
          are sent with your JWT bearer token.
        </p>
        <p className="token-preview" aria-label="Current API token">
          JWT {authToken.slice(0, 24)}...
        </p>
      </section>

      {selectedResourceId ? (
        <ResourceDetailPage
          onBack={showResourceList}
          resource={selectedResource}
          resourceError={selectedResourceError}
          resourceStatus={selectedResourceStatus}
        />
      ) : (
        <ResourceListPage
          createError={createError}
          createSuccess={createSuccess}
          onCreateResource={handleCreateResource}
          onResourceFormChange={handleResourceFormChange}
          onSelectResource={handleSelectResource}
          resourceFormData={resourceFormData}
          resources={resources}
          resourcesError={resourcesError}
          resourcesStatus={resourcesStatus}
        />
      )}
    </main>
  )
}

function ResourceListPage({
  createError,
  createSuccess,
  onCreateResource,
  onResourceFormChange,
  onSelectResource,
  resourceFormData,
  resources,
  resourcesError,
  resourcesStatus,
}) {
  return (
    <section className="resource-section" aria-labelledby="resource-list-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Main resource</p>
          <h2 id="resource-list-title">Coding resources</h2>
        </div>
        <span className="count-badge">{resources.length} resources</span>
      </div>

      <CreateResourceForm
        createError={createError}
        createSuccess={createSuccess}
        formData={resourceFormData}
        onChange={onResourceFormChange}
        onSubmit={onCreateResource}
      />

      {resourcesStatus === 'loading' ? (
        <StatusPanel message="Loading coding resources..." />
      ) : null}

      {resourcesStatus === 'error' ? (
        <StatusPanel message={resourcesError} tone="error" />
      ) : null}

      {resourcesStatus === 'success' ? (
        <div className="resource-grid">
          {resources.map((resource) => (
            <article className="resource-card" key={resource.id}>
              <div>
                <p className="resource-id">Resource #{resource.id}</p>
                <h3>{resource.description}</h3>
              </div>

              <TagList items={resource.topics} label="Topics" />
              <TagList items={resource.levels} label="Levels" />

              <button
                className="resource-link"
                type="button"
                onClick={() => onSelectResource(resource.id)}
              >
                View details
              </button>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  )
}

function CreateResourceForm({
  createError,
  createSuccess,
  formData,
  onChange,
  onSubmit,
}) {
  return (
    <form className="create-form" onSubmit={onSubmit}>
      <div className="create-form-heading">
        <div>
          <p className="eyebrow">Create</p>
          <h3>Add a coding resource</h3>
        </div>
        <button className="primary-button compact" type="submit">
          Create
        </button>
      </div>

      <div className="create-form-grid">
        <label htmlFor="resource-description">
          Title
          <input
            id="resource-description"
            name="description"
            type="text"
            value={formData.description}
            onChange={onChange}
            placeholder="React state management guide"
          />
        </label>

        <label htmlFor="resource-url">
          URL
          <input
            id="resource-url"
            name="url"
            type="url"
            value={formData.url}
            onChange={onChange}
            placeholder="https://example.com/resource"
          />
        </label>

        <label htmlFor="resource-topics">
          Topics
          <input
            id="resource-topics"
            name="topics"
            type="text"
            value={formData.topics}
            onChange={onChange}
            placeholder="react, javascript"
          />
        </label>

        <label htmlFor="resource-types">
          Types
          <input
            id="resource-types"
            name="types"
            type="text"
            value={formData.types}
            onChange={onChange}
            placeholder="tutorial, guide"
          />
        </label>

        <label htmlFor="resource-levels">
          Levels
          <input
            id="resource-levels"
            name="levels"
            type="text"
            value={formData.levels}
            onChange={onChange}
            placeholder="beginner, intermediate"
          />
        </label>
      </div>

      {createError ? <p className="form-error">{createError}</p> : null}
      {createSuccess ? <p className="form-success">{createSuccess}</p> : null}
    </form>
  )
}

function ResourceDetailPage({ onBack, resource, resourceError, resourceStatus }) {
  return (
    <section
      className="resource-section"
      aria-labelledby="resource-detail-title"
    >
      <button className="back-button" type="button" onClick={onBack}>
        Back to list
      </button>

      {resourceStatus === 'loading' ? (
        <StatusPanel message="Loading resource details..." />
      ) : null}

      {resourceStatus === 'error' ? (
        <StatusPanel message={resourceError} tone="error" />
      ) : null}

      {resourceStatus === 'success' && resource ? (
        <article className="detail-panel">
          <p className="resource-id">Resource #{resource.id}</p>
          <h2 id="resource-detail-title">{resource.description}</h2>
          <div className="detail-meta">
            <DetailGroup label="Types" values={resource.types} />
            <DetailGroup label="Topics" values={resource.topics} />
            <DetailGroup label="Levels" values={resource.levels} />
          </div>
          <a
            className="external-link"
            href={resource.url}
            rel="noreferrer"
            target="_blank"
          >
            Open resource
          </a>
        </article>
      ) : null}
    </section>
  )
}

function DetailGroup({ label, values }) {
  return (
    <div>
      <p>{label}</p>
      <TagList items={values} label={label} />
    </div>
  )
}

function TagList({ items = [], label }) {
  if (!items.length) {
    return <p className="empty-tags">No {label.toLowerCase()} listed</p>
  }

  return (
    <ul className="tag-list" aria-label={label}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

function StatusPanel({ message, tone = 'neutral' }) {
  return <p className={`status-panel ${tone}`}>{message}</p>
}

export default App
