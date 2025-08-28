'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  TrendingUp, 
  Plus, 
  Search, 
  MessageSquare, 
  FileText, 
  DollarSign,
  ShoppingCart,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Eye,
  Download,
  Calendar
} from 'lucide-react'
import Link from 'next/link'

interface BuyerDashboardProps {
  user: any
}

export function BuyerDashboard({ user }: BuyerDashboardProps) {
  const [stats, setStats] = useState({
    totalRfqs: 0,
    activeRfqs: 0,
    completedDeals: 0,
    totalSpent: 0
  })

  const [recentRfqs, setRecentRfqs] = useState([])
  const [recentTransactions, setRecentTransactions] = useState([])

  useEffect(() => {
    // Mock data - in real app, fetch from API
    setStats({
      totalRfqs: 12,
      activeRfqs: 3,
      completedDeals: 9,
      totalSpent: 2450000
    })

    setRecentRfqs([
      {
        id: '1',
        title: 'Steel Pipes for Construction',
        category: 'Construction Materials',
        status: 'OPEN',
        budget: 500000,
        responses: 5,
        createdAt: '2024-01-20'
      },
      {
        id: '2',
        title: 'Industrial Machinery Parts',
        category: 'Machinery',
        status: 'NEGOTIATION',
        budget: 750000,
        responses: 3,
        createdAt: '2024-01-18'
      }
    ])

    setRecentTransactions([
      {
        id: '1',
        rfqTitle: 'Steel Pipes for Construction',
        sellerName: 'Steel Industries Ltd',
        amount: 485000,
        commission: 9700,
        status: 'COMPLETED',
        date: '2024-01-15'
      },
      {
        id: '2',
        rfqTitle: 'Electrical Components',
        sellerName: 'Tech Suppliers',
        amount: 125000,
        commission: 2500,
        status: 'COMPLETED',
        date: '2024-01-10'
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

  const getTransactionStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800'
      case 'PAID': return 'bg-blue-100 text-blue-800'
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
          <p className="text-gray-600">Manage your RFQs and track your procurement activities</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/rfqs/create">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create RFQ
            </Button>
          </Link>
          <Link href="/dashboard/browse">
            <Button variant="outline" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Browse Products
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
                <p className="text-sm text-gray-500">Total RFQs</p>
                <p className="text-2xl font-bold">{stats.totalRfqs}</p>
                <p className="text-sm text-green-600">+2 this week</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active RFQs</p>
                <p className="text-2xl font-bold">{stats.activeRfqs}</p>
                <p className="text-sm text-yellow-600">Awaiting responses</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completed Deals</p>
                <p className="text-2xl font-bold">{stats.completedDeals}</p>
                <p className="text-sm text-green-600">75% success rate</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Spent</p>
                <p className="text-2xl font-bold">Rs. {(stats.totalSpent / 1000000).toFixed(1)}M</p>
                <p className="text-sm text-green-600">This year</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent RFQs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Recent RFQs
            </CardTitle>
            <CardDescription>Your latest request for quotations</CardDescription>
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
                    <p className="text-sm text-gray-600">{rfq.category}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span>Budget: Rs. {rfq.budget.toLocaleString()}</span>
                      <span>{rfq.responses} responses</span>
                      <span>{rfq.createdAt}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button size="sm">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Chat
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

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Transactions
            </CardTitle>
            <CardDescription>Your latest completed deals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction: any) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{transaction.rfqTitle}</h4>
                      <Badge className={getTransactionStatusColor(transaction.status)}>
                        {transaction.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">Seller: {transaction.sellerName}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span>Amount: Rs. {transaction.amount.toLocaleString()}</span>
                      <span>Commission: Rs. {transaction.commission.toLocaleString()}</span>
                      <span>{transaction.date}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      Details
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-3 w-3 mr-1" />
                      Invoice
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link href="/dashboard/transactions">
                <Button variant="outline" size="sm">
                  View All Transactions
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
            Spending Analytics
          </CardTitle>
          <CardDescription>Your procurement trends and insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">Rs. 2.45M</div>
              <div className="text-sm text-gray-600">Total Spent</div>
              <div className="text-xs text-green-600">+12% vs last month</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">9</div>
              <div className="text-sm text-gray-600">Deals Closed</div>
              <div className="text-xs text-green-600">75% success rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">Rs. 24.5K</div>
              <div className="text-sm text-gray-600">Avg. Deal Size</div>
              <div className="text-xs text-gray-500">Across all categories</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Monthly Budget Usage</span>
              <span>68%</span>
            </div>
            <Progress value={68} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}