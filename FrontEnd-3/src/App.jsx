import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom'
import AppRouter from './routes/AppRouter'
import {
  createResourcePost,
  fetchWebDevResources,
} from './services/resourceApi'
import {
  getResourceDetailPath,
  ROUTE_PATHS,
} from './routes/resourceRoutes'
import './App.css'

const categories = ['All', 'React', 'CSS', 'JavaScript', 'Tools']
const levels = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Quick Start']
const CREATED_RESOURCES_KEY = 'mini-resource-browser-created-resources'
const sortOptions = [
  { label: 'Title A-Z', value: 'title' },
  { label: 'Category', value: 'category' },
  { label: 'Reading time', value: 'readTime' },
]

const starterResources = [
  {
    id: 'react-state-patterns',
    title: 'React State Patterns',
    category: 'React',
    type: 'Guide',
    level: 'Intermediate',
    readTime: '12 min',
    summary: 'Compare local state, derived state, and prop-driven UI choices.',
    details:
      'Learn when to keep state close to a component, when to lift it, and how to avoid duplicating values that can be calculated during render.',
    outcomes: ['Identify derived state', 'Choose state ownership', 'Simplify props'],
  },
  {
    id: 'responsive-layout-recipes',
    title: 'Responsive Layout Recipes',
    category: 'CSS',
    type: 'Reference',
    level: 'Beginner',
    readTime: '8 min',
    summary: 'Practical grid and flex layouts for dashboards, cards, and forms.',
    details:
      'Use repeatable CSS layout patterns to keep pages readable on phones, tablets, and desktop screens.',
    outcomes: ['Build fluid grids', 'Control spacing', 'Prevent overflow'],
  },
  {
    id: 'array-method-practice',
    title: 'Array Method Practice',
    category: 'JavaScript',
    type: 'Exercise',
    level: 'Beginner',
    readTime: '15 min',
    summary: 'Practice map, filter, reduce, and sorting with real UI data.',
    details:
      'Work through small data transformations that mirror the filtering and sorting logic used in resource browsers.',
    outcomes: ['Transform arrays', 'Filter datasets', 'Sort visible results'],
  },
  {
    id: 'vite-project-checklist',
    title: 'Vite Project Checklist',
    category: 'Tools',
    type: 'Checklist',
    level: 'Quick Start',
    readTime: '5 min',
    summary: 'A short setup checklist for scripts, assets, linting, and builds.',
    details:
      'Review the basic project pieces that make a Vite app easier to run, test, and hand off.',
    outcomes: ['Check scripts', 'Organize assets', 'Verify builds'],
  },
  {
    id: 'component-composition',
    title: 'Component Composition',
    category: 'React',
    type: 'Article',
    level: 'Advanced',
    readTime: '10 min',
    summary: 'Build reusable UI by splitting data, layout, and interaction logic.',
    details:
      'Study how smaller components can share responsibility without becoming tightly coupled or hard to reuse.',
    outcomes: ['Split UI concerns', 'Reuse layout', 'Pass clear props'],
  },
  {
    id: 'form-validation-basics',
    title: 'Form Validation Basics',
    category: 'JavaScript',
    type: 'Tutorial',
    level: 'Intermediate',
    readTime: '14 min',
    summary: 'Validate inputs, show helpful errors, and keep form state clear.',
    details:
      'Create form interactions that give users timely feedback without making the interface feel noisy.',
    outcomes: ['Validate input', 'Show errors', 'Reset state'],
  },
]

function readCreatedResources() {
  try {
    return JSON.parse(localStorage.getItem(CREATED_RESOURCES_KEY)) ?? []
  } catch {
    return []
  }
}

function saveCreatedResources(resources) {
  localStorage.setItem(CREATED_RESOURCES_KEY, JSON.stringify(resources))
}

function getCreatedResourceId(title, responseId) {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  return `created-${responseId}-${slug || Date.now()}`
}

