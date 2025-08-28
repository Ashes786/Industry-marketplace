import { NextRequest, NextResponse } from 'next/server'
import { handleSubscriptionExpiry } from '@/lib/subscription-service'

export async function POST(request: NextRequest) {
  try {
    const result = await handleSubscriptionExpiry()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in subscription expiry check:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}