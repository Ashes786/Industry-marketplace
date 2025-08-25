'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Menu, 
  X, 
  Search, 
  Building2, 
  ShoppingCart, 
  Store, 
  TrendingUp, 
  Shield, 
  Clock,
  CheckCircle,
  Star,
  Users,
  BarChart3,
  MessageSquare,
  Package,
  Handshake,
  ArrowRight,
  Phone,
  Mail,
  MapPin
} from 'lucide-react'

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [email, setEmail] = useState('')

  const subscriptionPlans = {
    basic: {
      name: 'Basic',
      price: 'Free',
      features: ['1-2 listings', 'Limited RFQs', 'Lower search visibility'],
      color: 'bg-gray-100 text-gray-800',
      popular: false
    },
    standard: {
      name: 'Standard',
      price: 'Rs. 5,000/month',
      features: ['20 listings', 'Unlimited RFQs', 'Analytics dashboard', 'Company profile', 'Email support'],
      color: 'bg-blue-100 text-blue-800',
      popular: true
    },
    premium: {
      name: 'Premium',
      price: 'Rs. 12,000/month',
      features: ['Unlimited listings', 'Priority RFQs', 'Advanced analytics', 'Featured badge', 'Dedicated support', 'Priority placement'],
      color: 'bg-purple-100 text-purple-800',
      popular: false
    }
  }

  const testimonials = [
    {
      name: 'Ahmed Khan',
      company: 'Steel Industries Ltd',
      role: 'Procurement Manager',
      content: 'This platform has transformed our sourcing process. We found reliable suppliers and saved 30% on raw material costs.',
      rating: 5
    },
    {
      name: 'Fatima Ali',
      company: 'Textile Mills',
      role: 'CEO',
      content: 'As a seller, the premium plan helped us reach quality buyers across Pakistan. Our revenue increased by 45% in 3 months.',
      rating: 5
    },
    {
      name: 'Muhammad Raza',
      company: 'Construction Co.',
      role: 'Operations Director',
      content: 'The RFQ system is efficient and the chat feature makes negotiations smooth. Highly recommended for B2B trading.',
      rating: 4
    }
  ]

  const features = [
    {
      icon: <Search className="h-8 w-8 text-blue-600" />,
      title: 'Smart Search',
      description: 'Find exactly what you need with our advanced search and filtering system'
    },
    {
      icon: <Shield className="h-8 w-8 text-green-600" />,
      title: 'Verified Suppliers',
      description: 'All sellers are verified and approved to ensure quality and reliability'
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-purple-600" />,
      title: 'Real-time Chat',
      description: 'Negotiate directly with suppliers through our integrated chat system'
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-orange-600" />,
      title: 'Analytics Dashboard',
      description: 'Track your business performance with detailed insights and reports'
    }
  ]

  const howItWorks = [
    {
      step: 1,
      title: 'Sign Up',
      description: 'Create your account as a buyer, seller, or both',
      icon: <Users className="h-12 w-12 text-blue-600" />
    },
    {
      step: 2,
      title: 'Connect',
      description: 'Post RFQs or list products and start connecting',
      icon: <Handshake className="h-12 w-12 text-green-600" />
    },
    {
      step: 3,
      title: 'Trade',
      description: 'Negotiate, finalize deals, and grow your business',
      icon: <TrendingUp className="h-12 w-12 text-purple-600" />
    }
  ]

  const painPoints = [
    {
      title: 'Limited Supplier Access',
      solution: 'Connect with hundreds of verified suppliers across Pakistan',
      icon: <Store className="h-6 w-6 text-red-600" />
    },
    {
      title: 'Price Negotiation Hassles',
      solution: 'Streamlined RFQ process with real-time chat negotiations',
      icon: <MessageSquare className="h-6 w-6 text-red-600" />
    },
    {
      title: 'Quality Concerns',
      solution: 'Verified sellers with ratings and reviews system',
      icon: <Shield className="h-6 w-6 text-red-600" />
    },
    {
      title: 'Slow Procurement',
      solution: 'Fast RFQ responses and quick deal finalization',
      icon: <Clock className="h-6 w-6 text-red-600" />
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">B2B Pakistan</h1>
              </div>
              <div className="hidden md:block ml-10">
                <div className="flex items-baseline space-x-4">
                  <a href="#features" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">Features</a>
                  <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">How it Works</a>
                  <a href="#pricing" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">Pricing</a>
                  <a href="#testimonials" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">Testimonials</a>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center space-x-4">
                <Button variant="ghost" asChild>
                  <a href="/login">Sign In</a>
                </Button>
                <Button asChild>
                  <a href="/signup">Get Started</a>
                </Button>
              </div>
            </div>
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <a href="#features" className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium">Features</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium">How it Works</a>
              <a href="#pricing" className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium">Pricing</a>
              <a href="#testimonials" className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium">Testimonials</a>
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center px-5">
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <a href="/login">Sign In</a>
                  </Button>
                </div>
                <div className="mt-3 px-2">
                  <Button className="w-full" asChild>
                    <a href="/signup">Get Started</a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Pakistan's Premier B2B Industrial Marketplace
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Connect with trusted suppliers and buyers. Streamline your procurement and expand your business reach across Pakistan.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
                  <a href="/signup">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600" asChild>
                  <a href="#how-it-works">Learn More</a>
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold">1000+</div>
                    <div className="text-blue-100">Verified Suppliers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">5000+</div>
                    <div className="text-blue-100">Products Listed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">98%</div>
                    <div className="text-blue-100">Success Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">24/7</div>
                    <div className="text-blue-100">Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points Solved */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Common B2B Challenges, Solved
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We understand the pain points of Pakistani businesses and have built solutions to address them
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {painPoints.map((point, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-4">{point.icon}</div>
                  <CardTitle className="text-lg">{point.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{point.solution}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Your Business
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to streamline your B2B trading process
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto mb-4">{feature.icon}</div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started in three simple steps
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto mb-6">{step.icon}</div>
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-4 font-bold">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Flexible pricing plans for businesses of all sizes
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {Object.entries(subscriptionPlans).map(([key, plan]) => (
              <Card key={key} className={`relative ${plan.popular ? 'border-blue-500 shadow-xl' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white px-4 py-1">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold">{plan.price}</div>
                  <CardDescription>Perfect for growing businesses</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                    variant={plan.popular ? 'default' : 'outline'}
                    asChild
                  >
                    <a href="/signup">Get Started</a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <p className="text-gray-600">
              Buyer accounts are always free. Pay only when you make a purchase.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of satisfied businesses across Pakistan
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                    <div className="text-sm text-gray-500">{testimonial.company}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your B2B Trading?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of Pakistani businesses already using our platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
              <a href="/signup">Start Free Trial</a>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600" asChild>
              <a href="#contact">Contact Sales</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">B2B Pakistan</h3>
              <p className="text-gray-400">
                Pakistan's leading B2B industrial marketplace connecting buyers and suppliers nationwide.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/login" className="hover:text-white">Sign In</a></li>
                <li><a href="/signup" className="hover:text-white">Sign Up</a></li>
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>+92 123 456 7890</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>info@b2bpakistan.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Karachi, Pakistan</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 B2B Pakistan. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}