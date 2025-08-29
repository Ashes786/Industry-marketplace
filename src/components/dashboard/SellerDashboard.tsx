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
    dealsClosed: 0,
    revenue: 0
  })

  useEffect(() => {
    // Mock data - in real app, fetch from API
    setStats({
      totalProducts: 15,
      activeProducts: 12,
      totalViews: 2450,
      rfqsReceived: 8,
      dealsClosed: 5,
      revenue: 1850000
    })
  }, [])

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
                <p className="text-sm text-green-600">{stats.activeProducts} active</p>
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
                <p className="text-sm text-yellow-600">3 pending response</p>
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
                <p className="text-sm text-green-600">62.5% success rate</p>
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
                <p className="text-sm text-green-600">This month</p>
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
              <div className="text-xs text-green-600 mt-1">+15% vs last month</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.dealsClosed}</div>
              <div className="text-sm text-gray-600 mt-1">Deals Closed</div>
              <div className="text-xs text-green-600 mt-1">62.5% success rate</div>
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
              {[
                { month: 'Jan', value: 30, color: 'bg-blue-400' },
                { month: 'Feb', value: 45, color: 'bg-blue-400' },
                { month: 'Mar', value: 60, color: 'bg-blue-500' },
                { month: 'Apr', value: 55, color: 'bg-blue-400' },
                { month: 'May', value: 80, color: 'bg-blue-600' },
                { month: 'Jun', value: 95, color: 'bg-blue-600' }
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