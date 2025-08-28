'use client'

import { useState, useEffect } from 'react'
import { useAuth, ProtectedRoute } from '@/lib/simple-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Search, 
  Filter, 
  Package, 
  Star, 
  Eye, 
  MessageSquare,
  Building2,
  DollarSign,
  Users,
  TrendingUp
} from 'lucide-react'

function BrowseProductsContent() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
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
        seller: 'Steel Industries Ltd',
        sellerRating: 4.5,
        views: 245,
        isActive: true,
        images: ['/placeholder-product.jpg']
      },
      {
        id: '2',
        title: 'Electrical Motors',
        description: 'Industrial grade electrical motors for various applications',
        price: 25000,
        category: 'Electrical',
        seller: 'Tech Suppliers',
        sellerRating: 4.2,
        views: 189,
        isActive: true,
        images: ['/placeholder-product.jpg']
      },
      {
        id: '3',
        title: 'Cement Bags (50kg)',
        description: 'High-quality cement for construction projects',
        price: 650,
        category: 'Construction Materials',
        seller: 'Building Materials Co',
        sellerRating: 4.7,
        views: 567,
        isActive: true,
        images: ['/placeholder-product.jpg']
      },
      {
        id: '4',
        title: 'Industrial Pumps',
        description: 'Heavy-duty pumps for industrial applications',
        price: 85000,
        category: 'Machinery',
        seller: 'Industrial Solutions',
        sellerRating: 4.3,
        views: 134,
        isActive: true,
        images: ['/placeholder-product.jpg']
      }
    ])
  }, [])

  const categories = ['all', 'Construction Materials', 'Electrical', 'Machinery', 'Textile', 'Chemicals']

  const filteredProducts = products.filter((product: any) => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Browse Products</h1>
          <p className="text-gray-600">Explore products from verified sellers</p>
        </div>
      </div>

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
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
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
                  <CardTitle className="text-lg">{product.title}</CardTitle>
                  <CardDescription className="mt-1">{product.description}</CardDescription>
                </div>
                <Badge className="bg-green-100 text-green-800">
                  Active
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-600">Rs. {product.price.toLocaleString()}</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{product.sellerRating}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Building2 className="h-4 w-4" />
                  <span>{product.seller}</span>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {product.views} views
                  </span>
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {product.category}
                  </span>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button className="flex-1" size="sm">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Contact Seller
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="h-3 w-3 mr-1" />
                    View Details
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
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function BrowseProductsPage() {
  return (
    <ProtectedRoute>
      <BrowseProductsContent />
    </ProtectedRoute>
  )
}