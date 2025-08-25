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

    const count = await db.product.count({
      where: { 
        sellerId: userId,
        isActive: true 
      }
    })

    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error fetching product count:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}