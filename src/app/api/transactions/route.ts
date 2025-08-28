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

    const transactions = await db.transaction.findMany({
      where: {
        OR: [
          { buyerId: session.user.id },
          { sellerId: session.user.id }
        ]
      },
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
            companyName: true
          }
        },
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            companyName: true
          }
        },
        rfq: {
          include: {
            buyer: {
              select: {
                id: true,
                name: true,
                email: true,
                companyName: true
              }
            }
          }
        },
        product: {
          include: {
            seller: {
              select: {
                id: true,
                name: true,
                email: true,
                companyName: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(transactions)
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}