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

    if (session.user.role !== 'SELLER' && session.user.role !== 'BOTH') {
      return NextResponse.json({ error: 'Only sellers can view products' }, { status: 403 })
    }

    const products = await db.product.findMany({
      where: {
        sellerId: session.user.id
      },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            companyName: true,
            isApproved: true
          }
        },
        _count: {
          select: {
            transactions: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}