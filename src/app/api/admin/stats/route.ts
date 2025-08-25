import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get total users count
    const totalUsers = await db.user.count()

    // Get pending approvals count
    const pendingApprovals = await db.user.count({
      where: { isApproved: false }
    })

    // Get active subscriptions count
    const activeSubscriptions = await db.subscription.count({
      where: { 
        status: 'ACTIVE',
        endDate: { gte: new Date() }
      }
    })

    // Get total transactions count
    const totalTransactions = await db.transaction.count()

    // Get total revenue (sum of all commissions)
    const totalRevenueResult = await db.transaction.aggregate({
      _sum: { commissionAmount: true },
      where: { status: 'COMPLETED' }
    })
    const totalRevenue = totalRevenueResult._sum.commissionAmount || 0

    // Get monthly revenue
    const currentMonth = new Date()
    currentMonth.setDate(1)
    currentMonth.setHours(0, 0, 0, 0)

    const monthlyRevenueResult = await db.transaction.aggregate({
      _sum: { commissionAmount: true },
      where: {
        status: 'COMPLETED',
        createdAt: { gte: currentMonth }
      }
    })
    const monthlyRevenue = monthlyRevenueResult._sum.commissionAmount || 0

    // Get user growth data (last 6 months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const userGrowth = await db.user.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: { gte: sixMonthsAgo }
      },
      _count: { id: true },
      orderBy: { createdAt: 'asc' }
    })

    // Get transaction trends (last 6 months)
    const transactionTrends = await db.transaction.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: { gte: sixMonthsAgo },
        status: 'COMPLETED'
      },
      _count: { id: true },
      _sum: { commissionAmount: true },
      orderBy: { createdAt: 'asc' }
    })

    // Get subscription distribution
    const subscriptionDistribution = await db.subscription.groupBy({
      by: ['planType'],
      where: { status: 'ACTIVE' },
      _count: { id: true }
    })

    // Get top sellers by revenue
    const topSellers = await db.user.findMany({
      where: { role: { in: ['SELLER', 'BOTH'] } },
      include: {
        sellerTransactions: {
          where: { status: 'COMPLETED' },
          select: { productPrice: true }
        }
      },
      orderBy: {
        sellerTransactions: {
          _sum: { productPrice: 'desc' }
        }
      },
      take: 10
    })

    // Get top buyers by spending
    const topBuyers = await db.user.findMany({
      where: { role: { in: ['BUYER', 'BOTH'] } },
      include: {
        buyerTransactions: {
          where: { status: 'COMPLETED' },
          select: { totalAmount: true }
        }
      },
      orderBy: {
        buyerTransactions: {
          _sum: { totalAmount: 'desc' }
        }
      },
      take: 10
    })

    return NextResponse.json({
      totalUsers,
      pendingApprovals,
      activeSubscriptions,
      totalTransactions,
      totalRevenue,
      monthlyRevenue,
      userGrowth,
      transactionTrends,
      subscriptionDistribution,
      topSellers: topSellers.map(seller => ({
        id: seller.id,
        name: seller.name || seller.email,
        email: seller.email,
        totalRevenue: seller.sellerTransactions.reduce((sum, t) => sum + t.productPrice, 0)
      })),
      topBuyers: topBuyers.map(buyer => ({
        id: buyer.id,
        name: buyer.name || buyer.email,
        email: buyer.email,
        totalSpent: buyer.buyerTransactions.reduce((sum, t) => sum + t.totalAmount, 0)
      }))
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}