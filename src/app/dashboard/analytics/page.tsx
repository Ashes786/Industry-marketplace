'use client'

import { useState, useEffect } from 'react'
import { useAuth, ProtectedRoute } from '@/lib/simple-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Package,
  Users,
  Eye,
  Star,
  Calendar,
  Download,
  RefreshCw,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Zap
} from 'lucide-react'

function AnalyticsContent() {
  const { user } = useAuth()
  const [timeRange, setTimeRange] = useState('30days')
  const [analytics, setAnalytics] = useState<any>({})

  useEffect(() => {
    // Mock data - in real app, fetch from API based on user role
    const isBuyer = user.roles === 'BUYER' || user.roles === 'BOTH'
    const isSeller = user.roles === 'SELLER' || user.roles === 'BOTH'
    const isAdmin = user.isAdmin

    if (isBuyer) {
      setAnalytics({
        totalRfqs: 12,
        activeRfqs: 3,
        completedDeals: 9,
        totalSpent: 2450000,
        avgDealSize: 272222,
        successRate: 75,
        topCategories: ['Construction Materials', 'Machinery', 'Electrical'],
        monthlyTrend: [12, 15, 18, 22, 19, 25, 28, 32, 29, 35, 38, 42],
        spendingByCategory: {
          'Construction Materials': 1200000,
          'Machinery': 800000,
          'Electrical': 450000
        }
      })
    }

    if (isSeller) {
      setAnalytics({
        totalProducts: 15,
        activeProducts: 12,
        totalViews: 2450,
        totalInquiries: 89,
        dealsClosed: 5,
        revenue: 1850000,
        conversionRate: 5.6,
        topProducts: [
          { name: 'Industrial Steel Pipes', views: 245, inquiries: 12 },
          { name: 'Electrical Motors', views: 189, inquiries: 8 },
          { name: 'Cement Bags', views: 567, inquiries: 25 }
        ],
        monthlyRevenue: [120000, 150000, 180000, 220000, 195000, 250000, 280000, 320000, 295000, 350000, 380000, 420000]
      })
    }

    if (isAdmin) {
      setAnalytics({
        totalUsers: 156,
        activeUsers: 89,
        totalSellers: 67,
        totalBuyers: 124,
        monthlyRevenue: 2840000,
        totalTransactions: 342,
        commissionRevenue: 156000,
        platformGrowth: [120, 135, 142, 158, 167, 175, 189, 196, 205, 218, 225, 234],
        revenueBreakdown: {
          subscriptions: 2684000,
          commissions: 156000
        }
      })
    }
  }, [user])

  const isBuyer = user.roles === 'BUYER' || user.roles === 'BOTH'
  const isSeller = user.roles === 'SELLER' || user.roles === 'BOTH'
  const isAdmin = user.isAdmin

  const renderBuyerAnalytics = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total RFQs</p>
                <p className="text-2xl font-bold">{analytics.totalRfqs}</p>
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +15% vs last month
                </p>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Spent</p>
                <p className="text-2xl font-bold">Rs. {(analytics.totalSpent / 1000000).toFixed(1)}M</p>
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +12% vs last month
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Success Rate</p>
                <p className="text-2xl font-bold">{analytics.successRate}%</p>
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +5% vs last month
                </p>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg Deal Size</p>
                <p className="text-2xl font-bold">Rs. {analytics.avgDealSize.toLocaleString()}</p>
                <p className="text-sm text-yellow-600 flex items-center gap-1">
                  <TrendingDown className="h-3 w-3" />
                  -3% vs last month
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Spending by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Spending by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(analytics.spendingByCategory).map(([category, amount]: [string, any]) => {
                const total = Object.values(analytics.spendingByCategory).reduce((sum: number, val: any) => sum + val, 0)
                const percentage = (amount / total) * 100
                return (
                  <div key={category}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{category}</span>
                      <span>Rs. {amount.toLocaleString()} ({percentage.toFixed(1)}%)</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* RFQ Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              RFQ Activity Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Last 30 days</span>
                <span className="text-green-600">+15%</span>
              </div>
              <div className="h-32 bg-gray-100 rounded flex items-end justify-between p-2">
                {analytics.monthlyTrend.slice(-12).map((value: number, index: number) => (
                  <div
                    key={index}
                    className="bg-blue-500 rounded-t flex-1 mx-0.5"
                    style={{ height: `${(value / Math.max(...analytics.monthlyTrend)) * 100}%` }}
                  />
                ))}
              </div>
              <div className="text-xs text-gray-500 text-center">Monthly RFQ trend</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderSellerAnalytics = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Products</p>
                <p className="text-2xl font-bold">{analytics.totalProducts}</p>
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +3 new this month
                </p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Views</p>
                <p className="text-2xl font-bold">{analytics.totalViews.toLocaleString()}</p>
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +25% vs last month
                </p>
              </div>
              <Eye className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Revenue</p>
                <p className="text-2xl font-bold">Rs. {(analytics.revenue / 1000000).toFixed(1)}M</p>
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +18% vs last month
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Conversion Rate</p>
                <p className="text-2xl font-bold">{analytics.conversionRate}%</p>
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +2.1% vs last month
                </p>
              </div>
              <Zap className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Top Performing Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topProducts.map((product: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-gray-600">
                      {product.views} views • {product.inquiries} inquiries
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {((product.inquiries / product.views) * 100).toFixed(1)}% conversion
                    </div>
                    <div className="text-xs text-gray-500">Rate</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Revenue Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Last 12 months</span>
                <span className="text-green-600">+18%</span>
              </div>
              <div className="h-32 bg-gray-100 rounded flex items-end justify-between p-2">
                {analytics.monthlyRevenue.map((value: number, index: number) => (
                  <div
                    key={index}
                    className="bg-green-500 rounded-t flex-1 mx-0.5"
                    style={{ height: `${(value / Math.max(...analytics.monthlyRevenue)) * 100}%` }}
                  />
                ))}
              </div>
              <div className="text-xs text-gray-500 text-center">Monthly revenue trend</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderAdminAnalytics = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Users</p>
                <p className="text-2xl font-bold">{analytics.totalUsers}</p>
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {analytics.activeUsers} active
                </p>
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
                <p className="text-2xl font-bold">Rs. {(analytics.monthlyRevenue / 1000000).toFixed(1)}M</p>
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +12.5% growth
                </p>
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
                <p className="text-2xl font-bold">{analytics.totalTransactions}</p>
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +8.2% vs last month
                </p>
              </div>
              <ShoppingCart className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Commission Revenue</p>
                <p className="text-2xl font-bold">Rs. {(analytics.commissionRevenue / 1000).toFixed(0)}K</p>
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +5.5% of total
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Revenue Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(analytics.revenueBreakdown).map(([source, amount]: [string, any]) => {
                const total = Object.values(analytics.revenueBreakdown).reduce((sum: number, val: any) => sum + val, 0)
                const percentage = (amount / total) * 100
                return (
                  <div key={source}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize">{source}</span>
                      <span>Rs. {(amount / 1000000).toFixed(1)}M ({percentage.toFixed(1)}%)</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Platform Growth */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Platform Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>User growth over time</span>
                <span className="text-green-600">+15%</span>
              </div>
              <div className="h-32 bg-gray-100 rounded flex items-end justify-between p-2">
                {analytics.platformGrowth.map((value: number, index: number) => (
                  <div
                    key={index}
                    className="bg-blue-500 rounded-t flex-1 mx-0.5"
                    style={{ height: `${(value / Math.max(...analytics.platformGrowth)) * 100}%` }}
                  />
                ))}
              </div>
              <div className="text-xs text-gray-500 text-center">Monthly user growth</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">
            {isAdmin ? 'Platform performance and insights' : 
             isBuyer ? 'Your procurement analytics' : 
             'Your sales performance and insights'}
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Analytics Content */}
      {isAdmin && renderAdminAnalytics()}
      {isBuyer && !isAdmin && renderBuyerAnalytics()}
      {isSeller && !isAdmin && renderSellerAnalytics()}
    </div>
  )
}

export default function AnalyticsPage() {
  return (
    <ProtectedRoute>
      <AnalyticsContent />
    </ProtectedRoute>
  )
}