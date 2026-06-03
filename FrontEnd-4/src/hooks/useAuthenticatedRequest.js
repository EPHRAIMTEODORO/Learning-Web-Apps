import { useCallback } from 'react'
import { useAuth } from '../contexts/useAuth'
import { apiRequest } from '../services/apiClient'

export function useAuthenticatedRequest() {
  const { token } = useAuth()

  return useCallback(
    (endpoint, options = {}) => apiRequest(endpoint, { ...options, token }),
    [token],
  )
}
