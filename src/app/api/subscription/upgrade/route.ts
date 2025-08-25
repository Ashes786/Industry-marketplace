import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { SubscriptionPlan } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const role = session.user.role
    const userId = session.user.id

    if (role !== 'SELLER' && role !== 'BOTH') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const body = await request.json()
    const { planType } = body

    if (!Object.values(SubscriptionPlan).includes(planType)) {
      return NextResponse.json({ error: 'Invalid plan type' }, { status: 400 })
    }

    const planPricing = {
      BASIC: 0,
      STANDARD: 5000,
      PREMIUM: 12000
    }

    const amount = planPricing[planType]

    // Check if user already has an active subscription
    const existingSubscription = await db.subscription.findFirst({
      where: {
        userId,
        status: 'ACTIVE',
        endDate: { gte: new Date() }
      }
    })

    const startDate = new Date()
    const endDate = new Date()
    endDate.setMonth(endDate.getMonth() + 1)

    if (existingSubscription) {
      // Upgrade existing subscription
      await db.subscription.update({
        where: { id: existingSubscription.id },
        data: {
          planType,
          amount,
          endDate
        }
      })
    } else {
      // Create new subscription
      await db.subscription.create({
        data: {
          userId,
          planType,
          startDate,
          endDate,
          status: 'ACTIVE',
          amount
        }
      })
    }

    // In a real implementation, you would integrate with a payment gateway here
    // For now, we'll just return success

    return NextResponse.json({ 
      message: 'Subscription upgraded successfully',
      planType,
      amount
    })
  } catch (error) {
    console.error('Error upgrading subscription:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}