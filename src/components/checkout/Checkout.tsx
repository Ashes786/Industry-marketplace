'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  CreditCard, 
  Smartphone, 
  Building, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  Clock,
  FileText,
  Download
} from 'lucide-react'

interface CheckoutProps {
  isOpen: boolean
  onClose: () => void
  orderDetails: {
    rfqId?: string
    productId?: string
    title: string
    description: string
    productAmount: number
    sellerName: string
    buyerId: string
    sellerId: string
  }
}

interface PaymentDetails {
  productAmount: number
  commissionAmount: number
  totalAmount: number
  commissionRate: string
}

interface PaymentMethod {
  id: string
  name: string
  icon: React.ReactNode
  description: string
  fields: Array<{
    name: string
    label: string
    type: string
    placeholder: string
    required: boolean
  }>
}

export default function Checkout({ isOpen, onClose, orderDetails }: CheckoutProps) {
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('')
  const [paymentForm, setPaymentForm] = useState<Record<string, string>>({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string>('')

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'jazzcash',
      name: 'JazzCash',
      icon: <Smartphone className="h-5 w-5 text-green-600" />,
      description: 'Pay with your JazzCash mobile wallet',
      fields: [
        { name: 'mobileNumber', label: 'Mobile Number', type: 'tel', placeholder: '03001234567', required: true },
        { name: 'cnic', label: 'CNIC', type: 'text', placeholder: '12345-1234567-1', required: true }
      ]
    },
    {
      id: 'easypaisa',
      name: 'EasyPaisa',
      icon: <Smartphone className="h-5 w-5 text-green-600" />,
      description: 'Pay with your EasyPaisa mobile wallet',
      fields: [
        { name: 'mobileNumber', label: 'Mobile Number', type: 'tel', placeholder: '03001234567', required: true },
        { name: 'cnic', label: 'CNIC', type: 'text', placeholder: '12345-1234567-1', required: true }
      ]
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      icon: <Building className="h-5 w-5 text-blue-600" />,
      description: 'Pay via online bank transfer',
      fields: [
        { name: 'accountNumber', label: 'Account Number', type: 'text', placeholder: '1234567890123', required: true },
        { name: 'bankName', label: 'Bank Name', type: 'text', placeholder: 'HBL, UBL, MCB', required: true }
      ]
    },
    {
      id: 'stripe',
      name: 'Credit/Debit Card',
      icon: <CreditCard className="h-5 w-5 text-purple-600" />,
      description: 'Pay with your credit or debit card',
      fields: [
        { name: 'cardNumber', label: 'Card Number', type: 'text', placeholder: '1234 5678 9012 3456', required: true },
        { name: 'expiryDate', label: 'Expiry Date', type: 'text', placeholder: 'MM/YY', required: true },
        { name: 'cvv', label: 'CVV', type: 'text', placeholder: '123', required: true }
      ]
    }
  ]

  useEffect(() => {
    if (isOpen && orderDetails) {
      // Calculate payment details
      calculatePaymentDetails()
    }
  }, [isOpen, orderDetails])

  const calculatePaymentDetails = async () => {
    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rfqId: orderDetails.rfqId,
          productId: orderDetails.productId,
          buyerId: orderDetails.buyerId,
          sellerId: orderDetails.sellerId,
          productAmount: orderDetails.productAmount
        })
      })

      const data = await response.json()
      if (response.ok) {
        setPaymentDetails(data.commissionBreakdown)
      } else {
        setError(data.error || 'Failed to calculate payment details')
      }
    } catch (error) {
      setError('Failed to calculate payment details')
    }
  }

  const handlePaymentMethodChange = (methodId: string) => {
    setSelectedPaymentMethod(methodId)
    setPaymentForm({})
    setError('')
  }

  const handleFormChange = (fieldName: string, value: string) => {
    setPaymentForm(prev => ({
      ...prev,
      [fieldName]: value
    }))
  }

  const validateForm = () => {
    const method = paymentMethods.find(m => m.id === selectedPaymentMethod)
    if (!method) return false

    return method.fields.every(field => {
      if (field.required) {
        return paymentForm[field.name] && paymentForm[field.name].trim() !== ''
      }
      return true
    })
  }

  const handlePayment = async () => {
    if (!validateForm()) {
      setError('Please fill in all required fields')
      return
    }

    setIsProcessing(true)
    setPaymentStatus('processing')
    setError('')

    try {
      // First, create the payment calculation
      const calculationResponse = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rfqId: orderDetails.rfqId,
          productId: orderDetails.productId,
          buyerId: orderDetails.buyerId,
          sellerId: orderDetails.sellerId,
          productAmount: orderDetails.productAmount
        })
      })

      const calculationData = await calculationResponse.json()
      
      if (!calculationResponse.ok) {
        throw new Error(calculationData.error || 'Failed to calculate payment')
      }

      // Process the payment
      const processResponse = await fetch('/api/payments/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactionId: calculationData.transaction.id,
          paymentMethod: selectedPaymentMethod,
          paymentDetails: paymentForm
        })
      })

      const processData = await processResponse.json()
      
      if (processResponse.ok) {
        setPaymentStatus('success')
      } else {
        throw new Error(processData.error || 'Payment processing failed')
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Payment processing failed')
      setPaymentStatus('error')
    } finally {
      setIsProcessing(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return `Rs. ${amount.toLocaleString()}`
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            Secure Checkout
          </CardTitle>
          <CardDescription>
            Complete your purchase securely. All transactions are encrypted and protected.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Order Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold mb-3">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Product/Service:</span>
                <span className="font-medium">{orderDetails.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Seller:</span>
                <span className="font-medium">{orderDetails.sellerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Product Amount:</span>
                <span className="font-medium">{paymentDetails ? formatCurrency(paymentDetails.productAmount) : 'Calculating...'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Commission ({paymentDetails?.commissionRate || '...'}):</span>
                <span className="font-medium">{paymentDetails ? formatCurrency(paymentDetails.commissionAmount) : 'Calculating...'}</span>
              </div>
              <div className="border-t pt-2 flex justify-between text-lg font-semibold">
                <span>Total Amount:</span>
                <span className="text-blue-600">{paymentDetails ? formatCurrency(paymentDetails.totalAmount) : 'Calculating...'}</span>
              </div>
            </div>
          </div>

          {/* Payment Status */}
          {paymentStatus === 'processing' && (
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                Processing your payment... Please do not close this window.
              </AlertDescription>
            </Alert>
          )}

          {paymentStatus === 'success' && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Payment successful! Your order has been confirmed.
              </AlertDescription>
            </Alert>
          )}

          {paymentStatus === 'error' && error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {paymentStatus === 'idle' && (
            <>
              {/* Payment Method Selection */}
              <div>
                <h3 className="font-semibold mb-3">Select Payment Method</h3>
                <Tabs value={selectedPaymentMethod} onValueChange={handlePaymentMethodChange}>
                  <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
                    {paymentMethods.map(method => (
                      <TabsTrigger key={method.id} value={method.id} className="text-xs">
                        {method.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  {paymentMethods.map(method => (
                    <TabsContent key={method.id} value={method.id} className="space-y-4">
                      <div className="flex items-center gap-3 p-3 border rounded-lg">
                        {method.icon}
                        <div>
                          <h4 className="font-medium">{method.name}</h4>
                          <p className="text-sm text-gray-600">{method.description}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        {method.fields.map(field => (
                          <div key={field.name} className="space-y-1">
                            <Label htmlFor={field.name}>{field.label} {field.required && '*'}</Label>
                            <Input
                              id={field.name}
                              type={field.type}
                              placeholder={field.placeholder}
                              value={paymentForm[field.name] || ''}
                              onChange={(e) => handleFormChange(field.name, e.target.value)}
                              required={field.required}
                            />
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>

              {/* Security Note */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-800">Security & Protection</span>
                </div>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• All payments are encrypted and secure</li>
                  <li>• Your financial information is never stored</li>
                  <li>• 100% payment protection guarantee</li>
                  <li>• Secure checkout with SSL encryption</li>
                </ul>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            {paymentStatus === 'success' ? (
              <>
                <Button className="flex-1" onClick={onClose}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Done
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Invoice
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button 
                  className="flex-1" 
                  onClick={handlePayment}
                  disabled={!selectedPaymentMethod || isProcessing || paymentStatus !== 'idle'}
                >
                  {isProcessing ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4 mr-2" />
                      Pay {paymentDetails ? formatCurrency(paymentDetails.totalAmount) : '...'}
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}