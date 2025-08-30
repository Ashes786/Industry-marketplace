'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarProvider, 
  SidebarTrigger 
} from '@/components/ui/sidebar'
import { 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  Settings, 
  LogOut,
  Bell,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  FileText,
  Shield,
  Star,
  Search,
  Filter,
  MoreHorizontal,
  UserCheck,
  UserX,
  CreditCard
} from 'lucide-react'
import { getAuthToken } from '@/lib/simple-auth'

interface User {
  id: string
  name: string
  email: string
  phone?: string
  roles: string
  companyName?: string
  isApproved: boolean
  createdAt: string
  lastLogin?: string
}

interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price: number
  duration: number
  features: string[]
  isActive: boolean
  isTrial: boolean
}

interface Transaction {
  id: string
  buyerName: string
  sellerName: string
  amount: number
  commission: number
  status: string
  date: string
  paymentMethod?: string
}

interface Analytics {
  totalUsers: number
  activeUsers: number
  totalSellers: number
  totalBuyers: number
  monthlyRevenue: number
  totalTransactions: number
  commissionRevenue: number
  pendingApprovals: number
  activeSubscriptions: number
}

interface Activity {
  id: string
  action: string
  user: string
  details: string
  timestamp: string
}

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [recentActivity, setRecentActivity] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch analytics data
      const analyticsResponse = await fetch('/api/admin/stats')
      if (analyticsResponse.ok) {
        const analyticsData = await analyticsResponse.json()
        setAnalytics({
          totalUsers: analyticsData.totalUsers || 0,
          activeUsers: (analyticsData.totalUsers || 0) - (analyticsData.pendingApprovals || 0),
          totalSellers: analyticsData.sellers || 0,
          totalBuyers: analyticsData.buyers || 0,
          monthlyRevenue: analyticsData.monthlyRevenue || 0,
          totalTransactions: analyticsData.totalTransactions || 0,
          commissionRevenue: analyticsData.totalRevenue || 0,
          pendingApprovals: analyticsData.pendingApprovals || 0,
          activeSubscriptions: analyticsData.activeSubscriptions || 0
        })
      }

      // Fetch users data
      const usersResponse = await fetch('/api/admin/users')
      if (usersResponse.ok) {
        const usersData = await usersResponse.json()
        setUsers(usersData.users || [])
      }

      // Fetch transactions data
      const transactionsResponse = await fetch('/api/admin/transactions')
      if (transactionsResponse.ok) {
        const transactionsData = await transactionsResponse.json()
        setTransactions(transactionsData.transactions || [])
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800'
      case 'COMPLETED': return 'bg-green-100 text-green-800'
      case 'PAID': return 'bg-blue-100 text-blue-800'
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'EXPIRED': return 'bg-gray-100 text-gray-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'BUYER': return 'bg-blue-100 text-blue-800'
      case 'SELLER': return 'bg-green-100 text-green-800'
      case 'BOTH': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleUserApproval = async (userId: string, approve: boolean) => {
    try {
      const token = getAuthToken()
      if (!token) {
        console.error('No authentication token found')
        return
      }

      const response = await fetch(`/api/admin/users/${userId}/${approve ? 'approve' : 'reject'}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        // Refresh users data
        const usersResponse = await fetch('/api/admin/users')
        if (usersResponse.ok) {
          const usersData = await usersResponse.json()
          setUsers(usersData.users || [])
        }
      } else {
        const errorData = await response.json()
        console.error('User approval failed:', errorData.error)
      }
    } catch (error) {
      console.error('Error updating user approval:', error)
    }
  }

  const handleViewUser = (user: User) => {
    alert(`User Details:\n\nName: ${user.name}\nEmail: ${user.email}\nRole: ${user.roles}\nCompany: ${user.companyName || 'N/A'}\nApproved: ${user.isApproved ? 'Yes' : 'No'}\nCreated: ${new Date(user.createdAt).toLocaleDateString()}`)
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar className="w-64" collapsible="offcanvas">
          <SidebarHeader className="border-b p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-blue-600" />
              <h1 className="text-lg font-semibold">Admin Panel</h1>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <button 
                        className={`w-full justify-start ${activeTab === 'dashboard' ? 'bg-blue-100' : ''}`}
                        onClick={() => setActiveTab('dashboard')}
                      >
                        <BarChart3 className="h-4 w-4" />
                        <span>Overview</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            
            <SidebarGroup>
              <SidebarGroupLabel>User Management</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <button 
                        className={`w-full justify-start ${activeTab === 'users' ? 'bg-blue-100' : ''}`}
                        onClick={() => setActiveTab('users')}
                      >
                        <Users className="h-4 w-4" />
                        <span>Users</span>
                        {users.filter(u => !u.isApproved).length > 0 && (
                          <Badge className="ml-auto bg-red-500 text-white">
                            {users.filter(u => !u.isApproved).length}
                          </Badge>
                        )}
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <button 
                        className={`w-full justify-start ${activeTab === 'subscriptions' ? 'bg-blue-100' : ''}`}
                        onClick={() => setActiveTab('subscriptions')}
                      >
                        <CreditCard className="h-4 w-4" />
                        <span>Subscriptions</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Transactions</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <button 
                        className={`w-full justify-start ${activeTab === 'transactions' ? 'bg-blue-100' : ''}`}
                        onClick={() => setActiveTab('transactions')}
                      >
                        <DollarSign className="h-4 w-4" />
                        <span>All Transactions</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Reports</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <button 
                        className={`w-full justify-start ${activeTab === 'reports' ? 'bg-blue-100' : ''}`}
                        onClick={() => setActiveTab('reports')}
                      >
                        <FileText className="h-4 w-4" />
                        <span>Analytics</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>System</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <button className="w-full justify-start">
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <button className="w-full justify-start">
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarRail />
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white shadow-sm border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <h2 className="text-xl font-semibold">
                  {activeTab === 'dashboard' && 'Dashboard Overview'}
                  {activeTab === 'users' && 'User Management'}
                  {activeTab === 'subscriptions' && 'Subscription Management'}
                  {activeTab === 'transactions' && 'Transaction Management'}
                  {activeTab === 'reports' && 'Analytics & Reports'}
                </h2>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </Button>
                <Avatar>
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-6">
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Dashboard Overview</h3>
                
                {/* Key Metrics */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Total Users</p>
                          <p className="text-2xl font-bold">{analytics?.totalUsers || 0}</p>
                          <p className="text-sm text-green-600">{analytics?.activeUsers || 0} active</p>
                        </div>
                        <Users className="h-8 w-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Monthly Revenue</p>
                          <p className="text-2xl font-bold">Rs. {((analytics?.monthlyRevenue || 0) / 1000000).toFixed(1)}M</p>
  
                        </div>
                        <DollarSign className="h-8 w-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Total Transactions</p>
                          <p className="text-2xl font-bold">{analytics?.totalTransactions || 0}</p>
  
                        </div>
                        <CreditCard className="h-8 w-8 text-purple-600" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Commission Revenue</p>
                          <p className="text-2xl font-bold">Rs. {((analytics?.commissionRevenue || 0) / 1000).toFixed(0)}K</p>
    
                        </div>
                        <TrendingUp className="h-8 w-8 text-orange-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentActivity.length > 0 ? (
                          recentActivity.map((activity) => (
                            <div key={activity.id} className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <div className="flex-1">
                                <p className="text-sm font-medium">{activity.action}</p>
                                <p className="text-xs text-gray-500">{activity.details}</p>
                              </div>
                              <div className="text-xs text-gray-500">{activity.timestamp}</div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center text-gray-500 py-8">
                            No recent activity available
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Stats</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Pending Approvals</span>
                          <Badge className="bg-yellow-100 text-yellow-800">
                            {analytics?.pendingApprovals || 0}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Active Subscriptions</span>
                          <Badge className="bg-green-100 text-green-800">
                            {analytics?.activeSubscriptions || 0}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Total Sellers</span>
                          <Badge className="bg-blue-100 text-blue-800">
                            {analytics?.totalSellers || 0}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Total Buyers</span>
                          <Badge className="bg-purple-100 text-purple-800">
                            {analytics?.totalBuyers || 0}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">User Management</h3>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>All Users</CardTitle>
                    <CardDescription>Manage user accounts and approvals</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Company</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Joined</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{user.name}</p>
                                  <p className="text-sm text-gray-500">{user.phone}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge className={getRoleColor(user.roles)}>
                                {user.roles}
                              </Badge>
                            </TableCell>
                            <TableCell>{user.companyName || '-'}</TableCell>
                            <TableCell>
                              <Badge className={user.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                                {user.isApproved ? 'Approved' : 'Pending'}
                              </Badge>
                            </TableCell>
                            <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewUser(user)}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                                {!user.isApproved && (
                                  <>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleUserApproval(user.id, true)}
                                    >
                                      <UserCheck className="h-4 w-4 mr-1" />
                                      Approve
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleUserApproval(user.id, false)}
                                    >
                                      <UserX className="h-4 w-4 mr-1" />
                                      Reject
                                    </Button>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'subscriptions' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Subscription Management</h3>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Available Subscription Plans</CardTitle>
                    <CardDescription>Manage subscription plans and pricing</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Plan Name</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Features</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            <div>
                              <p className="font-medium">BASIC</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm">Basic plan for small businesses</p>
                          </TableCell>
                          <TableCell>Rs. 5,000</TableCell>
                          <TableCell>30 days</TableCell>
                          <TableCell>
                            <p className="text-sm">5 product listings</p>
                            <p className="text-sm">Basic support</p>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-800">Active</Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">Edit</Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <div>
                              <p className="font-medium">STANDARD</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm">Standard plan for growing businesses</p>
                          </TableCell>
                          <TableCell>Rs. 10,000</TableCell>
                          <TableCell>30 days</TableCell>
                          <TableCell>
                            <p className="text-sm">15 product listings</p>
                            <p className="text-sm">Priority support</p>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-800">Active</Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">Edit</Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <div>
                              <p className="font-medium">PREMIUM</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm">Premium plan for large businesses</p>
                          </TableCell>
                          <TableCell>Rs. 20,000</TableCell>
                          <TableCell>30 days</TableCell>
                          <TableCell>
                            <p className="text-sm">Unlimited product listings</p>
                            <p className="text-sm">24/7 dedicated support</p>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-800">Active</Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">Edit</Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Create New Subscription Plan</CardTitle>
                    <CardDescription>Add a new subscription plan to the system</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Plan Name</label>
                        <input 
                          type="text" 
                          className="w-full px-3 py-2 border rounded-md"
                          placeholder="e.g., ENTERPRISE"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Price (Rs.)</label>
                        <input 
                          type="number" 
                          className="w-full px-3 py-2 border rounded-md"
                          placeholder="e.g., 25000"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Duration (days)</label>
                        <input 
                          type="number" 
                          className="w-full px-3 py-2 border rounded-md"
                          placeholder="e.g., 30"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Status</label>
                        <select className="w-full px-3 py-2 border rounded-md">
                          <option>Active</option>
                          <option>Inactive</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea 
                          className="w-full px-3 py-2 border rounded-md"
                          rows={3}
                          placeholder="Describe the subscription plan features..."
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium mb-1">Features (one per line)</label>
                        <textarea 
                          className="w-full px-3 py-2 border rounded-md"
                          rows={4}
                          placeholder="Unlimited product listings&#10;24/7 dedicated support&#10;Advanced analytics..."
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button className="bg-blue-600 text-white">
                        Create Subscription Plan
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'transactions' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Transaction Management</h3>
                
                <Card>
                  <CardHeader>
                    <CardTitle>All Transactions</CardTitle>
                    <CardDescription>View and manage all transactions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Buyer</TableHead>
                          <TableHead>Seller</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Commission</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell className="font-medium">{transaction.buyerName}</TableCell>
                            <TableCell>{transaction.sellerName}</TableCell>
                            <TableCell>Rs. {transaction.totalAmount?.toLocaleString() || '0'}</TableCell>
                            <TableCell>Rs. {transaction.commissionAmount?.toLocaleString() || '0'}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(transaction.status)}>
                                {transaction.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{new Date(transaction.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'reports' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Analytics & Reports</h3>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Total Users</p>
                          <p className="text-2xl font-bold">{analytics?.totalUsers || 0}</p>
                          <p className="text-sm text-green-600">{analytics?.activeUsers || 0} active</p>
                        </div>
                        <Users className="h-8 w-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Monthly Revenue</p>
                          <p className="text-2xl font-bold">Rs. {((analytics?.monthlyRevenue || 0) / 1000000).toFixed(1)}M</p>
  
                        </div>
                        <DollarSign className="h-8 w-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Total Transactions</p>
                          <p className="text-2xl font-bold">{analytics?.totalTransactions || 0}</p>
  
                        </div>
                        <CreditCard className="h-8 w-8 text-purple-600" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Commission Revenue</p>
                          <p className="text-2xl font-bold">Rs. {((analytics?.commissionRevenue || 0) / 1000).toFixed(0)}K</p>
    
                        </div>
                        <TrendingUp className="h-8 w-8 text-orange-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>System Overview</CardTitle>
                    <CardDescription>Key system metrics and performance indicators</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-medium">User Distribution</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Buyers</span>
                            <span className="text-sm font-medium">{analytics?.totalBuyers || 0}</span>
                          </div>
                          <Progress value={(analytics?.totalBuyers || 0) / (analytics?.totalUsers || 1) * 100} />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Sellers</span>
                            <span className="text-sm font-medium">{analytics?.totalSellers || 0}</span>
                          </div>
                          <Progress value={(analytics?.totalSellers || 0) / (analytics?.totalUsers || 1) * 100} />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="font-medium">System Health</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Active Subscriptions</span>
                            <span className="text-sm font-medium">{analytics?.activeSubscriptions || 0}</span>
                          </div>
                          <Progress value={90} />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Pending Approvals</span>
                            <span className="text-sm font-medium">{analytics?.pendingApprovals || 0}</span>
                          </div>
                          <Progress value={100 - ((analytics?.pendingApprovals || 0) / (analytics?.totalUsers || 1) * 100)} />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}