'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Mail, Clock } from 'lucide-react'
import { useAuth } from '@/lib/simple-auth'

export default function SignUpSuccessPage() {
  const [countdown, setCountdown] = useState(10)
  const router = useRouter()

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push('/auth/signin')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Account Created Successfully!</CardTitle>
            <CardDescription>
              Your account has been created and is pending admin approval.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                <span>You will receive an email notification once your account is approved</span>
              </div>
              
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Account approval typically takes 1-2 business days</span>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Next Steps:</strong> You will be redirected to the sign-in page in {countdown} seconds, 
                or you can click the button below to go there now.
              </p>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={() => router.push('/auth/signin')}
                className="w-full"
              >
                Go to Sign In
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => router.push('/')}
                className="w-full"
              >
                Return to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}