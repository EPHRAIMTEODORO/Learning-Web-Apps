export const ROUTE_NAMES = {
  home: 'home',
  resources: 'resources',
  create: 'create',
  detail: 'detail',
  notFound: 'notFound',
}

export const ROUTE_PATHS = {
  home: '/',
  resources: '/resources',
  create: '/resources/new',
  collections: '/#collections',
}

export function getResourceDetailPath(resourceId) {
  return `${ROUTE_PATHS.resources}/${encodeURIComponent(resourceId)}`
}

export function getRouteFromLocation(location = window.location) {
  const path = location.pathname.replace(/\/+$/, '') || ROUTE_PATHS.home

  if (path === ROUTE_PATHS.home) {
    return { name: ROUTE_NAMES.home }
  }

  if (path === ROUTE_PATHS.resources) {
    return { name: ROUTE_NAMES.resources }
  }

  if (path === ROUTE_PATHS.create) {
    return { name: ROUTE_NAMES.create }
  }

  if (path.startsWith(`${ROUTE_PATHS.resources}/`)) {
    const id = decodeURIComponent(path.replace(`${ROUTE_PATHS.resources}/`, ''))
    return { name: ROUTE_NAMES.detail, id }
  }

  return { name: ROUTE_NAMES.notFound }
}

export function navigateTo(path) {
  window.history.pushState({}, '', path)
  return getRouteFromLocation()
}
