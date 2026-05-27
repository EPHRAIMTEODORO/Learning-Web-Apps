import { useMemo, useState } from 'react'
import './App.css'

const categories = ['All', 'React', 'CSS', 'JavaScript', 'Tools']

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

function App() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [query, setQuery] = useState('')

  const visibleResources = useMemo(() => {
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

  return (
    <main className="app-shell">
      <section className="home-hero" aria-labelledby="page-title">
        <nav className="topbar" aria-label="Primary navigation">
          <a className="brand" href="/">
            Resource Browser
          </a>
          <div className="nav-actions">
            <a href="#resources">Browse</a>
            <a href="#collections">Collections</a>
          </div>
        </nav>

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
    </main>
  )
}

export default App
