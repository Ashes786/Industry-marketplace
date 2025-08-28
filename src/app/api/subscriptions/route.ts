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

    const subscriptions = await db.subscription.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            roles: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(subscriptions)
  } catch (error) {
    console.error('Error fetching subscriptions:', error)
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
      return NextResponse.json({ error: 'Only sellers can purchase subscriptions' }, { status: 403 })
    }

    const body = await request.json()
    const { planType, amount } = body

    if (!planType || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Calculate subscription duration and listing limits
    let listingLimit = 2 // Basic default
    let duration = 30 // days

    switch (planType) {
      case 'STANDARD':
        listingLimit = 15
        duration = 30
        break
      case 'PREMIUM':
        listingLimit = -1 // Unlimited
        duration = 30
        break
      default:
        listingLimit = 2
        duration = 30
    }

    const startDate = new Date()
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + duration)

    // Deactivate previous subscriptions
    await db.subscription.updateMany({
      where: {
        userId: session.user.id,
        status: 'ACTIVE'
      },
      data: {
        status: 'EXPIRED'
      }
    })

    const subscription = await db.subscription.create({
      data: {
        userId: session.user.id,
        planType,
        startDate,
        endDate,
        status: 'ACTIVE',
        amount: parseFloat(amount)
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            roles: true
          }
        }
      }
    })

    return NextResponse.json(subscription, { status: 201 })
  } catch (error) {
    console.error('Error creating subscription:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}