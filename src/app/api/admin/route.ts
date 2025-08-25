import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'users', 'subscriptions', 'transactions', 'analytics'

    switch (type) {
      case 'users':
        return await getUsers(request)
      case 'subscriptions':
        return await getSubscriptions(request)
      case 'transactions':
        return await getTransactions(request)
      case 'analytics':
        return await getAnalytics()
      default:
        return NextResponse.json(
          { error: 'Invalid type parameter' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Admin API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, userId, subscriptionId, transactionId } = body

    switch (action) {
      case 'approve_user':
        return await approveUser(userId)
      case 'reject_user':
        return await rejectUser(userId)
      case 'update_subscription':
        return await updateSubscription(subscriptionId, body)
      case 'update_transaction':
        return await updateTransaction(transactionId, body)
      default:
        return NextResponse.json(
          { error: 'Invalid action parameter' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Admin API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function getUsers(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search') || ''
  const role = searchParams.get('role')
  const status = searchParams.get('status') // 'approved', 'pending', 'all'

  const whereClause: any = {}
  
  if (search) {
    whereClause.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { companyName: { contains: search, mode: 'insensitive' } }
    ]
  }

  if (role && role !== 'all') {
    whereClause.roles = role
  }

  if (status === 'approved') {
    whereClause.isApproved = true
  } else if (status === 'pending') {
    whereClause.isApproved = false
  }

  const users = await db.user.findMany({
    where: whereClause,
    include: {
      subscriptions: {
        where: { status: 'ACTIVE' },
        orderBy: { createdAt: 'desc' },
        take: 1
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return NextResponse.json({ users })
}

async function getSubscriptions(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const plan = searchParams.get('plan') // 'basic', 'standard', 'premium', 'all'
  const status = searchParams.get('status') // 'active', 'expired', 'cancelled', 'all'

  const whereClause: any = {}

  if (plan && plan !== 'all') {
    whereClause.planType = plan.toUpperCase()
  }

  if (status && status !== 'all') {
    whereClause.status = status.toUpperCase()
  }

  const subscriptions = await db.subscription.findMany({
    where: whereClause,
    include: {
      user: {
        select: { id: true, name: true, email: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return NextResponse.json({ subscriptions })
}

async function getTransactions(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status') // 'pending', 'paid', 'completed', 'failed', 'all'
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')

  const whereClause: any = {}

  if (status && status !== 'all') {
    whereClause.status = status.toUpperCase()
  }

  if (startDate && endDate) {
    whereClause.createdAt = {
      gte: new Date(startDate),
      lte: new Date(endDate)
    }
  }

  const transactions = await db.transaction.findMany({
    where: whereClause,
    include: {
      buyer: {
        select: { id: true, name: true, email: true }
      },
      seller: {
        select: { id: true, name: true, email: true }
      },
      rfq: {
        select: { id: true, title: true }
      },
      product: {
        select: { id: true, title: true }
      },
      invoice: {
        select: { id: true, invoiceNumber, pdfUrl: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return NextResponse.json({ transactions })
}

async function getAnalytics() {
  // Get user statistics
  const totalUsers = await db.user.count()
  const activeUsers = await db.user.count({
    where: { isApproved: true }
  })
  const totalSellers = await db.user.count({
    where: { 
      isApproved: true,
      OR: [
        { roles: 'SELLER' },
        { roles: 'BOTH' }
      ]
    }
  })
  const totalBuyers = await db.user.count({
    where: { 
      isApproved: true,
      OR: [
        { roles: 'BUYER' },
        { roles: 'BOTH' }
      ]
    }
  })

  // Get subscription statistics
  const activeSubscriptions = await db.subscription.count({
    where: { status: 'ACTIVE' }
  })

  // Get transaction statistics
  const totalTransactions = await db.transaction.count()
  const completedTransactions = await db.transaction.count({
    where: { status: 'COMPLETED' }
  })

  // Calculate revenue
  const transactions = await db.transaction.findMany({
    where: { status: 'COMPLETED' },
    select: { totalAmount: true, commissionAmount: true, createdAt: true }
  })

  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  const monthlyTransactions = transactions.filter(t => 
    new Date(t.createdAt).getMonth() === currentMonth && 
    new Date(t.createdAt).getFullYear() === currentYear
  )

  const monthlyRevenue = monthlyTransactions.reduce((sum, t) => sum + t.totalAmount, 0)
  const totalRevenue = transactions.reduce((sum, t) => sum + t.totalAmount, 0)
  const commissionRevenue = transactions.reduce((sum, t) => sum + t.commissionAmount, 0)

  // Get pending approvals
  const pendingApprovals = await db.user.count({
    where: { isApproved: false }
  })

  // Get recent activity (last 7 days)
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const recentUsers = await db.user.count({
    where: { createdAt: { gte: sevenDaysAgo } }
  })

  const recentTransactions = await db.transaction.count({
    where: { createdAt: { gte: sevenDaysAgo } }
  })

  return NextResponse.json({
    analytics: {
      totalUsers,
      activeUsers,
      totalSellers,
      totalBuyers,
      activeSubscriptions,
      totalTransactions,
      completedTransactions,
      monthlyRevenue,
      totalRevenue,
      commissionRevenue,
      pendingApprovals,
      recentActivity: {
        newUsers: recentUsers,
        newTransactions: recentTransactions
      }
    }
  })
}

async function approveUser(userId: string) {
  const user = await db.user.update({
    where: { id: userId },
    data: { isApproved: true }
  })

  // Log the action
  await db.adminLog.create({
    data: {
      adminId: 'system', // In real implementation, get from auth context
      action: 'APPROVE_USER',
      targetUserId: userId,
      details: `User ${user.name} (${user.email}) was approved`
    }
  })

  return NextResponse.json({ 
    message: 'User approved successfully',
    user: { id: user.id, name: user.name, email: user.email, isApproved: user.isApproved }
  })
}

async function rejectUser(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId }
  })

  if (!user) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    )
  }

  await db.user.delete({
    where: { id: userId }
  })

  // Log the action
  await db.adminLog.create({
    data: {
      adminId: 'system', // In real implementation, get from auth context
      action: 'REJECT_USER',
      targetUserId: userId,
      details: `User ${user.name} (${user.email}) was rejected and deleted`
    }
  })

  return NextResponse.json({ 
    message: 'User rejected and deleted successfully',
    user: { id: user.id, name: user.name, email: user.email }
  })
}

async function updateSubscription(subscriptionId: string, data: any) {
  const { planType, status, endDate } = data

  const subscription = await db.subscription.update({
    where: { id: subscriptionId },
    data: {
      ...(planType && { planType: planType.toUpperCase() }),
      ...(status && { status: status.toUpperCase() }),
      ...(endDate && { endDate: new Date(endDate) })
    },
    include: {
      user: {
        select: { id: true, name: true, email: true }
      }
    }
  })

  // Log the action
  await db.adminLog.create({
    data: {
      adminId: 'system', // In real implementation, get from auth context
      action: 'UPDATE_SUBSCRIPTION',
      targetUserId: subscription.userId,
      details: `Subscription updated for user ${subscription.user.name}: ${planType || status}`
    }
  })

  return NextResponse.json({ 
    message: 'Subscription updated successfully',
    subscription
  })
}

async function updateTransaction(transactionId: string, data: any) {
  const { status, notes } = data

  const transaction = await db.transaction.update({
    where: { id: transactionId },
    data: {
      ...(status && { status: status.toUpperCase() }),
      ...(notes && { notes }),
      ...(status === 'COMPLETED' && { paymentDate: new Date() })
    },
    include: {
      buyer: {
        select: { id: true, name: true, email: true }
      },
      seller: {
        select: { id: true, name: true, email: true }
      }
    }
  })

  // Log the action
  await db.adminLog.create({
    data: {
      adminId: 'system', // In real implementation, get from auth context
      action: 'UPDATE_TRANSACTION',
      targetUserId: transaction.buyerId,
      details: `Transaction ${transaction.id} status updated to ${status}`
    }
  })

  return NextResponse.json({ 
    message: 'Transaction updated successfully',
    transaction
  })
}