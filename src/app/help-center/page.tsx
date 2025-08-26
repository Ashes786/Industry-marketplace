'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  BookOpen, 
  MessageCircle, 
  Phone, 
  Mail, 
  ChevronRight,
  HelpCircle,
  Users,
  Settings,
  FileText,
  Video,
  Download
} from 'lucide-react'

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'All Topics', icon: <HelpCircle className="h-5 w-5" /> },
    { id: 'getting-started', name: 'Getting Started', icon: <BookOpen className="h-5 w-5" /> },
    { id: 'account', name: 'Account Management', icon: <Users className="h-5 w-5" /> },
    { id: 'trading', name: 'Trading & RFQs', icon: <MessageCircle className="h-5 w-5" /> },
    { id: 'billing', name: 'Billing & Payments', icon: <FileText className="h-5 w-5" /> },
    { id: 'technical', name: 'Technical Support', icon: <Settings className="h-5 w-5" /> }
  ]

  const helpArticles = [
    {
      category: 'getting-started',
      title: 'How to Create Your Account',
      description: 'Step-by-step guide to setting up your B2B Pakistan account',
      content: 'Learn how to create your account, verify your email, and set up your profile...',
      difficulty: 'Beginner',
      readTime: '5 min'
    },
    {
      category: 'getting-started',
      title: 'Understanding Subscription Plans',
      description: 'Compare Basic, Standard, and Premium plans to choose the right one',
      content: 'Detailed comparison of features, pricing, and benefits of each subscription tier...',
      difficulty: 'Beginner',
      readTime: '8 min'
    },
    {
      category: 'account',
      title: 'Managing Your Company Profile',
      description: 'How to update and optimize your company information',
      content: 'Learn to add your company details, logo, description, and contact information...',
      difficulty: 'Intermediate',
      readTime: '6 min'
    },
    {
      category: 'trading',
      title: 'Creating Effective RFQs',
      description: 'Best practices for creating Request for Quotations that get responses',
      content: 'Learn how to write clear, detailed RFQs that attract quality suppliers...',
      difficulty: 'Intermediate',
      readTime: '10 min'
    },
    {
      category: 'trading',
      title: 'Using the Chat System',
      description: 'How to communicate with suppliers and buyers through our platform',
      content: 'Guide to using the real-time chat system for negotiations and discussions...',
      difficulty: 'Beginner',
      readTime: '7 min'
    },
    {
      category: 'billing',
      title: 'Understanding Your Invoice',
      description: 'How to read and understand your monthly billing statements',
      content: 'Breakdown of charges, payment methods, and billing cycle information...',
      difficulty: 'Intermediate',
      readTime: '8 min'
    }
  ]

  const filteredArticles = helpArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === 'all' || article.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const faqs = [
    {
      question: 'How do I verify my seller account?',
      answer: 'To verify your seller account, go to your dashboard, click on Account Settings, and follow the verification process. You\'ll need to submit business documents and contact information.'
    },
    {
      question: 'What payment methods are supported?',
      answer: 'We support bank transfers, credit/debit cards, and digital wallets. All payments are processed securely through our payment partners.'
    },
    {
      question: 'How do I upgrade my subscription plan?',
      answer: 'You can upgrade your plan anytime from your dashboard. Go to Subscription > Upgrade Plan and choose your desired tier.'
    },
    {
      question: 'Is there a mobile app available?',
      answer: 'Yes, we have mobile apps for both iOS and Android. You can download them from the App Store or Google Play Store.'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Help Center</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions and learn how to make the most of B2B Pakistan
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search for help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 text-base"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors ${
                      activeCategory === category.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {category.icon}
                    <span className="font-medium">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="text-center">
                  <MessageCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <CardTitle className="text-lg">Live Chat</CardTitle>
                  <CardDescription>Chat with our support team</CardDescription>
                </CardHeader>
              </Card>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="text-center">
                  <Phone className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <CardTitle className="text-lg">Call Us</CardTitle>
                  <CardDescription>+92 123 456 7890</CardDescription>
                </CardHeader>
              </Card>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="text-center">
                  <Mail className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <CardTitle className="text-lg">Email Support</CardTitle>
                  <CardDescription>info@b2bpakistan.com</CardDescription>
                </CardHeader>
              </Card>
            </div>

            {/* Help Articles */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Articles</h2>
              <div className="space-y-4">
                {filteredArticles.map((article, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {categories.find(c => c.id === article.category)?.name}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {article.difficulty}
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-2">{article.title}</h3>
                          <p className="text-gray-600 text-sm mb-3">{article.description}</p>
                          <div className="flex items-center text-sm text-gray-500">
                            <BookOpen className="h-4 w-4 mr-1" />
                            <span>{article.readTime} read</span>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0 ml-4" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* FAQ Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-gray-900 mb-3">{faq.question}</h3>
                      <p className="text-gray-600">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}