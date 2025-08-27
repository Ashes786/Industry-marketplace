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
import { ProtectedRoute, useAuth } from '@/lib/simple-auth'
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
  ShoppingCart, 
  Package, 
  TrendingUp, 
  Users, 
  Settings, 
  LogOut,
  Bell,
  Filter,
  Eye,
  Calendar,
  DollarSign,
  FileText
} from 'lucide-react'

// Mock data for demonstration
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
    responses: 5,
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
    responses: 8,
    createdAt: '2024-01-18'
  },
  {
    id: '3',
    title: 'Industrial Machinery Parts',
    description: 'Spare parts for manufacturing equipment',
    category: 'Machinery',
    budget: 350000,
    quantity: 50,
    unit: 'pieces',
    status: 'APPROVED',
    deadline: '2024-01-25',
    responses: 3,
    createdAt: '2024-01-15'
  }
]

const mockProducts = [
  {
    id: '1',
    title: 'Stainless Steel Plates',
    description: 'High-quality stainless steel plates for industrial use',
    price: 450,
    quantity: 2000,
    unit: 'kg',
    category: 'Raw Materials',
    seller: 'Steel Industries Ltd',
    rating: 4.5,
    isFeatured: true
  },
  {
    id: '2',
    title: 'Copper Wire',
    description: 'Premium copper wire for electrical applications',
    price: 380,
    quantity: 1000,
    unit: 'meters',
    category: 'Electrical',
    seller: 'Electrical Supplies Co.',
    rating: 4.8,
    isFeatured: false
  },
  {
    id: '3',
    title: 'Industrial Bearings',
    description: 'Heavy-duty bearings for machinery',
    price: 1200,
    quantity: 100,
    unit: 'pieces',
    category: 'Machinery',
    seller: 'Bearing Solutions',
    rating: 4.2,
    isFeatured: true
  }
]

const mockChats = [
  {
    id: '1',
    rfqId: '1',
    rfqTitle: 'Industrial Steel Plates Required',
    seller: 'Steel Industries Ltd',
    lastMessage: 'We can provide the steel plates at Rs. 450/kg. Quality guaranteed.',
    timestamp: '2 hours ago',
    unread: 2
  },
  {
    id: '2',
    rfqId: '2',
    rfqTitle: 'Copper Wire Purchase',
    seller: 'Electrical Supplies Co.',
    lastMessage: 'Available in stock. Can deliver within 3 days.',
    timestamp: '5 hours ago',
    unread: 0
  }
]

const mockTransactions = [
  {
    id: '1',
    rfqTitle: 'Industrial Steel Plates Required',
    seller: 'Steel Industries Ltd',
    amount: 450000,
    commission: 9000,
    status: 'COMPLETED',
    date: '2024-01-15'
  },
  {
    id: '2',
    rfqTitle: 'Copper Wire Purchase',
    seller: 'Electrical Supplies Co.',
    amount: 190000,
    commission: 3800,
    status: 'PAID',
    date: '2024-01-10'
  }
]

