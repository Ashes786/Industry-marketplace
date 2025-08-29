import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { sendEmail, generateApprovalEmail } from '@/lib/email'
import { UserRole, SubscriptionPlan, SubscriptionStatus } from '@prisma/client'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = params.id

    // Get user details first
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        subscriptions: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Only approve users that need approval (SELLER and BOTH roles)
    if (user.roles === UserRole.BUYER) {
      return NextResponse.json({ error: 'Buyer users do not need approval' }, { status: 400 })
    }

    // Approve user
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { isApproved: true },
      select: {
        id: true,
        email: true,
        name: true,
        roles: true,
        isApproved: true
      }
    })

    // Create subscription for seller if they don't have one
    if ((user.roles === UserRole.SELLER || user.roles === UserRole.BOTH) && user.subscriptions.length === 0) {
      // Get the STANDARD trial plan
      const standardPlan = await db.availablePlan.findFirst({
        where: { 
          name: 'STANDARD',
          isActive: true,
          isTrial: true
        }
      })

      if (standardPlan) {
        await db.subscription.create({
          data: {
            userId: user.id,
            planId: standardPlan.id,
            planType: SubscriptionPlan.STANDARD,
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days trial
            status: SubscriptionStatus.ACTIVE,
            amount: 0,
            isTrial: true,
          }
        })
      }
    }

    // Log admin action
    await db.adminLog.create({
      data: {
        adminId: session.user.id,
        action: 'APPROVE_USER',
        targetUserId: userId,
        details: `Approved user: ${user.email} (${user.roles})`
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

    return NextResponse.json({ message: 'User approved successfully', user: updatedUser })
  } catch (error) {
    console.error('Error approving user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}