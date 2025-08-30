import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { UserRole } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    // For now, skip authentication to test the data fetching
    // TODO: Add proper authentication later

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const status = searchParams.get('status') // 'pending', 'paid', 'completed', 'failed', 'all'

    let where: any = {}

    if (status && status !== 'all') {
      where.status = status.toUpperCase()
    }

    const transactions = await db.transaction.findMany({
      where,
      include: {
        buyer: {
          select: { name: true, email: true }
        },
        seller: {
          select: { name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    })

    const total = await db.transaction.count({ where })

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