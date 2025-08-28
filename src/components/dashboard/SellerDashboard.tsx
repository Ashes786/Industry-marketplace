'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
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

  const [recentProducts, setRecentProducts] = useState([])
  const [recentRfqs, setRecentRfqs] = useState([])

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

    setRecentProducts([
      {
        id: '1',
        title: 'Industrial Steel Pipes',
        category: 'Construction Materials',
        price: 45000,
        views: 245,
        isActive: true,
        createdAt: '2024-01-20'
      },
      {
        id: '2',
        title: 'Electrical Motors',
        category: 'Electrical',
        price: 25000,
        views: 189,
        isActive: true,
        createdAt: '2024-01-18'
      }
    ])

    setRecentRfqs([
      {
        id: '1',
        title: 'Steel Pipes for Construction',
        buyerName: 'Construction Co.',
        budget: 500000,
        status: 'NEGOTIATION',
        messages: 3,
        createdAt: '2024-01-20'
      },
      {
        id: '2',
        title: 'Industrial Machinery Parts',
        buyerName: 'Manufacturing Ltd',
        budget: 750000,
        status: 'OPEN',
        messages: 1,
        createdAt: '2024-01-19'
      }
    ])
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-green-100 text-green-800'
      case 'NEGOTIATION': return 'bg-yellow-100 text-yellow-800'
      case 'APPROVED': return 'bg-blue-100 text-blue-800'
      case 'CLOSED': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
          <p className="text-gray-600">Manage your products and respond to RFQs</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/products/create">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </Link>
          <Link href="/dashboard/subscription">
            <Button variant="outline" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Upgrade Plan
            </Button>
          </Link>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Products</p>
                <p className="text-2xl font-bold">{stats.totalProducts}</p>
                <p className="text-sm text-green-600">{stats.activeProducts} active</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">RFQs Received</p>
                <p className="text-2xl font-bold">{stats.rfqsReceived}</p>
                <p className="text-sm text-yellow-600">3 pending response</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Deals Closed</p>
                <p className="text-2xl font-bold">{stats.dealsClosed}</p>
                <p className="text-sm text-green-600">62.5% success rate</p>
              </div>
              <FileText className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Revenue</p>
                <p className="text-2xl font-bold">Rs. {(stats.revenue / 1000000).toFixed(1)}M</p>
                <p className="text-sm text-green-600">This month</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Subscription Plan
          </CardTitle>
          <CardDescription>Your current plan and usage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{subscription?.planType || 'BASIC'}</div>
              <div className="text-sm text-gray-600">Current Plan</div>
              <div className="text-xs text-green-600">{planLimits.price}</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">{stats.activeProducts}/{planLimits.products}</div>
              <div className="text-sm text-gray-600">Products Used</div>
              <div className="text-xs text-gray-500">{usagePercentage.toFixed(0)}% of limit</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {subscription?.status === 'ACTIVE' ? 'Active' : 'Expired'}
              </div>
              <div className="text-sm text-gray-600">Status</div>
              <div className="text-xs text-gray-500">
                {subscription?.endDate ? `Expires: ${new Date(subscription.endDate).toLocaleDateString()}` : 'N/A'}
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Product Listing Usage</span>
              <span>{usagePercentage.toFixed(0)}%</span>
            </div>
            <Progress value={usagePercentage} className="h-2" />
            {usagePercentage > 80 && (
              <div className="mt-2 text-sm text-yellow-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                Approaching product limit. Consider upgrading your plan.
              </div>
            )}
          </div>
          <div className="mt-4 flex gap-2">
            <Link href="/dashboard/subscription">
              <Button variant="outline" size="sm">
                <Settings className="h-3 w-3 mr-1" />
                Manage Subscription
              </Button>
            </Link>
            <Link href="/dashboard/subscription">
              <Button size="sm">
                <CreditCard className="h-3 w-3 mr-1" />
                Buy Extra Listings
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Recent Products
            </CardTitle>
            <CardDescription>Your latest product listings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProducts.map((product: any) => (
                <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{product.title}</h4>
                      <Badge className={product.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{product.category}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span>Price: Rs. {product.price.toLocaleString()}</span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {product.views} views
                      </span>
                      <span>{product.createdAt}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link href="/dashboard/products">
                <Button variant="outline" size="sm">
                  View All Products
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent RFQs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Recent RFQs
            </CardTitle>
            <CardDescription>Latest requests for quotation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentRfqs.map((rfq: any) => (
                <div key={rfq.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{rfq.title}</h4>
                      <Badge className={getStatusColor(rfq.status)}>
                        {rfq.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">Buyer: {rfq.buyerName}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span>Budget: Rs. {rfq.budget.toLocaleString()}</span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {rfq.messages} messages
                      </span>
                      <span>{rfq.createdAt}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      View Details
                    </Button>
                    <Button size="sm">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Respond
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link href="/dashboard/rfqs">
                <Button variant="outline" size="sm">
                  View All RFQs
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Performance Analytics
          </CardTitle>
          <CardDescription>Your sales performance and insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalViews}</div>
              <div className="text-sm text-gray-600">Total Views</div>
              <div className="text-xs text-green-600">+15% vs last month</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.dealsClosed}</div>
              <div className="text-sm text-gray-600">Deals Closed</div>
              <div className="text-xs text-green-600">62.5% success rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">Rs. {(stats.revenue / stats.dealsClosed).toLocaleString()}</div>
              <div className="text-sm text-gray-600">Avg. Deal Value</div>
              <div className="text-xs text-gray-500">Per transaction</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">4.2</div>
              <div className="text-sm text-gray-600">Avg. Rating</div>
              <div className="text-xs text-gray-500">From buyers</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}