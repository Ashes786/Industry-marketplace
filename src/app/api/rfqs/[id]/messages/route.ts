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
      select: {
        buyerId: true
      }
    })

    if (!rfq) {
      return NextResponse.json({ error: 'RFQ not found' }, { status: 404 })
    }

    // Check if user is involved in this RFQ
    const isBuyer = rfq.buyerId === session.user.id
    const hasChats = await db.chat.findFirst({
      where: {
        rfqId: params.id,
        OR: [
          { senderId: session.user.id },
          { receiverId: session.user.id }
        ]
      }
    })

    if (!isBuyer && !hasChats && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const messages = await db.chat.findMany({
      where: {
        rfqId: params.id
      },
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
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
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
        }
      }
    })

    if (!rfq) {
      return NextResponse.json({ error: 'RFQ not found' }, { status: 404 })
    }

    const body = await request.json()
    const { message, messageType = 'text' } = body

    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Determine receiver
    let receiverId: string
    if (session.user.id === rfq.buyerId) {
      // If sender is buyer, find a seller who has responded to this RFQ
      const existingChat = await db.chat.findFirst({
        where: {
          rfqId: params.id,
          senderId: { not: session.user.id }
        },
        select: {
          senderId: true
        }
      })

      if (!existingChat) {
        return NextResponse.json({ error: 'No sellers have responded yet' }, { status: 400 })
      }
      receiverId = existingChat.senderId
    } else {
      // If sender is seller, receiver is buyer
      receiverId = rfq.buyerId
    }

    const chat = await db.chat.create({
      data: {
        rfqId: params.id,
        senderId: session.user.id,
        receiverId: receiverId,
        message: message.trim(),
        messageType,
        timestamp: new Date(),
        isRead: false
      },
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
      }
    })

    return NextResponse.json(chat, { status: 201 })
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}