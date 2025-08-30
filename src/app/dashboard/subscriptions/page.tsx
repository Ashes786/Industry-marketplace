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
  Download,
  Plus
} from 'lucide-react'

function SubscriptionsPageContent() {
  const { user } = useAuth()
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch real subscriptions from API
    const fetchSubscriptions = async () => {
      try {
        const response = await fetch('/api/admin/subscriptions')
        if (response.ok) {
          const data = await response.json()
          setSubscriptions(data.subscriptions || [])
        } else {
          // Fallback to empty array if API fails
          setSubscriptions([])
        }
      } catch (error) {
        console.error('Error fetching subscriptions:', error)
        setSubscriptions([])
      } finally {
        setLoading(false)
      }
    }

    fetchSubscriptions()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800'
      case 'COMPLETED': return 'bg-green-100 text-green-800'
      case 'PAID': return 'bg-blue-100 text-blue-800'
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'EXPIRED': return 'bg-gray-100 text-gray-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'BASIC': return 'bg-gray-100 text-gray-800'
      case 'STANDARD': return 'bg-blue-100 text-blue-800'
      case 'PREMIUM': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <DashboardLayout user={user} title="Subscription Management" subtitle="Manage user subscriptions and plans">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout user={user} title="Subscription Management" subtitle="Manage user subscriptions and plans">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Subscription Management
              </CardTitle>
              <CardDescription>Manage user subscriptions and plans</CardDescription>
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
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Subscription
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.map((subscription: any) => (
                  <TableRow key={subscription.id}>
                    <TableCell className="font-medium">{subscription.userName}</TableCell>
                    <TableCell>{subscription.userEmail}</TableCell>
                    <TableCell>
                      <Badge className={getPlanColor(subscription.planType)}>
                        {subscription.planType}
                      </Badge>
                    </TableCell>
                    <TableCell>Rs. {subscription.amount.toLocaleString()}</TableCell>
                    <TableCell>{subscription.startDate}</TableCell>
                    <TableCell>{subscription.endDate}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(subscription.status)}>
                        {subscription.status}
                      </Badge>
                    </TableCell>
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

export default function SubscriptionsPage() {
  return (
    <ProtectedRoute>
      <SubscriptionsPageContent />
    </ProtectedRoute>
  )
}