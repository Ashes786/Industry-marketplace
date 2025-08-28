import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'SELLER' && session.user.role !== 'BOTH') {
      return NextResponse.json({ error: 'Only sellers can purchase extra listings' }, { status: 403 })
    }

    const body = await request.json()
    const { listingCount } = body

    if (!listingCount || listingCount <= 0) {
      return NextResponse.json({ error: 'Invalid listing count' }, { status: 400 })
    }

    const amount = listingCount * 300 // Rs. 300 per listing

    const extraListing = await db.extraListing.create({
      data: {
        sellerId: session.user.id,
        listingCount: parseInt(listingCount),
        amount: parseFloat(amount.toString()),
        status: 'active'
      }
    })

    return NextResponse.json(extraListing, { status: 201 })
  } catch (error) {
    console.error('Error purchasing extra listings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}