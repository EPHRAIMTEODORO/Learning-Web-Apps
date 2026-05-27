import { useEffect, useMemo, useState } from 'react'
import './App.css'

const categories = ['All', 'React', 'CSS', 'JavaScript', 'Tools']
const levels = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Quick Start']
const sortOptions = [
  { label: 'Title A-Z', value: 'title' },
  { label: 'Category', value: 'category' },
  { label: 'Reading time', value: 'readTime' },
]

const resources = [
  {
    title: 'React State Patterns',
    category: 'React',
    type: 'Guide',
    level: 'Intermediate',
    readTime: '12 min',
    summary: 'Compare local state, derived state, and prop-driven UI choices.',
  },
  {
    title: 'Responsive Layout Recipes',
    category: 'CSS',
    type: 'Reference',
    level: 'Beginner',
    readTime: '8 min',
    summary: 'Practical grid and flex layouts for dashboards, cards, and forms.',
  },
  {
    title: 'Array Method Practice',
    category: 'JavaScript',
    type: 'Exercise',
    level: 'Beginner',
    readTime: '15 min',
    summary: 'Practice map, filter, reduce, and sorting with real UI data.',
  },
  {
    title: 'Vite Project Checklist',
    category: 'Tools',
    type: 'Checklist',
    level: 'Quick Start',
    readTime: '5 min',
    summary: 'A short setup checklist for scripts, assets, linting, and builds.',
  },
  {
    title: 'Component Composition',
    category: 'React',
    type: 'Article',
    level: 'Advanced',
    readTime: '10 min',
    summary: 'Build reusable UI by splitting data, layout, and interaction logic.',
  },
  {
    title: 'Form Validation Basics',
    category: 'JavaScript',
    type: 'Tutorial',
    level: 'Intermediate',
    readTime: '14 min',
    summary: 'Validate inputs, show helpful errors, and keep form state clear.',
  },
]

function getPageFromHash() {
  return window.location.hash === '#/resources' ? 'resources' : 'home'
}

function App() {
  const [page, setPage] = useState(getPageFromHash)
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeLevel, setActiveLevel] = useState('All')
  const [sortBy, setSortBy] = useState('title')
  const [query, setQuery] = useState('')

  useEffect(() => {
    const handleHashChange = () => setPage(getPageFromHash())

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

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
  }, [activeCategory, query])

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
  }, [activeCategory, activeLevel, query, sortBy])

  const resetFilters = () => {
    setActiveCategory('All')
    setActiveLevel('All')
    setQuery('')
    setSortBy('title')
  }

  return (
    <main className="app-shell">
      {page === 'resources' ? (
        <ResourceListPage
          activeCategory={activeCategory}
          activeLevel={activeLevel}
          query={query}
          resetFilters={resetFilters}
          setActiveCategory={setActiveCategory}
          setActiveLevel={setActiveLevel}
          setQuery={setQuery}
          setSortBy={setSortBy}
          sortBy={sortBy}
          visibleResources={listResources}
        />
      ) : (
        <HomePage
          activeCategory={activeCategory}
          query={query}
          setActiveCategory={setActiveCategory}
          setQuery={setQuery}
          visibleResources={homeResources}
        />
      )}
    </main>
  )
}

function Topbar({ activePage }) {
  return (
    <nav className="topbar" aria-label="Primary navigation">
      <a className="brand" href="#/">
        Resource Browser
      </a>
      <div className="nav-actions">
        <a className={activePage === 'home' ? 'active' : ''} href="#/">
          Home
        </a>
        <a
          className={activePage === 'resources' ? 'active' : ''}
          href="#/resources"
        >
          Resources
        </a>
        <a href="#collections">Collections</a>
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
  query,
  setActiveCategory,
  setQuery,
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
          </form>
        </div>
      </section>

      <section className="stats-band" aria-label="Library summary">
        <div>
          <strong>{resources.length}</strong>
          <span>starter resources</span>
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
            </article>
          ))}
        </div>

        {visibleResources.length === 0 && (
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
            <a className="home-link" href="#/">
              Back home
            </a>
          </div>

          {visibleResources.length > 0 ? (
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

export default App
