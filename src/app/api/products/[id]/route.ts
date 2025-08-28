import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const product = await db.product.findUnique({
      where: {
        id: params.id
      }
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    if (product.sellerId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const updatedProduct = await db.product.update({
      where: {
        id: params.id
      },
      data: {
        isActive: !product.isActive
      }
    })

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error('Error toggling product status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}