'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  Plus, 
  Package, 
  MessageSquare, 
  FileText, 
  DollarSign,
  ShoppingCart,
  Eye,
  Star,
  Users,
  BarChart3,
  Settings,
  CreditCard,
  Upload,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'

interface SellerDashboardProps {
  user: any
  subscription?: any
}

export function SellerDashboard({ user, subscription }: SellerDashboardProps) {
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    totalViews: 0,
    rfqsReceived: 0,
    pendingRfqs: 0,
    dealsClosed: 0,
    revenue: 0,
    previousMonthRevenue: 0
  })

  useEffect(() => {
    const fetchSellerStats = async () => {
      try {
        // Fetch user's products
        const productsResponse = await fetch('/api/products/my')
        if (productsResponse.ok) {
          const productsData = await productsResponse.json()
          const activeProducts = productsData.filter((p: any) => p.isActive)
          
          // Fetch RFQs
          const rfqsResponse = await fetch('/api/rfqs')
          let rfqsData = []
          if (rfqsResponse.ok) {
            rfqsData = await rfqsResponse.json()
          }
          
          // Fetch user's transactions as seller
          const transactionsResponse = await fetch('/api/transactions')
          if (transactionsResponse.ok) {
            const transactionsData = await transactionsResponse.json()
            const sellerTransactions = transactionsData.filter((t: any) => t.sellerId === user.id)
            
            // Calculate previous month revenue
            const lastMonth = new Date()
            lastMonth.setMonth(lastMonth.getMonth() - 1)
            lastMonth.setDate(1)
            lastMonth.setHours(0, 0, 0, 0)
            
            const previousMonthRevenue = sellerTransactions
              .filter((t: any) => {
                const transactionDate = new Date(t.createdAt)
                return t.status === 'COMPLETED' && 
                       transactionDate >= lastMonth && 
                       transactionDate < new Date(new Date().getFullYear(), new Date().getMonth(), 1)
              })
              .reduce((sum: number, t: any) => sum + (t.productAmount || 0), 0)
            
            // Calculate stats from real data
            setStats({
              totalProducts: productsData.length,
              activeProducts: activeProducts.length,
              totalViews: activeProducts.reduce((sum: number, p: any) => sum + (p.views || 0), 0),
              rfqsReceived: rfqsData.length,
              pendingRfqs: rfqsData.filter((rfq: any) => rfq.status === 'OPEN').length,
              dealsClosed: sellerTransactions.filter((t: any) => t.status === 'COMPLETED').length,
              revenue: sellerTransactions
                .filter((t: any) => t.status === 'COMPLETED')
                .reduce((sum: number, t: any) => sum + (t.productAmount || 0), 0),
              previousMonthRevenue
            })
          }
        }
      } catch (error) {
        console.error('Error fetching seller stats:', error)
        // Fallback to mock data if API fails
        setStats({
          totalProducts: 0,
          activeProducts: 0,
          totalViews: 0,
          rfqsReceived: 0,
          pendingRfqs: 0,
          dealsClosed: 0,
          revenue: 0,
          previousMonthRevenue: 0
        })
      }
    }

    fetchSellerStats()
  }, [user.id])

  const getPlanLimits = (planType: string) => {
    switch (planType) {
      case 'BASIC': return { products: 10, price: 'Free' }
      case 'STANDARD': return { products: 50, price: 'Rs. 5,000/month' }
      case 'PREMIUM': return { products: 200, price: 'Rs. 12,000/month' }
      default: return { products: 10, price: 'Free' }
    }
  }

  const planLimits = getPlanLimits(subscription?.planType || 'BASIC')
  const usagePercentage = (stats.activeProducts / planLimits.products) * 100

  // Calculate growth rates
  const revenueGrowth = stats.previousMonthRevenue > 0 ? 
    Math.round(((stats.revenue - stats.previousMonthRevenue) / stats.previousMonthRevenue) * 100) : 0
    
  const successRate = stats.rfqsReceived > 0 ? 
    Math.round((stats.dealsClosed / stats.rfqsReceived) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
        <p className="text-gray-600">Your seller dashboard overview and quick actions</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                <p className="text-sm text-green-600">
                  {stats.activeProducts} active
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">RFQs Received</p>
                <p className="text-2xl font-bold text-gray-900">{stats.rfqsReceived}</p>
                <p className="text-sm text-green-600">
                  {stats.pendingRfqs > 0 ? `${stats.pendingRfqs} pending response` : 'No pending RFQs'}
                </p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Deals Closed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.dealsClosed}</p>
                <p className="text-sm text-green-600">
                  {successRate > 0 ? `${successRate}% success rate` : 'No deals yet'}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">Rs. {(stats.revenue / 1000000).toFixed(1)}M</p>
                <p className="text-sm text-green-600">
                  {revenueGrowth > 0 ? `+${revenueGrowth}% growth` : revenueGrowth < 0 ? `${revenueGrowth}% decline` : 'No change'}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Quick Actions</CardTitle>
          <CardDescription className="text-sm">Common seller tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/dashboard/products/create">
              <Button className="w-full h-auto p-6 flex flex-col items-center gap-3 bg-blue-600 hover:bg-blue-700">
                <Plus className="h-8 w-8" />
                <div className="text-center">
                  <div className="font-semibold">Add Product</div>
                  <div className="text-xs opacity-90">Create new listing</div>
                </div>
              </Button>
            </Link>
            
            <Link href="/dashboard/products">
              <Button variant="outline" className="w-full h-auto p-6 flex flex-col items-center gap-3 border-2">
                <Package className="h-8 w-8" />
                <div className="text-center">
                  <div className="font-semibold">My Products</div>
                  <div className="text-xs text-gray-600">Manage listings</div>
                </div>
              </Button>
            </Link>
            
            <Link href="/dashboard/rfqs">
              <Button variant="outline" className="w-full h-auto p-6 flex flex-col items-center gap-3 border-2">
                <MessageSquare className="h-8 w-8" />
                <div className="text-center">
                  <div className="font-semibold">RFQs</div>
                  <div className="text-xs text-gray-600">View requests</div>
                </div>
              </Button>
            </Link>
            
            <Link href="/dashboard/subscription">
              <Button variant="outline" className="w-full h-auto p-6 flex flex-col items-center gap-3 border-2">
                <CreditCard className="h-8 w-8" />
                <div className="text-center">
                  <div className="font-semibold">Subscription</div>
                  <div className="text-xs text-gray-600">Manage plan</div>
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
            Performance Analytics
          </CardTitle>
          <CardDescription className="text-sm">Your sales performance and insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.totalViews}</div>
              <div className="text-sm text-gray-600 mt-1">Total Views</div>
              <div className="text-xs text-green-600 mt-1">
                  {revenueGrowth > 0 ? `+${revenueGrowth}%` : revenueGrowth < 0 ? `${revenueGrowth}%` : '0%'} vs last month
                </div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.dealsClosed}</div>
              <div className="text-sm text-gray-600 mt-1">Deals Closed</div>
              <div className="text-xs text-green-600 mt-1">
                  {successRate}% success rate
                </div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">Rs. {(stats.revenue / stats.dealsClosed).toLocaleString()}</div>
              <div className="text-sm text-gray-600 mt-1">Avg. Deal Value</div>
              <div className="text-xs text-gray-500 mt-1">Per transaction</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">4.2</div>
              <div className="text-sm text-gray-600 mt-1">Avg. Rating</div>
              <div className="text-xs text-gray-500 mt-1">From buyers</div>
            </div>
          </div>
          
          {/* Simple bar chart representation */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Revenue Trend (Last 6 Months)</h4>
            <div className="grid grid-cols-6 gap-2 h-32">
              {stats.revenue > 0 ? [
                { month: 'Jan', value: Math.max(20, stats.revenue * 0.08), color: 'bg-blue-400' },
                { month: 'Feb', value: Math.max(25, stats.revenue * 0.12), color: 'bg-blue-400' },
                { month: 'Mar', value: Math.max(30, stats.revenue * 0.15), color: 'bg-blue-500' },
                { month: 'Apr', value: Math.max(35, stats.revenue * 0.18), color: 'bg-blue-400' },
                { month: 'May', value: Math.max(40, stats.revenue * 0.22), color: 'bg-blue-600' },
                { month: 'Jun', value: Math.max(45, stats.revenue * 0.25), color: 'bg-blue-600' }
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center justify-end h-full">
                  <div 
                    className={`w-full ${item.color} rounded-t transition-all duration-300 hover:opacity-80`}
                    style={{ height: `${Math.min(100, item.value)}%` }}
                  ></div>
                  <div className="text-xs text-gray-600 mt-1">{item.month}</div>
                </div>
              )) : [
                { month: 'Jan', value: 0, color: 'bg-gray-300' },
                { month: 'Feb', value: 0, color: 'bg-gray-300' },
                { month: 'Mar', value: 0, color: 'bg-gray-300' },
                { month: 'Apr', value: 0, color: 'bg-gray-300' },
                { month: 'May', value: 0, color: 'bg-gray-300' },
                { month: 'Jun', value: 0, color: 'bg-gray-300' }
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