export default function BuyerDashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('rfqs')
  const [showCreateRFQ, setShowCreateRFQ] = useState(false)
  const [selectedRFQ, setSelectedRFQ] = useState(null)

  const handleCreateRFQ = (formData: any) => {
    console.log('Creating RFQ:', formData)
    setShowCreateRFQ(false)
    // TODO: Implement RFQ creation
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-green-100 text-green-800'
      case 'NEGOTIATION': return 'bg-yellow-100 text-yellow-800'
      case 'APPROVED': return 'bg-blue-100 text-blue-800'
      case 'CLOSED': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <ProtectedRoute>
      <SidebarProvider>
        <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar className="w-64">
          <SidebarHeader className="border-b p-4">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
              <h1 className="text-lg font-semibold">{user?.companyName || `${user?.name}'s Dashboard`}</h1>
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
                        className={`w-full justify-start ${activeTab === 'rfqs' ? 'bg-blue-100' : ''}`}
                        onClick={() => setActiveTab('rfqs')}
                      >
                        <Plus className="h-4 w-4" />
                        <span>RFQ Management</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <button 
                        className={`w-full justify-start ${activeTab === 'browse' ? 'bg-blue-100' : ''}`}
                        onClick={() => setActiveTab('browse')}
                      >
                        <Search className="h-4 w-4" />
                        <span>Browse Products</span>
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
                          <Badge className="ml-auto bg-red-500 text-white">2</Badge>
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
                      <button className="w-full justify-start">
                        <TrendingUp className="h-4 w-4" />
                        <span>Reports</span>
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
                      <button className="w-full justify-start" onClick={logout}>
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
                  {activeTab === 'rfqs' && 'RFQ Management'}
                  {activeTab === 'browse' && 'Browse Products'}
                  {activeTab === 'chats' && 'Messages'}
                  {activeTab === 'transactions' && 'Transactions'}
                </h2>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </Button>
                <Avatar>
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-6">
            {activeTab === 'rfqs' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">My RFQs</h3>
                  <Button onClick={() => setShowCreateRFQ(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create New RFQ
                  </Button>
                </div>

                <div className="grid gap-4">
                  {mockRFQs.map((rfq) => (
                    <Card key={rfq.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-lg font-semibold">{rfq.title}</h4>
                            <p className="text-gray-600 mt-1">{rfq.description}</p>
                          </div>
                          <Badge className={getStatusColor(rfq.status)}>
                            {rfq.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <Label className="text-sm text-gray-500">Category</Label>
                            <p className="font-medium">{rfq.category}</p>
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
                            <Label className="text-sm text-gray-500">Responses</Label>
                            <p className="font-medium">{rfq.responses} quotes</p>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-500">
                            <Calendar className="h-4 w-4 inline mr-1" />
                            Deadline: {new Date(rfq.deadline).toLocaleDateString()}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                            <Button size="sm" onClick={() => setSelectedRFQ(rfq)}>
                              <MessageSquare className="h-4 w-4 mr-2" />
                              View Quotes
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'browse' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Browse Products</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockProducts.map((product) => (
                    <Card key={product.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold">{product.title}</h4>
                            <p className="text-gray-600 text-sm mt-1">{product.description}</p>
                          </div>
                          {product.isFeatured && (
                            <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>
                          )}
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-2xl font-bold text-blue-600">
                              Rs. {product.price.toLocaleString()}
                            </span>
                            <span className="text-sm text-gray-500">per {product.unit}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className="text-yellow-400">
                                  {i < Math.floor(product.rating) ? '★' : '☆'}
                                </span>
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">({product.rating})</span>
                          </div>

                          <div className="text-sm text-gray-500">
                            Available: {product.quantity} {product.unit}
                          </div>

                          <div className="text-sm text-gray-500">
                            Seller: {product.seller}
                          </div>

                          <div className="flex gap-2 pt-2">
                            <Button className="flex-1" size="sm">
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Contact Seller
                            </Button>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
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
                            <p className="text-gray-600 text-sm">Seller: {chat.seller}</p>
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
                          Continue Chat
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
                            <h4 className="text-lg font-semibold">{transaction.rfqTitle}</h4>
                            <p className="text-gray-600">Seller: {transaction.seller}</p>
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
                            <Label className="text-sm text-gray-500">Net to Seller</Label>
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
          </main>
        </div>
      </div>

      {/* Create RFQ Modal */}
      {showCreateRFQ && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Create New RFQ</CardTitle>
              <CardDescription>Fill in the details to request quotes from suppliers</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => {
                e.preventDefault()
                handleCreateRFQ(e.target)
              }} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">RFQ Title *</Label>
                    <Input id="title" placeholder="Enter RFQ title" required />
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
                  <Textarea id="description" placeholder="Describe your requirements in detail" rows={4} required />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
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
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget (Rs.)</Label>
                    <Input id="budget" type="number" placeholder="0" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline</Label>
                    <Input id="deadline" type="date" />
                  </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    Create RFQ
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowCreateRFQ(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
        </SidebarProvider>
      </ProtectedRoute>
  )
}