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

// Mock data for demonstration
const mockUsers = [
  {
    id: '1',
    name: 'Ahmed Khan',
    email: 'ahmed@example.com',
    phone: '03001234567',
    roles: 'BUYER',
    companyName: 'Construction Co.',
    isApproved: true,
    createdAt: '2024-01-15',
    lastLogin: '2024-01-20'
  },
  {
    id: '2',
    name: 'Fatima Ali',
    email: 'fatima@example.com',
    phone: '03001234568',
    roles: 'SELLER',
    companyName: 'Textile Mills',
    isApproved: true,
    createdAt: '2024-01-10',
    lastLogin: '2024-01-19'
  },
  {
    id: '3',
    name: 'Muhammad Raza',
    email: 'raza@example.com',
    phone: '03001234569',
    roles: 'BOTH',
    companyName: 'Industrial Solutions',
    isApproved: false,
    createdAt: '2024-01-18',
    lastLogin: '2024-01-18'
  }
]

const mockSubscriptions = [
  {
    id: '1',
    userName: 'Fatima Ali',
    userEmail: 'fatima@example.com',
    planType: 'STANDARD',
    amount: 5000,
    startDate: '2024-01-01',
    endDate: '2024-02-01',
    status: 'ACTIVE'
  },
  {
    id: '2',
    userName: 'Muhammad Raza',
    userEmail: 'raza@example.com',
    planType: 'BASIC',
    amount: 0,
    startDate: '2024-01-15',
    endDate: '2025-01-15',
    status: 'ACTIVE'
  }
]

const mockTransactions = [
  {
    id: '1',
    buyerName: 'Ahmed Khan',
    sellerName: 'Fatima Ali',
    amount: 450000,
    commission: 9000,
    status: 'COMPLETED',
    date: '2024-01-15',
    paymentMethod: 'Bank Transfer'
  },
  {
    id: '2',
    buyerName: 'Ahmed Khan',
    sellerName: 'Steel Industries',
    amount: 190000,
    commission: 3800,
    status: 'PAID',
    date: '2024-01-10',
    paymentMethod: 'JazzCash'
  },
  {
    id: '3',
    buyerName: 'Construction Co.',
    sellerName: 'Muhammad Raza',
    amount: 350000,
    commission: 7000,
    status: 'PENDING',
    date: '2024-01-20',
    paymentMethod: 'EasyPaisa'
  }
]

const mockAnalytics = {
  totalUsers: 156,
  activeUsers: 89,
  totalSellers: 67,
  totalBuyers: 124,
  monthlyRevenue: 2840000,
  totalTransactions: 342,
  commissionRevenue: 156000,
  pendingApprovals: 3,
  activeSubscriptions: 45
}

