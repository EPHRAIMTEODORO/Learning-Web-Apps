import axios from 'axios'

const DEV_API_BASE_URL =
  import.meta.env.VITE_DEV_API_BASE_URL || 'https://dev.to/api'
const MOCK_API_BASE_URL =
  import.meta.env.VITE_MOCK_API_BASE_URL ||
  'https://jsonplaceholder.typicode.com'

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

export async function fetchWebDevResources() {
  const response = await axios.get('/articles', {
    baseURL: DEV_API_BASE_URL,
    params: {
      tag: 'webdev',
      per_page: 12,
    },
  })

  return response.data
    .filter((article) => article.title && article.id)
    .map(mapArticleToResource)
}

export async function createResourcePost(payload) {
  const response = await axios.post('/posts', payload, {
    baseURL: MOCK_API_BASE_URL,
  })

  return response.data
}
