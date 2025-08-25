'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, FileText, Package, TrendingUp, Clock, CheckCircle } from 'lucide-react'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const userRole = session.user.role
  const isBuyer = userRole === 'BUYER' || userRole === 'BOTH'
  const isSeller = userRole === 'SELLER' || userRole === 'BOTH'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">B2B Pakistan</h1>
              <nav className="ml-10 flex space-x-8">
                <a href="#" className="text-gray-700 hover:text-gray-900">Dashboard</a>
                <a href="#" className="text-gray-700 hover:text-gray-900">Messages</a>
                <a href="/dashboard/transactions" className="text-gray-700 hover:text-gray-900">Orders</a>
                <a href="#" className="text-gray-700 hover:text-gray-900">Settings</a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline">
                {userRole === 'BUYER' ? 'Buyer' : userRole === 'SELLER' ? 'Seller' : 'Buyer & Seller'}
              </Badge>
              {(userRole === 'SELLER' || userRole === 'BOTH') && (
                <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/subscription')}>
                  Subscription
                </Button>
              )}
              {session.user.isAdmin && (
                <Button variant="outline" size="sm" onClick={() => router.push('/admin')}>
                  Admin Panel
                </Button>
              )}
              <Button variant="outline" size="sm">Profile</Button>
              <Button variant="outline" size="sm">Logout</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome back, {session.user.name || session.user.email}!
          </h2>
          <p className="text-gray-600 mt-2">
            Manage your {isBuyer && isSeller ? 'buying and selling' : isBuyer ? 'buying' : 'selling'} activities
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active RFQs</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+2 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">+1 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Rs. 245,000</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Awaiting response</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue={isBuyer ? 'rfqs' : 'products'} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-96">
            {isBuyer && (
              <TabsTrigger value="rfqs">RFQ Management</TabsTrigger>
            )}
            {isSeller && (
              <TabsTrigger value="products">Product Listings</TabsTrigger>
            )}
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          {/* RFQ Management Tab */}
          {isBuyer && (
            <TabsContent value="rfqs" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">Request for Quotations</h3>
                <Button onClick={() => router.push('/dashboard/rfqs/create')}>
                  <Plus className="w-4 h-4 mr-2" />
                  New RFQ
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Active RFQs */}
                <Card>
                  <CardHeader>
                    <CardTitle>Active RFQs</CardTitle>
                    <CardDescription>RFQs currently open for bids</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">Industrial Steel Pipes</h4>
                        <Badge variant="outline">Open</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Need 100 units of 2-inch diameter steel pipes for construction project
                      </p>
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>Quantity: 100 units</span>
                        <span>Budget: Rs. 50,000</span>
                      </div>
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-sm text-gray-500">5 responses</span>
                        <div className="space-x-2">
                          <Button size="sm" variant="outline" onClick={() => router.push('/dashboard/chat?rfqId=rfq-123')}>
                            Chat
                          </Button>
                          <Button size="sm" variant="outline">View Details</Button>
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">Copper Wire (Grade A)</h4>
                        <Badge variant="outline">Open</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        High-quality copper wire required for electrical manufacturing
                      </p>
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>Quantity: 500 kg</span>
                        <span>Budget: Rs. 200,000</span>
                      </div>
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-sm text-gray-500">3 responses</span>
                        <div className="space-x-2">
                          <Button size="sm" variant="outline" onClick={() => router.push('/dashboard/chat?rfqId=rfq-124')}>
                            Chat
                          </Button>
                          <Button size="sm" variant="outline">View Details</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your latest RFQ interactions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">RFQ #1234 - Completed</p>
                        <p className="text-xs text-gray-500">Steel order delivered successfully</p>
                        <p className="text-xs text-gray-400">2 hours ago</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Search className="w-5 h-5 text-blue-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">New quotes received</p>
                        <p className="text-xs text-gray-500">3 new quotes for Copper Wire RFQ</p>
                        <p className="text-xs text-gray-400">5 hours ago</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <FileText className="w-5 h-5 text-purple-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">RFQ created</p>
                        <p className="text-xs text-gray-500">Industrial Steel Pipes RFQ posted</p>
                        <p className="text-xs text-gray-400">1 day ago</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}

          {/* Product Listings Tab */}
          {isSeller && (
            <TabsContent value="products" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">Product Listings</h3>
                <Button onClick={() => router.push('/dashboard/products/create')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* My Products */}
                <Card>
                  <CardHeader>
                    <CardTitle>My Products</CardTitle>
                    <CardDescription>Your active product listings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">Premium Steel Rods</h4>
                        <Badge variant="outline">Active</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        High-quality steel rods for construction and manufacturing
                      </p>
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>Price: Rs. 500/unit</span>
                        <span>Stock: 1000 units</span>
                      </div>
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-sm text-gray-500">245 views</span>
                        <Button size="sm" variant="outline">Edit</Button>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">Industrial Copper Sheets</h4>
                        <Badge variant="outline">Active</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Pure copper sheets for electrical and industrial applications
                      </p>
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>Price: Rs. 2,000/sheet</span>
                        <span>Stock: 50 sheets</span>
                      </div>
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-sm text-gray-500">189 views</span>
                        <Button size="sm" variant="outline">Edit</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Listing Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Listing Statistics</CardTitle>
                    <CardDescription>Your product performance</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">15</div>
                        <div className="text-sm text-gray-600">Total Listings</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">1,234</div>
                        <div className="text-sm text-gray-600">Total Views</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">45</div>
                        <div className="text-sm text-gray-600">Inquiries</div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">12</div>
                        <div className="text-sm text-gray-600">Sales</div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Top Categories</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Steel Products</span>
                          <span className="font-medium">8 listings</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Copper Products</span>
                          <span className="font-medium">4 listings</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Industrial Tools</span>
                          <span className="font-medium">3 listings</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Orders</h3>
              <Button variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Export Orders
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Orders */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>Your latest transactions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium">Order #1234</h4>
                            <p className="text-sm text-gray-600">Premium Steel Rods</p>
                          </div>
                          <Badge variant="outline">Delivered</Badge>
                        </div>
                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <span>Quantity: 100 units</span>
                          <span className="font-medium">Rs. 50,000</span>
                        </div>
                        <div className="flex justify-between items-center mt-3">
                          <span className="text-sm text-gray-500">Dec 15, 2024</span>
                          <Button size="sm" variant="outline">View Invoice</Button>
                        </div>
                      </div>

                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium">Order #1235</h4>
                            <p className="text-sm text-gray-600">Industrial Copper Sheets</p>
                          </div>
                          <Badge variant="outline">In Transit</Badge>
                        </div>
                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <span>Quantity: 25 sheets</span>
                          <span className="font-medium">Rs. 50,000</span>
                        </div>
                        <div className="flex justify-between items-center mt-3">
                          <span className="text-sm text-gray-500">Dec 18, 2024</span>
                          <Button size="sm" variant="outline">Track Order</Button>
                        </div>
                      </div>

                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium">Order #1236</h4>
                            <p className="text-sm text-gray-600">Steel Pipes</p>
                          </div>
                          <Badge variant="outline">Processing</Badge>
                        </div>
                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <span>Quantity: 100 units</span>
                          <span className="font-medium">Rs. 50,000</span>
                        </div>
                        <div className="flex justify-between items-center mt-3">
                          <span className="text-sm text-gray-500">Dec 20, 2024</span>
                          <Button size="sm" variant="outline">View Details</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                    <CardDescription>This month's overview</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Total Orders</span>
                        <span className="font-medium">8</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Total Spent</span>
                        <span className="font-medium">Rs. 245,000</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Pending</span>
                        <span className="font-medium">3</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Delivered</span>
                        <span className="font-medium">5</span>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">Quick Actions</h4>
                      <div className="space-y-2">
                        <Button size="sm" variant="outline" className="w-full justify-start">
                          <FileText className="w-4 h-4 mr-2" />
                          Download Invoices
                        </Button>
                        <Button size="sm" variant="outline" className="w-full justify-start">
                          <Package className="w-4 h-4 mr-2" />
                          Track All Orders
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}