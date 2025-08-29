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

    // For seller or both roles, sellerPlan is required
    if ((role === 'SELLER' || role === 'BOTH') && !sellerPlan) {
      return NextResponse.json(
        { error: 'sellerPlan is required for seller accounts' },
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

    // If user is a seller or both, create subscription
    if (role === 'SELLER' || role === 'BOTH') {
      // Get the selected plan from available plans
      const availablePlan = await db.availablePlan.findFirst({
        where: { 
          name: sellerPlan,
          isActive: true
        }
      })

      if (!availablePlan) {
        return NextResponse.json(
          { error: 'Invalid subscription plan selected' },
          { status: 400 }
        )
      }

      const startDate = new Date()
      const endDate = new Date()
      endDate.setDate(endDate.getDate() + availablePlan.duration)

      await db.subscription.create({
        data: {
          userId: user.id,
          planId: availablePlan.id,
          planType: sellerPlan as SubscriptionPlan,
          startDate,
          endDate,
          status: SubscriptionStatus.ACTIVE,
          amount: availablePlan.isTrial ? 0 : availablePlan.price,
          isTrial: availablePlan.isTrial
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