import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

interface SubscriptionLimits {
  products: number
  rfqs: number
  features: string[]
}

interface SubscriptionUsage {
  products: number
  rfqs: number
  extraListings: number
}

export async function checkSubscriptionLimits(
  userId: string,
  action: 'create_product' | 'create_rfq' | 'access_feature'
): Promise<{ allowed: boolean; reason?: string; current?: any; limits?: any }> {
  try {
    // Get user's active subscription
    const subscription = await db.subscription.findFirst({
      where: {
        userId: userId,
        status: 'ACTIVE',
        endDate: {
          gte: new Date()
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Get current usage
    const userProducts = await db.product.count({
      where: {
        sellerId: userId,
        isActive: true,
        createdAt: {
          gte: subscription?.startDate || new Date('1970-01-01')
        }
      }
    })

    const userRFQs = await db.rFQ.count({
      where: {
        buyerId: userId,
        createdAt: {
          gte: subscription?.startDate || new Date('1970-01-01')
        }
      }
    })

    // Get extra listings
    const extraListings = await db.extraListing.findMany({
      where: {
        sellerId: userId,
        status: 'active'
      }
    })

    const totalExtraListings = extraListings.reduce((sum, listing) => sum + listing.listingCount, 0)

    const usage: SubscriptionUsage = {
      products: userProducts,
      rfqs: userRFQs,
      extraListings: totalExtraListings
    }

    // If no active subscription, only basic actions allowed
    if (!subscription) {
      const basicLimits: SubscriptionLimits = {
        products: 0,
        rfqs: 5, // Allow some basic RFQs even without subscription
        features: ['Basic browsing']
      }

      switch (action) {
        case 'create_product':
          return {
            allowed: false,
            reason: 'Active subscription required to create product listings',
            current: usage,
            limits: basicLimits
          }
        case 'create_rfq':
          if (usage.rfqs >= basicLimits.rfqs) {
            return {
              allowed: false,
              reason: 'RFQ limit reached. Please upgrade your subscription.',
              current: usage,
              limits: basicLimits
            }
          }
          return { allowed: true, current: usage, limits: basicLimits }
        case 'access_feature':
          return {
            allowed: false,
            reason: 'Subscription required to access this feature',
            current: usage,
            limits: basicLimits
          }
      }
    }

    // Define plan limits
    const planLimits: Record<string, SubscriptionLimits> = {
      BASIC: {
        products: 2,
        rfqs: 10,
        features: ['Basic listing', 'Limited RFQ access', 'Email support']
      },
      STANDARD: {
        products: 20,
        rfqs: Infinity,
        features: ['Standard listing', 'Unlimited RFQs', 'Analytics dashboard', 'Company profile', 'Priority support']
      },
      PREMIUM: {
        products: Infinity,
        rfqs: Infinity,
        features: ['Premium listing', 'Unlimited RFQs', 'Advanced analytics', 'Featured badge', 'Dedicated support', 'Priority placement']
      }
    }

    const limits = planLimits[subscription.planType]
    const effectiveProductLimit = limits.products + totalExtraListings

    // Check action-specific limits
    switch (action) {
      case 'create_product':
        if (usage.products >= effectiveProductLimit) {
          return {
            allowed: false,
            reason: `Product limit reached. Your ${subscription.planType} plan allows ${limits.products} listings${totalExtraListings > 0 ? ` plus ${totalExtraListings} extra listings` : ''}.`,
            current: usage,
            limits: { ...limits, products: effectiveProductLimit }
          }
        }
        return { allowed: true, current: usage, limits: { ...limits, products: effectiveProductLimit } }

      case 'create_rfq':
        if (usage.rfqs >= limits.rfqs) {
          return {
            allowed: false,
            reason: 'RFQ limit reached. Please upgrade your subscription.',
            current: usage,
            limits
          }
        }
        return { allowed: true, current: usage, limits }

      case 'access_feature':
        // This would be more specific based on the feature being accessed
        return { allowed: true, current: usage, limits }
    }

    return { allowed: true, current: usage, limits }

  } catch (error) {
    console.error('Error checking subscription limits:', error)
    return {
      allowed: false,
      reason: 'Error checking subscription limits'
    }
  }
}

// Middleware function for Next.js API routes
export async function subscriptionMiddleware(
  request: NextRequest,
  action: 'create_product' | 'create_rfq' | 'access_feature'
): Promise<NextResponse | null> {
  try {
    // Get user ID from request (you'll need to implement authentication)
    const userId = request.headers.get('x-user-id')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 401 }
      )
    }

    // Check subscription limits
    const check = await checkSubscriptionLimits(userId, action)
    
    if (!check.allowed) {
      return NextResponse.json(
        { 
          error: check.reason || 'Subscription limit exceeded',
          current: check.current,
          limits: check.limits
        },
        { status: 403 }
      )
    }

    // If allowed, continue with the request
    return null

  } catch (error) {
    console.error('Subscription middleware error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Function to purchase extra listings
export async function purchaseExtraListings(
  userId: string,
  listingCount: number,
  amount: number,
  paymentMethod: string,
  paymentDetails: any
) {
  try {
    // Process payment
    const paymentSuccess = await processPayment(paymentMethod, paymentDetails, amount)
    
    if (!paymentSuccess.success) {
      throw new Error(paymentSuccess.error || 'Payment processing failed')
    }

    // Create extra listing record
    const extraListing = await db.extraListing.create({
      data: {
        sellerId: userId,
        listingCount,
        amount,
        status: 'active'
      }
    })

    return {
      success: true,
      extraListing: {
        id: extraListing.id,
        listingCount: extraListing.listingCount,
        amount: extraListing.amount,
        status: extraListing.status
      },
      paymentDetails: paymentSuccess
    }

  } catch (error) {
    console.error('Error purchasing extra listings:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to purchase extra listings'
    }
  }
}

// Simulate payment processing
async function processPayment(paymentMethod: string, paymentDetails: any, amount: number) {
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return {
    success: true,
    transactionId: `EXTRA${Date.now()}`,
    message: `Payment of Rs. ${amount} processed via ${paymentMethod}`
  }
}