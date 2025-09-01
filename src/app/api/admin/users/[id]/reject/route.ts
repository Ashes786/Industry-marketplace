import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { db } from '@/lib/db'
import { UserRole } from '@prisma/client'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminUser = await requireAdmin(request)
    
    const { id: userId } = await params

    // Get user details before deletion for logging
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true, roles: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Only reject users that need approval (SELLER and BOTH roles)
    if (user.roles === UserRole.BUYER) {
      return NextResponse.json({ error: 'Buyer users do not need approval' }, { status: 400 })
    }

    // Delete user and all related data
    await db.user.delete({
      where: { id: userId }
    })

    // Log admin action
    await db.adminLog.create({
      data: {
        adminId: adminUser.id,
        action: 'REJECT_USER',
        targetUserId: userId,
        details: `Rejected and deleted user: ${user.email} (${user.roles})`
      }
    })

    return NextResponse.json({ message: 'User rejected and deleted successfully' })
  } catch (error) {
    console.error('Error rejecting user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}