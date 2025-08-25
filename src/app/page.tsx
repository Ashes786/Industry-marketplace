'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Users, ShoppingCart, TrendingUp, Shield, Clock, MessageSquare, CreditCard } from 'lucide-react'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const handleGetStarted = (role: 'buyer' | 'seller') => {
    if (session) {
      router.push('/dashboard')
    } else {
      router.push(`/auth/signup?role=${role}`)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">B2B Pakistan</h1>
              </div>
              <div className="hidden md:block ml-10">
                <div className="flex items-baseline space-x-4">
                  <a href="#features" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Features</a>
                  <a href="#how-it-works" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">How it Works</a>
                  <a href="#pricing" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Pricing</a>
                  <a href="#testimonials" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Testimonials</a>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {status === 'authenticated' ? (
                <>
                  {session.user.isAdmin && (
                    <Button variant="outline" size="sm" onClick={() => router.push('/admin')}>
                      Admin Panel
                    </Button>
                  )}
                  <Button size="sm" onClick={() => router.push('/dashboard')}>
                    Dashboard
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" onClick={() => router.push('/auth/signin')}>
                    Login
                  </Button>
                  <Button size="sm" onClick={() => router.push('/auth/signup')}>
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Pakistan's Premier B2B Industrial Marketplace
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Connect with trusted suppliers and buyers for raw materials, semi-finished goods, and industrial products
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100"
                onClick={() => handleGetStarted('buyer')}
              >
                Start as Buyer
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-blue-600"
                onClick={() => handleGetStarted('seller')}
              >
                Start as Seller
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section id="features" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose B2B Pakistan?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're revolutionizing how Pakistani businesses trade industrial goods with transparency, efficiency, and trust.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Verified Network</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Connect with pre-verified businesses across Pakistan. Every member undergoes thorough verification to ensure authenticity.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Smart Matching</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Our AI-powered system matches your requirements with the most suitable suppliers, saving you time and resources.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Secure Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  All transactions are secured with escrow protection, ensuring both buyers and sellers are protected throughout the process.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pain Points Solved */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Solving Real Business Challenges
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold text-red-600 mb-6">Common Problems</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Limited Supplier Discovery</h4>
                    <p className="text-gray-600">Struggling to find reliable suppliers for specific industrial materials</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Price Negotiation Hassles</h4>
                    <p className="text-gray-600">Time-consuming back-and-forth negotiations without transparency</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Quality Assurance Concerns</h4>
                    <p className="text-gray-600">Uncertainty about product quality and supplier reliability</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Payment Security Issues</h4>
                    <p className="text-gray-600">Risk of fraud and delayed payments in traditional transactions</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-semibold text-green-600 mb-6">Our Solutions</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Comprehensive Supplier Directory</h4>
                    <p className="text-gray-600">Access to thousands of verified suppliers across all industrial categories</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Streamlined RFQ Process</h4>
                    <p className="text-gray-600">Post requirements once, receive multiple competitive quotes instantly</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Verified Business Profiles</h4>
                    <p className="text-gray-600">Detailed supplier verification with ratings and reviews from real buyers</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Secure Payment Gateway</h4>
                    <p className="text-gray-600">Escrow-based payment system with buyer protection and guaranteed payments</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get started in three simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Sign Up & Choose Your Role</h3>
              <p className="text-gray-600">
                Create your account and select whether you want to buy, sell, or do both. Sellers can choose their subscription plan.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Post & Connect</h3>
              <p className="text-gray-600">
                Buyers post RFQs, sellers list products. Our platform connects you with the right business partners.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Negotiate & Trade</h3>
              <p className="text-gray-600">
                Use our chat system to negotiate terms, finalize deals, and complete secure transactions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Seller Subscription Plans
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that fits your business needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="relative">
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Basic</CardTitle>
                <div className="text-3xl font-bold">Free</div>
                <CardDescription>Perfect for getting started</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">1-2 product listings</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Limited RFQ responses</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Basic search visibility</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Standard support</span>
                </div>
                <Button className="w-full" variant="outline" onClick={() => handleGetStarted('seller')}>Get Started</Button>
              </CardContent>
            </Card>

            <Card className="relative border-2 border-blue-500">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
                Most Popular
              </Badge>
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Standard</CardTitle>
                <div className="text-3xl font-bold">Rs. 5,000<span className="text-sm font-normal">/month</span></div>
                <CardDescription>For growing businesses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">20 product listings</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Unlimited RFQ responses</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Enhanced search visibility</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Basic analytics dashboard</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Company profile features</span>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => handleGetStarted('seller')}>Get Started</Button>
              </CardContent>
            </Card>

            <Card className="relative">
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Premium</CardTitle>
                <div className="text-3xl font-bold">Rs. 12,000<span className="text-sm font-normal">/month</span></div>
                <CardDescription>For established businesses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Unlimited product listings</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Priority RFQ access</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Advanced analytics</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Featured seller badge</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Dedicated account manager</span>
                </div>
                <Button className="w-full" onClick={() => handleGetStarted('seller')}>Get Started</Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-gray-600">
              <strong>Buyers:</strong> No subscription fees. Pay only a small commission on successful purchases.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "B2B Pakistan has transformed our procurement process. We now find reliable suppliers in hours instead of weeks."
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <div>
                    <div className="font-semibold">Ahmed Khan</div>
                    <div className="text-sm text-gray-500">Manufacturing Co.</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "The platform helped us expand our customer base across Pakistan. Sales increased by 40% in just 3 months!"
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <div>
                    <div className="font-semibold">Fatima Ali</div>
                    <div className="text-sm text-gray-500">Steel Supplier</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Secure payments and verified suppliers give us peace of mind. It's the future of B2B trading in Pakistan."
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <div>
                    <div className="font-semibold">Bilal Ahmed</div>
                    <div className="text-sm text-gray-500">Construction Firm</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of Pakistani businesses already using B2B Pakistan
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" onClick={() => handleGetStarted('buyer')}>
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">B2B Pakistan</h3>
              <p className="text-gray-400">
                Connecting Pakistani businesses for a stronger industrial ecosystem.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">How it Works</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Success Stories</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact Info</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Email: info@b2bpakistan.com</li>
                <li>Phone: +92 123 456 7890</li>
                <li>Address: Karachi, Pakistan</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2024 B2B Pakistan. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}