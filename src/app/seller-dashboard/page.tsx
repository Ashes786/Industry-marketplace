'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarProvider, 
  SidebarTrigger 
} from '@/components/ui/sidebar'
import { 
  Plus, 
  Search, 
  MessageSquare, 
  Package, 
  TrendingUp, 
  Users, 
  Settings, 
  LogOut,
  Bell,
  Eye,
  Calendar,
  DollarSign,
  Star,
  BarChart3,
  FileText,
  Crown,
  ShoppingCart,
  Edit,
  Trash2
} from 'lucide-react'

// Mock data for demonstration
const mockProducts = [
  {
    id: '1',
    title: 'Stainless Steel Plates',
    description: 'High-quality stainless steel plates for industrial use',
    price: 450,
    quantity: 2000,
    unit: 'kg',
    category: 'Raw Materials',
    views: 245,
    isActive: true,
    isFeatured: true,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    title: 'Copper Wire',
    description: 'Premium copper wire for electrical applications',
    price: 380,
    quantity: 1000,
    unit: 'meters',
    category: 'Electrical',
    views: 189,
    isActive: true,
    isFeatured: false,
    createdAt: '2024-01-10'
  },
  {
    id: '3',
    title: 'Industrial Bearings',
    description: 'Heavy-duty bearings for machinery',
    price: 1200,
    quantity: 100,
    unit: 'pieces',
    category: 'Machinery',
    views: 156,
    isActive: true,
    isFeatured: true,
    createdAt: '2024-01-05'
  }
]

const mockRFQs = [
  {
    id: '1',
    title: 'Industrial Steel Plates Required',
    description: 'Need 1000kg of stainless steel plates for construction project',
    category: 'Raw Materials',
    budget: 500000,
    quantity: 1000,
    unit: 'kg',
    status: 'OPEN',
    deadline: '2024-02-15',
    buyer: 'Construction Company Ltd',
    createdAt: '2024-01-20'
  },
  {
    id: '2',
    title: 'Copper Wire Purchase',
    description: 'High-quality copper wire for electrical wiring',
    category: 'Electrical',
    budget: 200000,
    quantity: 500,
    unit: 'meters',
    status: 'NEGOTIATION',
    deadline: '2024-02-10',
    buyer: 'Electrical Works Inc.',
    createdAt: '2024-01-18'
  }
]

const mockChats = [
  {
    id: '1',
    rfqId: '1',
    rfqTitle: 'Industrial Steel Plates Required',
    buyer: 'Construction Company Ltd',
    lastMessage: 'Can you provide quality certification for the steel plates?',
    timestamp: '2 hours ago',
    unread: 1
  },
  {
    id: '2',
    rfqId: '2',
    rfqTitle: 'Copper Wire Purchase',
    buyer: 'Electrical Works Inc.',
    lastMessage: 'We need delivery within 5 days. Is this possible?',
    timestamp: '5 hours ago',
    unread: 0
  }
]

const mockTransactions = [
  {
    id: '1',
    productTitle: 'Stainless Steel Plates',
    buyer: 'Construction Company Ltd',
    amount: 450000,
    commission: 9000,
    status: 'COMPLETED',
    date: '2024-01-15'
  },
  {
    id: '2',
    productTitle: 'Copper Wire',
    buyer: 'Electrical Works Inc.',
    amount: 190000,
    commission: 3800,
    status: 'PAID',
    date: '2024-01-10'
  }
]

const mockAnalytics = {
  totalViews: 590,
  totalProducts: 3,
  activeRFQs: 2,
  completedTransactions: 2,
  monthlyRevenue: 640000,
  conversionRate: 65
}

const mockSubscription = {
  plan: 'STANDARD',
  startDate: '2024-01-01',
  endDate: '2024-02-01',
  listingsUsed: 3,
  listingsLimit: 20,
  rfqLimit: 'Unlimited',
  features: ['Analytics dashboard', 'Company profile', 'Email support']
}