function App() {
  const [baseResources, setBaseResources] = useState([])
  const [createdResources, setCreatedResources] = useState(readCreatedResources)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeLevel, setActiveLevel] = useState('All')
  const [sortBy, setSortBy] = useState('title')
  const [query, setQuery] = useState('')

  const loadResources = useCallback(async () => {
    try {
      setIsLoading(true)
      setLoadError('')

      const apiResources = await fetchWebDevResources()

      if (apiResources.length === 0) {
        throw new Error('The API returned no resources.')
      }

      setBaseResources([...apiResources, ...starterResources])
    } catch {
      setBaseResources(starterResources)
      setLoadError('Live resources unavailable. Showing starter resources.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const requestId = window.setTimeout(loadResources, 0)

    return () => window.clearTimeout(requestId)
  }, [loadResources])

  const resources = useMemo(
    () => [...createdResources, ...baseResources],
    [baseResources, createdResources],
  )

  const createResource = async (formData) => {
    const postPayload = {
      title: formData.title,
      body: formData.summary,
      userId: 1,
    }
    const responseData = await createResourcePost(postPayload)
    const createdResource = {
      id: getCreatedResourceId(formData.title, responseData.id ?? Date.now()),
      title: formData.title,
      category: formData.category,
      type: formData.type,
      level: formData.level,
      readTime: `${formData.readTime} min`,
      summary: formData.summary,
      details: formData.details,
      outcomes: formData.outcomes
        .split(',')
        .map((outcome) => outcome.trim())
        .filter(Boolean),
    }
    const nextCreatedResources = [createdResource, ...createdResources]

    setCreatedResources(nextCreatedResources)
    saveCreatedResources(nextCreatedResources)
    return createdResource
  }

  const homeResources = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return resources.filter((resource) => {
      const matchesCategory =
        activeCategory === 'All' || resource.category === activeCategory
      const searchableText = [
        resource.title,
        resource.category,
        resource.type,
        resource.level,
        resource.summary,
      ]
        .join(' ')
        .toLowerCase()

      return matchesCategory && searchableText.includes(normalizedQuery)
    })
  }, [activeCategory, query, resources])

  const listResources = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return resources
      .filter((resource) => {
        const matchesCategory =
          activeCategory === 'All' || resource.category === activeCategory
        const matchesLevel =
          activeLevel === 'All' || resource.level === activeLevel
        const searchableText = [
          resource.title,
          resource.category,
          resource.type,
          resource.level,
          resource.summary,
        ]
          .join(' ')
          .toLowerCase()

        return (
          matchesCategory &&
          matchesLevel &&
          searchableText.includes(normalizedQuery)
        )
      })
      .sort((firstResource, secondResource) => {
        if (sortBy === 'readTime') {
          return (
            parseInt(firstResource.readTime, 10) -
            parseInt(secondResource.readTime, 10)
          )
        }

        return firstResource[sortBy].localeCompare(secondResource[sortBy])
      })
  }, [activeCategory, activeLevel, query, resources, sortBy])

  const resetFilters = () => {
    setActiveCategory('All')
    setActiveLevel('All')
    setQuery('')
    setSortBy('title')
  }

  return (
    <main className="app-shell">
      <AppRouter
        createElement={<CreateResourcePage onCreateResource={createResource} />}
        detailElement={
          <ResourceDetailRoute
            isLoading={isLoading}
            loadError={loadError}
            onRetry={loadResources}
            resources={resources}
          />
        }
        homeElement={
          <HomePage
            activeCategory={activeCategory}
            isLoading={isLoading}
            loadError={loadError}
            onRetry={loadResources}
            query={query}
            setActiveCategory={setActiveCategory}
            setQuery={setQuery}
            totalResources={resources.length}
            visibleResources={homeResources}
          />
        }
        notFoundElement={<NotFoundPage />}
        resourcesElement={
          <ResourceListPage
            activeCategory={activeCategory}
            activeLevel={activeLevel}
            isLoading={isLoading}
            loadError={loadError}
            onRetry={loadResources}
            query={query}
            resetFilters={resetFilters}
            setActiveCategory={setActiveCategory}
            setActiveLevel={setActiveLevel}
            setQuery={setQuery}
            setSortBy={setSortBy}
            sortBy={sortBy}
            visibleResources={listResources}
          />
        }
      />
    </main>
  )
}

