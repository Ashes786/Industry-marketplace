'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  ArrowLeft, 
  Search, 
  Plus, 
  Edit, 
  Eye,
  ToggleLeft,
  ToggleRight,
  Package,
  TrendingUp,
  Users,
  Star,
  MapPin,
  Calendar,
  DollarSign
} from 'lucide-react'
import Link from 'next/link'

interface MyProductsProps {
  user: any
}

interface Product {
  id: string
  title: string
  description: string
  price: number
  quantity: number
  unit: string
  category: string
  subCategory?: string
  images?: string
  isActive: boolean
  isFeatured: boolean
  views: number
  createdAt: string
  seller: {
    id: string
    name: string
    email: string
    companyName: string
    isApproved: boolean
  }
  _count?: {
    transactions: number
  }
}

interface SubscriptionInfo {
  listingLimit: number
  totalExtraListings: number
  activeProductsCount: number
  canCreateMore: boolean
}

export default function MyProductsPage({ user }: MyProductsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchProducts()
    fetchSubscriptionInfo()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products/my')
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSubscriptionInfo = async () => {
    try {
      const response = await fetch('/api/subscription')
      if (response.ok) {
        const data = await response.json()
        setSubscriptionInfo({
          listingLimit: data.listingLimit,
          totalExtraListings: data.totalExtraListings,
          activeProductsCount: data.activeProductsCount,
          canCreateMore: data.canCreateMore
        })
      }
    } catch (error) {
      console.error('Error fetching subscription info:', error)
    }
  }

  const toggleProductStatus = async (productId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/products/${productId}/toggle`, {
        method: 'PATCH'
      })

      if (response.ok) {
        fetchProducts()
        fetchSubscriptionInfo()
      }
    } catch (error) {
      console.error('Error toggling product status:', error)
    }
  }

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your products...</p>
        </div>
      </div>
    )
  }

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
              <h1 className="text-xl font-semibold">My Products</h1>
            </div>
            <Link href="/dashboard/products/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Subscription Info */}
        {subscriptionInfo && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {subscriptionInfo.listingLimit === -1 ? 'Unlimited' : subscriptionInfo.listingLimit}
                  </div>
                  <div className="text-sm text-gray-600">Listing Limit</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{subscriptionInfo.activeProductsCount}</div>
                  <div className="text-sm text-gray-600">Active Products</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{subscriptionInfo.totalExtraListings}</div>
                  <div className="text-sm text-gray-600">Extra Listings</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${subscriptionInfo.canCreateMore ? 'text-green-600' : 'text-red-600'}`}>
                    {subscriptionInfo.listingLimit === -1 ? 'Unlimited' : Math.max(0, (subscriptionInfo.listingLimit + subscriptionInfo.totalExtraListings) - subscriptionInfo.activeProductsCount)}
                  </div>
                  <div className="text-sm text-gray-600">Available Slots</div>
                </div>
              </div>
              {!subscriptionInfo.canCreateMore && (
                <div className="mt-4 text-center">
                  <Link href="/dashboard/subscription">
                    <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                      Upgrade Plan or Buy Extra Listings
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search your products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-1">{product.title}</CardTitle>
                    <CardDescription className="text-sm">{product.category}</CardDescription>
                  </div>
                  <div className="flex gap-1">
                    {product.isFeatured && (
                      <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>
                    )}
                    <Badge className={product.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Product Details */}
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-blue-600">Rs. {product.price.toLocaleString()}</span>
                      <span className="text-sm text-gray-500"> / {product.unit}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Available</p>
                      <p className="font-medium">{product.quantity} {product.unit}</p>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-gray-400" />
                    <span>{product.views} views</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <span>{product._count?.transactions || 0} sales</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleProductStatus(product.id, product.isActive)}
                  >
                    {product.isActive ? (
                      <>
                        <ToggleLeft className="h-4 w-4" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <ToggleRight className="h-4 w-4" />
                        Activate
                      </>
                    )}
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>

                {/* Created Date */}
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  <span>Created {new Date(product.createdAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm ? 'Try adjusting your search terms.' : 'Start by creating your first product listing.'}
            </p>
            <div className="flex gap-4 justify-center">
              {searchTerm && (
                <Button onClick={() => setSearchTerm('')}>
                  Clear Search
                </Button>
              )}
              <Link href="/dashboard/products/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Product
                </Button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}