export default function SellerDashboard() {
  const [activeTab, setActiveTab] = useState('products')
  const [showCreateProduct, setShowCreateProduct] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-green-100 text-green-800'
      case 'NEGOTIATION': return 'bg-yellow-100 text-yellow-800'
      case 'APPROVED': return 'bg-blue-100 text-blue-800'
      case 'CLOSED': return 'bg-gray-100 text-gray-800'
      case 'COMPLETED': return 'bg-green-100 text-green-800'
      case 'PAID': return 'bg-blue-100 text-blue-800'
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

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar className="w-64">
          <SidebarHeader className="border-b p-4">
            <div className="flex items-center gap-2">
              <Package className="h-6 w-6 text-blue-600" />
              <h1 className="text-lg font-semibold">Seller Dashboard</h1>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <button 
                        className={`w-full justify-start ${activeTab === 'products' ? 'bg-blue-100' : ''}`}
                        onClick={() => setActiveTab('products')}
                      >
                        <Package className="h-4 w-4" />
                        <span>My Products</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <button 
                        className={`w-full justify-start ${activeTab === 'rfqs' ? 'bg-blue-100' : ''}`}
                        onClick={() => setActiveTab('rfqs')}
                      >
                        <ShoppingCart className="h-4 w-4" />
                        <span>RFQs</span>
                        {mockRFQs.length > 0 && (
                          <Badge className="ml-auto bg-blue-500 text-white">{mockRFQs.length}</Badge>
                        )}
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <button 
                        className={`w-full justify-start ${activeTab === 'chats' ? 'bg-blue-100' : ''}`}
                        onClick={() => setActiveTab('chats')}
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span>Messages</span>
                        {mockChats.some(chat => chat.unread > 0) && (
                          <Badge className="ml-auto bg-red-500 text-white">1</Badge>
                        )}
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <button 
                        className={`w-full justify-start ${activeTab === 'transactions' ? 'bg-blue-100' : ''}`}
                        onClick={() => setActiveTab('transactions')}
                      >
                        <FileText className="h-4 w-4" />
                        <span>Transactions</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            
            <SidebarGroup>
              <SidebarGroupLabel>Analytics</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <button 
                        className={`w-full justify-start ${activeTab === 'analytics' ? 'bg-blue-100' : ''}`}
                        onClick={() => setActiveTab('analytics')}
                      >
                        <BarChart3 className="h-4 w-4" />
                        <span>Analytics</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Subscription</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <button 
                        className={`w-full justify-start ${activeTab === 'subscription' ? 'bg-blue-100' : ''}`}
                        onClick={() => setActiveTab('subscription')}
                      >
                        <Crown className="h-4 w-4" />
                        <span>My Plan</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Account</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <button className="w-full justify-start">
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <button className="w-full justify-start">
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white shadow-sm border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <h2 className="text-xl font-semibold">
                  {activeTab === 'products' && 'My Products'}
                  {activeTab === 'rfqs' && 'RFQs'}
                  {activeTab === 'chats' && 'Messages'}
                  {activeTab === 'transactions' && 'Transactions'}
                  {activeTab === 'analytics' && 'Analytics'}
                  {activeTab === 'subscription' && 'My Subscription'}
                </h2>
              </div>
              <div className="flex items-center gap-4">
                <Badge className={getPlanColor(mockSubscription.plan)}>
                  {mockSubscription.plan}
                </Badge>
                <Button variant="outline" size="sm">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </Button>
                <Avatar>
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-6">
            {activeTab === 'products' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">My Products</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                    <Button onClick={() => setShowCreateProduct(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4">
                  {mockProducts.map((product) => (
                    <Card key={product.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="text-lg font-semibold">{product.title}</h4>
                              {product.isFeatured && (
                                <Badge className="bg-yellow-100 text-yellow-800">
                                  <Crown className="h-3 w-3 mr-1" />
                                  Featured
                                </Badge>
                              )}
                              <Badge className={product.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                {product.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                            <p className="text-gray-600">{product.description}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                          <div>
                            <Label className="text-sm text-gray-500">Price</Label>
                            <p className="font-medium">Rs. {product.price.toLocaleString()}</p>
                          </div>
                          <div>
                            <Label className="text-sm text-gray-500">Stock</Label>
                            <p className="font-medium">{product.quantity} {product.unit}</p>
                          </div>
                          <div>
                            <Label className="text-sm text-gray-500">Category</Label>
                            <p className="font-medium">{product.category}</p>
                          </div>
                          <div>
                            <Label className="text-sm text-gray-500">Views</Label>
                            <p className="font-medium">{product.views}</p>
                          </div>
                          <div>
                            <Label className="text-sm text-gray-500">Listed</Label>
                            <p className="font-medium">{new Date(product.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-500">
                            <Eye className="h-4 w-4 inline mr-1" />
                            {product.views} views
                          </div>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'rfqs' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">RFQs for My Products</h3>
                
                <div className="grid gap-4">
                  {mockRFQs.map((rfq) => (
                    <Card key={rfq.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold">{rfq.title}</h4>
                            <p className="text-gray-600 mt-1">{rfq.description}</p>
                          </div>
                          <Badge className={getStatusColor(rfq.status)}>
                            {rfq.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <Label className="text-sm text-gray-500">Buyer</Label>
                            <p className="font-medium">{rfq.buyer}</p>
                          </div>
                          <div>
                            <Label className="text-sm text-gray-500">Budget</Label>
                            <p className="font-medium">Rs. {rfq.budget.toLocaleString()}</p>
                          </div>
                          <div>
                            <Label className="text-sm text-gray-500">Quantity</Label>
                            <p className="font-medium">{rfq.quantity} {rfq.unit}</p>
                          </div>
                          <div>
                            <Label className="text-sm text-gray-500">Deadline</Label>
                            <p className="font-medium">{new Date(rfq.deadline).toLocaleDateString()}</p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Send Quote
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'chats' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Messages</h3>
                
                <div className="grid gap-4">
                  {mockChats.map((chat) => (
                    <Card key={chat.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold">{chat.rfqTitle}</h4>
                            <p className="text-gray-600 text-sm">Buyer: {chat.buyer}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-500">{chat.timestamp}</div>
                            {chat.unread > 0 && (
                              <Badge className="bg-red-500 text-white mt-1">{chat.unread} new</Badge>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-gray-700 mb-4">{chat.lastMessage}</p>
                        
                        <Button size="sm">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Reply
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'transactions' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Transaction History</h3>
                
                <div className="grid gap-4">
                  {mockTransactions.map((transaction) => (
                    <Card key={transaction.id}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-lg font-semibold">{transaction.productTitle}</h4>
                            <p className="text-gray-600">Buyer: {transaction.buyer}</p>
                          </div>
                          <Badge className={
                            transaction.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                            transaction.status === 'PAID' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }>
                            {transaction.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <Label className="text-sm text-gray-500">Total Amount</Label>
                            <p className="font-medium">Rs. {transaction.amount.toLocaleString()}</p>
                          </div>
                          <div>
                            <Label className="text-sm text-gray-500">Commission</Label>
                            <p className="font-medium">Rs. {transaction.commission.toLocaleString()}</p>
                          </div>
                          <div>
                            <Label className="text-sm text-gray-500">Net Received</Label>
                            <p className="font-medium">Rs. {(transaction.amount - transaction.commission).toLocaleString()}</p>
                          </div>
                          <div>
                            <Label className="text-sm text-gray-500">Date</Label>
                            <p className="font-medium">{new Date(transaction.date).toLocaleDateString()}</p>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-2" />
                            Download Invoice
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Analytics Dashboard</h3>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Total Views</p>
                          <p className="text-2xl font-bold">{mockAnalytics.totalViews.toLocaleString()}</p>
                        </div>
                        <Eye className="h-8 w-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Active Products</p>
                          <p className="text-2xl font-bold">{mockAnalytics.totalProducts}</p>
                        </div>
                        <Package className="h-8 w-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Monthly Revenue</p>
                          <p className="text-2xl font-bold">Rs. {(mockAnalytics.monthlyRevenue / 1000).toFixed(0)}K</p>
                        </div>
                        <DollarSign className="h-8 w-8 text-purple-600" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Conversion Rate</p>
                          <p className="text-2xl font-bold">{mockAnalytics.conversionRate}%</p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-orange-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Product Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {mockProducts.map((product) => (
                          <div key={product.id} className="flex justify-between items-center">
                            <div className="flex-1">
                              <p className="font-medium">{product.title}</p>
                              <p className="text-sm text-gray-500">{product.views} views</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">Rs. {product.price.toLocaleString()}</p>
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                                <span className="text-sm">4.5</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm">New order received</p>
                            <p className="text-xs text-gray-500">2 hours ago</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm">Product featured</p>
                            <p className="text-xs text-gray-500">1 day ago</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm">New RFQ received</p>
                            <p className="text-xs text-gray-500">2 days ago</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'subscription' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">My Subscription</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Crown className="h-5 w-5" />
                        Current Plan
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold">{mockSubscription.plan}</span>
                          <Badge className={getPlanColor(mockSubscription.plan)}>
                            Active
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Period</span>
                            <span className="text-sm">{new Date(mockSubscription.startDate).toLocaleDateString()} - {new Date(mockSubscription.endDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Listings Used</span>
                            <span className="text-sm">{mockSubscription.listingsUsed} / {mockSubscription.listingsLimit}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">RFQ Limit</span>
                            <span className="text-sm">{mockSubscription.rfqLimit}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Features:</Label>
                          <ul className="space-y-1">
                            {mockSubscription.features.map((feature, index) => (
                              <li key={index} className="flex items-center gap-2 text-sm">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Usage Progress:</Label>
                          <Progress 
                            value={(mockSubscription.listingsUsed / mockSubscription.listingsLimit) * 100} 
                            className="h-2"
                          />
                          <p className="text-xs text-gray-500">
                            {mockSubscription.listingsUsed} of {mockSubscription.listingsLimit} listings used
                          </p>
                        </div>

                        <div className="flex gap-2 pt-4">
                          <Button className="flex-1">Upgrade Plan</Button>
                          <Button variant="outline">Buy Extra Listings</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Available Plans</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-semibold">Basic</h4>
                            <Badge className="bg-gray-100 text-gray-800">Free</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">1-2 listings, Limited RFQs</p>
                        </div>
                        
                        <div className="border rounded-lg p-4 border-blue-200 bg-blue-50">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-semibold">Standard</h4>
                            <Badge className="bg-blue-100 text-blue-800">Rs. 5,000/month</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">20 listings, Unlimited RFQs, Analytics</p>
                          <Badge className="bg-blue-600 text-white">Current Plan</Badge>
                        </div>
                        
                        <div className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-semibold">Premium</h4>
                            <Badge className="bg-purple-100 text-purple-800">Rs. 12,000/month</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">Unlimited listings, Priority support</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Create Product Modal */}
      {showCreateProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Add New Product</CardTitle>
              <CardDescription>List your product for buyers to discover</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => {
                e.preventDefault()
                setShowCreateProduct(false)
              }} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Product Title *</Label>
                    <Input id="title" placeholder="Enter product title" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="raw-materials">Raw Materials</SelectItem>
                        <SelectItem value="machinery">Machinery</SelectItem>
                        <SelectItem value="electrical">Electrical</SelectItem>
                        <SelectItem value="chemicals">Chemicals</SelectItem>
                        <SelectItem value="textiles">Textiles</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea id="description" placeholder="Describe your product in detail" rows={4} required />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (Rs.) *</Label>
                    <Input id="price" type="number" placeholder="0" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity *</Label>
                    <Input id="quantity" type="number" placeholder="0" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit *</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">kg</SelectItem>
                        <SelectItem value="pieces">pieces</SelectItem>
                        <SelectItem value="meters">meters</SelectItem>
                        <SelectItem value="liters">liters</SelectItem>
                        <SelectItem value="tons">tons</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    Add Product
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowCreateProduct(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </SidebarProvider>
  )
}