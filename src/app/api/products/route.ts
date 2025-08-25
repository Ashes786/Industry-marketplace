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

    const { searchParams } = new URL(request.url)
    const role = session.user.role
    const userId = session.user.id
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')

    let where: any = { isActive: true }

    if (role === 'SELLER' || role === 'BOTH') {
      // Sellers can only see their own products
      where.sellerId = userId
    }

    if (category) {
      where.category = category
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        include: {
          seller: {
            select: { id: true, name: true, email: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      db.product.count({ where })
    ])

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
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

    const role = session.user.role
    const userId = session.user.id

    if (role !== 'SELLER' && role !== 'BOTH') {
      return NextResponse.json({ error: 'Only sellers can create products' }, { status: 403 })
    }

    // Check subscription limits
    const subscription = await db.subscription.findFirst({
      where: {
        userId,
        status: 'ACTIVE',
        endDate: { gte: new Date() }
      },
      orderBy: { createdAt: 'desc' }
    })

    if (!subscription) {
      return NextResponse.json({ error: 'Active subscription required' }, { status: 403 })
    }

    const currentProductCount = await db.product.count({
      where: { sellerId: userId, isActive: true }
    })

    const planLimits = {
      BASIC: 2,
      STANDARD: 20,
      PREMIUM: Infinity
    }

    if (currentProductCount >= planLimits[subscription.planType]) {
      return NextResponse.json({ 
        error: `Product limit reached. Your ${subscription.planType} plan allows ${planLimits[subscription.planType]} listings.` 
      }, { status: 403 })
    }

    const body = await request.json()
    const { title, description, category, price, quantity, unit, images } = body

    if (!title || !description || !category || !price || !quantity || !unit) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const product = await db.product.create({
      data: {
        sellerId: userId,
        title,
        description,
        category,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        unit,
        images: images ? JSON.stringify(images) : null
      },
      include: {
        seller: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}