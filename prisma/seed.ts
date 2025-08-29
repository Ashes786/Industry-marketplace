import { PrismaClient, UserRole, SubscriptionPlan, SubscriptionStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data (optional - comment out if you want to preserve existing data)
  console.log('🗑️  Clearing existing data...')
  await prisma.chat.deleteMany()
  await prisma.transaction.deleteMany()
  await prisma.invoice.deleteMany()
  await prisma.rFQProduct.deleteMany()
  await prisma.rFQ.deleteMany()
  await prisma.product.deleteMany()
  await prisma.subscription.deleteMany()
  await prisma.extraListing.deleteMany()
  await prisma.adminLog.deleteMany()
  await prisma.user.deleteMany()
  await prisma.availablePlan.deleteMany()

  console.log('✅ Existing data cleared')

  // Hash password function
  const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 12)
  }

  // Create available subscription plans
  console.log('💳 Creating available subscription plans...')
  
  const basicPlan = await prisma.availablePlan.create({
    data: {
      name: 'BASIC',
      description: 'Perfect for small sellers starting out',
      price: 0,
      duration: 365,
      features: JSON.stringify([
        'Up to 10 product listings',
        'Basic seller profile',
        'RFQ responses',
        'Standard support'
      ]),
      isActive: true,
      isTrial: false,
    },
  })

  const standardPlan = await prisma.availablePlan.create({
    data: {
      name: 'STANDARD',
      description: '1-month trial, then converts to BASIC if not upgraded',
      price: 5000,
      duration: 30,
      features: JSON.stringify([
        'Up to 50 product listings',
        'Featured products',
        'Priority RFQ matching',
        'Advanced analytics',
        'Premium support',
        'Business verification badge'
      ]),
      isActive: true,
      isTrial: true,
      trialDays: 30,
    },
  })

  const enterprisePlan = await prisma.availablePlan.create({
    data: {
      name: 'ENTERPRISE',
      description: 'For large-scale businesses with high volume',
      price: 12000,
      duration: 30,
      features: JSON.stringify([
        'Unlimited product listings',
        'Premium featured placement',
        'Top priority RFQ matching',
        'Advanced analytics dashboard',
        '24/7 dedicated support',
        'API access',
        'Custom branding',
        'Bulk listing tools'
      ]),
      isActive: true,
      isTrial: false,
    },
  })

  console.log('✅ Available subscription plans created')

  // Create dummy users
  console.log('👥 Creating dummy users...')

  // 1. Admin User
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@marketplace.com',
      phone: '0300-1111111',
      name: 'Admin User',
      passwordHash: await hashPassword('admin123'),
      roles: UserRole.ADMIN,
      companyName: 'Marketplace Admin',
      address: 'Admin Office, Karachi',
      city: 'Karachi',
      country: 'Pakistan',
      isApproved: true,
    },
  })

  console.log('✅ Admin user created: admin@marketplace.com / admin123')

  // 2. Approved Seller User
  const sellerUser = await prisma.user.create({
    data: {
      email: 'seller@marketplace.com',
      phone: '0300-2222222',
      name: 'Ahmed Khan',
      passwordHash: await hashPassword('seller123'),
      roles: UserRole.SELLER,
      companyName: 'Steel Industries Ltd',
      address: 'Industrial Area, Lahore',
      city: 'Lahore',
      country: 'Pakistan',
      isApproved: true,
    },
  })

  // Create seller subscription with STANDARD trial
  await prisma.subscription.create({
    data: {
      userId: sellerUser.id,
      planId: standardPlan.id,
      planType: SubscriptionPlan.STANDARD,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days trial
      status: SubscriptionStatus.ACTIVE,
      amount: 0,
      isTrial: true,
    },
  })

  console.log('✅ Seller user created: seller@marketplace.com / seller123')

  // 3. Approved Buyer User (no approval needed for buyers)
  const buyerUser = await prisma.user.create({
    data: {
      email: 'buyer@marketplace.com',
      phone: '0300-3333333',
      name: 'Fatima Ali',
      passwordHash: await hashPassword('buyer123'),
      roles: UserRole.BUYER,
      companyName: 'Textile Mills',
      address: 'Commercial Area, Faisalabad',
      city: 'Faisalabad',
      country: 'Pakistan',
      isApproved: true, // Buyers are auto-approved
    },
  })

  console.log('✅ Buyer user created: buyer@marketplace.com / buyer123')

  // 4. Both Buyer and Seller User (needs approval for seller part)
  const bothUser = await prisma.user.create({
    data: {
      email: 'both@marketplace.com',
      phone: '0300-4444444',
      name: 'Muhammad Raza',
      passwordHash: await hashPassword('both123'),
      roles: UserRole.BOTH,
      companyName: 'Construction Co.',
      address: 'Business District, Islamabad',
      city: 'Islamabad',
      country: 'Pakistan',
      isApproved: true,
    },
  })

  // Create subscription for both user with BASIC plan
  await prisma.subscription.create({
    data: {
      userId: bothUser.id,
      planId: basicPlan.id,
      planType: SubscriptionPlan.BASIC,
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      status: SubscriptionStatus.ACTIVE,
      amount: 0,
      isTrial: false,
    },
  })

  console.log('✅ Both user created: both@marketplace.com / both123')

  // 5. Pending Seller User (needs approval)
  const pendingSeller = await prisma.user.create({
    data: {
      email: 'pending@marketplace.com',
      phone: '0300-5555555',
      name: 'Bilal Ahmed',
      passwordHash: await hashPassword('pending123'),
      roles: UserRole.SELLER,
      companyName: 'Startup Manufacturing',
      address: 'New Industrial Zone, Karachi',
      city: 'Karachi',
      country: 'Pakistan',
      isApproved: false, // Pending approval
    },
  })

  console.log('✅ Pending seller created: pending@marketplace.com / pending123')

  // 6. Pending Both User (needs approval for seller part)
  const pendingBoth = await prisma.user.create({
    data: {
      email: 'pendingboth@marketplace.com',
      phone: '0300-7777777',
      name: 'Ayesha Malik',
      passwordHash: await hashPassword('pending123'),
      roles: UserRole.BOTH,
      companyName: 'Tech Solutions',
      address: 'IT Park, Lahore',
      city: 'Lahore',
      country: 'Pakistan',
      isApproved: false, // Pending approval for seller role
    },
  })

  console.log('✅ Pending both user created: pendingboth@marketplace.com / pending123')

  // Create some sample products
  console.log('📦 Creating sample products...')

  const products = await Promise.all([
    prisma.product.create({
      data: {
        sellerId: sellerUser.id,
        title: 'High-Quality Steel Rods',
        description: 'Premium grade steel rods for construction purposes. Available in various sizes and lengths.',
        price: 85000,
        quantity: 1000,
        unit: 'ton',
        category: 'Construction Materials',
        subCategory: 'Steel Products',
        isActive: true,
        isFeatured: true,
      },
    }),
    prisma.product.create({
      data: {
        sellerId: bothUser.id,
        title: 'Industrial Cotton Yarn',
        description: '100% pure cotton yarn suitable for textile manufacturing. High strength and durability.',
        price: 1200,
        quantity: 5000,
        unit: 'kg',
        category: 'Textiles',
        subCategory: 'Yarn',
        isActive: true,
        isFeatured: false,
      },
    }),
    prisma.product.create({
      data: {
        sellerId: sellerUser.id,
        title: 'Cement Bags (50kg)',
        description: 'High-quality cement bags for construction. Compliant with industry standards.',
        price: 650,
        quantity: 10000,
        unit: 'bag',
        category: 'Construction Materials',
        subCategory: 'Cement',
        isActive: true,
        isFeatured: true,
      },
    }),
    prisma.product.create({
      data: {
        sellerId: bothUser.id,
        title: 'Electrical Wiring',
        description: 'Copper electrical wiring for residential and commercial use. Fire-resistant and durable.',
        price: 450,
        quantity: 2000,
        unit: 'meter',
        category: 'Electrical',
        subCategory: 'Wiring',
        isActive: true,
        isFeatured: false,
      },
    }),
  ])

  console.log(`✅ Created ${products.length} sample products`)

  // Create some sample RFQs
  console.log('📋 Creating sample RFQs...')

  const rfqs = await Promise.all([
    prisma.rFQ.create({
      data: {
        buyerId: buyerUser.id,
        title: 'Steel Rods for Construction Project',
        description: 'Need high-quality steel rods for a large construction project. Must meet industry standards.',
        category: 'Construction Materials',
        budget: 500000,
        quantity: 5,
        unit: 'ton',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        status: 'OPEN',
      },
    }),
    prisma.rFQ.create({
      data: {
        buyerId: bothUser.id,
        title: 'Cotton Yarn for Textile Production',
        description: 'Looking for premium cotton yarn for our textile manufacturing unit. Need consistent quality.',
        category: 'Textiles',
        budget: 600000,
        quantity: 500,
        unit: 'kg',
        deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
        status: 'OPEN',
      },
    }),
  ])

  console.log(`✅ Created ${rfqs.length} sample RFQs`)

  // Create some sample transactions
  console.log('💰 Creating sample transactions...')

  const transactions = await Promise.all([
    prisma.transaction.create({
      data: {
        buyerId: buyerUser.id,
        sellerId: sellerUser.id,
        productId: products[0].id,
        totalAmount: 425000,
        commissionAmount: 12750,
        productAmount: 412250,
        status: 'COMPLETED',
        paymentDate: new Date(),
        invoiceNumber: 'INV-2024-001',
      },
    }),
    prisma.transaction.create({
      data: {
        buyerId: bothUser.id,
        sellerId: sellerUser.id,
        productId: products[2].id,
        totalAmount: 65000,
        commissionAmount: 1950,
        productAmount: 63050,
        status: 'PAID',
        paymentDate: new Date(),
        invoiceNumber: 'INV-2024-002',
      },
    }),
  ])

  console.log(`✅ Created ${transactions.length} sample transactions`)

  console.log('🎉 Database seeding completed successfully!')
  console.log('')
  console.log('📋 DUMMY CREDENTIALS:')
  console.log('========================')
  console.log('👤 ADMIN USER:')
  console.log('   Email: admin@marketplace.com')
  console.log('   Password: admin123')
  console.log('   Role: Admin (Approved)')
  console.log('')
  console.log('👤 SELLER USER:')
  console.log('   Email: seller@marketplace.com')
  console.log('   Password: seller123')
  console.log('   Role: Seller (Approved)')
  console.log('   Subscription: STANDARD (1-month trial)')
  console.log('')
  console.log('👤 BUYER USER:')
  console.log('   Email: buyer@marketplace.com')
  console.log('   Password: buyer123')
  console.log('   Role: Buyer (Auto-approved)')
  console.log('')
  console.log('👤 BOTH USER:')
  console.log('   Email: both@marketplace.com')
  console.log('   Password: both123')
  console.log('   Role: Both Buyer & Seller (Approved)')
  console.log('   Subscription: BASIC (Free)')
  console.log('')
  console.log('👤 PENDING SELLER:')
  console.log('   Email: pending@marketplace.com')
  console.log('   Password: pending123')
  console.log('   Role: Seller (Pending Approval)')
  console.log('')
  console.log('👤 PENDING BOTH:')
  console.log('   Email: pendingboth@marketplace.com')
  console.log('   Password: pending123')
  console.log('   Role: Both Buyer & Seller (Pending Approval)')
  console.log('')
  console.log('📊 SAMPLE DATA:')
  console.log('- 4 Products created')
  console.log('- 2 RFQs created')
  console.log('- 2 Transactions created')
  console.log('- 3 Subscription plans available')
  console.log('- Subscriptions for approved sellers')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })