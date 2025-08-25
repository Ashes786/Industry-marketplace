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

    const role = session.user.role
    const userId = session.user.id

    if (role !== 'SELLER' && role !== 'BOTH') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const subscription = await db.subscription.findFirst({
      where: {
        userId,
        endDate: { gte: new Date() }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(subscription)
  } catch (error) {
    console.error('Error fetching subscription:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}