import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sellerId, listingCount, amount } = body

    if (!sellerId || !listingCount || !amount) {
      return NextResponse.json(
        { error: 'Seller ID, listing count, and amount are required' },
        { status: 400 }
      )
    }

    // Create extra listing purchase
    const extraListing = await db.extraListing.create({
      data: {
        sellerId,
        listingCount,
        amount,
        status: 'active'
      }
    })

    return NextResponse.json({
      message: 'Extra listings purchased successfully',
      extraListing: {
        id: extraListing.id,
        listingCount: extraListing.listingCount,
        amount: extraListing.amount,
        status: extraListing.status,
        createdAt: extraListing.createdAt
      }
    })

  } catch (error) {
    console.error('Error purchasing extra listings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sellerId = searchParams.get('sellerId')

    if (!sellerId) {
      return NextResponse.json(
        { error: 'Seller ID is required' },
        { status: 400 }
      )
    }

    // Get seller's extra listings
    const extraListings = await db.extraListing.findMany({
      where: {
        sellerId: sellerId,
        status: 'active'
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Calculate total available extra listings
    const totalAvailable = extraListings.reduce((sum, listing) => sum + listing.listingCount, 0)

    return NextResponse.json({
      extraListings,
      totalAvailable
    })

  } catch (error) {
    console.error('Error fetching extra listings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}