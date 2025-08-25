'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CheckCircle, Users, ShoppingCart } from 'lucide-react'

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'BUYER',
    plan: 'BASIC'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: formData.role,
          plan: formData.role === 'BUYER' ? undefined : formData.plan
        })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Account created successfully! Please wait for admin approval.')
        setTimeout(() => {
          router.push('/auth/signin')
        }, 3000)
      } else {
        setError(data.error || 'An error occurred during signup')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const roleDescriptions = {
    BUYER: {
      title: 'Buyer Account',
      description: 'Post RFQs and browse products from verified sellers',
      icon: ShoppingCart,
      color: 'text-blue-600'
    },
    SELLER: {
      title: 'Seller Account',
      description: 'List products and respond to RFQs from buyers',
      icon: Users,
      color: 'text-green-600'
    },
    BOTH: {
      title: 'Buyer & Seller',
      description: 'Full access to both buying and selling features',
      icon: CheckCircle,
      color: 'text-purple-600'
    }
  }

  const planPricing = {
    BASIC: { price: 'Free', description: 'Perfect for getting started' },
    STANDARD: { price: 'Rs. 5,000/month', description: 'For growing businesses' },
    PREMIUM: { price: 'Rs. 12,000/month', description: 'For established businesses' }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Create Your Account
          </h2>
          <p className="mt-3 text-xl text-gray-500">
            Join Pakistan's premier B2B industrial marketplace
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Role Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Choose Your Role</CardTitle>
              <CardDescription>
                Select how you want to use the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={formData.role}
                onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
                className="space-y-4"
              >
                {Object.entries(roleDescriptions).map(([role, config]) => {
                  const Icon = config.icon
                  return (
                    <div key={role} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value={role} id={role} />
                      <Label htmlFor={role} className="flex-1 cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <Icon className={`w-5 h-5 ${config.color}`} />
                          <div>
                            <div className="font-medium">{config.title}</div>
                            <div className="text-sm text-gray-500">{config.description}</div>
                          </div>
                        </div>
                      </Label>
                    </div>
                  )
                })}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Signup Form */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Enter your details to create your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                    placeholder="Enter your email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    required
                    placeholder="Create a password"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    required
                    placeholder="Confirm your password"
                  />
                </div>

                {(formData.role === 'SELLER' || formData.role === 'BOTH') && (
                  <div className="space-y-2">
                    <Label>Subscription Plan</Label>
                    <Select
                      value={formData.plan}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, plan: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a plan" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(planPricing).map(([plan, config]) => (
                          <SelectItem key={plan} value={plan}>
                            <div>
                              <div className="font-medium">{plan}</div>
                              <div className="text-sm text-gray-500">{config.price} - {config.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="border-green-200 bg-green-50">
                    <AlertDescription className="text-green-800">{success}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <a href="/auth/signin" className="font-medium text-blue-600 hover:text-blue-500">
                    Sign in
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}