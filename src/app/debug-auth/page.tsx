'use client'

import { useAuth } from '@/lib/simple-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function DebugAuthPage() {
  const { user, isLoading, authError, isAuthenticated, login, logout } = useAuth()

  const handleTestLogin = async () => {
    try {
      console.log('Debug: 🔐 Testing login for buyer@test.com')
      const success = await login('buyer@test.com', 'buyer123')
      console.log('Debug: ✅ Test login result:', success)
    } catch (error) {
      console.error('Debug: ❌ Test login error:', error)
    }
  }

  const handleClearStorage = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user')
      window.location.reload()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔧 Authentication Debug Page</h1>
        
        <div className="grid gap-6">
          {/* Auth State Card */}
          <Card>
            <CardHeader>
              <CardTitle>🔐 Authentication State</CardTitle>
              <CardDescription>Current authentication status and user information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong>Loading:</strong> 
                  <span className={isLoading ? 'text-yellow-600' : 'text-green-600'}>
                    {isLoading ? '⏳ Yes' : '✅ No'}
                  </span>
                </div>
                <div>
                  <strong>Authenticated:</strong> 
                  <span className={isAuthenticated ? 'text-green-600' : 'text-red-600'}>
                    {isAuthenticated ? '✅ Yes' : '❌ No'}
                  </span>
                </div>
                <div>
                  <strong>Auth Error:</strong> 
                  <span className={authError ? 'text-red-600' : 'text-green-600'}>
                    {authError || '✅ None'}
                  </span>
                </div>
                <div>
                  <strong>User Present:</strong> 
                  <span className={user ? 'text-green-600' : 'text-red-600'}>
                    {user ? '✅ Yes' : '❌ No'}
                  </span>
                </div>
              </div>
              
              {user && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold mb-2">👤 User Data:</h4>
                  <pre className="text-sm bg-white p-2 rounded overflow-x-auto">
                    {JSON.stringify(user, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Test Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>🧪 Test Actions</CardTitle>
              <CardDescription>Test authentication functionality</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  onClick={handleTestLogin} 
                  disabled={isLoading}
                  className="w-full"
                >
                  🔐 Test Login (buyer@test.com)
                </Button>
                <Button 
                  onClick={logout} 
                  disabled={!user || isLoading}
                  variant="outline"
                  className="w-full"
                >
                  🚪 Logout
                </Button>
                <Button 
                  onClick={handleClearStorage}
                  variant="outline"
                  className="w-full"
                >
                  🗑️ Clear Storage & Reload
                </Button>
                <Button 
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className="w-full"
                >
                  🔄 Reload Page
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* LocalStorage Card */}
          <Card>
            <CardHeader>
              <CardTitle>💾 Local Storage</CardTitle>
              <CardDescription>Browser localStorage content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 p-4 rounded">
                <pre className="text-sm">
                  {typeof window !== 'undefined' 
                    ? JSON.stringify({
                        user: localStorage.getItem('user')
                      }, null, 2)
                    : '🚫 Window not available'
                  }
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Card */}
          <Card>
            <CardHeader>
              <CardTitle>🧭 Navigation</CardTitle>
              <CardDescription>Test navigation to different pages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  onClick={() => window.location.href = '/auth/signin'}
                  variant="outline"
                  className="w-full"
                >
                  📝 Go to Signin
                </Button>
                <Button 
                  onClick={() => window.location.href = '/dashboard'}
                  disabled={!isAuthenticated}
                  className="w-full"
                >
                  📊 Go to Dashboard
                </Button>
                <Button 
                  onClick={() => window.location.href = '/'}
                  variant="outline"
                  className="w-full"
                >
                  🏠 Go to Home
                </Button>
                <Button 
                  onClick={() => window.location.href = '/auth/signup'}
                  variant="outline"
                  className="w-full"
                >
                  📝 Go to Signup
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Browser Console Card */}
          <Card>
            <CardHeader>
              <CardTitle>🖥️ Browser Console</CardTitle>
              <CardDescription>Check browser console for detailed logs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  📋 <strong>How to check console:</strong>
                </p>
                <ol className="text-sm text-gray-600 list-decimal list-inside space-y-1">
                  <li>Press <kbd className="bg-gray-200 px-1 rounded">F12</kbd> to open Developer Tools</li>
                  <li>Click on <strong>Console</strong> tab</li>
                  <li>Look for authentication logs with emojis:</li>
                </ol>
                <div className="bg-gray-100 p-3 rounded text-sm font-mono">
                  <div>🔐 Auth: Attempting login for: buyer@test.com</div>
                  <div>📡 Auth: Login response: {"{status: 200, success: true}"}</div>
                  <div>✅ Auth: User saved to localStorage: buyer@test.com</div>
                  <div>⏳ ProtectedRoute: Checking authentication...</div>
                  <div>✅ ProtectedRoute: User authenticated, showing protected content</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}