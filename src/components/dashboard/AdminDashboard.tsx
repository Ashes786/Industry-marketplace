'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
  CreditCard,
  AlertTriangle,
  UserPlus
} from 'lucide-react'

interface AdminDashboardProps {
  user: any
}

export function AdminDashboard({ user }: AdminDashboardProps) {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalSellers: 0,
    totalBuyers: 0,
    monthlyRevenue: 0,
    totalTransactions: 0,
    commissionRevenue: 0,
    pendingApprovals: 0,
    activeSubscriptions: 0
  })

  const [recentUsers, setRecentUsers] = useState([])
  const [recentTransactions, setRecentTransactions] = useState([])
  const [recentActivity, setRecentActivity] = useState([])
  const [subscriptions, setSubscriptions] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // Mock data - in real app, fetch from API
    setStats({
      totalUsers: 156,
      activeUsers: 89,
      totalSellers: 67,
      totalBuyers: 124,
      monthlyRevenue: 2840000,
      totalTransactions: 342,
      commissionRevenue: 156000,
      pendingApprovals: 3,
      activeSubscriptions: 45
    })

    setRecentUsers([
      {
        id: '1',
        name: 'Muhammad Raza',
        email: 'raza@example.com',
        phone: '03001234569',
        roles: 'SELLER',
        companyName: 'Industrial Solutions',
        isApproved: false,
        createdAt: '2024-01-18',
        lastLogin: '2024-01-18'
      },
      {
        id: '2',
        name: 'Ayesha Malik',
        email: 'ayesha@example.com',
        phone: '03001234568',
        roles: 'BUYER',
        companyName: 'Construction Co.',
        isApproved: true,
        createdAt: '2024-01-17',
        lastLogin: '2024-01-20'
      },
      {
        id: '3',
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
        id: '4',
        name: 'Fatima Ali',
        email: 'fatima@example.com',
        phone: '03001234568',
        roles: 'SELLER',
        companyName: 'Textile Mills',
        isApproved: true,
        createdAt: '2024-01-10',
        lastLogin: '2024-01-19'
      }
    ])

    setRecentTransactions([
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
        buyerName: 'Construction Co.',
        sellerName: 'Muhammad Raza',
        amount: 350000,
        commission: 7000,
        status: 'PENDING',
        date: '2024-01-20',
        paymentMethod: 'EasyPaisa'
      },
      {
        id: '3',
        buyerName: 'Ahmed Khan',
        sellerName: 'Steel Industries',
        amount: 190000,
        commission: 3800,
        status: 'PAID',
        date: '2024-01-10',
        paymentMethod: 'JazzCash'
      }
    ])

    setSubscriptions([
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
      },
      {
        id: '3',
        userName: 'Ahmed Khan',
        userEmail: 'ahmed@example.com',
        planType: 'PREMIUM',
        amount: 15000,
        startDate: '2024-01-01',
        endDate: '2024-04-01',
        status: 'ACTIVE'
      }
    ])

    setRecentActivity([
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
    ])
  }, [])

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
      case 'ADMIN': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleUserApproval = async (userId: string, approve: boolean) => {
    console.log(`${approve ? 'Approving' : 'Rejecting'} user: ${userId}`)
    // TODO: Implement user approval/rejection API call
  }

  const filteredUsers = recentUsers.filter((user: any) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users, transactions, and platform analytics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
            {stats.pendingApprovals > 0 && (
              <Badge className="bg-red-500 text-white">{stats.pendingApprovals}</Badge>
            )}
          </Button>
          <Button className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Users</p>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
                <p className="text-sm text-green-600">{stats.activeUsers} active</p>
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
                <p className="text-2xl font-bold">Rs. {(stats.monthlyRevenue / 1000000).toFixed(1)}M</p>
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
                <p className="text-2xl font-bold">{stats.totalTransactions}</p>
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
                <p className="text-2xl font-bold">Rs. {(stats.commissionRevenue / 1000).toFixed(0)}K</p>
                <p className="text-sm text-green-600">This month</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Pending Approvals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Pending Approvals
                </CardTitle>
                <CardDescription>Users waiting for approval</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentUsers.filter((u: any) => !u.isApproved).map((user: any) => (
                    <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{user.name}</h4>
                          <Badge className={getRoleColor(user.roles)}>
                            {user.roles}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{user.companyName}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" className="h-7 w-7 p-0" onClick={() => handleUserApproval(user.id, true)}>
                          <CheckCircle className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" className="h-7 w-7 p-0" onClick={() => handleUserApproval(user.id, false)}>
                          <XCircle className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                {stats.pendingApprovals === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    No pending approvals
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest platform activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.map((activity: any) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm">{activity.action}</h4>
                        </div>
                        <p className="text-xs text-gray-600">{activity.user} - {activity.details}</p>
                        <p className="text-xs text-gray-500">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Quick Stats
                </CardTitle>
                <CardDescription>Platform overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Active Sellers</span>
                    <span className="font-semibold">{stats.totalSellers}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Active Buyers</span>
                    <span className="font-semibold">{stats.totalBuyers}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Active Subscriptions</span>
                    <span className="font-semibold">{stats.activeSubscriptions}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Pending Approvals</span>
                    <Badge className="bg-red-500 text-white">{stats.pendingApprovals}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Recent Transactions
                </CardTitle>
                <CardDescription>Latest platform transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTransactions.map((transaction: any) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{transaction.buyerName} → {transaction.sellerName}</h4>
                          <Badge className={getStatusColor(transaction.status)}>
                            {transaction.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span>Amount: Rs. {transaction.amount.toLocaleString()}</span>
                          <span>Commission: Rs. {transaction.commission.toLocaleString()}</span>
                          <span>{transaction.date}</span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Revenue Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Revenue Analytics
                </CardTitle>
                <CardDescription>Revenue breakdown and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">Rs. {(stats.monthlyRevenue / 1000000).toFixed(1)}M</div>
                    <div className="text-sm text-gray-600">Monthly Revenue</div>
                    <div className="text-xs text-green-600">+12.5% growth</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">Rs. {(stats.commissionRevenue / 1000).toFixed(0)}K</div>
                    <div className="text-sm text-gray-600">Commission Revenue</div>
                    <div className="text-xs text-gray-500">5.5% of total</div>
                  </div>
                </div>
                <div className="mt-6 space-y-3">
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Subscription Revenue</span>
                      <span>Rs. {((stats.monthlyRevenue - stats.commissionRevenue) / 1000).toFixed(0)}K</span>
                    </div>
                    <Progress value={94.5} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Commission Revenue</span>
                      <span>Rs. {(stats.commissionRevenue / 1000).toFixed(0)}K</span>
                    </div>
                    <Progress value={5.5} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Management
              </CardTitle>
              <CardDescription>Manage all platform users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Add User
                </Button>
              </div>

              <div className="rounded-md border">
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
                    {filteredUsers.map((user: any) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{user.phone}</div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getRoleColor(user.roles)}>
                            {user.roles}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{user.companyName}</div>
                        </TableCell>
                        <TableCell>
                          <Badge className={user.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                            {user.isApproved ? 'Approved' : 'Pending'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{user.createdAt}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {!user.isApproved && (
                              <>
                                <Button size="sm" className="h-7 w-7 p-0" onClick={() => handleUserApproval(user.id, true)}>
                                  <CheckCircle className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="outline" className="h-7 w-7 p-0" onClick={() => handleUserApproval(user.id, false)}>
                                  <XCircle className="h-3 w-3" />
                                </Button>
                              </>
                            )}
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                All Transactions
              </CardTitle>
              <CardDescription>View and manage all platform transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
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
                    {recentTransactions.map((transaction: any) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">#{transaction.id}</TableCell>
                        <TableCell>{transaction.buyerName}</TableCell>
                        <TableCell>{transaction.sellerName}</TableCell>
                        <TableCell>Rs. {transaction.amount.toLocaleString()}</TableCell>
                        <TableCell>Rs. {transaction.commission.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(transaction.status)}>
                            {transaction.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>{transaction.paymentMethod}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Subscription Management
              </CardTitle>
              <CardDescription>Manage user subscriptions and plans</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscriptions.map((subscription: any) => (
                      <TableRow key={subscription.id}>
                        <TableCell className="font-medium">{subscription.userName}</TableCell>
                        <TableCell>{subscription.userEmail}</TableCell>
                        <TableCell>
                          <Badge className="bg-blue-100 text-blue-800">
                            {subscription.planType}
                          </Badge>
                        </TableCell>
                        <TableCell>Rs. {subscription.amount.toLocaleString()}</TableCell>
                        <TableCell>{subscription.startDate}</TableCell>
                        <TableCell>{subscription.endDate}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(subscription.status)}>
                            {subscription.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}