'use client'

import { useState, useEffect } from 'react'
import { useAuth, ProtectedRoute } from '@/lib/simple-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  ShoppingCart, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  MessageSquare,
  Calendar,
  DollarSign,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText
} from 'lucide-react'
import Link from 'next/link'

function RFQsContent() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [rfqs, setRfqs] = useState([])

  useEffect(() => {
    // Mock data - in real app, fetch from API based on user role
    const isBuyer = user.roles === 'BUYER' || user.roles === 'BOTH'
    
    if (isBuyer) {
      setRfqs([
        {
          id: '1',
          title: 'Steel Pipes for Construction',
          description: 'Need high-quality steel pipes for residential construction project',
          category: 'Construction Materials',
          budget: 500000,
          quantity: 100,
          unit: 'pieces',
          status: 'OPEN',
          responses: 5,
          deadline: '2024-02-15',
          createdAt: '2024-01-20'
        },
        {
          id: '2',
          title: 'Industrial Machinery Parts',
          description: 'Looking for spare parts for industrial machinery',
          category: 'Machinery',
          budget: 750000,
          quantity: 50,
          unit: 'pieces',
          status: 'NEGOTIATION',
          responses: 3,
          deadline: '2024-02-10',
          createdAt: '2024-01-18'
        },
        {
          id: '3',
          title: 'Electrical Components',
          description: 'Various electrical components needed for manufacturing',
          category: 'Electrical',
          budget: 250000,
          quantity: 200,
          unit: 'pieces',
          status: 'CLOSED',
          responses: 8,
          deadline: '2024-01-25',
          createdAt: '2024-01-10'
        }
      ])
    } else {
      // Seller view - RFQs received
      setRfqs([
        {
          id: '4',
          title: 'Cement Supply Required',
          description: 'Need bulk cement supply for construction project',
          category: 'Construction Materials',
          budget: 1200000,
          quantity: 2000,
          unit: 'bags',
          status: 'OPEN',
          buyerName: 'Construction Co.',
          buyerRating: 4.5,
          messages: 2,
          deadline: '2024-02-20',
          createdAt: '2024-01-22'
        },
        {
          id: '5',
          title: 'Steel Beams Order',
          description: 'Steel beams required for commercial building',
          category: 'Construction Materials',
          budget: 2500000,
          quantity: 100,
          unit: 'pieces',
          status: 'NEGOTIATION',
          buyerName: 'Building Corp',
          buyerRating: 4.2,
          messages: 5,
          deadline: '2024-02-18',
          createdAt: '2024-01-19'
        }
      ])
    }
  }, [user])

  const isBuyer = user.roles === 'BUYER' || user.roles === 'BOTH'
  const isSeller = user.roles === 'SELLER' || user.roles === 'BOTH'

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-green-100 text-green-800'
      case 'NEGOTIATION': return 'bg-yellow-100 text-yellow-800'
      case 'APPROVED': return 'bg-blue-100 text-blue-800'
      case 'CLOSED': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredRfqs = rfqs.filter((rfq: any) => {
    const matchesSearch = rfq.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rfq.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || rfq.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isBuyer ? 'My RFQs' : 'RFQs Received'}
          </h1>
          <p className="text-gray-600">
            {isBuyer ? 'Manage your requests for quotations' : 'Respond to quotation requests'}
          </p>
        </div>
        {isBuyer && (
          <Link href="/dashboard/rfqs/create">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create RFQ
            </Button>
          </Link>
        )}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search RFQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="OPEN">Open</SelectItem>
                <SelectItem value="NEGOTIATION">In Negotiation</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="CLOSED">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* RFQs List */}
      <div className="space-y-4">
        {filteredRfqs.map((rfq: any) => (
          <Card key={rfq.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg">{rfq.title}</CardTitle>
                    <Badge className={getStatusColor(rfq.status)}>
                      {rfq.status}
                    </Badge>
                  </div>
                  <CardDescription>{rfq.description}</CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">Rs. {rfq.budget.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Budget</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <ShoppingCart className="h-4 w-4" />
                  <span>{rfq.category}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Deadline: {rfq.deadline}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <DollarSign className="h-4 w-4" />
                  <span>{rfq.quantity} {rfq.unit}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>Created: {rfq.createdAt}</span>
                </div>
              </div>

              {isBuyer && (
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <MessageSquare className="h-4 w-4" />
                  <span>{rfq.responses} responses</span>
                </div>
              )}

              {isSeller && (
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{rfq.buyerName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>{rfq.messages} messages</span>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Eye className="h-3 w-3 mr-1" />
                  View Details
                </Button>
                <Button size="sm">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  {isBuyer ? 'View Responses' : 'Respond'}
                </Button>
                {rfq.status === 'APPROVED' && (
                  <Button size="sm" variant="outline">
                    <FileText className="h-3 w-3 mr-1" />
                    View Invoice
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRfqs.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {isBuyer ? 'No RFQs created yet' : 'No RFQs received'}
            </h3>
            <p className="text-gray-600 mb-4">
              {isBuyer ? 'Create your first RFQ to get started' : 'Check back later for new RFQs'}
            </p>
            {isBuyer && (
              <Link href="/dashboard/rfqs/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create RFQ
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function RFQsPage() {
  return (
    <ProtectedRoute>
      <RFQsContent />
    </ProtectedRoute>
  )
}