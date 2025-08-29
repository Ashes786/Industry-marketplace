import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { UserRole } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const status = searchParams.get('status') // 'active', 'expired', 'trial', 'all'

    let where: any = {}

    if (status === 'active') {
      where.status = 'ACTIVE'
      where.endDate = { gte: new Date() }
    } else if (status === 'expired') {
      where.OR = [
        { status: 'EXPIRED' },
        { endDate: { lt: new Date() } }
      ]
    } else if (status === 'trial') {
      where.isTrial = true
      where.status = 'ACTIVE'
    }

    const subscriptions = await db.subscription.findMany({
      where,
      include: {
        user: {
          select: { 
            name: true, 
            email: true, 
            roles: true,
            companyName: true 
          }
        },
        plan: {
          select: {
            name: true,
            description: true,
            price: true,
            isTrial: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    })

    const total = await db.subscription.count({ where })

    // Parse features for plans that have them
    const subscriptionsWithParsedFeatures = subscriptions.map(sub => ({
      ...sub,
      plan: sub.plan ? {
        ...sub.plan,
        features: sub.plan.features ? JSON.parse(sub.plan.features) : []
      } : null
    }))

    return NextResponse.json({
      subscriptions: subscriptionsWithParsedFeatures,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching subscriptions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      userId,
      planId,
      planType,
      startDate,
      endDate,
      amount,
      isTrial = false
    } = body

    // Validate required fields
    if (!userId || !planType || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user exists
    const user = await db.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if plan exists if planId is provided
    if (planId) {
      const plan = await db.availablePlan.findUnique({
        where: { id: planId }
      })

      if (!plan) {
        return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
      }
    }

    // Create subscription
    const subscription = await db.subscription.create({
      data: {
        userId,
        planId,
        planType,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: 'ACTIVE',
        amount: amount || 0,
        isTrial
      },
      include: {
        user: {
          select: { name: true, email: true }
        },
        plan: {
          select: {
            name: true,
            description: true,
            price: true,
            isTrial: true
          }
        }
      }
    })

    // Log admin action
    await db.adminLog.create({
      data: {
        adminId: session.user.id,
        action: 'CREATE_SUBSCRIPTION',
        targetUserId: userId,
        details: `Created ${planType} subscription for user: ${user.email}`
      }
    })

    return NextResponse.json({
      message: 'Subscription created successfully',
      subscription
    })
  } catch (error) {
    console.error('Error creating subscription:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}