import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { TransactionStatus } from '@prisma/client'

function calculateCommission(productPrice: number): number {
  // Commission calculation: Rs. 500 for ≤50k, 2% for >50k
  if (productPrice <= 50000) {
    return 500
  } else {
    return productPrice * 0.02
  }
}

function generateInvoiceNumber(): string {
  const timestamp = Date.now().toString()
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `INV-${timestamp}-${random}`
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const type = searchParams.get('type') // 'buyer' or 'seller'

    let where: any = {}

    if (type === 'buyer') {
      where.buyerId = userId
    } else if (type === 'seller') {
      where.sellerId = userId
    } else {
      // Show all transactions for the user
      where.OR = [
        { buyerId: userId },
        { sellerId: userId }
      ]
    }

    const [transactions, total] = await Promise.all([
      db.transaction.findMany({
        where,
        include: {
          buyer: {
            select: { id: true, name: true, email: true }
          },
          seller: {
            select: { id: true, name: true, email: true }
          },
          rfq: {
            select: { id: true, title: true }
          },
          product: {
            select: { id: true, title: true }
          },
          invoice: {
            select: { id: true, invoiceNumber, pdfUrl }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      db.transaction.count({ where })
    ])

    return NextResponse.json({
      transactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const role = session.user.role

    if (role !== 'BUYER' && role !== 'BOTH') {
      return NextResponse.json({ error: 'Only buyers can create transactions' }, { status: 403 })
    }

    const body = await request.json()
    const { rfqId, productId, sellerId, productPrice, quantity } = body

    if (!sellerId || !productPrice || !quantity) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Calculate total amount and commission
    const totalPrice = productPrice * quantity
    const commissionAmount = calculateCommission(totalPrice)
    const totalAmount = totalPrice + commissionAmount

    // Generate invoice number
    const invoiceNumber = generateInvoiceNumber()

    // Create transaction
    const transaction = await db.transaction.create({
      data: {
        rfqId,
        productId,
        buyerId: userId,
        sellerId,
        productPrice: totalPrice,
        commissionAmount,
        totalAmount,
        status: TransactionStatus.PENDING,
        invoiceNumber
      },
      include: {
        buyer: {
          select: { id: true, name: true, email: true }
        },
        seller: {
          select: { id: true, name: true, email: true }
        },
        rfq: {
          select: { id: true, title: true }
        },
        product: {
          select: { id: true, title: true }
        }
      }
    })

    // Create invoice record
    await db.invoice.create({
      data: {
        transactionId: transaction.id,
        invoiceNumber
      }
    })

    // Update RFQ status if applicable
    if (rfqId) {
      await db.rFQ.update({
        where: { id: rfqId },
        data: { status: 'APPROVED' }
      })
    }

    return NextResponse.json(transaction, { status: 201 })
  } catch (error) {
    console.error('Error creating transaction:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}