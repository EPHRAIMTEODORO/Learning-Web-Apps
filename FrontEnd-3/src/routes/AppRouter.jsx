import { Route, Routes } from 'react-router-dom'
import { ROUTE_PATHS } from './resourceRoutes'

function AppRouter({
  createElement,
  detailElement,
  homeElement,
  notFoundElement,
  resourcesElement,
}) {
  return (
    <Routes>
      <Route path={ROUTE_PATHS.home} element={homeElement} />
      <Route path={ROUTE_PATHS.resources} element={resourcesElement} />
      <Route path={ROUTE_PATHS.create} element={createElement} />
      <Route path={ROUTE_PATHS.detail} element={detailElement} />
      <Route path="*" element={notFoundElement} />
    </Routes>
  )
}

export default AppRouter
