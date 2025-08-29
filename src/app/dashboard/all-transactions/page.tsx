'use client'

import { useState, useEffect } from 'react'
import { useAuth, ProtectedRoute } from '@/lib/simple-auth'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { 
  CreditCard, 
  Eye,
  Loader2,
  Filter,
  Download
} from 'lucide-react'

function AllTransactionsPageContent() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockTransactions = [
      {
        id: '1',
        buyerName: 'Ahmed Khan',
        sellerName: 'Fatima Ali',
        amount: 450000,
        commission: 9000,
        status: 'COMPLETED',
        date: '2024-01-15',
        paymentMethod: 'Bank Transfer'
      },
      {
        id: '2',
        buyerName: 'Construction Co.',
        sellerName: 'Muhammad Raza',
        amount: 350000,
        commission: 7000,
        status: 'PENDING',
        date: '2024-01-20',
        paymentMethod: 'EasyPaisa'
      },
      {
        id: '3',
        buyerName: 'Ahmed Khan',
        sellerName: 'Steel Industries',
        amount: 190000,
        commission: 3800,
        status: 'PAID',
        date: '2024-01-10',
        paymentMethod: 'JazzCash'
      },
      {
        id: '4',
        buyerName: 'Textile Mills',
        sellerName: 'Industrial Solutions',
        amount: 275000,
        commission: 5500,
        status: 'COMPLETED',
        date: '2024-01-12',
        paymentMethod: 'Bank Transfer'
      },
      {
        id: '5',
        buyerName: 'Construction Co.',
        sellerName: 'Fatima Ali',
        amount: 125000,
        commission: 2500,
        status: 'FAILED',
        date: '2024-01-08',
        paymentMethod: 'EasyPaisa'
      }
    ]

    setTimeout(() => {
      setTransactions(mockTransactions)
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800'
      case 'COMPLETED': return 'bg-green-100 text-green-800'
      case 'PAID': return 'bg-blue-100 text-blue-800'
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'EXPIRED': return 'bg-gray-100 text-gray-800'
      case 'FAILED': return 'bg-red-100 text-red-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <DashboardLayout user={user} title="All Transactions" subtitle="View and manage all platform transactions">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout user={user} title="All Transactions" subtitle="View and manage all platform transactions">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                All Transactions
              </CardTitle>
              <CardDescription>View and manage all platform transactions</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Buyer</TableHead>
                  <TableHead>Seller</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction: any) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">#{transaction.id}</TableCell>
                    <TableCell>{transaction.buyerName}</TableCell>
                    <TableCell>{transaction.sellerName}</TableCell>
                    <TableCell>Rs. {transaction.amount.toLocaleString()}</TableCell>
                    <TableCell>Rs. {transaction.commission.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(transaction.status)}>
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>{transaction.paymentMethod}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}

export default function AllTransactionsPage() {
  return (
    <ProtectedRoute>
      <AllTransactionsPageContent />
    </ProtectedRoute>
  )
}