export const base64UrlEncode = (value) => {
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

export const createDemoJwt = (account) => {
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

export const parseList = (value) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

export const getCourseCode = (resource) => {
  if (resource.isLocal) {
    return `NEW-${String(resource.id).slice(-4)}`
  }

  return `CC-${String(resource.id).padStart(3, '0')}`
}

export const getPrimaryValue = (values, fallback) =>
  values?.length ? values[0] : fallback

export const getDepartment = (resource) =>
  getPrimaryValue(resource.topics, 'General Studies')

export const getCredits = (resource) =>
  Math.min(4, Math.max(1, resource.levels?.length || 1)) + 1

export const getStatusLabel = (resource) => (resource.isLocal ? 'Draft' : 'Open')

export const getUniqueValues = (resources, key) =>
  Array.from(new Set(resources.flatMap((resource) => resource[key] ?? []))).sort(
    (firstValue, secondValue) => firstValue.localeCompare(secondValue),
  )

export const filterResources = ({
  levelFilter = 'all',
  resources,
  searchQuery = '',
  topicFilter = 'all',
  typeFilter = 'all',
}) => {
  const normalizedQuery = searchQuery.trim().toLowerCase()

  return resources.filter((resource) => {
    const searchableText = [
      getCourseCode(resource),
      resource.description,
      ...(resource.topics ?? []),
      ...(resource.levels ?? []),
      ...(resource.types ?? []),
    ]
      .join(' ')
      .toLowerCase()
    const matchesQuery =
      !normalizedQuery || searchableText.includes(normalizedQuery)
    const matchesTopic =
      topicFilter === 'all' || resource.topics?.includes(topicFilter)
    const matchesLevel =
      levelFilter === 'all' || resource.levels?.includes(levelFilter)
    const matchesType = typeFilter === 'all' || resource.types?.includes(typeFilter)

    return matchesQuery && matchesTopic && matchesLevel && matchesType
  })
}
