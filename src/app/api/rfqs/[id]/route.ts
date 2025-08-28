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

    const rfq = await db.rFQ.findUnique({
      where: {
        id: params.id
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
        products: {
          include: {
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
          }
        },
        chats: {
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                email: true,
                companyName: true
              }
            },
            receiver: {
              select: {
                id: true,
                name: true,
                email: true,
                companyName: true
              }
            }
          },
          orderBy: {
            timestamp: 'asc'
          }
        }
      }
    })

    if (!rfq) {
      return NextResponse.json({ error: 'RFQ not found' }, { status: 404 })
    }

    // Check if user is involved in this RFQ (buyer or seller who responded)
    const isBuyer = rfq.buyerId === session.user.id
    const isSeller = rfq.chats.some(chat => 
      chat.senderId === session.user.id || chat.receiverId === session.user.id
    )

    if (!isBuyer && !isSeller && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    return NextResponse.json(rfq)
  } catch (error) {
    console.error('Error fetching RFQ:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}