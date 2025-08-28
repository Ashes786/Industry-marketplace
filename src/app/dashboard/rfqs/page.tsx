'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  ArrowLeft, 
  MessageSquare, 
  Eye, 
  Package,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  DollarSign,
  Users,
  TrendingUp
} from 'lucide-react'
import Link from 'next/link'

interface MyRFQsProps {
  user: any
}

interface RFQ {
  id: string
  title: string
  description: string
  category: string
  budget?: number
  quantity: number
  unit: string
  deadline?: string
  status: 'OPEN' | 'NEGOTIATION' | 'APPROVED' | 'CLOSED'
  createdAt: string
  updatedAt: string
  _count?: {
    chats: number
    products: number
    transactions: number
  }
}

export default function MyRFQsPage({ user }: MyRFQsProps) {
  const [rfqs, setRfqs] = useState<RFQ[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRFQs()
  }, [])

  const fetchRFQs = async () => {
    try {
      const response = await fetch('/api/rfqs')
      if (response.ok) {
        const data = await response.json()
        setRfqs(data)
      }
    } catch (error) {
      console.error('Error fetching RFQs:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-blue-100 text-blue-800'
      case 'NEGOTIATION': return 'bg-yellow-100 text-yellow-800'
      case 'APPROVED': return 'bg-green-100 text-green-800'
      case 'CLOSED': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OPEN': return <Clock className="h-4 w-4" />
      case 'NEGOTIATION': return <MessageSquare className="h-4 w-4" />
      case 'APPROVED': return <CheckCircle className="h-4 w-4" />
      case 'CLOSED': return <XCircle className="h-4 w-4" />
      default: return <AlertTriangle className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your RFQs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-xl font-semibold">My RFQs</h1>
            </div>
            <Link href="/dashboard/rfqs/create">
              <Button>
                <Package className="h-4 w-4 mr-2" />
                Create New RFQ
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total RFQs</p>
                  <p className="text-2xl font-bold">{rfqs.length}</p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Active RFQs</p>
                  <p className="text-2xl font-bold">{rfqs.filter(rfq => rfq.status === 'OPEN' || rfq.status === 'NEGOTIATION').length}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Approved Deals</p>
                  <p className="text-2xl font-bold">{rfqs.filter(rfq => rfq.status === 'APPROVED').length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Responses</p>
                  <p className="text-2xl font-bold">{rfqs.reduce((sum, rfq) => sum + (rfq._count?.chats || 0), 0)}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RFQs List */}
        <div className="space-y-6">
          {rfqs.map((rfq) => (
            <Card key={rfq.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl">{rfq.title}</CardTitle>
                    <CardDescription className="mt-1">{rfq.category}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(rfq.status)}>
                      {getStatusIcon(rfq.status)}
                      <span className="ml-1">{rfq.status}</span>
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Left Column - Details */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm text-gray-900 mb-2">Description</h4>
                      <p className="text-sm text-gray-600 line-clamp-3">{rfq.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-sm text-gray-900">Quantity</h4>
                        <p className="text-sm text-gray-600">{rfq.quantity} {rfq.unit}</p>
                      </div>
                      {rfq.budget && (
                        <div>
                          <h4 className="font-medium text-sm text-gray-900">Budget</h4>
                          <p className="text-sm text-gray-600">Rs. {rfq.budget.toLocaleString()}</p>
                        </div>
                      )}
                    </div>

                    {rfq.deadline && (
                      <div>
                        <h4 className="font-medium text-sm text-gray-900">Deadline</h4>
                        <p className="text-sm text-gray-600">{new Date(rfq.deadline).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>

                  {/* Right Column - Stats & Actions */}
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-sm text-gray-900 mb-3">Activity Summary</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Seller Responses</span>
                          <span className="font-medium">{rfq._count?.chats || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Products Quoted</span>
                          <span className="font-medium">{rfq._count?.products || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Deals Closed</span>
                          <span className="font-medium">{rfq._count?.transactions || 0}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-gray-900">Created</h4>
                      <p className="text-sm text-gray-600">{new Date(rfq.createdAt).toLocaleDateString()}</p>
                    </div>

                    <div className="flex gap-2">
                      <Link href={`/dashboard/chat?rfqId=${rfq.id}`} className="flex-1">
                        <Button size="sm" className="w-full">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          View Messages
                        </Button>
                      </Link>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {rfqs.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No RFQs yet</h3>
            <p className="text-gray-600 mb-6">Start by creating your first Request for Quotation.</p>
            <Link href="/dashboard/rfqs/create">
              <Button>
                <Package className="h-4 w-4 mr-2" />
                Create Your First RFQ
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}