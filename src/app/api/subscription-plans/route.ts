import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get('activeOnly') === 'true'

    const where = activeOnly ? { isActive: true } : {}

    const plans = await db.availablePlan.findMany({
      where,
      orderBy: { price: 'asc' },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        duration: true,
        features: true,
        isActive: true,
        isTrial: true,
        trialDays: true,
        createdAt: true,
        updatedAt: true
      }
    })

    // Parse features JSON for each plan
    const plansWithParsedFeatures = plans.map(plan => ({
      ...plan,
      features: JSON.parse(plan.features)
    }))

    return NextResponse.json(plansWithParsedFeatures)
  } catch (error) {
    console.error('Error fetching subscription plans:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      description,
      price,
      duration,
      features,
      isActive = true,
      isTrial = false,
      trialDays
    } = body

    // Validate required fields
    if (!name || !price || !duration || !features) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate features is an array
    if (!Array.isArray(features)) {
      return NextResponse.json(
        { error: 'Features must be an array' },
        { status: 400 }
      )
    }

    // If trial, trialDays is required
    if (isTrial && !trialDays) {
      return NextResponse.json(
        { error: 'trialDays is required for trial plans' },
        { status: 400 }
      )
    }

    const plan = await db.availablePlan.create({
      data: {
        name,
        description,
        price,
        duration,
        features: JSON.stringify(features),
        isActive,
        isTrial,
        trialDays
      }
    })

    // Parse features for response
    const planWithParsedFeatures = {
      ...plan,
      features: JSON.parse(plan.features)
    }

    return NextResponse.json({
      message: 'Subscription plan created successfully',
      plan: planWithParsedFeatures
    })
  } catch (error) {
    console.error('Error creating subscription plan:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}