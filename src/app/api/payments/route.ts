import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { rfqId, productId, buyerId, sellerId, productAmount } = body

    // Validate required fields
    if (!buyerId || !sellerId || !productAmount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Calculate commission based on the specified rules
    let commissionAmount: number
    if (productAmount <= 50000) {
      commissionAmount = 500
    } else {
      commissionAmount = productAmount * 0.02 // 2% for amounts > 50k
    }

    const totalAmount = productAmount + commissionAmount

    // Create transaction record
    const transaction = await db.transaction.create({
      data: {
        rfqId: rfqId || null,
        productId: productId || null,
        buyerId,
        sellerId,
        totalAmount,
        commissionAmount,
        productAmount,
        status: 'PENDING'
      }
    })

    // Generate invoice number
    const invoiceNumber = `INV-${Date.now()}-${transaction.id.slice(-6)}`

    // Create invoice record
    const invoice = await db.invoice.create({
      data: {
        transactionId: transaction.id,
        invoiceNumber
      }
    })

    return NextResponse.json({
      message: 'Payment calculation completed',
      transaction: {
        id: transaction.id,
        totalAmount,
        commissionAmount,
        productAmount,
        status: transaction.status,
        invoiceNumber
      },
      commissionBreakdown: {
        productAmount,
        commissionRate: productAmount <= 50000 ? 'Fixed Rs. 500' : '2%',
        commissionAmount,
        totalAmount
      }
    })

  } catch (error) {
    console.error('Payment calculation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const userType = searchParams.get('userType') // 'buyer' or 'seller'

    if (!userId || !userType) {
      return NextResponse.json(
        { error: 'Missing userId or userType' },
        { status: 400 }
      )
    }

    // Get transactions based on user type
    const transactions = await db.transaction.findMany({
      where: userType === 'buyer' ? { buyerId: userId } : { sellerId: userId },
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
          select: { id: true, invoiceNumber, pdfUrl: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Calculate statistics
    const stats = {
      totalTransactions: transactions.length,
      completedTransactions: transactions.filter(t => t.status === 'COMPLETED').length,
      totalRevenue: userType === 'seller' 
        ? transactions.reduce((sum, t) => sum + (t.status === 'COMPLETED' ? t.productAmount : 0), 0)
        : transactions.reduce((sum, t) => sum + (t.status === 'COMPLETED' ? t.totalAmount : 0), 0),
      totalCommission: transactions.reduce((sum, t) => sum + (t.status === 'COMPLETED' ? t.commissionAmount : 0), 0),
      pendingTransactions: transactions.filter(t => t.status === 'PENDING').length
    }

    return NextResponse.json({
      transactions,
      stats
    })

  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}