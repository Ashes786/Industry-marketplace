import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { UserRole } from '@prisma/client'
import { z } from 'zod'

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['BUYER', 'SELLER', 'BOTH']),
  plan: z.enum(['BASIC', 'STANDARD', 'PREMIUM']).optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, password, role, plan } = signupSchema.parse(body)

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
    const passwordHash = await bcrypt.hash(password, 12)

    // Create user
    const user = await db.user.create({
      data: {
        name,
        email,
        phone,
        passwordHash,
        role: role as UserRole,
        isApproved: false // Admin approval required
      }
    })

    // If user is a seller or both, create subscription if plan is provided
    if ((role === 'SELLER' || role === 'BOTH') && plan) {
      const planPricing = {
        BASIC: 0,
        STANDARD: 5000,
        PREMIUM: 12000
      }

      const startDate = new Date()
      const endDate = new Date()
      endDate.setMonth(endDate.getMonth() + 1)

      await db.subscription.create({
        data: {
          userId: user.id,
          planType: plan,
          startDate,
          endDate,
          status: 'ACTIVE',
          amount: planPricing[plan]
        }
      })
    }

    return NextResponse.json({
      message: 'User created successfully. Please wait for admin approval.',
      userId: user.id
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}