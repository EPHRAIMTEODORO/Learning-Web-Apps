import { useEffect, useMemo, useState } from 'react'
import './App.css'
import {
  createDemoJwt,
  filterResources,
  getCourseCode,
  getCredits,
  getDepartment,
  getStatusLabel,
  getUniqueValues,
  parseList,
} from './courseCatalog'

const SESSION_STORAGE_KEY = 'course-api-user'
const ACCOUNT_STORAGE_KEY = 'course-api-accounts'
const CREATED_RESOURCES_STORAGE_KEY = 'course-api-created-resources'
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'https://api.sampleapis.com'
const RESOURCE_API_URL =
  `${API_BASE_URL.replace(/\/$/, '')}/codingresources/codingResources`

const emptyResourceForm = {
  description: '',
  url: '',
  types: '',
  topics: '',
  levels: '',
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
      <section className="auth-card" aria-labelledby="login-title">
        <div className="auth-visual">
          <span className="brand-icon">CC</span>
          <p className="eyebrow">Course Catalog</p>
          <h1>Modern academic discovery</h1>
          <p>
            Access protected course resources, build a custom catalog, and
            explore learning pathways from one polished workspace.
          </p>
        </div>

        <div className="login-panel">
          <p className="eyebrow">Secure access</p>
          <h2 id="login-title">{title}</h2>
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
              {isSignup ? 'Create account' : 'Login'}
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
        </div>
      </section>
    </main>
  )
}

