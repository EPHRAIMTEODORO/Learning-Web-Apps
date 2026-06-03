import { useCallback, useMemo, useState } from 'react'
import AuthContext from './AuthContext'

const AUTH_STORAGE_KEY = 'frontend4_demo_auth'

function getStoredAuth() {
  const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY)

  return storedAuth ? JSON.parse(storedAuth) : { user: null, token: null }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredAuth().user)
  const [token, setToken] = useState(() => getStoredAuth().token)

  const login = useCallback((nextUser, nextToken) => {
    setUser(nextUser)
    setToken(nextToken)
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({ user: nextUser, token: nextToken }),
    )
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    localStorage.removeItem(AUTH_STORAGE_KEY)
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
