'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Crown, 
  Star, 
  CheckCircle, 
  ArrowRight, 
  Plus,
  TrendingUp,
  Users,
  MessageSquare,
  Headphones,
  Zap,
  Shield
} from 'lucide-react'

interface SubscriptionManagerProps {
  userId: string
  currentPlan?: string
  onPlanChange?: (plan: string) => void
}

interface SubscriptionData {
  subscription?: {
    id: string
    planType: string
    startDate: string
    endDate: string
    status: string
    amount: number
  }
  extraListings: Array<{
    id: string
    listingCount: number
    amount: number
    status: string
    createdAt: string
  }>
  usageStats: {
    currentPlan: string
    listingsUsed: number
    listingsLimit: number | string
    extraListingsAvailable: number
    totalListingsAvailable: number | string
    rfqLimit: number | string
    subscriptionEnds: string | null
    features: string[]
  }
}

const subscriptionPlans = {
  BASIC: {
    name: 'Basic',
    price: 'Free',
    duration: '1 year',
    color: 'bg-gray-100 text-gray-800',
    popular: false,
    icon: <Star className="h-6 w-6" />,
    description: 'Perfect for getting started'
  },
  STANDARD: {
    name: 'Standard',
    price: 'Rs. 5,000/month',
    duration: '1 month',
    color: 'bg-blue-100 text-blue-800',
    popular: true,
    icon: <TrendingUp className="h-6 w-6" />,
    description: 'Great for growing businesses'
  },
  PREMIUM: {
    name: 'Premium',
    price: 'Rs. 12,000/month',
    duration: '1 month',
    color: 'bg-purple-100 text-purple-800',
    popular: false,
    icon: <Crown className="h-6 w-6" />,
    description: 'Maximum features and support'
  }
}

const planFeatures = {
  BASIC: {
    listings: 2,
    rfqs: 5,
    features: [
      { icon: <Package className="h-4 w-4" />, text: '1-2 product listings' },
      { icon: <MessageSquare className="h-4 w-4" />, text: 'Limited RFQ responses' },
      { icon: <Search className="h-4 w-4" />, text: 'Basic search visibility' },
      { icon: <Mail className="h-4 w-4" />, text: 'Email support' }
    ]
  },
  STANDARD: {
    listings: 20,
    rfqs: 'unlimited',
    features: [
      { icon: <Package className="h-4 w-4" />, text: '20 product listings' },
      { icon: <MessageSquare className="h-4 w-4" />, text: 'Unlimited RFQ responses' },
      { icon: <Search className="h-4 w-4" />, text: 'Enhanced search visibility' },
      { icon: <BarChart3 className="h-4 w-4" />, text: 'Analytics dashboard' },
      { icon: <Users className="h-4 w-4" />, text: 'Company profile' },
      { icon: <Mail className="h-4 w-4" />, text: 'Priority email support' }
    ]
  },
  PREMIUM: {
    listings: 'unlimited',
    rfqs: 'unlimited',
    features: [
      { icon: <Package className="h-4 w-4" />, text: 'Unlimited product listings' },
      { icon: <MessageSquare className="h-4 w-4" />, text: 'Unlimited RFQ responses' },
      { icon: <Search className="h-4 w-4" />, text: 'Maximum search visibility' },
      { icon: <BarChart3 className="h-4 w-4" />, text: 'Advanced analytics' },
      { icon: <Star className="h-4 w-4" />, text: 'Featured badge' },
      { icon: <Zap className="h-4 w-4" />, text: 'Priority RFQ placement' },
      { icon: <Users className="h-4 w-4" />, text: 'Dedicated account manager' },
      { icon: <Headphones className="h-4 w-4" />, text: '24/7 phone support' }
    ]
  }
}

