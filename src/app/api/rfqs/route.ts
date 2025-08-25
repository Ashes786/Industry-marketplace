import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { RFQStatus } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const role = session.user.role
    const userId = session.user.id

    let rfqs

    if (role === 'BUYER' || role === 'BOTH') {
      // Get RFQs where user is buyer
      rfqs = await db.rFQ.findMany({
        where: { buyerId: userId },
        include: {
          buyer: {
            select: { id: true, name: true, email: true }
          },
          seller: {
            select: { id: true, name: true, email: true }
          },
          chats: {
            orderBy: { timestamp: 'desc' },
            take: 1
          }
        },
        orderBy: { createdAt: 'desc' }
      })
    } else {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

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

    const role = session.user.role
    const userId = session.user.id

    if (role !== 'BUYER' && role !== 'BOTH') {
      return NextResponse.json({ error: 'Only buyers can create RFQs' }, { status: 403 })
    }

    const body = await request.json()
    const { title, description, category, quantity, unit, budget, deadline } = body

    if (!title || !description || !category || !quantity || !unit) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const rfq = await db.rFQ.create({
      data: {
        buyerId: userId,
        title,
        description,
        category,
        quantity: parseInt(quantity),
        unit,
        budget: budget ? parseFloat(budget) : null,
        deadline: deadline ? new Date(deadline) : null,
        status: RFQStatus.OPEN
      },
      include: {
        buyer: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    return NextResponse.json(rfq, { status: 201 })
  } catch (error) {
    console.error('Error creating RFQ:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}