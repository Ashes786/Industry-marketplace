'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  ArrowLeft, 
  Plus, 
  Save, 
  X,
  Package,
  DollarSign,
  Image,
  AlertTriangle,
  Upload,
  Star,
  Crown
} from 'lucide-react'
import Link from 'next/link'

interface CreateProductProps {
  user: any
}

interface SubscriptionInfo {
  subscription?: {
    planType: 'BASIC' | 'STANDARD' | 'PREMIUM'
    status: string
  }
  listingLimit: number
  totalExtraListings: number
  activeProductsCount: number
  canCreateMore: boolean
}

export default function CreateProductPage({ user }: CreateProductProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    quantity: '',
    unit: 'piece',
    category: '',
    subCategory: '',
    images: ''
  })

  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const categories = [
    'Construction Materials',
    'Industrial Machinery',
    'Electrical Equipment',
    'Chemicals',
    'Textiles',
    'Steel & Metal',
    'Plastics',
    'Packaging',
    'Automotive Parts',
    'Other'
  ]

  const units = [
    'piece', 'kg', 'ton', 'meter', 'liter', 'box', 'bag', 'set'
  ]

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
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSuccess(true)
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to create product')
      }
    } catch (error) {
      console.error('Error creating product:', error)
      setError('Failed to create product')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const getPlanDetails = (planType: string) => {
    switch (planType) {
      case 'BASIC':
        return { name: 'Basic', listings: 2, color: 'bg-gray-100 text-gray-800' }
      case 'STANDARD':
        return { name: 'Standard', listings: 15, color: 'bg-blue-100 text-blue-800' }
      case 'PREMIUM':
        return { name: 'Premium', listings: -1, color: 'bg-purple-100 text-purple-800' }
      default:
        return { name: 'Basic', listings: 2, color: 'bg-gray-100 text-gray-800' }
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Product Created Successfully!</CardTitle>
            <CardDescription>
              Your product has been listed and is now visible to potential buyers.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Link href="/dashboard/products" className="flex-1">
                <Button className="w-full">View My Products</Button>
              </Link>
              <Link href="/dashboard" className="flex-1">
                <Button variant="outline" className="w-full">Back to Dashboard</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!subscriptionInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading subscription information...</p>
        </div>
      </div>
    )
  }

  const { subscription, listingLimit, totalExtraListings, activeProductsCount, canCreateMore } = subscriptionInfo
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
              <h1 className="text-xl font-semibold">Create New Product</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Subscription Info */}
        {!canCreateMore && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              You've reached your listing limit. Your current plan allows {listingLimit} listings 
              {totalExtraListings > 0 && ` + ${totalExtraListings} extra listings`}. 
              <Link href="/dashboard/subscription" className="underline ml-1">
                Upgrade your subscription or purchase extra listings.
              </Link>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Product Details
                </CardTitle>
                <CardDescription>
                  Provide detailed information about your product to attract potential buyers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Product Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Industrial Steel Pipes - Grade A"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your product in detail including specifications, quality, applications, etc."
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={4}
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subCategory">Sub Category (Optional)</Label>
                      <Input
                        id="subCategory"
                        placeholder="e.g., Steel Pipes"
                        value={formData.subCategory}
                        onChange={(e) => handleInputChange('subCategory', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price per Unit (Rs.) *</Label>
                      <Input
                        id="price"
                        type="number"
                        placeholder="1000"
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="quantity">Available Quantity *</Label>
                      <div className="flex gap-2">
                        <Input
                          id="quantity"
                          type="number"
                          placeholder="100"
                          value={formData.quantity}
                          onChange={(e) => handleInputChange('quantity', e.target.value)}
                          required
                        />
                        <Select value={formData.unit} onValueChange={(value) => handleInputChange('unit', value)}>
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {units.map((unit) => (
                              <SelectItem key={unit} value={unit}>
                                {unit}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="images">Product Images (Optional)</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Click to upload images or drag and drop</p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>

                  {error && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex gap-4 pt-6">
                    <Button type="submit" className="flex-1" disabled={loading || !canCreateMore}>
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Creating...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Create Product
                        </>
                      )}
                    </Button>
                    <Link href="/dashboard">
                      <Button type="button" variant="outline">
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Subscription Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5" />
                  Subscription Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge className={currentPlan.color}>{currentPlan.name}</Badge>
                  {subscription?.status === 'ACTIVE' && (
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Listing Limit</span>
                    <span className="font-medium">
                      {listingLimit === -1 ? 'Unlimited' : listingLimit}
                    </span>
                  </div>
                  {totalExtraListings > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Extra Listings</span>
                      <span className="font-medium">+ {totalExtraListings}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span>Used</span>
                    <span className="font-medium">{activeProductsCount}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium">
                    <span>Available</span>
                    <span className={canCreateMore ? 'text-green-600' : 'text-red-600'}>
                      {listingLimit === -1 ? 'Unlimited' : Math.max(0, (listingLimit + totalExtraListings) - activeProductsCount)}
                    </span>
                  </div>
                </div>

                {!canCreateMore && (
                  <Link href="/dashboard/subscription">
                    <Button className="w-full" size="sm">
                      <Star className="h-4 w-4 mr-2" />
                      Upgrade Plan
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tips for Better Listings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-sm">Clear Title</p>
                    <p className="text-xs text-gray-600">Include key details like size, grade, or type.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-sm">Detailed Description</p>
                    <p className="text-xs text-gray-600">Mention specifications, quality, and uses.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-sm">Competitive Pricing</p>
                    <p className="text-xs text-gray-600">Research market rates for similar products.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-sm">Quality Images</p>
                    <p className="text-xs text-gray-600">Show actual product photos, not stock images.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}