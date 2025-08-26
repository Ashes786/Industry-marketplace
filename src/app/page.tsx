'use client'

import { useState, useEffect } from 'react'
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
  MapPin,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [animatedNumbers, setAnimatedNumbers] = useState({
    suppliers: 0,
    products: 0,
    successRate: 0
  })
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0)

  const subscriptionPlans = {
    basic: {
      name: 'Basic',
      price: 'Free',
      features: ['2 listings', 'Basic RFQ system', 'Company profile', 'Basic chat support', 'Simple analytics dashboard'],
      color: 'bg-gray-100 text-gray-800',
      popular: false
    },
    standard: {
      name: 'Standard',
      price: 'Rs. 5,000/month',
      features: ['15 listings', 'Unlimited RFQs', 'Advanced analytics', 'Priority search placement', 'Email & chat support', 'Mobile app access'],
      color: 'bg-blue-100 text-blue-800',
      popular: true
    },
    premium: {
      name: 'Premium',
      price: 'Rs. 12,000/month',
      features: ['Unlimited listings', 'Priority RFQ processing', 'Advanced analytics with reports', 'Featured badge', 'Dedicated account manager', '24/7 priority support', 'API access'],
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
    },
    {
      name: 'Ayesha Malik',
      company: 'Tech Solutions',
      role: 'Supply Chain Manager',
      content: 'The analytics dashboard provides incredible insights into our procurement patterns. We\'ve optimized our inventory management significantly.',
      rating: 5
    },
    {
      name: 'Bilal Ahmed',
      company: 'Manufacturing Corp',
      role: 'Purchasing Director',
      content: 'Exceptional platform with verified suppliers. The mobile app keeps us connected even when we\'re on the go.',
      rating: 5
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

  // Animation effect for numbers
  useEffect(() => {
    const animateNumbers = () => {
      const duration = 2000 // 2 seconds
      const steps = 60
      const interval = duration / steps

      const targets = {
        suppliers: 1000,
        products: 5000,
        successRate: 98
      }

      let currentStep = 0

      const timer = setInterval(() => {
        currentStep++
        const progress = currentStep / steps
        const easeProgress = 1 - Math.pow(1 - progress, 3) // Ease out cubic

        setAnimatedNumbers({
          suppliers: Math.round(targets.suppliers * easeProgress),
          products: Math.round(targets.products * easeProgress),
          successRate: Math.round(targets.successRate * easeProgress)
        })

        if (currentStep >= steps) {
          clearInterval(timer)
          setAnimatedNumbers(targets)
        }
      }, interval)

      return () => clearInterval(timer)
    }

    // Start animation when component mounts
    const timeout = setTimeout(animateNumbers, 500)
    return () => clearTimeout(timeout)
  }, [])

  // Testimonial navigation - Enhanced for endless scrolling
  const [currentTestimonialStart, setCurrentTestimonialStart] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [direction, setDirection] = useState<'next' | 'prev'>('next')

  // Create extended testimonials array for endless scrolling
  const extendedTestimonials = [...testimonials, ...testimonials, ...testimonials]

  const nextTestimonialSet = () => {
    setDirection('next')
    setCurrentTestimonialStart((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonialSet = () => {
    setDirection('prev')
    setCurrentTestimonialStart((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const goToTestimonialSet = (startIndex: number) => {
    setDirection(startIndex > currentTestimonialStart ? 'next' : 'prev')
    setCurrentTestimonialStart(startIndex)
  }

  // Auto-play functionality with smoother transitions
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setDirection('next')
      setCurrentTestimonialStart((prev) => (prev + 1) % testimonials.length)
    }, 4000) // Change every 4 seconds for smoother movement

    return () => clearInterval(interval)
  }, [isAutoPlaying, testimonials.length])

  // Pause auto-play on user interaction
  const handleUserInteraction = () => {
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000) // Resume after 10 seconds
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo - Left */}
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-gray-900">B2B Pakistan</h1>
            </div>

            {/* Center Navigation Links */}
            <div className="hidden md:block flex-1">
              <div className="flex items-center justify-center space-x-8">
                <a href="#features" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200">Features</a>
                <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200">How it Works</a>
                <a href="#pricing" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200">Pricing</a>
                <a href="#testimonials" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200">Testimonials</a>
              </div>
            </div>

            {/* Sign In/Sign Up Buttons - Right */}
            <div className="hidden md:block">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200" asChild>
                  <a href="/login">Sign In</a>
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-200" asChild>
                  <a href="/signup">Get Started</a>
                </Button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-700 hover:text-blue-600 hover:bg-blue-50"
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
                <div className="flex flex-row space-x-3 px-3">
                  <Button variant="ghost" className="flex-1 justify-center text-gray-700 hover:text-blue-600 hover:bg-blue-50" asChild>
                    <a href="/login">Sign In</a>
                  </Button>
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium" asChild>
                    <a href="/signup">Get Started</a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 text-white py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight drop-shadow-lg">
                Pakistan's Premier B2B Industrial Marketplace
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-50 leading-relaxed max-w-2xl">
                Connect with trusted suppliers and buyers. Streamline your procurement and expand your business reach across Pakistan.
              </p>
              <div className="flex flex-col sm:flex-row gap-6">
                <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 font-semibold text-lg py-4 px-8 shadow-lg hover:shadow-xl transition-all duration-300" asChild>
                  <a href="/signup">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-700 font-semibold text-lg py-4 px-8 bg-white/10 backdrop-blur-sm transition-all duration-300" asChild>
                  <a href="#how-it-works">Learn More</a>
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/15 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
                <div className="grid grid-cols-2 gap-8">
                  <div className="text-center space-y-2">
                    <div className="text-4xl font-bold text-white transition-all duration-300">
                      {animatedNumbers.suppliers}+
                    </div>
                    <div className="text-blue-100 text-lg font-medium">Verified Suppliers</div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-4xl font-bold text-white transition-all duration-300">
                      {animatedNumbers.products}+
                    </div>
                    <div className="text-blue-100 text-lg font-medium">Products Listed</div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-4xl font-bold text-white transition-all duration-300">
                      {animatedNumbers.successRate}%
                    </div>
                    <div className="text-blue-100 text-lg font-medium">Success Rate</div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-4xl font-bold text-white">24/7</div>
                    <div className="text-blue-100 text-lg font-medium">Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points Solved */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Common B2B Challenges, Solved
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              We understand the pain points of Pakistani businesses and have built solutions to address them
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {painPoints.map((point, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white">
                <CardHeader className="pb-4">
                  <div className="mx-auto mb-4 p-3 bg-red-50 rounded-full">{point.icon}</div>
                  <CardTitle className="text-lg font-semibold text-gray-900">{point.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 leading-relaxed">{point.solution}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Your Business
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Everything you need to streamline your B2B trading process
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg p-6 group">
                <CardHeader className="pb-4">
                  <div className="mx-auto mb-4 p-3 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors duration-300">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Get started in three simple steps
            </p>
          </div>
          <div className="relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-24 left-1/2 transform -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
            
            <div className="grid md:grid-cols-3 gap-8 md:gap-12 relative z-10">
              {howItWorks.map((step, index) => (
                <div key={index} className="text-center space-y-6 group">
                  {/* Step number circle */}
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                      <div className="text-white text-2xl font-bold">{step.step}</div>
                    </div>
                    {/* Connector dots for mobile */}
                    <div className="md:hidden absolute top-10 left-full w-full h-1 bg-gradient-to-r from-blue-400 to-purple-400 transform translate-x-4"></div>
                  </div>
                  
                  {/* Icon with background */}
                  <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110">
                    {step.icon}
                  </div>
                  
                  {/* Content */}
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-base max-w-xs mx-auto">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Flexible pricing plans for businesses of all sizes
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {Object.entries(subscriptionPlans).map(([key, plan]) => (
              <Card key={key} className={`relative flex flex-col ${plan.popular ? 'border-blue-500 shadow-2xl scale-105' : 'border-gray-200 shadow-lg'} hover:shadow-xl transition-all duration-300`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white px-6 py-2 text-sm font-semibold shadow-lg">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-6 flex-shrink-0">
                  <CardTitle className="text-2xl font-bold text-gray-900">{plan.name}</CardTitle>
                  <div className="text-4xl font-bold text-blue-600 my-2">{plan.price}</div>
                  <CardDescription className="text-gray-600">Perfect for growing businesses</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="flex-1">
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-3 text-gray-700">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-auto">
                    <Button 
                      className={`w-full py-3 text-lg font-semibold ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}`}
                      variant={plan.popular ? 'default' : 'outline'}
                      asChild
                    >
                      <a href="/signup">Get Started</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <p className="text-gray-600 text-lg">
              Buyer accounts are always free. Pay only when you make a purchase.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Don't just take our word for it - hear from businesses that have transformed their B2B trading
            </p>
          </div>
          
          <div className="relative">
            {/* Testimonials Grid - Enhanced for endless scrolling */}
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              {testimonials.map((testimonial, index) => {
                // Calculate the display position with wrapping for endless effect
                const displayIndex = (index - currentTestimonialStart + testimonials.length) % testimonials.length
                const isVisible = displayIndex < 3
                
                if (!isVisible) return null
                
                return (
                  <Card 
                    key={`${currentTestimonialStart}-${index}`} 
                    className={`
                      hover:shadow-xl transition-all duration-500 border-0 shadow-lg bg-white overflow-hidden group
                      ${displayIndex === 0 ? 'animate-in slide-in-from-left-5' : ''}
                      ${displayIndex === 1 ? 'animate-in slide-in-from-bottom-5' : ''}
                      ${displayIndex === 2 ? 'animate-in slide-in-from-right-5' : ''}
                    `}
                  >
                    <CardContent className="p-6">
                      {/* Profile Picture and Rating */}
                      <div className="flex flex-col items-center mb-6">
                        <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-gray-100 mb-4 group-hover:ring-blue-200 transition-all duration-300">
                          <img 
                            src={`/${testimonial.name.toLowerCase().replace(' ', '-')}.jpg`}
                            alt={testimonial.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=3B82F6&color=fff&size=64`;
                            }}
                          />
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-2">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <div className="text-xs text-gray-500 mb-2">Verified Review</div>
                          <div className="font-semibold text-gray-900 text-lg mb-1">{testimonial.name}</div>
                          <div className="text-sm text-gray-600 font-medium">{testimonial.role}</div>
                          <div className="text-sm text-gray-500">{testimonial.company}</div>
                        </div>
                      </div>
                      
                      {/* Testimonial Content */}
                      <p className="text-gray-700 italic text-base leading-relaxed text-center">
                        "{testimonial.content}"
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
            
            {/* Enhanced Navigation Controls */}
            <div className="flex items-center justify-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  prevTestimonialSet()
                  handleUserInteraction()
                }}
                className="rounded-full w-12 h-12 p-0 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              
              <div className="flex space-x-2">
                {Array.from({ length: testimonials.length }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      goToTestimonialSet(i)
                      handleUserInteraction()
                    }}
                    className={`
                      w-3 h-3 rounded-full transition-all duration-200
                      ${currentTestimonialStart === i
                        ? 'bg-blue-600 scale-110'
                        : 'bg-gray-300 hover:bg-gray-400'
                      }
                    `}
                  />
                ))}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  nextTestimonialSet()
                  handleUserInteraction()
                }}
                className="rounded-full w-12 h-12 p-0 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
            Ready to Transform Your B2B Trading?
          </h2>
          <p className="text-xl mb-10 text-blue-100 leading-relaxed max-w-2xl mx-auto">
            Join thousands of Pakistani businesses already using our platform
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 font-semibold text-lg py-4 px-8 shadow-lg hover:shadow-xl transition-all duration-300" asChild>
              <a href="/signup">Start Free Trial</a>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-700 font-semibold text-lg py-4 px-8 bg-white/10 backdrop-blur-sm transition-all duration-300" asChild>
              <a href="#contact">Contact Sales</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold mb-4 text-white">B2B Pakistan</h3>
              <p className="text-gray-300 leading-relaxed">
                Pakistan's leading B2B industrial marketplace connecting buyers and suppliers nationwide.
              </p>
            </div>
            <div className="space-y-6">
              <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
              <ul className="space-y-3 text-gray-300">
                <li><a href="/login" className="hover:text-white transition-colors duration-200">Sign In</a></li>
                <li><a href="/signup" className="hover:text-white transition-colors duration-200">Sign Up</a></li>
                <li><a href="#features" className="hover:text-white transition-colors duration-200">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors duration-200">Pricing</a></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-lg font-semibold mb-4 text-white">Support</h4>
              <ul className="space-y-3 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors duration-200">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Terms of Service</a></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-lg font-semibold mb-4 text-white">Contact Info</h4>
              <div className="space-y-4 text-gray-300">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-blue-400" />
                  <span>+92 123 456 7890</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-blue-400" />
                  <span>info@b2bpakistan.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-blue-400" />
                  <span>Karachi, Pakistan</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p className="text-sm">&copy; 2024 B2B Pakistan. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}