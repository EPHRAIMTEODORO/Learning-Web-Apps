import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/useAuth'

function ProtectedRoute({ children, redirectTo = '/login' }) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />
  }

  return children
}

export default ProtectedRoute
