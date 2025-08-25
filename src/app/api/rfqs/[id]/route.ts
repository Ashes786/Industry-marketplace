import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const rfqId = params.id
    const userId = session.user.id
    const role = session.user.role

    // Check if user has access to this RFQ
    const rfq = await db.rFQ.findFirst({
      where: {
        id: rfqId,
        OR: [
          { buyerId: userId },
          { sellerId: userId }
        ]
      },
      include: {
        buyer: {
          select: { id: true, name: true, email: true }
        },
        seller: {
          select: { id: true, name: true, email: true }
        },
        chats: {
          include: {
            sender: {
              select: { id: true, name: true }
            },
            receiver: {
              select: { id: true, name: true }
            }
          },
          orderBy: { timestamp: 'desc' },
          take: 1
        }
      }
    })

    if (!rfq) {
      return NextResponse.json({ error: 'RFQ not found or access denied' }, { status: 404 })
    }

    return NextResponse.json(rfq)
  } catch (error) {
    console.error('Error fetching RFQ:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}