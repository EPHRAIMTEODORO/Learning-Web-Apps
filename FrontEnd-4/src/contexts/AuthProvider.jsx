import { useCallback, useMemo, useState } from 'react'
import AuthContext from './AuthContext'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)

  const login = useCallback((nextUser, nextToken) => {
    setUser(nextUser)
    setToken(nextToken)
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
  }, [])

  const isAuthenticated = Boolean(user && token)

  const value = useMemo(
    () => ({
      user,
      token,
      login,
      logout,
      isAuthenticated,
    }),
    [user, token, login, logout, isAuthenticated],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
