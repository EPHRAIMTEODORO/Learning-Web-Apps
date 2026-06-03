const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

function buildHeaders(headers, body) {
  const nextHeaders = new Headers(headers)

  if (body && !(body instanceof FormData) && !nextHeaders.has('Content-Type')) {
    nextHeaders.set('Content-Type', 'application/json')
  }

  return nextHeaders
}

function buildUrl(endpoint) {
  if (/^https?:\/\//i.test(endpoint)) {
    return endpoint
  }

  return `${API_BASE_URL}${endpoint}`
}

export async function apiRequest(endpoint, options = {}) {
  const { body, headers, token, ...fetchOptions } = options
  const requestHeaders = buildHeaders(headers, body)

  if (token) {
    requestHeaders.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(buildUrl(endpoint), {
    ...fetchOptions,
    headers: requestHeaders,
    body:
      body && !(body instanceof FormData) && typeof body !== 'string'
        ? JSON.stringify(body)
        : body,
  })

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}.`)
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}
