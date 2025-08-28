'use client'

import { useState, useEffect } from 'react'
import { useAuth, ProtectedRoute } from '@/lib/simple-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit,
  Trash2,
  Star,
  TrendingUp,
  DollarSign,
  Calendar,
  Settings,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'

function ProductsContent() {
  const { user, subscription } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [products, setProducts] = useState([])

  useEffect(() => {
    // Mock data - in real app, fetch from API
    setProducts([
      {
        id: '1',
        title: 'Industrial Steel Pipes',
        description: 'High-quality steel pipes for construction and industrial use',
        price: 45000,
        category: 'Construction Materials',
        views: 245,
        isActive: true,
        isFeatured: false,
        createdAt: '2024-01-20',
        inquiries: 12
      },
      {
        id: '2',
        title: 'Electrical Motors',
        description: 'Industrial grade electrical motors for various applications',
        price: 25000,
        category: 'Electrical',
        views: 189,
        isActive: true,
        isFeatured: true,
        createdAt: '2024-01-18',
        inquiries: 8
      },
      {
        id: '3',
        title: 'Cement Bags (50kg)',
        description: 'High-quality cement for construction projects',
        price: 650,
        category: 'Construction Materials',
        views: 567,
        isActive: true,
        isFeatured: false,
        createdAt: '2024-01-15',
        inquiries: 25
      },
      {
        id: '4',
        title: 'Industrial Pumps',
        description: 'Heavy-duty pumps for industrial applications',
        price: 85000,
        category: 'Machinery',
        views: 134,
        isActive: false,
        isFeatured: false,
        createdAt: '2024-01-10',
        inquiries: 3
      }
    ])
  }, [])

  const getPlanLimits = (planType: string) => {
    switch (planType) {
      case 'BASIC': return 10
      case 'STANDARD': return 50
      case 'PREMIUM': return 200
      default: return 10
    }
  }

  const planLimits = getPlanLimits(subscription?.planType || 'BASIC')
  const activeProducts = products.filter((p: any) => p.isActive).length
  const usagePercentage = (activeProducts / planLimits) * 100

  const categories = ['all', 'Construction Materials', 'Electrical', 'Machinery', 'Textile', 'Chemicals']

  const filteredProducts = products.filter((product: any) => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && product.isActive) ||
                         (statusFilter === 'inactive' && !product.isActive)
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Products</h1>
          <p className="text-gray-600">Manage your product listings</p>
        </div>
        <Link href="/dashboard/products/create">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Usage Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Subscription Usage
          </CardTitle>
          <CardDescription>Your current plan and product listing usage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{subscription?.planType || 'BASIC'}</div>
              <div className="text-sm text-gray-600">Current Plan</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">{activeProducts}/{planLimits}</div>
              <div className="text-sm text-gray-600">Products Used</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {subscription?.status === 'ACTIVE' ? 'Active' : 'Expired'}
              </div>
              <div className="text-sm text-gray-600">Status</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Product Listing Usage</span>
              <span>{usagePercentage.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  usagePercentage > 80 ? 'bg-red-500' : usagePercentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${usagePercentage}%` }}
              ></div>
            </div>
            {usagePercentage > 80 && (
              <div className="mt-2 text-sm text-yellow-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                Approaching product limit. Consider upgrading your plan.
              </div>
            )}
          </div>
          <div className="mt-4 flex gap-2">
            <Link href="/dashboard/subscription">
              <Button variant="outline" size="sm">
                <Settings className="h-3 w-3 mr-1" />
                Manage Subscription
              </Button>
            </Link>
            <Link href="/dashboard/subscription">
              <Button size="sm">
                <Plus className="h-3 w-3 mr-1" />
                Buy Extra Listings
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product: any) => (
          <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <Package className="h-16 w-16 text-gray-400" />
            </div>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg">{product.title}</CardTitle>
                    {product.isFeatured && (
                      <Badge className="bg-yellow-100 text-yellow-800">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="mt-1">{product.description}</CardDescription>
                </div>
                <Badge className={product.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                  {product.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-600">Rs. {product.price.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {product.views} views
                  </span>
                  <span className="flex items-center gap-1">
                    <Package className="h-3 w-3" />
                    {product.inquiries} inquiries
                  </span>
                </div>
                
                <div className="text-sm text-gray-600">
                  Category: {product.category}
                </div>
                
                <div className="text-sm text-gray-500">
                  Added: {product.createdAt}
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline">
                    <Trash2 className="h-3 w-3 mr-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">Create your first product listing</p>
            <Link href="/dashboard/products/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function ProductsPage() {
  return (
    <ProtectedRoute>
      <ProductsContent />
    </ProtectedRoute>
  )
}