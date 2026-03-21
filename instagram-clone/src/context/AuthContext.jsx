import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('prism_token'))
  const [loading, setLoading] = useState(true)

  // On mount, verify token and load user
  useEffect(() => {
    const init = async () => {
      const savedToken = localStorage.getItem('prism_token')
      const savedUser = localStorage.getItem('prism_user')
      if (savedToken && savedUser) {
        try {
          setToken(savedToken)
          setUser(JSON.parse(savedUser))
        } catch {
          localStorage.removeItem('prism_token')
          localStorage.removeItem('prism_user')
        }
      }
      setLoading(false)
    }
    init()
  }, [])

  const login = useCallback(async (credentials) => {
    const data = await authService.login(credentials)
    const { token: newToken, user: userData } = data
    localStorage.setItem('prism_token', newToken)
    localStorage.setItem('prism_user', JSON.stringify(userData))
    setToken(newToken)
    setUser(userData)
    return userData
  }, [])

  const register = useCallback(async (credentials) => {
    const data = await authService.register(credentials)
    const { token: newToken, user: userData } = data
    localStorage.setItem('prism_token', newToken)
    localStorage.setItem('prism_user', JSON.stringify(userData))
    setToken(newToken)
    setUser(userData)
    return userData
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('prism_token')
    localStorage.removeItem('prism_user')
    setToken(null)
    setUser(null)
  }, [])

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser)
    localStorage.setItem('prism_user', JSON.stringify(updatedUser))
  }, [])

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    login,
    register,
    logout,
    updateUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
