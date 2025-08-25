'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { User, Building2, ShoppingCart, Store } from 'lucide-react'

export default function AuthPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    role: 'buyer',
    sellerPlan: 'basic'
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // TODO: Implement API call for registration
      console.log('Registration data:', formData)
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      alert('Registration successful! Please check your email for verification.')
    } catch (error) {
      alert('Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const subscriptionPlans = {
    basic: {
      name: 'Basic',
      price: 'Free',
      features: ['1-2 listings', 'Limited RFQs', 'Lower search visibility'],
      color: 'bg-gray-100 text-gray-800'
    },
    standard: {
      name: 'Standard',
      price: 'Rs. 5,000/month',
      features: ['20 listings', 'Unlimited RFQs', 'Analytics', 'Company profile'],
      color: 'bg-blue-100 text-blue-800'
    },
    premium: {
      name: 'Premium',
      price: 'Rs. 12,000/month',
      features: ['Unlimited listings', 'Priority RFQs', 'Advanced analytics', 'Featured badge', 'Dedicated support'],
      color: 'bg-purple-100 text-purple-800'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">B2B Marketplace Pakistan</h1>
          <p className="text-lg text-gray-600">Connect with trusted industrial suppliers and buyers</p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Create Account</CardTitle>
            <CardDescription className="text-center">
              Join Pakistan's leading B2B industrial marketplace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Basic Information
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                    />
                  </div>
                </div>

                {/* Role Selection and Plans */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Account Type</h3>
                  
                  <div className="space-y-3">
                    <Label>Select your primary role:</Label>
                    <RadioGroup
                      value={formData.role}
                      onValueChange={(value) => handleInputChange('role', value)}
                      className="space-y-3"
                    >
                      <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value="buyer" id="buyer" />
                        <Label htmlFor="buyer" className="flex items-center gap-2 cursor-pointer">
                          <ShoppingCart className="h-4 w-4" />
                          Buyer - Find suppliers and request quotes
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value="seller" id="seller" />
                        <Label htmlFor="seller" className="flex items-center gap-2 cursor-pointer">
                          <Store className="h-4 w-4" />
                          Seller - List products and receive orders
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value="both" id="both" />
                        <Label htmlFor="both" className="flex items-center gap-2 cursor-pointer">
                          <Building2 className="h-4 w-4" />
                          Both - Buy and sell on the platform
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {formData.role === 'seller' || formData.role === 'both' ? (
                    <div className="space-y-3">
                      <Label>Choose Subscription Plan:</Label>
                      <Select
                        value={formData.sellerPlan}
                        onValueChange={(value) => handleInputChange('sellerPlan', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a plan" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(subscriptionPlans).map(([key, plan]) => (
                            <SelectItem key={key} value={key}>
                              <div className="flex items-center gap-2">
                                <Badge className={plan.color}>{plan.name}</Badge>
                                <span>{plan.price}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {formData.sellerPlan && (
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <h4 className="font-semibold mb-2">{subscriptionPlans[formData.sellerPlan].name} Plan Features:</h4>
                          <ul className="text-sm space-y-1">
                            {subscriptionPlans[formData.sellerPlan].features.map((feature, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-800">Buyer Account Benefits:</h4>
                      <ul className="text-sm space-y-1 text-blue-700">
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                          No subscription fees
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                          Pay commission only on successful purchases
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                          Access to verified suppliers
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Password Fields */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="text-center">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full md:w-auto px-8 py-3"
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </div>

              <div className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <a href="/login" className="text-blue-600 hover:underline">
                  Sign in here
                </a>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}