function Dashboard({ onLogout, user }) {
  const authToken = user.token
  const [resources, setResources] = useState([])
  const [resourcesStatus, setResourcesStatus] = useState('loading')
  const [resourcesError, setResourcesError] = useState('')
  const [resourcesRequestKey, setResourcesRequestKey] = useState(0)
  const [resourceFormData, setResourceFormData] = useState(emptyResourceForm)
  const [createError, setCreateError] = useState('')
  const [createSuccess, setCreateSuccess] = useState('')
  const [selectedResourceId, setSelectedResourceId] = useState(null)
  const [selectedResource, setSelectedResource] = useState(null)
  const [selectedResourceStatus, setSelectedResourceStatus] = useState('idle')
  const [selectedResourceError, setSelectedResourceError] = useState('')
  const [detailRequestKey, setDetailRequestKey] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [topicFilter, setTopicFilter] = useState('all')
  const [levelFilter, setLevelFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  const topics = useMemo(() => getUniqueValues(resources, 'topics'), [resources])
  const levels = useMemo(() => getUniqueValues(resources, 'levels'), [resources])
  const types = useMemo(() => getUniqueValues(resources, 'types'), [resources])
  const filteredResources = useMemo(
    () =>
      filterResources({
        levelFilter,
        resources,
        searchQuery,
        topicFilter,
        typeFilter,
      }),
    [levelFilter, resources, searchQuery, topicFilter, typeFilter],
  )
  const activeFilterCount = [topicFilter, levelFilter, typeFilter].filter(
    (filterValue) => filterValue !== 'all',
  ).length
  const hasSearchOrFilters = Boolean(searchQuery.trim()) || activeFilterCount > 0

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
  }, [authToken, resourcesRequestKey])

  useEffect(() => {
    if (!selectedResourceId || String(selectedResourceId).startsWith('local-')) {
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
  }, [authToken, detailRequestKey, selectedResourceId])

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
      <nav className="topbar" aria-label="Primary navigation">
        <div className="brand-mark">
          <span>CC</span>
          <div>
            <p>Course Catalog</p>
            <strong>Academic Portal</strong>
          </div>
        </div>

        <div className="nav-actions">
          <span className="nav-pill">Protected</span>
          <button className="secondary-button" type="button" onClick={onLogout}>
            Logout
          </button>
        </div>
      </nav>

      <section className="hero-section" aria-labelledby="catalog-title">
        <div className="hero-content">
          <p className="eyebrow">Signed in as {user.email}</p>
          <h1 id="catalog-title">Discover courses built for modern learners</h1>
          <p>
            Search, filter, create, and review academic learning resources from
            a protected course catalog powered by authenticated API requests.
          </p>

          <div className="hero-search" role="search">
            <label htmlFor="course-search">Search catalog</label>
            <input
              id="course-search"
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by course, department, level, or topic"
            />
          </div>
        </div>

        <aside className="hero-card" aria-label="Catalog summary">
          <div>
            <span className="metric-value">{resources.length}</span>
            <span className="metric-label">Courses available</span>
          </div>
          <div>
            <span className="metric-value">{filteredResources.length}</span>
            <span className="metric-label">Matching results</span>
          </div>
          <p className="token-preview" aria-label="Current API token">
            JWT {authToken.slice(0, 24)}...
          </p>
        </aside>
      </section>

      <section className="catalog-shell">
        <aside className="filter-panel" aria-label="Catalog filters">
          <div className="filter-heading">
            <div>
              <p className="eyebrow">Filters</p>
              <h2>Refine courses</h2>
            </div>
            {hasSearchOrFilters ? (
              <button
                className="text-button"
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  setTopicFilter('all')
                  setLevelFilter('all')
                  setTypeFilter('all')
                }}
              >
                Clear
              </button>
            ) : null}
          </div>

          <FilterSelect
            label="Department"
            onChange={setTopicFilter}
            options={topics}
            value={topicFilter}
          />
          <FilterSelect
            label="Level"
            onChange={setLevelFilter}
            options={levels}
            value={levelFilter}
          />
          <FilterSelect
            label="Format"
            onChange={setTypeFilter}
            options={types}
            value={typeFilter}
          />

          <div className="active-filter-list">
            {searchQuery.trim() ? <span>Search: {searchQuery.trim()}</span> : null}
            {topicFilter !== 'all' ? <span>{topicFilter}</span> : null}
            {levelFilter !== 'all' ? <span>{levelFilter}</span> : null}
            {typeFilter !== 'all' ? <span>{typeFilter}</span> : null}
          </div>
        </aside>

        <div className="catalog-content">
          {selectedResourceId ? (
            <ResourceDetailPage
              onRetry={() => setDetailRequestKey((currentKey) => currentKey + 1)}
              onBack={showResourceList}
              resource={selectedResource}
              resourceError={selectedResourceError}
              resourceStatus={selectedResourceStatus}
            />
          ) : (
            <ResourceListPage
              createError={createError}
              createSuccess={createSuccess}
              filteredCount={filteredResources.length}
              hasSearchOrFilters={hasSearchOrFilters}
              onCreateResource={handleCreateResource}
              onResourceFormChange={handleResourceFormChange}
              onRetryResources={() =>
                setResourcesRequestKey((currentKey) => currentKey + 1)
              }
              onSelectResource={handleSelectResource}
              resourceFormData={resourceFormData}
              resources={filteredResources}
              resourcesError={resourcesError}
              resourcesStatus={resourcesStatus}
              totalCount={resources.length}
            />
          )}
        </div>
      </section>

      <footer className="site-footer">
        <p>Course Catalog</p>
        <span>Secure academic discovery for students and faculty.</span>
      </footer>
    </main>
  )
}

