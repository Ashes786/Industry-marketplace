import { db } from '@/lib/db'

export async function checkExpiredSubscriptions() {
  try {
    const now = new Date()
    
    // Find all active subscriptions that have expired
    const expiredSubscriptions = await db.subscription.findMany({
      where: {
        status: 'ACTIVE',
        endDate: {
          lt: now
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            roles: true
          }
        }
      }
    })

    // Update expired subscriptions to EXPIRED status
    for (const subscription of expiredSubscriptions) {
      await db.subscription.update({
        where: {
          id: subscription.id
        },
        data: {
          status: 'EXPIRED'
        }
      })

      // Deactivate extra products beyond basic limit (2 listings)
      const activeProducts = await db.product.findMany({
        where: {
          sellerId: subscription.userId,
          isActive: true
        }
      })

      if (activeProducts.length > 2) {
        // Deactivate products beyond the first 2 (basic limit)
        const productsToDeactivate = activeProducts.slice(2)
        
        for (const product of productsToDeactivate) {
          await db.product.update({
            where: {
              id: product.id
            },
            data: {
              isActive: false
            }
          })
        }
      }

      console.log(`Subscription expired for user: ${subscription.user.name} (${subscription.user.email})`)
    }

    return {
      processed: expiredSubscriptions.length,
      message: `Processed ${expiredSubscriptions.length} expired subscriptions`
    }
  } catch (error) {
    console.error('Error checking expired subscriptions:', error)
    return {
      processed: 0,
      error: error.message
    }
  }
}

// This can be called by a cron job or scheduled task
export async function handleSubscriptionExpiry() {
  const result = await checkExpiredSubscriptions()
  console.log(result.message)
  return result
}