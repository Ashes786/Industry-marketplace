import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { UserRole } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    // For now, skip authentication to test the data fetching
    // TODO: Add proper authentication later

    // Get total users count by role
    const [totalUsers, buyers, sellers, bothUsers] = await Promise.all([
      db.user.count(),
      db.user.count({ where: { roles: UserRole.BUYER } }),
      db.user.count({ where: { roles: UserRole.SELLER } }),
      db.user.count({ where: { roles: UserRole.BOTH } })
    ])

    // Get pending approvals count (only sellers and both roles that need approval)
    const pendingApprovals = await db.user.count({
      where: { 
        isApproved: false,
        roles: {
          in: [UserRole.SELLER, UserRole.BOTH]
        }
      }
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

    // Get user growth data (last 6 months) - simplified
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

    // Get transaction trends (last 6 months) - simplified
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
      where: { 
        roles: { 
          in: [UserRole.SELLER, UserRole.BOTH] 
        },
        isApproved: true
      },
      include: {
        sellerTransactions: {
          where: { status: 'COMPLETED' },
          select: { productAmount: true }
        }
      },
      take: 10
    })

    // Calculate seller revenue
    const topSellersWithRevenue = topSellers.map(seller => ({
      id: seller.id,
      name: seller.name || seller.email,
      email: seller.email,
      companyName: seller.companyName,
      totalRevenue: seller.sellerTransactions.reduce((sum, t) => sum + (t.productAmount || 0), 0),
      transactionCount: seller.sellerTransactions.length
    })).sort((a, b) => b.totalRevenue - a.totalRevenue)

    // Get top buyers by spending
    const topBuyers = await db.user.findMany({
      where: { 
        roles: { 
          in: [UserRole.BUYER, UserRole.BOTH] 
        },
        isApproved: true
      },
      include: {
        buyerTransactions: {
          where: { status: 'COMPLETED' },
          select: { totalAmount: true }
        }
      },
      take: 10
    })

    // Calculate buyer spending
    const topBuyersWithSpending = topBuyers.map(buyer => ({
      id: buyer.id,
      name: buyer.name || buyer.email,
      email: buyer.email,
      companyName: buyer.companyName,
      totalSpent: buyer.buyerTransactions.reduce((sum, t) => sum + (t.totalAmount || 0), 0),
      transactionCount: buyer.buyerTransactions.length
    })).sort((a, b) => b.totalSpent - a.totalSpent)

    // Get active subscription plans count
    const activePlans = await db.availablePlan.count({
      where: { isActive: true }
    })

    // Get trial subscriptions count
    const trialSubscriptions = await db.subscription.count({
      where: { 
        isTrial: true,
        status: 'ACTIVE'
      }
    })

    return NextResponse.json({
      totalUsers,
      buyers,
      sellers,
      bothUsers,
      pendingApprovals,
      activeSubscriptions,
      totalTransactions,
      totalRevenue,
      monthlyRevenue,
      activePlans,
      trialSubscriptions,
      userGrowth,
      transactionTrends,
      subscriptionDistribution,
      topSellers: topSellersWithRevenue,
      topBuyers: topBuyersWithSpending
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}