'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  DollarSign, 
  CreditCard,
  TrendingUp, 
  BarChart3,
  FileText,
  Shield,
  UserCheck,
  UserX,
  AlertTriangle,
  Settings,
  Eye
} from 'lucide-react'
import Link from 'next/link'

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
  }, [])

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Platform overview and administrative controls</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                <p className="text-sm text-green-600">{stats.activeUsers} active</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Monthly Revenue</p>
                <p className="text-2xl font-bold text-gray-900">Rs. {(stats.monthlyRevenue / 1000000).toFixed(1)}M</p>
                <p className="text-sm text-green-600">+12.5%</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalTransactions}</p>
                <p className="text-sm text-green-600">+8.2%</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <CreditCard className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Commission Revenue</p>
                <p className="text-2xl font-bold text-gray-900">Rs. {(stats.commissionRevenue / 1000).toFixed(0)}K</p>
                <p className="text-sm text-green-600">This month</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Quick Actions</CardTitle>
          <CardDescription className="text-sm">Administrative tasks and controls</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/dashboard/users">
              <Button className="w-full h-auto p-6 flex flex-col items-center gap-3 bg-blue-600 hover:bg-blue-700">
                <UserCheck className="h-8 w-8" />
                <div className="text-center">
                  <div className="font-semibold">Manage Users</div>
                  <div className="text-xs opacity-90">Approve/reject users</div>
                </div>
              </Button>
            </Link>
            
            <Link href="/dashboard/all-transactions">
              <Button variant="outline" className="w-full h-auto p-6 flex flex-col items-center gap-3 border-2">
                <Eye className="h-8 w-8" />
                <div className="text-center">
                  <div className="font-semibold">All Transactions</div>
                  <div className="text-xs text-gray-600">View transaction history</div>
                </div>
              </Button>
            </Link>
            
            <Link href="/dashboard/subscriptions">
              <Button variant="outline" className="w-full h-auto p-6 flex flex-col items-center gap-3 border-2">
                <CreditCard className="h-8 w-8" />
                <div className="text-center">
                  <div className="font-semibold">Subscriptions</div>
                  <div className="text-xs text-gray-600">Manage subscription plans</div>
                </div>
              </Button>
            </Link>
            
            <Link href="/dashboard/settings">
              <Button variant="outline" className="w-full h-auto p-6 flex flex-col items-center gap-3 border-2">
                <Settings className="h-8 w-8" />
                <div className="text-center">
                  <div className="font-semibold">Platform Settings</div>
                  <div className="text-xs text-gray-600">Configure platform</div>
                </div>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Graph */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="h-5 w-5" />
            Platform Analytics
          </CardTitle>
          <CardDescription className="text-sm">Platform growth and revenue trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">156</div>
              <div className="text-sm text-gray-600 mt-1">Total Users</div>
              <div className="text-xs text-green-600 mt-1">+15% vs last month</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">Rs. 2.84M</div>
              <div className="text-sm text-gray-600 mt-1">Monthly Revenue</div>
              <div className="text-xs text-green-600 mt-1">+12.5% growth</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">342</div>
              <div className="text-sm text-gray-600 mt-1">Total Transactions</div>
              <div className="text-xs text-green-600 mt-1">+8.2% increase</div>
            </div>
          </div>
          
          {/* Simple bar chart representation */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Revenue Trend (Last 6 Months)</h4>
            <div className="grid grid-cols-6 gap-2 h-32">
              {[
                { month: 'Jan', value: 40, color: 'bg-green-400' },
                { month: 'Feb', value: 55, color: 'bg-green-400' },
                { month: 'Mar', value: 70, color: 'bg-green-500' },
                { month: 'Apr', value: 65, color: 'bg-green-400' },
                { month: 'May', value: 85, color: 'bg-green-600' },
                { month: 'Jun', value: 95, color: 'bg-green-600' }
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center justify-end h-full">
                  <div 
                    className={`w-full ${item.color} rounded-t transition-all duration-300 hover:opacity-80`}
                    style={{ height: `${item.value}%` }}
                  ></div>
                  <div className="text-xs text-gray-600 mt-1">{item.month}</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}