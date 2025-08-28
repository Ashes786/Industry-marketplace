'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  name: string
  email: string
  roles: string
  companyName?: string
  isAdmin: boolean
  subscription?: any
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  authError: string | null
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = () => {
      try {
        if (typeof window !== 'undefined') {
          const storedUser = localStorage.getItem('user')
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser)
            if (parsedUser && parsedUser.email && parsedUser.id) {
              setUser(parsedUser)
              setIsAuthenticated(true)
            } else {
              localStorage.removeItem('user')
              setIsAuthenticated(false)
            }
          } else {
            setIsAuthenticated(false)
          }
        }
      } catch (error) {
        console.error('Auth: ❌ Error initializing authentication:', error)
        setAuthError('Failed to restore authentication state')
        setIsAuthenticated(false)
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user')
        }
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setAuthError(null)
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMessage = data.error || 'Login failed'
        setAuthError(errorMessage)
        throw new Error(errorMessage)
      }

      if (data.user && data.user.email && data.user.id) {
        setUser(data.user)
        setIsAuthenticated(true)
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(data.user))
        }
        setAuthError(null)
        return true
      } else {
        const errorMessage = 'Invalid user data received from server'
        setAuthError(errorMessage)
        throw new Error(errorMessage)
      }
    } catch (error) {
      console.error('Auth: ❌ Login error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Login failed'
      setAuthError(errorMessage)
      setIsAuthenticated(false)
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    setAuthError(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user')
    }
    router.push('/auth/signin')
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isLoading, 
      authError, 
      isAuthenticated 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isLoading, authError, isAuthenticated } = useAuth()
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isRedirecting) {
      setIsRedirecting(true)
      router.push('/auth/signin')
    }
  }, [isAuthenticated, isLoading, router, isRedirecting])

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show error state if there's an authentication error
  if (authError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-600 text-lg font-semibold mb-4">Authentication Error</div>
          <div className="text-gray-600 mb-6">{authError}</div>
          <div className="space-y-3">
            <button 
              onClick={() => router.push('/auth/signin')}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Login
            </button>
            <button 
              onClick={() => {
                if (typeof window !== 'undefined') {
                  localStorage.removeItem('user')
                  window.location.reload()
                }
              }}
              className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Clear Cache & Reload
            </button>
          </div>
        </div>
      </div>
    )
  }

  // If not authenticated and not loading, don't render anything (will redirect)
  if (!isAuthenticated) {
    return null
  }

  // User is authenticated, render the protected content
  return <>{children}</>
}