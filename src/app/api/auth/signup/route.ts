import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { UserRole, SubscriptionPlan } from '@prisma/client'
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
      role,
      sellerPlan
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

    // Create user
    const user = await db.user.create({
      data: {
        name,
        email,
        phone,
        passwordHash: hashedPassword,
        companyName,
        roles: role as UserRole,
        country: 'Pakistan'
      }
    })

    // If user is a seller or both, create subscription
    if (role === 'SELLER' || role === 'BOTH') {
      const subscriptionData = {
        BASIC: { amount: 0, duration: 365 }, // 1 year free for basic
        STANDARD: { amount: 5000, duration: 30 }, // 1 month
        PREMIUM: { amount: 12000, duration: 30 } // 1 month
      }

      const plan = subscriptionData[sellerPlan as keyof typeof subscriptionData]
      const startDate = new Date()
      const endDate = new Date()
      endDate.setDate(endDate.getDate() + plan.duration)

      await db.subscription.create({
        data: {
          userId: user.id,
          planType: sellerPlan as SubscriptionPlan,
          startDate,
          endDate,
          status: 'ACTIVE',
          amount: plan.amount
        }
      })
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
        html: generateWelcomeEmail(user.name)
      })
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError)
      // Don't fail the registration if email fails
    }

    return NextResponse.json({
      message: 'User created successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roles: user.roles
      },
      token
    })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}