const mockRecentActivity = [
  {
    id: '1',
    action: 'New User Registration',
    user: 'Muhammad Raza',
    details: 'Registered as SELLER',
    timestamp: '2 hours ago'
  },
  {
    id: '2',
    action: 'Payment Completed',
    user: 'Ahmed Khan',
    details: 'Transaction #123 completed',
    timestamp: '5 hours ago'
  },
  {
    id: '3',
    action: 'Subscription Upgraded',
    user: 'Fatima Ali',
    details: 'Upgraded to STANDARD plan',
    timestamp: '1 day ago'
  }
]

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')

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
    console.log(`${approve ? 'Approving' : 'Rejecting'} user: ${userId}`)
    // TODO: Implement user approval/rejection API call
  }

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar className="w-64">
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
                        {mockUsers.filter(u => !u.isApproved).length > 0 && (
                          <Badge className="ml-auto bg-red-500 text-white">
                            {mockUsers.filter(u => !u.isApproved).length}
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
              <SidebarGroupLabel>Content</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <button 
                        className={`w-full justify-start ${activeTab === 'products' ? 'bg-blue-100' : ''}`}
                        onClick={() => setActiveTab('products')}
                      >
                        <Package className="h-4 w-4" />
                        <span>Products</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <button 
                        className={`w-full justify-start ${activeTab === 'rfqs' ? 'bg-blue-100' : ''}`}
                        onClick={() => setActiveTab('rfqs')}
                      >
                        <ShoppingCart className="h-4 w-4" />
                        <span>RFQs</span>
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
                  {activeTab === 'products' && 'Product Management'}
                  {activeTab === 'rfqs' && 'RFQ Management'}
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
                          <p className="text-2xl font-bold">{mockAnalytics.totalUsers}</p>
                          <p className="text-sm text-green-600">{mockAnalytics.activeUsers} active</p>
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
                          <p className="text-2xl font-bold">Rs. {(mockAnalytics.monthlyRevenue / 1000000).toFixed(1)}M</p>
                          <p className="text-sm text-green-600">+12.5%</p>
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
                          <p className="text-2xl font-bold">{mockAnalytics.totalTransactions}</p>
                          <p className="text-sm text-green-600">+8.2%</p>
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
                          <p className="text-2xl font-bold">Rs. {(mockAnalytics.commissionRevenue / 1000).toFixed(0)}K</p>
                          <p className="text-sm text-green-600">+15.3%</p>
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
                        {mockRecentActivity.map((activity) => (
                          <div key={activity.id} className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{activity.action}</p>
                              <p className="text-xs text-gray-500">{activity.details}</p>
                            </div>
                            <div className="text-xs text-gray-500">{activity.timestamp}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Pending Approvals</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {mockUsers.filter(u => !u.isApproved).map((user) => (
                          <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                              <Badge className={getRoleColor(user.roles)}>{user.roles}</Badge>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                onClick={() => handleUserApproval(user.id, true)}
                              >
                                <UserCheck className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleUserApproval(user.id, false)}
                              >
                                <UserX className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">User Management</h3>
                  <div className="flex gap-2">
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
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Contact</TableHead>
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
                                  <p className="text-sm text-gray-500">{user.email}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <p className="text-sm">{user.phone}</p>
                            </TableCell>
                            <TableCell>
                              <Badge className={getRoleColor(user.roles)}>
                                {user.roles}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <p className="text-sm">{user.companyName || '-'}</p>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {user.isApproved ? (
                                  <Badge className="bg-green-100 text-green-800">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Approved
                                  </Badge>
                                ) : (
                                  <Badge className="bg-yellow-100 text-yellow-800">
                                    <Clock className="h-3 w-3 mr-1" />
                                    Pending
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <p className="text-sm">{new Date(user.createdAt).toLocaleDateString()}</p>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                {!user.isApproved && (
                                  <>
                                    <Button 
                                      size="sm" 
                                      onClick={() => handleUserApproval(user.id, true)}
                                    >
                                      <UserCheck className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => handleUserApproval(user.id, false)}
                                    >
                                      <UserX className="h-4 w-4" />
                                    </Button>
                                  </>
                                )}
                                <Button size="sm" variant="outline">
                                  <Eye className="h-4 w-4" />
                                </Button>
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
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Plan</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Period</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockSubscriptions.map((subscription) => (
                          <TableRow key={subscription.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{subscription.userName}</p>
                                <p className="text-sm text-gray-500">{subscription.userEmail}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={
                                subscription.planType === 'BASIC' ? 'bg-gray-100 text-gray-800' :
                                subscription.planType === 'STANDARD' ? 'bg-blue-100 text-blue-800' :
                                'bg-purple-100 text-purple-800'
                              }>
                                {subscription.planType}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <p className="font-medium">Rs. {subscription.amount.toLocaleString()}</p>
                            </TableCell>
                            <TableCell>
                              <p className="text-sm">
                                {new Date(subscription.startDate).toLocaleDateString()} - {new Date(subscription.endDate).toLocaleDateString()}
                              </p>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(subscription.status)}>
                                {subscription.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
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

            {activeTab === 'transactions' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Transaction Management</h3>
                
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Transaction ID</TableHead>
                          <TableHead>Buyer</TableHead>
                          <TableHead>Seller</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Commission</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Payment Method</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockTransactions.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell>
                              <p className="font-medium">#{transaction.id}</p>
                            </TableCell>
                            <TableCell>
                              <p className="font-medium">{transaction.buyerName}</p>
                            </TableCell>
                            <TableCell>
                              <p className="font-medium">{transaction.sellerName}</p>
                            </TableCell>
                            <TableCell>
                              <p className="font-medium">Rs. {transaction.amount.toLocaleString()}</p>
                            </TableCell>
                            <TableCell>
                              <p className="font-medium">Rs. {transaction.commission.toLocaleString()}</p>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(transaction.status)}>
                                {transaction.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <p className="text-sm">{new Date(transaction.date).toLocaleDateString()}</p>
                            </TableCell>
                            <TableCell>
                              <p className="text-sm">{transaction.paymentMethod}</p>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <FileText className="h-4 w-4" />
                                </Button>
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

            {activeTab === 'reports' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Analytics & Reports</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Revenue Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Total Revenue</span>
                          <span className="font-medium">Rs. {mockAnalytics.monthlyRevenue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Commission Revenue</span>
                          <span className="font-medium">Rs. {mockAnalytics.commissionRevenue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Total Transactions</span>
                          <span className="font-medium">{mockAnalytics.totalTransactions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Active Subscriptions</span>
                          <span className="font-medium">{mockAnalytics.activeSubscriptions}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>User Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Total Users</span>
                          <span className="font-medium">{mockAnalytics.totalUsers}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Active Users</span>
                          <span className="font-medium">{mockAnalytics.activeUsers}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Total Sellers</span>
                          <span className="font-medium">{mockAnalytics.totalSellers}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Total Buyers</span>
                          <span className="font-medium">{mockAnalytics.totalBuyers}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Generate Reports</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                      <Button variant="outline" className="h-20 flex-col">
                        <FileText className="h-6 w-6 mb-2" />
                        User Report
                      </Button>
                      <Button variant="outline" className="h-20 flex-col">
                        <DollarSign className="h-6 w-6 mb-2" />
                        Revenue Report
                      </Button>
                      <Button variant="outline" className="h-20 flex-col">
                        <TrendingUp className="h-6 w-6 mb-2" />
                        Analytics Report
                      </Button>
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