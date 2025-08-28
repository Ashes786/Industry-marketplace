'use client'

import { useState, useEffect } from 'react'
import { useAuth, ProtectedRoute } from '@/lib/simple-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  CreditCard, 
  Crown, 
  Star, 
  Zap, 
  Package,
  TrendingUp,
  Calendar,
  CheckCircle,
  AlertCircle,
  Plus,
  Settings,
  Download,
  HelpCircle
} from 'lucide-react'

interface SubscriptionPlan {
  id: string
  name: string
  price: number
  duration: number
  features: string[]
  popular?: boolean
  color: string
}

function SubscriptionContent() {
  const { user, subscription } = useAuth()
  const [selectedPlan, setSelectedPlan] = useState('')
  const [extraListings, setExtraListings] = useState(0)

  useEffect(() => {
    if (subscription) {
      setSelectedPlan(subscription.planType)
    }
  }, [subscription])

  const plans: SubscriptionPlan[] = [
    {
      id: 'BASIC',
      name: 'Basic',
      price: 0,
      duration: 365,
      features: [
        '10 product listings',
        'Basic analytics',
        'Email support',
        'Standard visibility'
      ],
      color: 'bg-gray-100 text-gray-800 border-gray-300'
    },
    {
      id: 'STANDARD',
      name: 'Standard',
      price: 5000,
      duration: 30,
      features: [
        '50 product listings',
        'Advanced analytics',
        'Priority support',
        'Enhanced visibility',
        'Featured products (2/month)',
        'Business verification'
      ],
      popular: true,
      color: 'bg-blue-100 text-blue-800 border-blue-300'
    },
    {
      id: 'PREMIUM',
      name: 'Premium',
      price: 12000,
      duration: 30,
      features: [
        '200 product listings',
        'Premium analytics',
        '24/7 phone support',
        'Maximum visibility',
        'Featured products (10/month)',
        'Business verification',
        'Dedicated account manager',
        'Custom branding'
      ],
      color: 'bg-purple-100 text-purple-800 border-purple-300'
    }
  ]

  const extraListingPricing = [
    { quantity: 5, price: 1000, discount: 0 },
    { quantity: 10, price: 1800, discount: 10 },
    { quantity: 25, price: 4000, discount: 20 },
    { quantity: 50, price: 7000, discount: 30 }
  ]

  const getPlanLimits = (planType: string) => {
    switch (planType) {
      case 'BASIC': return 10
      case 'STANDARD': return 50
      case 'PREMIUM': return 200
      default: return 10
    }
  }

  const currentPlan = plans.find(p => p.id === (subscription?.planType || 'BASIC'))
  const currentLimits = getPlanLimits(subscription?.planType || 'BASIC')
  const usagePercentage = 75 // Mock usage percentage

  const handleUpgrade = (planId: string) => {
    console.log('Upgrading to plan:', planId)
    // TODO: Implement upgrade logic
  }

  const handlePurchaseExtraListings = () => {
    console.log('Purchasing extra listings:', extraListings)
    // TODO: Implement purchase logic
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Subscription Management</h1>
        <p className="text-gray-600">Manage your subscription plan and extra listings</p>
      </div>

      {/* Current Subscription */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Current Subscription
          </CardTitle>
          <CardDescription>Your active subscription plan and usage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${currentPlan?.color}`}>
                {currentPlan?.name}
                {currentPlan?.popular && <Crown className="h-4 w-4" />}
              </div>
              <div className="text-sm text-gray-600 mt-1">Current Plan</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">
                {usagePercentage}/{currentLimits}
              </div>
              <div className="text-sm text-gray-600">Products Used</div>
              <div className="text-xs text-gray-500">{usagePercentage.toFixed(0)}% of limit</div>
            </div>
            <div className="text-center">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                subscription?.status === 'ACTIVE' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {subscription?.status === 'ACTIVE' ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Active
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4" />
                    Expired
                  </>
                )}
              </div>
              <div className="text-sm text-gray-600 mt-1">Status</div>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Product Listing Usage</span>
              <span>{usagePercentage.toFixed(0)}%</span>
            </div>
            <Progress value={usagePercentage} className="h-2" />
            {usagePercentage > 80 && (
              <div className="mt-2 text-sm text-yellow-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                Approaching product limit. Consider upgrading your plan.
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {subscription?.endDate && (
                <span>Renews on: {new Date(subscription.endDate).toLocaleDateString()}</span>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-3 w-3 mr-1" />
                Download Invoice
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-3 w-3 mr-1" />
                Cancel Subscription
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Available Plans</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card key={plan.id} className={`relative ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${plan.color}`}>
                  {plan.name}
                  {plan.popular && <Crown className="h-4 w-4" />}
                </div>
                <div className="mt-2">
                  <span className="text-3xl font-bold">Rs. {plan.price.toLocaleString()}</span>
                  <span className="text-gray-600">/{plan.duration} days</span>
                </div>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                  variant={plan.id === selectedPlan ? 'outline' : 'default'}
                  disabled={plan.id === selectedPlan}
                  onClick={() => handleUpgrade(plan.id)}
                >
                  {plan.id === selectedPlan ? 'Current Plan' : `Upgrade to ${plan.name}`}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Extra Listings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Buy Extra Listings
          </CardTitle>
          <CardDescription>Purchase additional product listings for your current plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {extraListingPricing.map((option) => (
              <Card key={option.quantity} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{option.quantity}</div>
                  <div className="text-sm text-gray-600 mb-2">Extra Listings</div>
                  <div className="text-lg font-semibold">Rs. {option.price.toLocaleString()}</div>
                  {option.discount > 0 && (
                    <div className="text-sm text-green-600">Save {option.discount}%</div>
                  )}
                  <div className="text-xs text-gray-500">
                    Rs. {Math.round(option.price / option.quantity)} per listing
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium mb-3">Custom Quantity</h3>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of extra listings
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={extraListings}
                  onChange={(e) => setExtraListings(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Total Price</div>
                <div className="text-xl font-bold text-green-600">
                  Rs. {(extraListings * 200).toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">Rs. 200 per listing</div>
              </div>
            </div>
            <Button 
              className="mt-4" 
              disabled={extraListings <= 0}
              onClick={handlePurchaseExtraListings}
            >
              <Plus className="h-4 w-4 mr-2" />
              Purchase Extra Listings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Billing Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Billing Information
          </CardTitle>
          <CardDescription>Manage your payment methods and billing history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">•••• •••• •••• 4242</div>
                  <div className="text-sm text-gray-600">Expires 12/25</div>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">Default</Badge>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Payment Method
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Billing History
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function SubscriptionPage() {
  return (
    <ProtectedRoute>
      <SubscriptionContent />
    </ProtectedRoute>
  )
}