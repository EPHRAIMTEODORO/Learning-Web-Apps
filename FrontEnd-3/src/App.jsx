import { useCallback, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import './App.css'

const categories = ['All', 'React', 'CSS', 'JavaScript', 'Tools']
const levels = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Quick Start']
const DEV_API_URL = 'https://dev.to/api/articles?tag=webdev&per_page=12'
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

function pickCategory(tags) {
  if (tags.includes('react')) {
    return 'React'
  }

  if (tags.includes('css')) {
    return 'CSS'
  }

  if (tags.includes('javascript') || tags.includes('js')) {
    return 'JavaScript'
  }

  return 'Tools'
}

function mapArticleToResource(article) {
  const tags = article.tag_list ?? []
  const readableTags = tags.slice(0, 3)

  return {
    id: String(article.id),
    title: article.title,
    category: pickCategory(tags),
    type: 'Article',
    level: 'Beginner',
    readTime: `${article.reading_time_minutes || 5} min`,
    summary:
      article.description ||
      'A web development resource from the DEV Community API.',
    details:
      article.description ||
      'This resource was loaded from the DEV Community public articles API.',
    outcomes:
      readableTags.length > 0
        ? readableTags.map((tag) => `Explore ${tag}`)
        : ['Read the article', 'Review the concept', 'Apply the idea'],
    url: article.url,
  }
}

function getRouteFromLocation() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'

  if (path === '/') {
    return { name: 'home' }
  }

  if (path === '/resources') {
    return { name: 'resources' }
  }

  if (path.startsWith('/resources/')) {
    const id = decodeURIComponent(path.replace('/resources/', ''))
    return { name: 'detail', id }
  }

  return { name: 'notFound' }
}

function App() {
  const [route, setRoute] = useState(getRouteFromLocation)
  const [resources, setResources] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeLevel, setActiveLevel] = useState('All')
  const [sortBy, setSortBy] = useState('title')
  const [query, setQuery] = useState('')

  useEffect(() => {
    const handleRouteChange = () => setRoute(getRouteFromLocation())

    window.addEventListener('popstate', handleRouteChange)
    return () => window.removeEventListener('popstate', handleRouteChange)
  }, [])

  const loadResources = useCallback(async () => {
    try {
      setIsLoading(true)
      setLoadError('')

      const response = await axios.get(DEV_API_URL)
      const apiResources = response.data
        .filter((article) => article.title && article.id)
        .map(mapArticleToResource)

      if (apiResources.length === 0) {
        throw new Error('The API returned no resources.')
      }

      setResources([...apiResources, ...starterResources])
    } catch {
      setResources(starterResources)
      setLoadError('Live resources unavailable. Showing starter resources.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const requestId = window.setTimeout(loadResources, 0)

    return () => window.clearTimeout(requestId)
  }, [loadResources])

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

  const selectedResource = resources.find(
    (resource) => resource.id === route.id,
  )

  return (
    <main className="app-shell">
      {route.name === 'resources' ? (
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
      ) : route.name === 'detail' && selectedResource ? (
        <ResourceDetailPage resource={selectedResource} routeId={route.id} />
      ) : route.name === 'detail' && isLoading ? (
        <LoadingDetailPage routeId={route.id} />
      ) : route.name === 'detail' && loadError ? (
        <ResourceLoadErrorPage
          loadError={loadError}
          onRetry={loadResources}
          routeId={route.id}
        />
      ) : route.name === 'detail' ? (
        <NotFoundPage />
      ) : route.name === 'notFound' ? (
        <NotFoundPage />
      ) : (
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
      )}
    </main>
  )
}

function Topbar({ activePage }) {
  return (
    <nav className="topbar" aria-label="Primary navigation">
      <a className="brand" href="/">
        Resource Browser
      </a>
      <div className="nav-actions">
        <a className={activePage === 'home' ? 'active' : ''} href="/">
          Home
        </a>
        <a
          className={activePage === 'resources' ? 'active' : ''}
          href="/resources"
        >
          Resources
        </a>
        <a href="/#collections">Collections</a>
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
        <Topbar activePage="home" />

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
                <a className="detail-link" href={`/resources/${resource.id}`}>
                  View details
                </a>
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
        <Topbar activePage="resources" />
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
            <a className="home-link" href="/">
              Back home
            </a>
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
                    <a
                      className="detail-link compact"
                      href={`/resources/${resource.id}`}
                    >
                      Details
                    </a>
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
        <Topbar activePage="resources" />
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
          <a className="home-link" href="/resources">
            Back to resources
          </a>
          <a className="home-link" href="/">
            Back home
          </a>
        </aside>
      </section>
    </>
  )
}

function LoadingDetailPage({ routeId }) {
  return (
    <>
      <section className="detail-hero" aria-labelledby="detail-title">
        <Topbar activePage="resources" />
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
        <Topbar activePage="resources" />
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
            <a className="home-link" href="/resources">
              Back to resources
            </a>
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
        <Topbar activePage="none" />
        <div className="not-found-card">
          <p className="eyebrow">404</p>
          <h1 id="not-found-title">Page not found.</h1>
          <p>
            The page you tried to open does not exist in this resource browser.
          </p>
          <div className="not-found-actions">
            <a className="home-link" href="/resources">
              View resources
            </a>
            <a className="home-link" href="/">
              Go home
            </a>
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
