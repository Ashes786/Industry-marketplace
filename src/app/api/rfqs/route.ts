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

    const rfqs = await db.rFQ.findMany({
      where: {
        buyerId: session.user.id
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
        _count: {
          select: {
            chats: true,
            products: true,
            transactions: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(rfqs)
  } catch (error) {
    console.error('Error fetching RFQs:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'BUYER' && session.user.role !== 'BOTH') {
      return NextResponse.json({ error: 'Only buyers can create RFQs' }, { status: 403 })
    }

    const body = await request.json()
    const { title, description, category, budget, quantity, unit, deadline } = body

    if (!title || !description || !category || !quantity || !unit) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const rfq = await db.rFQ.create({
      data: {
        buyerId: session.user.id,
        title,
        description,
        category,
        budget: budget ? parseFloat(budget) : null,
        quantity: parseInt(quantity),
        unit,
        deadline: deadline ? new Date(deadline) : null,
        status: 'OPEN'
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

    return NextResponse.json(rfq, { status: 201 })
  } catch (error) {
    console.error('Error creating RFQ:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}