function ResourceDetailRoute({ isLoading, loadError, onRetry, resources }) {
  const { id } = useParams()
  const selectedResource = resources.find((resource) => resource.id === id)

  if (selectedResource) {
    return <ResourceDetailPage resource={selectedResource} routeId={id} />
  }

  if (isLoading) {
    return <LoadingDetailPage routeId={id} />
  }

  if (loadError) {
    return (
      <ResourceLoadErrorPage
        loadError={loadError}
        onRetry={onRetry}
        routeId={id}
      />
    )
  }

  return <NotFoundPage />
}

function Topbar() {
  const location = useLocation()

  return (
    <nav className="topbar" aria-label="Primary navigation">
      <Link className="brand" to={ROUTE_PATHS.home}>
        Resource Browser
      </Link>
      <div className="nav-actions">
        <NavLink
          className={({ isActive }) => (isActive ? 'active' : '')}
          end
          to={ROUTE_PATHS.home}
        >
          Home
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive && location.pathname !== ROUTE_PATHS.create ? 'active' : ''
          }
          to={ROUTE_PATHS.resources}
        >
          Resources
        </NavLink>
        <NavLink
          className={({ isActive }) => (isActive ? 'active' : '')}
          to={ROUTE_PATHS.create}
        >
          Create
        </NavLink>
        <Link to={ROUTE_PATHS.collections}>Collections</Link>
      </div>
    </nav>
  )
}

function SearchBox({ query, setQuery }) {
  return (
    <div className="search-row">
      <span className="search-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false">
          <circle cx="11" cy="11" r="7"></circle>
          <path d="m16 16 5 5"></path>
        </svg>
      </span>
      <input
        id="resource-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Try React, forms, grid..."
      />
    </div>
  )
}

function CategoryFilters({ activeCategory, setActiveCategory }) {
  return (
    <div className="category-list" aria-label="Resource categories">
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          className={category === activeCategory ? 'active' : ''}
          onClick={() => setActiveCategory(category)}
        >
          {category}
        </button>
      ))}
    </div>
  )
}

function HomePage({
  activeCategory,
  isLoading,
  loadError,
  onRetry,
  query,
  setActiveCategory,
  setQuery,
  totalResources,
  visibleResources,
}) {
  return (
    <>
      <section className="home-hero" aria-labelledby="page-title">
        <Topbar />

        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Mini learning library</p>
            <h1 id="page-title">Find the next resource for your web app.</h1>
            <p className="hero-lede">
              Search short guides, practice prompts, and tool checklists for the
              concepts you are working on right now.
            </p>
          </div>

          <form className="search-panel" role="search">
            <label htmlFor="resource-search">Search resources</label>
            <SearchBox query={query} setQuery={setQuery} />
            <CategoryFilters
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
            />
            <ResourceStatus
              isLoading={isLoading}
              loadError={loadError}
              onRetry={onRetry}
            />
          </form>
        </div>
      </section>

      <section className="stats-band" aria-label="Library summary">
        <div>
          <strong>{totalResources}</strong>
          <span>resources loaded</span>
        </div>
        <div>
          <strong>{categories.length - 1}</strong>
          <span>topic categories</span>
        </div>
        <div>
          <strong>{visibleResources.length}</strong>
          <span>matching now</span>
        </div>
      </section>

      <section className="content-grid" id="resources">
        <div className="section-heading">
          <p className="eyebrow">Browse</p>
          <h2>Featured resources</h2>
        </div>

        {isLoading ? (
          <LoadingCards />
        ) : (
          <div className="resource-grid">
            {visibleResources.map((resource) => (
              <article className="resource-card" key={resource.title}>
                <div className="card-topline">
                  <span>{resource.category}</span>
                  <span>{resource.readTime}</span>
                </div>
                <h3>{resource.title}</h3>
                <p>{resource.summary}</p>
                <div className="card-footer">
                  <span>{resource.type}</span>
                  <span>{resource.level}</span>
                </div>
                <Link
                  className="detail-link"
                  to={getResourceDetailPath(resource.id)}
                >
                  View details
                </Link>
              </article>
            ))}
          </div>
        )}

        {!isLoading && visibleResources.length === 0 && (
          <div className="empty-state">
            <h3>No resources found</h3>
            <p>Try a different search term or choose another category.</p>
          </div>
        )}
      </section>

      <section className="collection-band" id="collections">
        <div className="section-heading">
          <p className="eyebrow">Collections</p>
          <h2>Start with a focused path</h2>
        </div>
        <div className="collection-list">
          <a href="#resources">Build a React component</a>
          <a href="#resources">Polish a responsive layout</a>
          <a href="#resources">Practice JavaScript data flow</a>
        </div>
      </section>
    </>
  )
}

