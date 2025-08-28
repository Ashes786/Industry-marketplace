'use client'

import { useState, useEffect } from 'react'
import { useAuth, ProtectedRoute } from '@/lib/simple-auth'
import { BuyerDashboard } from '@/components/dashboard/BuyerDashboard'
import { SellerDashboard } from '@/components/dashboard/SellerDashboard'
import { AdminDashboard } from '@/components/dashboard/AdminDashboard'
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Building2, 
  User, 
  Mail, 
  ShoppingCart, 
  Settings, 
  LogOut,
  Bell,
  Loader2
} from 'lucide-react'

function DashboardContent() {
  const { user, logout, isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Dashboard initialization logic if needed
  }, [user, isAuthenticated])

  const handleLogout = () => {
    setLoading(true)
    setTimeout(() => {
      logout()
    }, 100)
  }

  // Show loading if user is not available yet
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Render appropriate dashboard based on user role
  const renderDashboard = () => {
    if (user.isAdmin) {
      return <AdminDashboard user={user} />
    } else if (user.roles === 'BUYER') {
      return <BuyerDashboard user={user} />
    } else if (user.roles === 'SELLER') {
      return <SellerDashboard user={user} subscription={user.subscription} />
    } else if (user.roles === 'BOTH') {
      return (
        <div className="space-y-6">
          <BuyerDashboard user={user} />
          <SellerDashboard user={user} subscription={user.subscription} />
        </div>
      )
    }
    return <div>Unknown user role</div>
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0">
        <DashboardSidebar user={user} subscription={user.subscription} />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {user.isAdmin ? 'Admin Dashboard' : `${user.roles} Dashboard`}
              </h1>
              <p className="text-sm text-gray-600">
                Welcome back, {user.name}!
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="font-medium text-gray-900">{user.name}</div>
                  <div className="text-sm text-gray-600">{user.email}</div>
                </div>
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {renderDashboard()}
        </main>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}