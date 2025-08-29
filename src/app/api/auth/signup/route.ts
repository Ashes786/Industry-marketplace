import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { UserRole, SubscriptionPlan, SubscriptionStatus } from '@prisma/client'
import { sendEmail, generateWelcomeEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      email,
      phone,
      password,
      companyName,
      role
    } = body

    // Validate required fields
    if (!name || !email || !phone || !password || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Determine if user needs approval
    const needsApproval = role === 'SELLER' || role === 'BOTH'
    const isApproved = role === 'BUYER' // Buyers are auto-approved

    // Create user
    const user = await db.user.create({
      data: {
        name,
        email,
        phone,
        passwordHash: hashedPassword,
        companyName,
        roles: role as UserRole,
        country: 'Pakistan',
        isApproved
      }
    })

    // If user is a seller or both, automatically create STANDARD trial subscription
    if (role === 'SELLER' || role === 'BOTH') {
      // Get the STANDARD trial plan
      const standardPlan = await db.availablePlan.findFirst({
        where: { 
          name: 'STANDARD',
          isActive: true,
          isTrial: true
        }
      })

      if (standardPlan) {
        const startDate = new Date()
        const endDate = new Date()
        endDate.setDate(endDate.getDate() + standardPlan.trialDays || 30)

        await db.subscription.create({
          data: {
            userId: user.id,
            planId: standardPlan.id,
            planType: SubscriptionPlan.STANDARD,
            startDate,
            endDate,
            status: SubscriptionStatus.ACTIVE,
            amount: 0,
            isTrial: true
          }
        })
      }
    }

    // Create JWT token (simplified - in production use proper JWT library)
    const token = Buffer.from(JSON.stringify({
      userId: user.id,
      email: user.email,
      role: user.roles
    })).toString('base64')

    // Send welcome email
    try {
      await sendEmail({
        to: user.email,
        subject: 'Welcome to Industry Marketplace Pakistan!',
        html: generateWelcomeEmail(user.name, needsApproval)
      })
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError)
      // Don't fail the registration if email fails
    }

    return NextResponse.json({
      message: needsApproval 
        ? 'User created successfully. Your account is pending approval.' 
        : 'User created successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roles: user.roles,
        isApproved: user.isApproved
      },
      token,
      needsApproval
    })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}