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

    const products = await db.product.findMany({
      where: {
        isActive: true
      },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            companyName: true,
            isApproved: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'SELLER' && session.user.role !== 'BOTH') {
      return NextResponse.json({ error: 'Only sellers can create products' }, { status: 403 })
    }

    // Check subscription limits
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

    // Calculate listing limit
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

    // Check if user can create more products
    if (listingLimit !== -1 && activeProductsCount >= (listingLimit + totalExtraListings)) {
      return NextResponse.json({ 
        error: 'Listing limit reached. Please upgrade your subscription or purchase extra listings.',
        currentCount: activeProductsCount,
        limit: listingLimit + totalExtraListings
      }, { status: 403 })
    }

    const body = await request.json()
    const { title, description, price, quantity, unit, category, subCategory, images } = body

    if (!title || !description || !price || !quantity || !unit || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const product = await db.product.create({
      data: {
        sellerId: session.user.id,
        title,
        description,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        unit,
        category,
        subCategory,
        images: images || null,
        isActive: true,
        isFeatured: false,
        views: 0
      },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            companyName: true
          }
        }
      }
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}