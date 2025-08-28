'use client'

import { useState, useEffect } from 'react'
import { useAuth, ProtectedRoute } from '@/lib/simple-auth'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, CheckCircle, Clock, AlertTriangle, Download, Eye, Rupee } from 'lucide-react'

interface Transaction {
  id: string
  productPrice: number
  commissionAmount: number
  totalAmount: number
  status: string
  invoiceNumber: string
  paymentDate?: string
  createdAt: string
  buyer: {
    id: string
    name: string
    email: string
  }
  seller: {
    id: string
    name: string
    email: string
  }
  rfq?: {
    id: string
    title: string
  }
  product?: {
    id: string
    title: string
  }
  invoice?: {
    id: string
    invoiceNumber: string
    pdfUrl?: string
  }
}

interface TransactionResponse {
  transactions: Transaction[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export default function TransactionsPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [buyerTransactions, setBuyerTransactions] = useState<Transaction[]>([])
  const [sellerTransactions, setSellerTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/signin')
      return
    }

    if (user) {
      fetchTransactions()
    }
  }, [user, isAuthenticated, isLoading, router])

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      
      const [buyerResponse, sellerResponse] = await Promise.all([
        fetch('/api/transactions?type=buyer'),
        fetch('/api/transactions?type=seller')
      ])

      if (buyerResponse.ok) {
        const buyerData: TransactionResponse = await buyerResponse.json()
        setBuyerTransactions(buyerData.transactions)
      }

      if (sellerResponse.ok) {
        const sellerData: TransactionResponse = await sellerResponse.json()
        setSellerTransactions(sellerData.transactions)
      }
    } catch (error) {
      setError('Failed to fetch transactions')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case 'PAID':
        return <Badge className="bg-blue-100 text-blue-800">Paid</Badge>
      case 'COMPLETED':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case 'FAILED':
        return <Badge variant="destructive">Failed</Badge>
      case 'REFUNDED':
        return <Badge className="bg-gray-100 text-gray-800">Refunded</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-4 h-4 text-yellow-600" />
      case 'PAID':
        return <Clock className="w-4 h-4 text-blue-600" />
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'FAILED':
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      case 'REFUNDED':
        return <AlertTriangle className="w-4 h-4 text-gray-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const handleDownloadInvoice = (invoiceNumber: string) => {
    // In a real implementation, this would download the PDF
    alert(`Downloading invoice: ${invoiceNumber}`)
  }

  const handleViewDetails = (transactionId: string) => {
    router.push(`/dashboard/transactions/${transactionId}`)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const TransactionTable = ({ transactions, type }: { transactions: Transaction[], type: 'buyer' | 'seller' }) => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Transaction ID</TableHead>
            <TableHead>{type === 'buyer' ? 'Seller' : 'Buyer'}</TableHead>
            <TableHead>Product/RFQ</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Commission</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                No transactions found
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-mono text-sm">
                  {transaction.invoiceNumber}
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {type === 'buyer' ? transaction.seller.name : transaction.buyer.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {type === 'buyer' ? transaction.seller.email : transaction.buyer.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-xs">
                    <div className="font-medium truncate">
                      {transaction.product?.title || transaction.rfq?.title || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {transaction.product ? 'Product' : 'RFQ'}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  {formatCurrency(transaction.productPrice)}
                </TableCell>
                <TableCell className="text-red-600">
                  {formatCurrency(transaction.commissionAmount)}
                </TableCell>
                <TableCell className="font-medium">
                  {formatCurrency(transaction.totalAmount)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(transaction.status)}
                    {getStatusBadge(transaction.status)}
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(transaction.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(transaction.id)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {transaction.invoice && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownloadInvoice(transaction.invoiceNumber)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
              <Rupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(
                  buyerTransactions.reduce((sum, t) => sum + t.totalAmount, 0)
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                As buyer
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <Rupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(
                  sellerTransactions.reduce((sum, t) => sum + t.productPrice, 0)
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                As seller
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Commission Earned</CardTitle>
              <Rupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(
                  buyerTransactions.reduce((sum, t) => sum + t.commissionAmount, 0)
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Platform revenue
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {[...buyerTransactions, ...sellerTransactions].filter(t => t.status === 'PENDING').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Awaiting action
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Transaction Tables */}
        <Tabs defaultValue="buyer" className="space-y-6">
          <TabsList>
            <TabsTrigger value="buyer">As Buyer ({buyerTransactions.length})</TabsTrigger>
            <TabsTrigger value="seller">As Seller ({sellerTransactions.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="buyer">
            <Card>
              <CardHeader>
                <CardTitle>Purchase Transactions</CardTitle>
                <CardDescription>
                  Transactions where you are the buyer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TransactionTable transactions={buyerTransactions} type="buyer" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seller">
            <Card>
              <CardHeader>
                <CardTitle>Sales Transactions</CardTitle>
                <CardDescription>
                  Transactions where you are the seller
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TransactionTable transactions={sellerTransactions} type="seller" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Commission Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Commission Structure</CardTitle>
            <CardDescription>
              How we calculate transaction fees
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="font-medium">For transactions ≤ Rs. 50,000</h4>
                <p className="text-sm text-gray-600">Fixed commission of Rs. 500</p>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-medium">Example:</p>
                  <p className="text-sm">Product Price: Rs. 30,000</p>
                  <p className="text-sm">Commission: Rs. 500</p>
                  <p className="text-sm font-medium">Total: Rs. 30,500</p>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">For transactions &gt; Rs. 50,000</h4>
                <p className="text-sm text-gray-600">2% commission on product price</p>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-medium">Example:</p>
                  <p className="text-sm">Product Price: Rs. 100,000</p>
                  <p className="text-sm">Commission: Rs. 2,000 (2%)</p>
                  <p className="text-sm font-medium">Total: Rs. 102,000</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function ProtectedTransactionsPage() {
  return (
    <ProtectedRoute>
      <TransactionsPage />
    </ProtectedRoute>
  )
}