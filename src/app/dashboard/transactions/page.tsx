'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  ArrowLeft, 
  Download, 
  Eye, 
  CreditCard,
  DollarSign,
  TrendingUp,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  Calendar,
  Package
} from 'lucide-react'
import Link from 'next/link'

interface TransactionsProps {
  user: any
}

interface Transaction {
  id: string
  rfqId?: string
  productId?: string
  buyerId: string
  sellerId: string
  totalAmount: number
  commissionAmount: number
  productAmount: number
  status: 'PENDING' | 'PAID' | 'COMPLETED' | 'FAILED'
  paymentDate?: string
  invoiceNumber?: string
  createdAt: string
  buyer: {
    id: string
    name: string
    email: string
    companyName?: string
  }
  seller: {
    id: string
    name: string
    email: string
    companyName?: string
  }
  rfq?: {
    id: string
    title: string
    category: string
  }
  product?: {
    id: string
    title: string
    category: string
  }
}

export default function TransactionsPage({ user }: TransactionsProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/transactions')
      if (response.ok) {
        const data = await response.json()
        setTransactions(data)
      }
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'PAID': return 'bg-blue-100 text-blue-800'
      case 'COMPLETED': return 'bg-green-100 text-green-800'
      case 'FAILED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="h-4 w-4" />
      case 'PAID': return <CreditCard className="h-4 w-4" />
      case 'COMPLETED': return <CheckCircle className="h-4 w-4" />
      case 'FAILED': return <AlertTriangle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const getCommissionRate = (amount: number) => {
    return amount <= 50000 ? 'Rs. 500 (flat)' : '2% of amount'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading transactions...</p>
        </div>
      </div>
    )
  }

  const totalSpent = transactions
    .filter(t => t.buyerId === user.id)
    .reduce((sum, t) => sum + t.totalAmount, 0)

  const totalEarned = transactions
    .filter(t => t.sellerId === user.id)
    .reduce((sum, t) => sum + t.productAmount, 0)

  const totalCommission = transactions
    .filter(t => t.buyerId === user.id)
    .reduce((sum, t) => sum + t.commissionAmount, 0)

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
              <h1 className="text-xl font-semibold">Transactions</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Transactions</p>
                  <p className="text-2xl font-bold">{transactions.length}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          {user.roles === 'BUYER' || user.roles === 'BOTH' ? (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Spent</p>
                    <p className="text-2xl font-bold">Rs. {totalSpent.toLocaleString()}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          ) : null}
          
          {user.roles === 'SELLER' || user.roles === 'BOTH' ? (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Earned</p>
                    <p className="text-2xl font-bold">Rs. {totalEarned.toLocaleString()}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          ) : null}
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Commission Paid</p>
                  <p className="text-2xl font-bold">Rs. {totalCommission.toLocaleString()}</p>
                </div>
                <CreditCard className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>
              View all your transactions including payments, commissions, and status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Party</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => {
                  const isBuyer = transaction.buyerId === user.id
                  const otherParty = isBuyer ? transaction.seller : transaction.buyer
                  const amount = isBuyer ? transaction.totalAmount : transaction.productAmount
                  
                  return (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">
                            {new Date(transaction.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {transaction.rfq ? (
                            <Package className="h-4 w-4 text-blue-600" />
                          ) : (
                            <FileText className="h-4 w-4 text-green-600" />
                          )}
                          <div>
                            <p className="font-medium text-sm">
                              {transaction.rfq?.title || transaction.product?.title || 'Transaction'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {transaction.rfq?.category || transaction.product?.category || 'General'}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar>
                            <AvatarImage src="/placeholder-avatar.jpg" />
                            <AvatarFallback>
                              {otherParty.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{otherParty.name}</p>
                            <p className="text-xs text-gray-500">{otherParty.companyName}</p>
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="text-right">
                          <p className="font-semibold">Rs. {amount.toLocaleString()}</p>
                          {isBuyer && transaction.commissionAmount > 0 && (
                            <p className="text-xs text-gray-500">
                              + Rs. {transaction.commissionAmount.toLocaleString()} commission
                            </p>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="text-right">
                          <p className="font-medium">Rs. {transaction.commissionAmount.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">{getCommissionRate(transaction.totalAmount)}</p>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <Badge className={getStatusColor(transaction.status)}>
                          {getStatusIcon(transaction.status)}
                          <span className="ml-1">{transaction.status}</span>
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {transaction.invoiceNumber && (
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
            
            {transactions.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
                <p className="text-gray-600">
                  {user.roles === 'BUYER' || user.roles === 'BOTH' 
                    ? 'Start by creating RFQs and making deals with sellers.'
                    : 'Complete deals with buyers to see transactions here.'
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Commission Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Commission Structure
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">For transactions ≤ Rs. 50,000</h4>
                  <p className="text-2xl font-bold text-blue-600">Rs. 500</p>
                  <p className="text-sm text-blue-700">Flat commission fee</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">For transactions &gt; Rs. 50,000</h4>
                  <p className="text-2xl font-bold text-green-600">2%</p>
                  <p className="text-sm text-green-700">Percentage of transaction amount</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">How it works:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Buyers pay the total amount (product price + commission)</li>
                <li>• Sellers receive only the product price</li>
                <li>• Commission is automatically calculated and collected</li>
                <li>• All transactions are securely processed and recorded</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}