import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Get user's current subscription
    const currentSubscription = await db.subscription.findFirst({
      where: {
        userId: userId,
        status: 'ACTIVE'
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Get user's extra listings
    const extraListings = await db.extraListing.findMany({
      where: {
        sellerId: userId,
        status: 'active'
      }
    })

    // Calculate current usage
    const activeListings = await db.product.count({
      where: {
        sellerId: userId,
        isActive: true
      }
    })

    const subscriptionLimits = {
      BASIC: { listings: 2, rfqs: 5 },
      STANDARD: { listings: 20, rfqs: 'unlimited' },
      PREMIUM: { listings: 'unlimited', rfqs: 'unlimited' }
    }

    const currentPlan = currentSubscription?.planType || 'BASIC'
    const limits = subscriptionLimits[currentPlan as keyof typeof subscriptionLimits]
    const totalExtraListings = extraListings.reduce((sum, listing) => sum + listing.listingCount, 0)

    const usageStats = {
      currentPlan,
      listingsUsed: activeListings,
      listingsLimit: limits.listings,
      extraListingsAvailable: totalExtraListings,
      totalListingsAvailable: limits.listings === 'unlimited' ? 'unlimited' : limits.listings + totalExtraListings,
      rfqLimit: limits.rfqs,
      subscriptionEnds: currentSubscription?.endDate || null,
      features: getPlanFeatures(currentPlan)
    }

    return NextResponse.json({
      subscription: currentSubscription,
      extraListings,
      usageStats
    })

  } catch (error) {
    console.error('Error fetching subscription:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, planType, amount } = body

    if (!userId || !planType) {
      return NextResponse.json(
        { error: 'User ID and plan type are required' },
        { status: 400 }
      )
    }

    // Calculate subscription duration and amount
    const planDetails = {
      BASIC: { duration: 365, amount: 0 }, // 1 year free
      STANDARD: { duration: 30, amount: 5000 }, // 1 month
      PREMIUM: { duration: 30, amount: 12000 } // 1 month
    }

    const plan = planDetails[planType as keyof typeof planDetails]
    const startDate = new Date()
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + plan.duration)

    // Deactivate existing subscriptions
    await db.subscription.updateMany({
      where: {
        userId: userId,
        status: 'ACTIVE'
      },
      data: {
        status: 'EXPIRED'
      }
    })

    // Create new subscription
    const subscription = await db.subscription.create({
      data: {
        userId,
        planType: planType as any,
        startDate,
        endDate,
        status: 'ACTIVE',
        amount: amount || plan.amount
      }
    })

    return NextResponse.json({
      message: 'Subscription created successfully',
      subscription: {
        id: subscription.id,
        planType: subscription.planType,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        status: subscription.status,
        amount: subscription.amount
      }
    })

  } catch (error) {
    console.error('Error creating subscription:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function getPlanFeatures(planType: string) {
  const features = {
    BASIC: [
      '1-2 product listings',
      'Limited RFQ responses',
      'Basic search visibility',
      'Email support'
    ],
    STANDARD: [
      '20 product listings',
      'Unlimited RFQ responses',
      'Enhanced search visibility',
      'Analytics dashboard',
      'Company profile',
      'Priority email support'
    ],
    PREMIUM: [
      'Unlimited product listings',
      'Unlimited RFQ responses',
      'Maximum search visibility',
      'Advanced analytics',
      'Featured badge',
      'Priority RFQ placement',
      'Dedicated account manager',
      '24/7 phone support'
    ]
  }

  return features[planType as keyof typeof features] || features.BASIC
}