'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Shield, 
  Eye, 
  Lock, 
  Database, 
  Cookie,
  Server,
  Trash2,
  Download,
  Share2,
  Mail,
  Phone
} from 'lucide-react'

export default function PrivacyPolicy() {
  const sections = [
    {
      title: 'Information We Collect',
      icon: <Database className="h-6 w-6 text-blue-600" />,
      content: [
        {
          heading: 'Personal Information',
          text: 'When you register for an account, we collect your name, email address, company name, phone number, and business registration details.'
        },
        {
          heading: 'Business Information',
          text: 'We collect information about your business including industry, company size, location, and business registration documents.'
        },
        {
          heading: 'Usage Data',
          text: 'We automatically collect information about your interactions with our platform, including IP addresses, browser type, pages visited, and time spent on our site.'
        },
        {
          heading: 'Communication Data',
          text: 'When you communicate with us or other users through our platform, we collect the content of those communications.'
        }
      ]
    },
    {
      title: 'How We Use Your Information',
      icon: <Eye className="h-6 w-6 text-green-600" />,
      content: [
        {
          heading: 'Service Provision',
          text: 'To provide, maintain, and improve our B2B marketplace platform and services.'
        },
        {
          heading: 'Communication',
          text: 'To communicate with you about your account, transactions, and customer support inquiries.'
        },
        {
          heading: 'Platform Security',
          text: 'To monitor and protect our platform against fraud, security breaches, and illegal activities.'
        },
        {
          heading: 'Business Analytics',
          text: 'To analyze usage patterns and improve our services, subject to your consent where required.'
        }
      ]
    },
    {
      title: 'Information Sharing',
      icon: <Share2 className="h-6 w-6 text-purple-600" />,
      content: [
        {
          heading: 'With Other Users',
          text: 'We share your business profile and contact information with other registered users for business purposes.'
        },
        {
          heading: 'Service Providers',
          text: 'We share information with third-party service providers who perform services on our behalf.'
        },
        {
          heading: 'Legal Requirements',
          text: 'We may disclose your information if required by law or to protect our rights and safety.'
        },
        {
          heading: 'Business Transfers',
          text: 'In the event of a merger, acquisition, or sale of assets, your information may be transferred.'
        }
      ]
    },
    {
      title: 'Data Security',
      icon: <Lock className="h-6 w-6 text-red-600" />,
      content: [
        {
          heading: 'Encryption',
          text: 'We use industry-standard encryption to protect your data both in transit and at rest.'
        },
        {
          heading: 'Access Controls',
          text: 'We implement strict access controls to ensure only authorized personnel can access your information.'
        },
        {
          heading: 'Regular Audits',
          text: 'We conduct regular security audits to identify and address potential vulnerabilities.'
        },
        {
          heading: 'Employee Training',
          text: 'Our employees receive regular training on data protection and privacy practices.'
        }
      ]
    },
    {
      title: 'Your Rights',
      icon: <Shield className="h-6 w-6 text-indigo-600" />,
      content: [
        {
          heading: 'Access and Correction',
          text: 'You have the right to access and correct your personal information stored in our systems.'
        },
        {
          heading: 'Data Portability',
          text: 'You can request a copy of your personal data in a machine-readable format.'
        },
        {
          heading: 'Deletion',
          text: 'You have the right to request deletion of your personal data, subject to legal obligations.'
        },
        {
          heading: 'Opt-out',
          text: 'You can opt-out of certain data collection and marketing communications.'
        }
      ]
    },
    {
      title: 'Cookies and Tracking',
      icon: <Cookie className="h-6 w-6 text-orange-600" />,
      content: [
        {
          heading: 'Essential Cookies',
          text: 'We use cookies necessary for the basic functioning of our website and services.'
        },
        {
          heading: 'Analytics Cookies',
          text: 'We use cookies to understand how users interact with our platform and improve our services.'
        },
        {
          heading: 'Marketing Cookies',
          text: 'We may use cookies to deliver personalized advertisements and marketing content.'
        },
        {
          heading: 'Cookie Management',
          text: 'You can manage your cookie preferences through your browser settings.'
        }
      ]
    }
  ]

  const dataRetention = [
    {
      type: 'Account Information',
      retention: 'While your account is active plus 2 years after closure'
    },
    {
      type: 'Transaction Records',
      retention: '7 years for accounting and legal compliance'
    },
    {
      type: 'Communication Data',
      retention: '3 years for customer service and dispute resolution'
    },
    {
      type: 'Usage Analytics',
      retention: '2 years for service improvement and analytics'
    },
    {
      type: 'Marketing Data',
      retention: 'Until you opt-out or request deletion'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <Shield className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-xl text-blue-100">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Introduction</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 leading-relaxed mb-4">
              At B2B Pakistan, we are committed to protecting your privacy and ensuring the security of your personal information. 
              This Privacy Policy outlines how we collect, use, disclose, and safeguard your data when you use our B2B marketplace platform.
            </p>
            <p className="text-gray-600 leading-relaxed">
              By using our services, you agree to the collection and use of information in accordance with this policy. 
              We reserve the right to update this policy periodically, and we will notify you of any significant changes.
            </p>
          </CardContent>
        </Card>

        {/* Main Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  {section.icon}
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {section.content.map((item, itemIndex) => (
                    <div key={itemIndex}>
                      <h4 className="font-semibold text-gray-900 mb-2">{item.heading}</h4>
                      <p className="text-gray-600 leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Data Retention */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <Trash2 className="h-6 w-6 text-red-600" />
              Data Retention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">
              We retain your personal information only for as long as necessary to fulfill the purposes for which it was collected, 
              including legal, accounting, or reporting requirements.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {dataRetention.map((item, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-1">{item.type}</h4>
                  <p className="text-sm text-gray-600">{item.retention}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* International Data Transfers */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <Server className="h-6 w-6 text-blue-600" />
              International Data Transfers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our platform may transfer and store your information in countries other than your own. We ensure that any such transfers 
              comply with applicable data protection laws and that your data is adequately protected.
            </p>
            <p className="text-gray-600 leading-relaxed">
              When we transfer your personal information internationally, we use standard contractual clauses and other legally 
              recognized mechanisms to ensure appropriate safeguards are in place.
            </p>
          </CardContent>
        </Card>

        {/* Changes to This Policy */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <Download className="h-6 w-6 text-green-600" />
              Changes to This Policy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 leading-relaxed">
              We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. 
              We will notify you of any material changes by posting the new policy on our website and updating the "Last updated" date.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We encourage you to review this Privacy Policy periodically to stay informed about how we are protecting your information.
            </p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <Mail className="h-6 w-6 text-purple-600" />
              Contact Us
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 leading-relaxed mb-6">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="font-medium">Email</div>
                    <div className="text-gray-600">privacy@b2bpakistan.com</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="font-medium">Phone</div>
                    <div className="text-gray-600">+92 123 456 7890</div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="font-medium">Data Protection Officer</div>
                    <div className="text-gray-600">dpo@b2bpakistan.com</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Server className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="font-medium">Address</div>
                    <div className="text-gray-600">Karachi, Pakistan</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}