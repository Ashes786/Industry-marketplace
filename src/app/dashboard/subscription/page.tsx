'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  ArrowLeft, 
  Crown, 
  Star, 
  Package, 
  TrendingUp,
  CreditCard,
  Plus,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Users,
  BarChart3
} from 'lucide-react'
import Link from 'next/link'

interface SubscriptionManagerProps {
  user: any
}

interface Subscription {
  id: string
  planType: 'BASIC' | 'STANDARD' | 'PREMIUM'
  startDate: string
  endDate: string
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED'
  amount: number
}

interface ExtraListing {
  id: string
  listingCount: number
  amount: number
  status: string
}

interface SubscriptionInfo {
  subscription?: Subscription
  extraListings: ExtraListing[]
  listingLimit: number
  totalExtraListings: number
  activeProductsCount: number
  canCreateMore: boolean
}

export default function SubscriptionManager({ user }: SubscriptionManagerProps) {
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)

  useEffect(() => {
    fetchSubscriptionInfo()
  }, [])

  const fetchSubscriptionInfo = async () => {
    try {
      const response = await fetch('/api/subscription')
      if (response.ok) {
        const data = await response.json()
        setSubscriptionInfo(data)
      }
    } catch (error) {
      console.error('Error fetching subscription info:', error)
    } finally {
      setLoading(false)
    }
  }

  const purchaseSubscription = async (planType: string, amount: number) => {
    setPurchasing(true)
    try {
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planType, amount }),
      })

      if (response.ok) {
        fetchSubscriptionInfo()
      }
    } catch (error) {
      console.error('Error purchasing subscription:', error)
    } finally {
      setPurchasing(false)
    }
  }

  const purchaseExtraListings = async (listingCount: number) => {
    setPurchasing(true)
    try {
      const response = await fetch('/api/subscriptions/extra-listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ listingCount }),
      })

      if (response.ok) {
        fetchSubscriptionInfo()
      }
    } catch (error) {
      console.error('Error purchasing extra listings:', error)
    } finally {
      setPurchasing(false)
    }
  }

  const getPlanDetails = (planType: string) => {
    switch (planType) {
      case 'BASIC':
        return {
          name: 'Basic',
          price: 'Free',
          listings: 2,
          features: ['2 listings', 'Basic RFQ system', 'Company profile', 'Basic support'],
          color: 'bg-gray-100 text-gray-800'
        }
      case 'STANDARD':
        return {
          name: 'Standard',
          price: 'Rs. 5,000/month',
          listings: 15,
          features: ['15 listings', 'Unlimited RFQs', 'Advanced analytics', 'Priority placement', 'Email & chat support'],
          color: 'bg-blue-100 text-blue-800'
        }
      case 'PREMIUM':
        return {
          name: 'Premium',
          price: 'Rs. 12,000/month',
          listings: -1, // Unlimited
          features: ['Unlimited listings', 'Priority RFQ processing', 'Advanced analytics', 'Featured badge', 'Dedicated support'],
          color: 'bg-purple-100 text-purple-800'
        }
      default:
        return {
          name: 'Basic',
          price: 'Free',
          listings: 2,
          features: ['2 listings', 'Basic RFQ system'],
          color: 'bg-gray-100 text-gray-800'
        }
    }
  }

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate)
    const now = new Date()
    const diffTime = end.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading subscription information...</p>
        </div>
      </div>
    )
  }

  if (!subscriptionInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Unable to load subscription information</p>
        </div>
      </div>
    )
  }

  const { subscription, extraListings, listingLimit, totalExtraListings, activeProductsCount, canCreateMore } = subscriptionInfo
  const currentPlan = subscription ? getPlanDetails(subscription.planType) : getPlanDetails('BASIC')

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
              <h1 className="text-xl font-semibold">Subscription Management</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Current Subscription Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5" />
              Current Subscription
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={currentPlan.color}>{currentPlan.name}</Badge>
                  {subscription?.status === 'ACTIVE' && (
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  )}
                </div>
                <p className="text-2xl font-bold">{currentPlan.price}</p>
                {subscription && (
                  <p className="text-sm text-gray-600">
                    {getDaysRemaining(subscription.endDate)} days remaining
                  </p>
                )}
              </div>
              
              <div>
                <h4 className="font-medium text-sm text-gray-900 mb-2">Listing Limit</h4>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-blue-600" />
                  <span className="text-lg font-semibold">
                    {listingLimit === -1 ? 'Unlimited' : listingLimit}
                  </span>
                  {totalExtraListings > 0 && (
                    <span className="text-sm text-gray-600">+ {totalExtraListings} extra</span>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-sm text-gray-900 mb-2">Usage</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Active Products</span>
                    <span>{activeProductsCount}</span>
                  </div>
                  {listingLimit !== -1 && (
                    <Progress 
                      value={(activeProductsCount / (listingLimit + totalExtraListings)) * 100} 
                      className="h-2"
                    />
                  )}
                  <p className="text-xs text-gray-600">
                    {canCreateMore ? 'Can create more listings' : 'Listing limit reached'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Available Plans */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {(['BASIC', 'STANDARD', 'PREMIUM'] as const).map((planType) => {
            const plan = getPlanDetails(planType)
            const isCurrentPlan = subscription?.planType === planType
            const isPopular = planType === 'STANDARD'

            return (
              <Card key={planType} className={`relative ${isPopular ? 'border-blue-500 shadow-lg' : ''}`}>
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white">Most Popular</Badge>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {planType === 'PREMIUM' && <Crown className="h-5 w-5 text-yellow-600" />}
                    {planType === 'STANDARD' && <Star className="h-5 w-5 text-blue-600" />}
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                  </div>
                  <CardDescription className="text-2xl font-bold">{plan.price}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-gray-600" />
                      <span className="text-sm">
                        {plan.listings === -1 ? 'Unlimited listings' : `${plan.listings} listings`}
                      </span>
                    </div>
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    className="w-full" 
                    variant={isCurrentPlan ? "outline" : "default"}
                    disabled={isCurrentPlan || purchasing}
                    onClick={() => {
                      const amount = planType === 'BASIC' ? 0 : planType === 'STANDARD' ? 5000 : 12000
                      purchaseSubscription(planType, amount)
                    }}
                  >
                    {isCurrentPlan ? 'Current Plan' : purchasing ? 'Processing...' : `Upgrade to ${plan.name}`}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Extra Listings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Purchase Extra Listings
            </CardTitle>
            <CardDescription>
              Need more listings? Purchase extra listings at Rs. 300 per listing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {[5, 10, 20].map((count) => {
                const amount = count * 300
                return (
                  <div key={count} className="border rounded-lg p-4 text-center">
                    <h4 className="font-semibold text-lg">{count} Listings</h4>
                    <p className="text-2xl font-bold text-blue-600 mb-4">Rs. {amount.toLocaleString()}</p>
                    <Button 
                      className="w-full"
                      variant="outline"
                      disabled={purchasing}
                      onClick={() => purchaseExtraListings(count)}
                    >
                      {purchasing ? 'Processing...' : 'Purchase'}
                    </Button>
                  </div>
                )
              })}
            </div>
            
            {extraListings.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium mb-3">Your Extra Listings</h4>
                <div className="space-y-2">
                  {extraListings.map((listing) => (
                    <div key={listing.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-blue-600" />
                        <span>{listing.listingCount} extra listings</span>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">Rs. {listing.amount.toLocaleString()}</p>
                        <Badge className={listing.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {listing.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Usage Analytics */}
        <div className="grid md:grid-cols-4 gap-6 mt-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Listings</p>
                  <p className="text-2xl font-bold">{listingLimit === -1 ? 'Unlimited' : listingLimit + totalExtraListings}</p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Used</p>
                  <p className="text-2xl font-bold">{activeProductsCount}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Available</p>
                  <p className="text-2xl font-bold">
                    {listingLimit === -1 ? 'Unlimited' : Math.max(0, (listingLimit + totalExtraListings) - activeProductsCount)}
                  </p>
                </div>
                <Plus className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Efficiency</p>
                  <p className="text-2xl font-bold">
                    {listingLimit === -1 ? 'N/A' : `${Math.round((activeProductsCount / (listingLimit + totalExtraListings)) * 100)}%`}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}