function FilterSelect({ label, onChange, options, value }) {
  return (
    <label className="filter-field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="all">All {label.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

function ResourceListPage({
  createError,
  createSuccess,
  filteredCount,
  hasSearchOrFilters,
  onCreateResource,
  onResourceFormChange,
  onRetryResources,
  onSelectResource,
  resourceFormData,
  resources,
  resourcesError,
  resourcesStatus,
  totalCount,
}) {
  return (
    <section className="resource-section" aria-labelledby="resource-list-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Catalog</p>
          <h2 id="resource-list-title">Featured courses</h2>
        </div>
        <span className="count-badge">
          {filteredCount} of {totalCount} courses
        </span>
      </div>

      <CreateResourceForm
        createError={createError}
        createSuccess={createSuccess}
        formData={resourceFormData}
        onChange={onResourceFormChange}
        onSubmit={onCreateResource}
      />

      {resourcesStatus === 'loading' ? (
        <StatusPanel
          message="Fetching the latest learning resources from the API."
          title="Loading resources"
        />
      ) : null}

      {resourcesStatus === 'error' ? (
        <StatusPanel
          actionLabel="Retry"
          message={resourcesError}
          onAction={onRetryResources}
          title="Resources could not load"
          tone="error"
        />
      ) : null}

      {resourcesStatus === 'success' ? (
        resources.length ? (
          <div className="resource-grid">
            {resources.map((resource) => (
              <CourseCard
                key={resource.id}
                onSelectResource={onSelectResource}
                resource={resource}
              />
            ))}
          </div>
        ) : (
          <StatusPanel
            message={
              hasSearchOrFilters
                ? 'Try clearing a filter or searching for a different course.'
                : 'Create your first resource to populate the dashboard.'
            }
            title={hasSearchOrFilters ? 'No matching courses' : 'No courses yet'}
          />
        )
      ) : null}
    </section>
  )
}

function CourseCard({ onSelectResource, resource }) {
  const courseCode = getCourseCode(resource)
  const department = getDepartment(resource)
  const credits = getCredits(resource)
  const status = getStatusLabel(resource)

  return (
    <article className="resource-card">
      <div className="card-topline">
        <span className="course-code">{courseCode}</span>
        <span className={`course-status ${status.toLowerCase()}`}>{status}</span>
      </div>

      <div>
        <h3>{resource.description}</h3>
        <p className="course-department">{department}</p>
      </div>

      <dl className="course-meta">
        <div>
          <dt>Credits</dt>
          <dd>{credits}</dd>
        </div>
        <div>
          <dt>Department</dt>
          <dd>{department}</dd>
        </div>
      </dl>

      <TagList items={resource.levels} label="Levels" />

      <div className="card-actions">
        <button
          className="resource-link"
          type="button"
          onClick={() => onSelectResource(resource.id)}
        >
          View details
        </button>
        <a
          className="ghost-link"
          href={resource.url}
          rel="noreferrer"
          target="_blank"
        >
          Open
        </a>
      </div>
    </article>
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

function ResourceDetailPage({
  onBack,
  onRetry,
  resource,
  resourceError,
  resourceStatus,
}) {
  return (
    <section
      className="resource-section"
      aria-labelledby="resource-detail-title"
    >
      <button className="back-button" type="button" onClick={onBack}>
        Back to list
      </button>

      {resourceStatus === 'loading' ? (
        <StatusPanel
          message="Fetching this resource with your bearer token."
          title="Loading details"
        />
      ) : null}

      {resourceStatus === 'error' ? (
        <StatusPanel
          actionLabel="Retry"
          message={resourceError}
          onAction={onRetry}
          title="Resource could not load"
          tone="error"
        />
      ) : null}

      {resourceStatus === 'success' && resource ? (
        <article className="detail-panel">
          <div className="detail-hero">
            <div>
              <span className="course-code">{getCourseCode(resource)}</span>
              <h2 id="resource-detail-title">{resource.description}</h2>
              <p>
                A curated learning resource from the {getDepartment(resource)}
                department.
              </p>
            </div>
            <span className={`course-status ${getStatusLabel(resource).toLowerCase()}`}>
              {getStatusLabel(resource)}
            </span>
          </div>

          <dl className="detail-summary">
            <div>
              <dt>Credits</dt>
              <dd>{getCredits(resource)}</dd>
            </div>
            <div>
              <dt>Department</dt>
              <dd>{getDepartment(resource)}</dd>
            </div>
            <div>
              <dt>Course Code</dt>
              <dd>{getCourseCode(resource)}</dd>
            </div>
          </dl>

          <div className="detail-meta">
            <DetailGroup label="Formats" values={resource.types} />
            <DetailGroup label="Departments" values={resource.topics} />
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

function StatusPanel({
  actionLabel,
  message,
  onAction,
  title,
  tone = 'neutral',
}) {
  return (
    <div className={`status-panel ${tone}`} role="status">
      {tone === 'neutral' ? <span className="loading-dot"></span> : null}
      <div>
        <h3>{title}</h3>
        <p>{message}</p>
      </div>
      {onAction ? (
        <button className="secondary-button compact" type="button" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </div>
  )
}

export default App
