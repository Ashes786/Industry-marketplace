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

    const body = await request.json()
    const { rfqId, productId, amount, paymentMethod } = body

    if (!rfqId || !amount || !paymentMethod) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Calculate commission
    let commissionAmount: number
    if (amount <= 50000) {
      commissionAmount = 500 // Flat fee for transactions ≤ 50,000
    } else {
      commissionAmount = amount * 0.02 // 2% fee for transactions > 50,000
    }

    const productAmount = amount - commissionAmount

    // Get RFQ and product details
    const rfq = await db.rFQ.findUnique({
      where: { id: rfqId },
      include: { buyer: true }
    })

    const product = productId ? await db.product.findUnique({
      where: { id: productId },
      include: { seller: true }
    }) : null

    if (!rfq && !product) {
      return NextResponse.json({ error: 'Invalid RFQ or product' }, { status: 400 })
    }

    const buyerId = rfq?.buyerId || session.user.id
    const sellerId = product?.sellerId || session.user.id

    // Create transaction
    const transaction = await db.transaction.create({
      data: {
        rfqId: rfqId || null,
        productId: productId || null,
        buyerId,
        sellerId,
        totalAmount: amount,
        commissionAmount,
        productAmount,
        status: 'PENDING',
        paymentDate: new Date()
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
        rfq: rfq ? {
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
        } : false,
        product: product ? {
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
        } : false
      }
    })

    return NextResponse.json(transaction, { status: 201 })
  } catch (error) {
    console.error('Error processing payment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}