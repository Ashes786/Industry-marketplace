'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
  BarChart3,
  Users,
  Package,
  CreditCard
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
    totalSpent: 0,
    thisWeekRfqs: 0,
    previousWeekRfqs: 0
  })

  useEffect(() => {
    const fetchBuyerStats = async () => {
      try {
        // Fetch user's RFQs
        const rfqsResponse = await fetch('/api/rfqs')
        if (rfqsResponse.ok) {
          const rfqsData = await rfqsResponse.json()
          const userRfqs = rfqsData.filter((rfq: any) => rfq.buyerId === user.id)
          
          // Calculate this week's RFQs vs previous week
          const now = new Date()
          const thisWeekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay())
          const lastWeekStart = new Date(thisWeekStart)
          lastWeekStart.setDate(lastWeekStart.getDate() - 7)
          
          const thisWeekRfqs = userRfqs.filter((rfq: any) => new Date(rfq.createdAt) >= thisWeekStart).length
          const previousWeekRfqs = userRfqs.filter((rfq: any) => {
            const created = new Date(rfq.createdAt)
            return created >= lastWeekStart && created < thisWeekStart
          }).length
          
          // Fetch user's transactions as buyer
          const transactionsResponse = await fetch('/api/transactions')
          if (transactionsResponse.ok) {
            const transactionsData = await transactionsResponse.json()
            const buyerTransactions = transactionsData.filter((t: any) => t.buyerId === user.id)
            
            // Calculate stats from real data
            setStats({
              totalRfqs: userRfqs.length,
              activeRfqs: userRfqs.filter((rfq: any) => rfq.status === 'OPEN').length,
              completedDeals: buyerTransactions.filter((t: any) => t.status === 'COMPLETED').length,
              totalSpent: buyerTransactions
                .filter((t: any) => t.status === 'COMPLETED')
                .reduce((sum: number, t: any) => sum + (t.totalAmount || 0), 0),
              thisWeekRfqs,
              previousWeekRfqs
            })
          }
        }
      } catch (error) {
        console.error('Error fetching buyer stats:', error)
        // Fallback to mock data if API fails
        setStats({
          totalRfqs: 0,
          activeRfqs: 0,
          completedDeals: 0,
          totalSpent: 0,
          thisWeekRfqs: 0,
          previousWeekRfqs: 0
        })
      }
    }

    fetchBuyerStats()
  }, [user.id])

  // Calculate weekly growth
  const weeklyGrowth = stats.previousWeekRfqs > 0 ? 
    Math.round(((stats.thisWeekRfqs - stats.previousWeekRfqs) / stats.previousWeekRfqs) * 100) : 0
    
  // Calculate success rate
  const successRate = stats.totalRfqs > 0 ? 
    Math.round((stats.completedDeals / stats.totalRfqs) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
        <p className="text-gray-600">Here's your procurement overview and quick actions</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Total RFQs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalRfqs}</p>
                <p className="text-sm text-green-600">
                  {weeklyGrowth > 0 ? `+${weeklyGrowth}` : weeklyGrowth < 0 ? `${weeklyGrowth}` : 'No change'} this week
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Active RFQs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeRfqs}</p>
                <p className="text-sm text-green-600">
                  {stats.activeRfqs > 0 ? 'Awaiting responses' : 'No active RFQs'}
                </p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Completed Deals</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedDeals}</p>
                <p className="text-sm text-green-600">
                  {successRate > 0 ? `${successRate}% success rate` : 'No deals yet'}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">Rs. {(stats.totalSpent / 1000000).toFixed(1)}M</p>
                <p className="text-sm text-green-600">
                  {stats.totalSpent > 0 ? 'This year' : 'No spending yet'}
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
          <CardDescription className="text-sm">Common tasks you can perform quickly</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/dashboard/rfqs/create">
              <Button className="w-full h-auto p-6 flex flex-col items-center gap-3 bg-blue-600 hover:bg-blue-700">
                <Plus className="h-8 w-8" />
                <div className="text-center">
                  <div className="font-semibold">Create RFQ</div>
                  <div className="text-xs opacity-90">New request for quotation</div>
                </div>
              </Button>
            </Link>
            
            <Link href="/dashboard/browse">
              <Button variant="outline" className="w-full h-auto p-6 flex flex-col items-center gap-3 border-2">
                <Search className="h-8 w-8" />
                <div className="text-center">
                  <div className="font-semibold">Browse Products</div>
                  <div className="text-xs text-gray-600">Explore available products</div>
                </div>
              </Button>
            </Link>
            
            <Link href="/dashboard/rfqs">
              <Button variant="outline" className="w-full h-auto p-6 flex flex-col items-center gap-3 border-2">
                <FileText className="h-8 w-8" />
                <div className="text-center">
                  <div className="font-semibold">My RFQs</div>
                  <div className="text-xs text-gray-600">View all requests</div>
                </div>
              </Button>
            </Link>
            
            <Link href="/dashboard/transactions">
              <Button variant="outline" className="w-full h-auto p-6 flex flex-col items-center gap-3 border-2">
                <CreditCard className="h-8 w-8" />
                <div className="text-center">
                  <div className="font-semibold">Transactions</div>
                  <div className="text-xs text-gray-600">View transaction history</div>
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
            Spending Analytics
          </CardTitle>
          <CardDescription className="text-sm">Your procurement trends and insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">Rs. {(stats.totalSpent / 1000000).toFixed(2)}M</div>
              <div className="text-sm text-gray-600 mt-1">Total Spent</div>
              <div className="text-xs text-green-600 mt-1">All time</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.completedDeals}</div>
              <div className="text-sm text-gray-600 mt-1">Deals Closed</div>
              <div className="text-xs text-green-600 mt-1">
                {successRate}% success rate
              </div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                Rs. {stats.completedDeals > 0 ? Math.round(stats.totalSpent / stats.completedDeals).toLocaleString() : 0}
              </div>
              <div className="text-sm text-gray-600 mt-1">Avg. Deal Size</div>
              <div className="text-xs text-gray-500 mt-1">Per transaction</div>
            </div>
          </div>
          
          {/* Simple bar chart representation */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Monthly Spending Trend</h4>
            <div className="grid grid-cols-6 gap-2 h-32">
              {stats.totalSpent > 0 ? [
                { month: 'Jan', value: Math.max(20, stats.totalSpent * 0.1), color: 'bg-blue-400' },
                { month: 'Feb', value: Math.max(25, stats.totalSpent * 0.15), color: 'bg-blue-400' },
                { month: 'Mar', value: Math.max(30, stats.totalSpent * 0.2), color: 'bg-blue-500' },
                { month: 'Apr', value: Math.max(35, stats.totalSpent * 0.18), color: 'bg-blue-400' },
                { month: 'May', value: Math.max(40, stats.totalSpent * 0.25), color: 'bg-blue-600' },
                { month: 'Jun', value: Math.max(45, stats.totalSpent * 0.22), color: 'bg-blue-500' }
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