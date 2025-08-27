import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { sendEmail, generateApprovalEmail } from '@/lib/email'

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

    // Approve user
    const user = await db.user.update({
      where: { id: userId },
      data: { isApproved: true },
      select: {
        id: true,
        email: true,
        name: true,
        isApproved: true
      }
    })

    // Log admin action
    await db.adminLog.create({
      data: {
        adminId: session.user.id,
        action: 'APPROVE_USER',
        targetUserId: userId,
        details: `Approved user: ${user.email}`
      }
    })

    // Send approval email
    try {
      await sendEmail({
        to: user.email,
        subject: 'Your Account Has Been Approved - Industry Marketplace Pakistan',
        html: generateApprovalEmail(user.name)
      })
    } catch (emailError) {
      console.error('Failed to send approval email:', emailError)
      // Don't fail the approval if email fails
    }

    return NextResponse.json({ message: 'User approved successfully', user })
  } catch (error) {
    console.error('Error approving user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}