function ResourceListPage({
  activeCategory,
  activeLevel,
  isLoading,
  loadError,
  onRetry,
  query,
  resetFilters,
  setActiveCategory,
  setActiveLevel,
  setQuery,
  setSortBy,
  sortBy,
  visibleResources,
}) {
  return (
    <>
      <section className="list-hero" aria-labelledby="resource-list-title">
        <Topbar />
        <div className="list-hero-copy">
          <p className="eyebrow">Resource list</p>
          <h1 id="resource-list-title">Browse every learning resource.</h1>
          <p className="hero-lede">
            Filter the library by topic, level, and search terms to find the
            exact guide or exercise you need.
          </p>
        </div>
      </section>

      <section className="resource-list-page" aria-label="Resource list">
        <aside className="filter-panel">
          <form role="search">
            <label htmlFor="resource-search">Search resources</label>
            <SearchBox query={query} setQuery={setQuery} />
          </form>

          <ResourceStatus
            isLoading={isLoading}
            loadError={loadError}
            onRetry={onRetry}
          />

          <div className="filter-group">
            <p>Category</p>
            <CategoryFilters
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
            />
          </div>

          <label className="select-field" htmlFor="level-filter">
            Level
            <select
              id="level-filter"
              value={activeLevel}
              onChange={(event) => setActiveLevel(event.target.value)}
            >
              {levels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </label>

          <label className="select-field" htmlFor="sort-filter">
            Sort by
            <select
              id="sort-filter"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <button className="reset-button" type="button" onClick={resetFilters}>
            Reset filters
          </button>
        </aside>

        <div className="resource-list-shell">
          <div className="list-toolbar">
            <div>
              <p className="eyebrow">Results</p>
              <h2>{visibleResources.length} resources found</h2>
            </div>
            <div className="toolbar-actions">
              <Link className="home-link" to={ROUTE_PATHS.create}>
                Create resource
              </Link>
              <Link className="home-link" to={ROUTE_PATHS.home}>
                Back home
              </Link>
            </div>
          </div>

          {isLoading ? (
            <LoadingRows />
          ) : visibleResources.length > 0 ? (
            <div className="resource-list">
              {visibleResources.map((resource) => (
                <article className="resource-row" key={resource.title}>
                  <div className="resource-row-main">
                    <div className="card-topline">
                      <span>{resource.category}</span>
                      <span>{resource.readTime}</span>
                    </div>
                    <h3>{resource.title}</h3>
                    <p>{resource.summary}</p>
                  </div>
                  <div className="resource-row-meta">
                    <span>{resource.type}</span>
                    <span>{resource.level}</span>
                    <Link
                      className="detail-link compact"
                      to={getResourceDetailPath(resource.id)}
                    >
                      Details
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>No resources found</h3>
              <p>Try clearing filters or searching with a broader term.</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

function CreateResourcePage({ onCreateResource }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    category: 'React',
    type: 'Article',
    level: 'Beginner',
    readTime: '10',
    summary: '',
    details: '',
    outcomes: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const updateField = (field, value) => {
    setFormData((currentData) => ({ ...currentData, [field]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      setIsSubmitting(true)
      setSubmitError('')
      await onCreateResource(formData)
      navigate(ROUTE_PATHS.resources)
    } catch {
      setSubmitError('Could not create the resource. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <section className="list-hero" aria-labelledby="create-resource-title">
        <Topbar />
        <div className="list-hero-copy">
          <p className="eyebrow">Create resource</p>
          <h1 id="create-resource-title">Add a learning resource.</h1>
          <p className="hero-lede">
            Submit a resource through a POST request, then add it to the local
            browser list.
          </p>
        </div>
      </section>

      <section className="create-page" aria-label="Create resource form">
        <form className="create-form" onSubmit={handleSubmit}>
          <label htmlFor="resource-title">
            Title
            <input
              id="resource-title"
              required
              value={formData.title}
              onChange={(event) => updateField('title', event.target.value)}
              placeholder="React form patterns"
            />
          </label>

          <div className="form-grid">
            <label htmlFor="resource-category">
              Category
              <select
                id="resource-category"
                value={formData.category}
                onChange={(event) => updateField('category', event.target.value)}
              >
                {categories.filter((category) => category !== 'All').map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label htmlFor="resource-level">
              Level
              <select
                id="resource-level"
                value={formData.level}
                onChange={(event) => updateField('level', event.target.value)}
              >
                {levels.filter((level) => level !== 'All').map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </label>

            <label htmlFor="resource-type">
              Type
              <input
                id="resource-type"
                required
                value={formData.type}
                onChange={(event) => updateField('type', event.target.value)}
                placeholder="Article"
              />
            </label>

            <label htmlFor="resource-read-time">
              Reading time
              <input
                id="resource-read-time"
                min="1"
                required
                type="number"
                value={formData.readTime}
                onChange={(event) => updateField('readTime', event.target.value)}
              />
            </label>
          </div>

          <label htmlFor="resource-summary">
            Summary
            <textarea
              id="resource-summary"
              required
              rows="3"
              value={formData.summary}
              onChange={(event) => updateField('summary', event.target.value)}
              placeholder="A short description of the resource."
            ></textarea>
          </label>

          <label htmlFor="resource-details">
            Details
            <textarea
              id="resource-details"
              required
              rows="5"
              value={formData.details}
              onChange={(event) => updateField('details', event.target.value)}
              placeholder="What should someone learn from this?"
            ></textarea>
          </label>

          <label htmlFor="resource-outcomes">
            Outcomes
            <input
              id="resource-outcomes"
              required
              value={formData.outcomes}
              onChange={(event) => updateField('outcomes', event.target.value)}
              placeholder="Build forms, validate input, handle submit"
            />
          </label>

          {submitError && (
            <div className="resource-status warning" role="alert">
              <span>{submitError}</span>
            </div>
          )}

          <div className="form-actions">
            <button className="detail-link" disabled={isSubmitting} type="submit">
              {isSubmitting ? 'Creating...' : 'Create resource'}
            </button>
            <Link className="home-link" to={ROUTE_PATHS.resources}>
              Cancel
            </Link>
          </div>
        </form>
      </section>
    </>
  )
}

function LoadingCards() {
  return (
    <div className="resource-grid" aria-label="Loading resources">
      {Array.from({ length: 6 }, (_, index) => (
        <article className="resource-card skeleton-card" key={index}>
          <span className="skeleton-pill"></span>
          <span className="skeleton-line title"></span>
          <span className="skeleton-line"></span>
          <span className="skeleton-line short"></span>
          <span className="skeleton-button"></span>
        </article>
      ))}
    </div>
  )
}

function LoadingRows() {
  return (
    <div className="resource-list" aria-label="Loading resources">
      {Array.from({ length: 5 }, (_, index) => (
        <article className="resource-row skeleton-row" key={index}>
          <div className="resource-row-main">
            <span className="skeleton-pill"></span>
            <span className="skeleton-line title"></span>
            <span className="skeleton-line"></span>
          </div>
          <div className="resource-row-meta">
            <span className="skeleton-pill"></span>
            <span className="skeleton-pill"></span>
          </div>
        </article>
      ))}
    </div>
  )
}

function ResourceDetailPage({ resource, routeId }) {
  return (
    <>
      <section className="detail-hero" aria-labelledby="detail-title">
        <Topbar />
        <div className="detail-hero-grid">
          <div>
            <p className="eyebrow">{resource.category}</p>
            <h1 id="detail-title">{resource.title}</h1>
            <p className="hero-lede">{resource.summary}</p>
            <p className="route-id">
              Route id: <code>{routeId}</code>
            </p>
          </div>
          <div className="detail-summary">
            <span>{resource.type}</span>
            <span>{resource.level}</span>
            <span>{resource.readTime}</span>
          </div>
        </div>
      </section>

      <section className="detail-page" aria-label="Resource details">
        <article className="detail-content">
          <h2>Overview</h2>
          <p>{resource.details}</p>

          <h2>What you will practice</h2>
          <ul className="outcome-list">
            {resource.outcomes.map((outcome) => (
              <li key={outcome}>{outcome}</li>
            ))}
          </ul>
        </article>

        <aside className="detail-actions" aria-label="Resource actions">
          {resource.url && (
            <a
              className="detail-link"
              href={resource.url}
              target="_blank"
              rel="noreferrer"
            >
              Open article
            </a>
          )}
          <Link className="home-link" to={ROUTE_PATHS.resources}>
            Back to resources
          </Link>
          <Link className="home-link" to={ROUTE_PATHS.home}>
            Back home
          </Link>
        </aside>
      </section>
    </>
  )
}

function LoadingDetailPage({ routeId }) {
  return (
    <>
      <section className="detail-hero" aria-labelledby="detail-title">
        <Topbar />
        <div className="detail-hero-grid">
          <div>
            <p className="eyebrow">Loading</p>
            <h1 id="detail-title">Loading resource.</h1>
            <p className="route-id">
              Route id: <code>{routeId}</code>
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

function ResourceLoadErrorPage({ loadError, onRetry, routeId }) {
  return (
    <>
      <section className="detail-hero" aria-labelledby="detail-error-title">
        <Topbar />
        <div className="detail-hero-grid">
          <div>
            <p className="eyebrow">Error</p>
            <h1 id="detail-error-title">Could not load this resource.</h1>
            <p className="hero-lede">{loadError}</p>
            <p className="route-id">
              Route id: <code>{routeId}</code>
            </p>
          </div>
          <div className="detail-actions" aria-label="Resource actions">
            <button className="reset-button" type="button" onClick={onRetry}>
              Try again
            </button>
            <Link className="home-link" to={ROUTE_PATHS.resources}>
              Back to resources
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

function NotFoundPage() {
  return (
    <>
      <section className="not-found-page" aria-labelledby="not-found-title">
        <Topbar />
        <div className="not-found-card">
          <p className="eyebrow">404</p>
          <h1 id="not-found-title">Page not found.</h1>
          <p>
            The page you tried to open does not exist in this resource browser.
          </p>
          <div className="not-found-actions">
            <Link className="home-link" to={ROUTE_PATHS.resources}>
              View resources
            </Link>
            <Link className="home-link" to={ROUTE_PATHS.home}>
              Go home
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

function ResourceStatus({ isLoading, loadError, onRetry }) {
  if (isLoading) {
    return (
      <div className="resource-status" role="status">
        Loading live DEV resources...
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="resource-status warning" role="alert">
        <span>{loadError}</span>
        <button type="button" onClick={onRetry}>
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="resource-status success" role="status">
      Live resources loaded from DEV.
    </div>
  )
}

export default App
