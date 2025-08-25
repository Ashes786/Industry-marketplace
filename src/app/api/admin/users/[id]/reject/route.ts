import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = params.id

    // Get user details before deletion for logging
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Delete user and all related data
    await db.user.delete({
      where: { id: userId }
    })

    // Log admin action
    await db.adminLog.create({
      data: {
        adminId: session.user.id,
        action: 'REJECT_USER',
        targetUserId: userId,
        details: `Rejected and deleted user: ${user.email}`
      }
    })

    return NextResponse.json({ message: 'User rejected and deleted successfully' })
  } catch (error) {
    console.error('Error rejecting user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}