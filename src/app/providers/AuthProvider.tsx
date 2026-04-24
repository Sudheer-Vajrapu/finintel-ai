import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { tokenStore } from '@/shared/api/client'
import type { User } from '@/shared/api/types'

// ─── Context shape ────────────────────────────────────────────────────────────
interface AuthContextValue {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (token: string, user: User) => void
  logout: () => void
}

// ─── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue | null>(null)

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Rehydrate from localStorage on mount
  useEffect(() => {
    const storedToken = tokenStore.get()
    const storedUser = localStorage.getItem('finintel_user')

    if (storedToken && storedUser) {
      try {
        setToken(storedToken)
        setUser(JSON.parse(storedUser) as User)
      } catch {
        // Corrupt stored data — clear it
        tokenStore.clear()
        localStorage.removeItem('finintel_user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = useCallback((newToken: string, newUser: User) => {
    tokenStore.set(newToken)
    localStorage.setItem('finintel_user', JSON.stringify(newUser))
    setToken(newToken)
    setUser(newUser)
  }, [])

  const logout = useCallback(() => {
    tokenStore.clear()
    localStorage.removeItem('finintel_user')
    setToken(null)
    setUser(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: !!token && !!user,
      isLoading,
      login,
      logout,
    }),
    [user, token, isLoading, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
