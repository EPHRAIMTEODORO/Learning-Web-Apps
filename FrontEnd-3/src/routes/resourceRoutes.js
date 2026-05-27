export const ROUTE_PATHS = {
  home: '/',
  resources: '/resources',
  create: '/resources/new',
  detail: '/resources/:id',
  collections: '/#collections',
}

export function getResourceDetailPath(resourceId) {
  return `${ROUTE_PATHS.resources}/${encodeURIComponent(resourceId)}`
}
