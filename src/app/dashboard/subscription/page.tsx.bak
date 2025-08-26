'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, Crown, Star, CheckCircle, Clock, AlertTriangle } from 'lucide-react'

interface Subscription {
  id: string
  planType: string
  startDate: string
  endDate: string
  status: string
  amount: number
}

interface ProductCount {
  count: number
}

export default function SubscriptionPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [productCount, setProductCount] = useState<ProductCount | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (session) {
      fetchSubscriptionData()
    }
  }, [session, status, router])

  const fetchSubscriptionData = async () => {
    try {
      setLoading(true)
      const [subResponse, productResponse] = await Promise.all([
        fetch('/api/subscription'),
        fetch('/api/products/count')
      ])

      if (subResponse.ok) {
        const subData = await subResponse.json()
        setSubscription(subData)
      }

      if (productResponse.ok) {
        const productData = await productResponse.json()
        setProductCount(productData)
      }
    } catch (error) {
      setError('Failed to fetch subscription data')
    } finally {
      setLoading(false)
    }
  }

  const planDetails = {
    BASIC: {
      name: 'Basic',
      price: 'Free',
      color: 'bg-gray-100 text-gray-800',
      icon: Clock,
      features: ['1-2 product listings', 'Limited RFQ responses', 'Basic search visibility', 'Standard support'],
      limit: 2
    },
    STANDARD: {
      name: 'Standard',
      price: 'Rs. 5,000/month',
      color: 'bg-blue-100 text-blue-800',
      icon: Star,
      features: ['20 product listings', 'Unlimited RFQ responses', 'Enhanced search visibility', 'Basic analytics', 'Company profile features'],
      limit: 20
    },
    PREMIUM: {
      name: 'Premium',
      price: 'Rs. 12,000/month',
      color: 'bg-purple-100 text-purple-800',
      icon: Crown,
      features: ['Unlimited product listings', 'Priority RFQ access', 'Advanced analytics', 'Featured seller badge', 'Dedicated account manager'],
      limit: Infinity
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case 'EXPIRED':
        return <Badge variant="destructive">Expired</Badge>
      case 'INACTIVE':
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>
    }
  }

  const handleUpgrade = async (planType: string) => {
    try {
      const response = await fetch('/api/subscription/upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ planType })
      })

      if (response.ok) {
        // Redirect to payment or success page
        router.push('/dashboard/subscription/success')
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to upgrade subscription')
      }
    } catch (error) {
      setError('An error occurred during upgrade')
    }
  }

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
            <h1 className="text-2xl font-bold text-gray-900">Subscription Management</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Current Subscription */}
        {subscription && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>Current Subscription</span>
                {getStatusBadge(subscription.status)}
              </CardTitle>
              <CardDescription>
                Your current subscription plan and usage details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h4 className="font-medium">Plan</h4>
                  <p className="text-2xl font-bold text-blue-600">{subscription.planType}</p>
                  <p className="text-sm text-gray-500">
                    {planDetails[subscription.planType].price}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Usage</h4>
                  <p className="text-2xl font-bold">
                    {productCount?.count || 0} / {planDetails[subscription.planType].limit === Infinity ? '∞' : planDetails[subscription.planType].limit}
                  </p>
                  <p className="text-sm text-gray-500">Product listings</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Validity</h4>
                  <p className="text-lg font-medium">
                    {new Date(subscription.endDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">Expires on</p>
                </div>
              </div>

              {subscription.status === 'ACTIVE' && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-800">Your subscription is active</span>
                  </div>
                </div>
              )}

              {subscription.status === 'EXPIRED' && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <span className="font-medium text-red-800">Your subscription has expired</span>
                  </div>
                  <p className="text-sm text-red-700 mt-2">
                    Please renew your subscription to continue using premium features
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Available Plans */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Available Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(planDetails).map(([planType, details]) => {
              const Icon = details.icon
              const isCurrentPlan = subscription?.planType === planType
              const isUpgrade = subscription && 
                ['BASIC', 'STANDARD'].includes(subscription.planType) && 
                ['STANDARD', 'PREMIUM'].includes(planType) &&
                planType !== subscription.planType

              return (
                <Card key={planType} className={`relative ${isCurrentPlan ? 'ring-2 ring-blue-500' : ''}`}>
                  {isCurrentPlan && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
                      Current Plan
                    </Badge>
                  )}
                  <CardHeader className="text-center">
                    <div className={`w-16 h-16 ${details.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <CardTitle>{details.name}</CardTitle>
                    <div className="text-3xl font-bold">{details.price}</div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {details.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    {isCurrentPlan ? (
                      <Button className="w-full" variant="outline" disabled>
                        Current Plan
                      </Button>
                    ) : isUpgrade ? (
                      <Button 
                        className="w-full" 
                        onClick={() => handleUpgrade(planType)}
                      >
                        Upgrade to {details.name}
                      </Button>
                    ) : (
                      <Button className="w-full" variant="outline">
                        {subscription ? 'Downgrade' : 'Get Started'}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Extra Listings */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Need More Listings?</CardTitle>
            <CardDescription>
              Purchase additional product listings beyond your plan limit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4 text-center">
                <h4 className="font-medium">5 Extra Listings</h4>
                <p className="text-2xl font-bold text-blue-600 mb-2">Rs. 2,500</p>
                <Button variant="outline" className="w-full">Purchase</Button>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <h4 className="font-medium">10 Extra Listings</h4>
                <p className="text-2xl font-bold text-blue-600 mb-2">Rs. 4,500</p>
                <Button variant="outline" className="w-full">Purchase</Button>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <h4 className="font-medium">25 Extra Listings</h4>
                <p className="text-2xl font-bold text-blue-600 mb-2">Rs. 10,000</p>
                <Button variant="outline" className="w-full">Purchase</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}