export default function SubscriptionManager({ userId, currentPlan, onPlanChange }: SubscriptionManagerProps) {
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null)
  const [loading, setLoading] = useState(false)
  const [showExtraListings, setShowExtraListings] = useState(false)
  const [extraListingsCount, setExtraListingsCount] = useState(5)

  useEffect(() => {
    if (userId) {
      fetchSubscriptionData()
    }
  }, [userId])

  const fetchSubscriptionData = async () => {
    try {
      const response = await fetch(`/api/subscriptions?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setSubscriptionData(data)
      }
    } catch (error) {
      console.error('Error fetching subscription data:', error)
    }
  }

  const handlePlanUpgrade = async (planType: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          planType,
          amount: planType === 'BASIC' ? 0 : planType === 'STANDARD' ? 5000 : 12000
        })
      })

      if (response.ok) {
        await fetchSubscriptionData()
        onPlanChange?.(planType)
      }
    } catch (error) {
      console.error('Error upgrading plan:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePurchaseExtraListings = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/subscriptions/extra-listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sellerId: userId,
          listingCount: extraListingsCount,
          amount: extraListingsCount * 500 // Rs. 500 per extra listing
        })
      })

      if (response.ok) {
        await fetchSubscriptionData()
        setShowExtraListings(false)
      }
    } catch (error) {
      console.error('Error purchasing extra listings:', error)
    } finally {
      setLoading(false)
    }
  }

  const getUsagePercentage = () => {
    if (!subscriptionData) return 0
    
    const { listingsUsed, listingsLimit, extraListingsAvailable } = subscriptionData.usageStats
    if (listingsLimit === 'unlimited') return 0
    
    const totalAvailable = listingsLimit + extraListingsAvailable
    return (listingsUsed / totalAvailable) * 100
  }

  if (!subscriptionData) {
    return <div>Loading subscription data...</div>
  }

  const { usageStats, subscription } = subscriptionData
  const currentPlanData = subscriptionPlans[usageStats.currentPlan as keyof typeof subscriptionPlans]

  return (
    <div className="space-y-6">
      {/* Current Subscription Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Current Subscription
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{usageStats.currentPlan} Plan</h3>
                  <p className="text-sm text-gray-500">
                    {subscription ? `Renews on ${new Date(subscription.endDate).toLocaleDateString()}` : 'No active subscription'}
                  </p>
                </div>
                <Badge className={currentPlanData.color}>
                  {usageStats.currentPlan}
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Listings Used</span>
                  <span className="font-medium">
                    {usageStats.listingsUsed} of {usageStats.totalListingsAvailable}
                  </span>
                </div>
                <Progress value={getUsagePercentage()} className="h-2" />
                <p className="text-xs text-gray-500">
                  {usageStats.listingsLimit === 'unlimited' ? 'Unlimited listings available' : 
                   `${usageStats.listingsLimit + usageStats.extraListingsAvailable - usageStats.listingsUsed} listings remaining`}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">RFQ Limit</span>
                  <span className="font-medium">
                    {usageStats.rfqLimit === 'unlimited' ? 'Unlimited' : usageStats.rfqLimit}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Extra Listings</span>
                  <span className="font-medium">{usageStats.extraListingsAvailable} available</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Current Plan Features:</h4>
              <div className="space-y-2">
                {usageStats.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    {feature}
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={() => setShowExtraListings(true)}
                  variant="outline"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Buy Extra Listings
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Available Plans</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {Object.entries(subscriptionPlans).map(([planKey, plan]) => (
            <Card 
              key={planKey} 
              className={`relative ${plan.popular ? 'border-blue-500 shadow-xl' : ''} ${
                usageStats.currentPlan === planKey ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white px-3 py-1">Most Popular</Badge>
                </div>
              )}
              
              {usageStats.currentPlan === planKey && (
                <div className="absolute -top-3 right-4">
                  <Badge className="bg-green-600 text-white px-3 py-1">Current Plan</Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-2">{plan.icon}</div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="text-2xl font-bold">{plan.price}</div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="text-sm text-gray-600 text-center">
                  <div className="font-medium">What's included:</div>
                  <div className="space-y-2 mt-2">
                    {planFeatures[planKey as keyof typeof planFeatures].features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        {feature.icon}
                        <span className="text-sm">{feature.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  className={`w-full ${usageStats.currentPlan === planKey ? 'bg-gray-500' : ''}`}
                  disabled={usageStats.currentPlan === planKey || loading}
                  onClick={() => handlePlanUpgrade(planKey)}
                >
                  {usageStats.currentPlan === planKey ? 'Current Plan' : 
                   planKey === 'BASIC' ? 'Downgrade to Basic' : 
                   `Upgrade to ${plan.name}`}
                  {usageStats.currentPlan !== planKey && <ArrowRight className="h-4 w-4 ml-2" />}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Extra Listings Modal */}
      {showExtraListings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Purchase Extra Listings</CardTitle>
              <CardDescription>
                Buy additional product listings for your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="listingsCount">Number of Extra Listings</Label>
                <Input
                  id="listingsCount"
                  type="number"
                  min="1"
                  max="100"
                  value={extraListingsCount}
                  onChange={(e) => setExtraListingsCount(parseInt(e.target.value) || 1)}
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Price per listing:</span>
                  <span className="font-medium">Rs. 500</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-600">Total cost:</span>
                  <span className="font-bold text-lg">Rs. {(extraListingsCount * 500).toLocaleString()}</span>
                </div>
              </div>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Extra listings are permanent and don't expire. They will be added to your current plan limits.
                </AlertDescription>
              </Alert>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowExtraListings(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handlePurchaseExtraListings}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? 'Processing...' : `Pay Rs. ${(extraListingsCount * 500).toLocaleString()}`}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

// Placeholder icons for features
const Package = ({ className }: { className?: string }) => (
  <div className={`inline-block ${className}`}>📦</div>
)
const Search = ({ className }: { className?: string }) => (
  <div className={`inline-block ${className}`}>🔍</div>
)
const Mail = ({ className }: { className?: string }) => (
  <div className={`inline-block ${className}`}>✉️</div>
)
const BarChart3 = ({ className }: { className?: string }) => (
  <div className={`inline-block ${className}`}>📊</div>
)
const Users = ({ className }: { className?: string }) => (
  <div className={`inline-block ${className}`}>👥</div>
)
const Zap = ({ className }: { className?: string }) => (
  <div className={`inline-block ${className}`}>⚡</div>
)
const Headphones = ({ className }: { className?: string }) => (
  <div className={`inline-block ${className}`}>🎧</div>
)