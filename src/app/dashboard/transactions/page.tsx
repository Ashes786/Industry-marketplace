'use client'

import { useState, useEffect } from 'react'
import { useAuth, ProtectedRoute } from '@/lib/simple-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  FileText, 
  Search, 
  Filter, 
  Eye, 
  Download,
  DollarSign,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  CreditCard,
  Receipt,
  TrendingUp
} from 'lucide-react'

function TransactionsContent() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    // Mock data - in real app, fetch from API based on user role
    const isBuyer = user.roles === 'BUYER' || user.roles === 'BOTH'
    
    setTransactions([
      {
        id: '1',
        rfqTitle: 'Steel Pipes for Construction',
        counterpartyName: isBuyer ? 'Steel Industries Ltd' : 'Construction Co.',
        amount: 485000,
        commission: 9700,
        totalAmount: 494700,
        status: 'COMPLETED',
        paymentMethod: 'Bank Transfer',
        date: '2024-01-15',
        invoiceNumber: 'INV-2024-001',
        invoicePdf: '/invoices/INV-2024-001.pdf'
      },
      {
        id: '2',
        rfqTitle: 'Electrical Components',
        counterpartyName: isBuyer ? 'Tech Suppliers' : 'Manufacturing Ltd',
        amount: 125000,
        commission: 2500,
        totalAmount: 127500,
        status: 'COMPLETED',
        paymentMethod: 'JazzCash',
        date: '2024-01-10',
        invoiceNumber: 'INV-2024-002',
        invoicePdf: '/invoices/INV-2024-002.pdf'
      },
      {
        id: '3',
        rfqTitle: 'Industrial Machinery Parts',
        counterpartyName: isBuyer ? 'Industrial Solutions' : 'Factory Corp',
        amount: 350000,
        commission: 7000,
        totalAmount: 357000,
        status: 'PENDING',
        paymentMethod: 'EasyPaisa',
        date: '2024-01-20',
        invoiceNumber: 'INV-2024-003',
        invoicePdf: '/invoices/INV-2024-003.pdf'
      },
      {
        id: '4',
        rfqTitle: 'Cement Supply',
        counterpartyName: isBuyer ? 'Building Materials Co' : 'Construction Ltd',
        amount: 750000,
        commission: 15000,
        totalAmount: 765000,
        status: 'PAID',
        paymentMethod: 'Bank Transfer',
        date: '2024-01-18',
        invoiceNumber: 'INV-2024-004',
        invoicePdf: '/invoices/INV-2024-004.pdf'
      }
    ])
  }, [user])

  const isBuyer = user.roles === 'BUYER' || user.roles === 'BOTH'

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800'
      case 'PAID': return 'bg-blue-100 text-blue-800'
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'FAILED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredTransactions = transactions.filter((transaction: any) => {
    const matchesSearch = transaction.rfqTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.counterpartyName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalSpent = transactions
    .filter(t => t.status === 'COMPLETED' || t.status === 'PAID')
    .reduce((sum, t) => sum + (isBuyer ? t.totalAmount : t.amount), 0)
    
  const totalCommission = transactions
    .filter(t => t.status === 'COMPLETED' || t.status === 'PAID')
    .reduce((sum, t) => sum + t.commission, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600">View your transaction history and invoices</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export All
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  {isBuyer ? 'Total Spent' : 'Total Earned'}
                </p>
                <p className="text-2xl font-bold">Rs. {totalSpent.toLocaleString()}</p>
                <p className="text-sm text-green-600">This month</p>
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
                <p className="text-2xl font-bold">{transactions.length}</p>
                <p className="text-sm text-green-600">
                  {transactions.filter(t => t.status === 'COMPLETED').length} completed
                </p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        {isBuyer && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Commission</p>
                  <p className="text-2xl font-bold">Rs. {totalCommission.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Platform fees</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search transactions..."
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
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <div className="space-y-4">
        {filteredTransactions.map((transaction: any) => (
          <Card key={transaction.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{transaction.rfqTitle}</h3>
                    <Badge className={getStatusColor(transaction.status)}>
                      {transaction.status}
                    </Badge>
                  </div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="text-sm">
                      <div className="text-gray-600">
                        {isBuyer ? 'Seller' : 'Buyer'}
                      </div>
                      <div className="font-medium">{transaction.counterpartyName}</div>
                    </div>
                    <div className="text-sm">
                      <div className="text-gray-600">Amount</div>
                      <div className="font-medium">
                        Rs. {isBuyer ? transaction.totalAmount.toLocaleString() : transaction.amount.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-sm">
                      <div className="text-gray-600">Payment Method</div>
                      <div className="font-medium">{transaction.paymentMethod}</div>
                    </div>
                    <div className="text-sm">
                      <div className="text-gray-600">Date</div>
                      <div className="font-medium">{transaction.date}</div>
                    </div>
                  </div>

                  {isBuyer && (
                    <div className="text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <span>Commission: Rs. {transaction.commission.toLocaleString()}</span>
                        <span>•</span>
                        <span>Invoice: {transaction.invoiceNumber}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 ml-4">
                  <Button size="sm" variant="outline">
                    <Eye className="h-3 w-3 mr-1" />
                    View Details
                  </Button>
                  {transaction.invoicePdf && (
                    <Button size="sm" variant="outline">
                      <Download className="h-3 w-3 mr-1" />
                      Invoice
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTransactions.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
            <p className="text-gray-600">Your transaction history will appear here</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function TransactionsPage() {
  return (
    <ProtectedRoute>
      <TransactionsContent />
    </ProtectedRoute>
  )
}