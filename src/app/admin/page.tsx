'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Users, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Eye,
  Check,
  X
} from 'lucide-react'

interface User {
  id: string
  email: string
  name?: string
  phone?: string
  role: string
  isApproved: boolean
  isAdmin: boolean
  createdAt: string
}

interface Subscription {
  id: string
  userId: string
  planType: string
  startDate: string
  endDate: string
  status: string
  amount: number
  user: {
    name?: string
    email: string
  }
}

interface Transaction {
  id: string
  productPrice: number
  commissionAmount: number
  totalAmount: number
  status: string
  invoiceNumber: string
  createdAt: string
  buyer: {
    name?: string
    email: string
  }
  seller: {
    name?: string
    email: string
  }
}

interface DashboardStats {
  totalUsers: number
  pendingApprovals: number
  activeSubscriptions: number
  totalTransactions: number
  totalRevenue: number
  monthlyRevenue: number
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (session && !session.user.isAdmin) {
      router.push('/dashboard')
      return
    }

    if (session && session.user.isAdmin) {
      fetchData()
    }
  }, [session, status, router])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      const [usersRes, subscriptionsRes, transactionsRes, statsRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/subscriptions'),
        fetch('/api/admin/transactions'),
        fetch('/api/admin/stats')
      ])

      if (usersRes.ok) {
        const usersData = await usersRes.json()
        setUsers(usersData)
      }

      if (subscriptionsRes.ok) {
        const subscriptionsData = await subscriptionsRes.json()
        setSubscriptions(subscriptionsData)
      }

      if (transactionsRes.ok) {
        const transactionsData = await transactionsRes.json()
        setTransactions(transactionsData)
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }
    } catch (error) {
      setError('Failed to fetch admin data')
    } finally {
      setLoading(false)
    }
  }

  const handleApproveUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/approve`, {
        method: 'POST'
      })

      if (response.ok) {
        setUsers(prev => prev.map(user => 
          user.id === userId ? { ...user, isApproved: true } : user
        ))
        fetchData() // Refresh stats
      }
    } catch (error) {
      console.error('Error approving user:', error)
    }
  }

  const handleRejectUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/reject`, {
        method: 'POST'
      })

      if (response.ok) {
        setUsers(prev => prev.filter(user => user.id !== userId))
        fetchData() // Refresh stats
      }
    } catch (error) {
      console.error('Error rejecting user:', error)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'BUYER':
        return <Badge className="bg-blue-100 text-blue-800">Buyer</Badge>
      case 'SELLER':
        return <Badge className="bg-green-100 text-green-800">Seller</Badge>
      case 'BOTH':
        return <Badge className="bg-purple-100 text-purple-800">Both</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case 'PAID':
        return <Badge className="bg-blue-100 text-blue-800">Paid</Badge>
      case 'COMPLETED':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case 'FAILED':
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!session || !session.user.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="ml-auto">
              <Button variant="outline" size="sm" onClick={() => router.push('/dashboard')}>
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.pendingApprovals} pending approval
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
                <p className="text-xs text-muted-foreground">
                  Premium plans active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalTransactions}</div>
                <p className="text-xs text-muted-foreground">
                  All time transactions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
                <p className="text-xs text-muted-foreground">
                  All time revenue
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(stats.monthlyRevenue)}</div>
                <p className="text-xs text-muted-foreground">
                  This month
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">User Management ({users.length})</TabsTrigger>
            <TabsTrigger value="subscriptions">Subscriptions ({subscriptions.length})</TabsTrigger>
            <TabsTrigger value="transactions">Transactions ({transactions.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage user accounts and approvals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                            No users found
                          </TableCell>
                        </TableRow>
                      ) : (
                        users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{user.name || 'N/A'}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                                {user.phone && (
                                  <div className="text-sm text-gray-500">{user.phone}</div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{getRoleBadge(user.role)}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                {user.isApproved ? (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                ) : (
                                  <Clock className="w-4 h-4 text-yellow-600" />
                                )}
                                <span>
                                  {user.isApproved ? 'Approved' : 'Pending'}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {new Date(user.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => router.push(`/admin/users/${user.id}`)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                {!user.isApproved && (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleApproveUser(user.id)}
                                    >
                                      <Check className="w-4 h-4 text-green-600" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleRejectUser(user.id)}
                                    >
                                      <X className="w-4 h-4 text-red-600" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscriptions">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Management</CardTitle>
                <CardDescription>
                  Monitor and manage user subscriptions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Period</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subscriptions.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                            No subscriptions found
                          </TableCell>
                        </TableRow>
                      ) : (
                        subscriptions.map((subscription) => (
                          <TableRow key={subscription.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{subscription.user.name || 'N/A'}</div>
                                <div className="text-sm text-gray-500">{subscription.user.email}</div>
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
                            <TableCell>{getStatusBadge(subscription.status)}</TableCell>
                            <TableCell>{formatCurrency(subscription.amount)}</TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div>{new Date(subscription.startDate).toLocaleDateString()}</div>
                                <div className="text-gray-500">to {new Date(subscription.endDate).toLocaleDateString()}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Transaction Monitoring</CardTitle>
                <CardDescription>
                  Track all platform transactions and revenue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice</TableHead>
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
                      {transactions.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                            No transactions found
                          </TableCell>
                        </TableRow>
                      ) : (
                        transactions.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell className="font-mono text-sm">
                              {transaction.invoiceNumber}
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{transaction.buyer.name || 'N/A'}</div>
                                <div className="text-sm text-gray-500">{transaction.buyer.email}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{transaction.seller.name || 'N/A'}</div>
                                <div className="text-sm text-gray-500">{transaction.seller.email}</div>
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">
                              {formatCurrency(transaction.productPrice)}
                            </TableCell>
                            <TableCell className="text-red-600">
                              {formatCurrency(transaction.commissionAmount)}
                            </TableCell>
                            <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                            <TableCell>
                              {new Date(transaction.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}