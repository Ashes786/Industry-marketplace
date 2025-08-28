'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/simple-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  User, 
  Mail, 
  Building2, 
  ShoppingCart, 
  Search, 
  MessageSquare, 
  FileText, 
  TrendingUp, 
  Settings, 
  LogOut,
  Bell,
  Plus,
  Eye,
  Calendar,
  DollarSign
} from 'lucide-react'

function DashboardContent() {
  const { user, logout, isAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    console.log('Dashboard: 📊 User data:', user)
    console.log('Dashboard: 🔐 Authenticated:', isAuthenticated)
  }, [user, isAuthenticated])

  const handleLogout = () => {
    console.log('Dashboard: 🚪 Logging out')
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Building2 className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {user.companyName || `${user.name}'s Dashboard`}
              </h1>
              <p className="text-sm text-gray-600">
                Welcome back, {user.name}!
              </p>
            </div>
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

      {/* Main Content */}
      <main className="p-6">
        {/* User Info Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Account Information
            </CardTitle>
            <CardDescription>Your account details and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{user.companyName || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-gray-500" />
                <span className="text-sm">Role: {user.roles}</span>
              </div>
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-gray-500" />
                <span className="text-sm">
                  Admin: {user.isAdmin ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'rfqs', label: 'RFQ Management', icon: Plus },
            { id: 'browse', label: 'Browse Products', icon: Search },
            { id: 'chats', label: 'Messages', icon: MessageSquare },
            { id: 'transactions', label: 'Transactions', icon: FileText }
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'outline'}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2"
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </Button>
            )
          })}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Total RFQs</span>
                      <span className="font-semibold">3</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Quotes</span>
                      <span className="font-semibold">5</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Messages</span>
                      <span className="font-semibold">2</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div>• New RFQ created</div>
                    <div>• Quote received from supplier</div>
                    <div>• Message from buyer</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button className="w-full justify-start" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Create RFQ
                    </Button>
                    <Button className="w-full justify-start" variant="outline" size="sm">
                      <Search className="h-4 w-4 mr-2" />
                      Browse Products
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'rfqs' && (
            <Card>
              <CardHeader>
                <CardTitle>RFQ Management</CardTitle>
                <CardDescription>Manage your Request for Quotations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Plus className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-4">No RFQs created yet</p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First RFQ
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'browse' && (
            <Card>
              <CardHeader>
                <CardTitle>Browse Products</CardTitle>
                <CardDescription>Explore available products from suppliers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-4">Product browsing coming soon</p>
                  <Button variant="outline">
                    <Search className="h-4 w-4 mr-2" />
                    Explore Categories
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'chats' && (
            <Card>
              <CardHeader>
                <CardTitle>Messages</CardTitle>
                <CardDescription>Communicate with buyers and suppliers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-4">No messages yet</p>
                  <Button variant="outline">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Start a Conversation
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'transactions' && (
            <Card>
              <CardHeader>
                <CardTitle>Transactions</CardTitle>
                <CardDescription>View your transaction history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-4">No transactions yet</p>
                  <Button variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    View Transaction History
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Logout Button */}
        <div className="mt-8 text-center">
          <Button 
            onClick={handleLogout} 
            variant="outline" 
            disabled={loading}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            {loading ? 'Logging out...' : 'Logout'}
          </Button>
        </div>
      </main>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <DashboardContent />
  )
}