import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's current subscription and listing limits
    const subscription = await db.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: 'ACTIVE'
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const extraListings = await db.extraListing.findMany({
      where: {
        sellerId: session.user.id,
        status: 'active'
      }
    })

    const totalExtraListings = extraListings.reduce((sum, listing) => sum + listing.listingCount, 0)

    // Calculate current listing limits
    let listingLimit = 2 // Basic default
    if (subscription) {
      switch (subscription.planType) {
        case 'STANDARD':
          listingLimit = 15
          break
        case 'PREMIUM':
          listingLimit = -1 // Unlimited
          break
        default:
          listingLimit = 2
      }
    }

    // Count active products
    const activeProductsCount = await db.product.count({
      where: {
        sellerId: session.user.id,
        isActive: true
      }
    })

    return NextResponse.json({
      subscription,
      extraListings,
      listingLimit,
      totalExtraListings,
      activeProductsCount,
      canCreateMore: listingLimit === -1 || activeProductsCount < (listingLimit + totalExtraListings)
    })
  } catch (error) {
    console.error('Error fetching subscription info:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}