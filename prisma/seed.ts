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

  console.log('✅ Existing data cleared')

  // Hash password function
  const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 12)
  }

  // Create dummy users
  console.log('👥 Creating dummy users...')

  // 1. Admin User
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@marketplace.com',
      phone: '0300-1111111',
      name: 'Admin User',
      passwordHash: await hashPassword('admin123'),
      roles: UserRole.BOTH,
      companyName: 'Marketplace Admin',
      address: 'Admin Office, Karachi',
      city: 'Karachi',
      country: 'Pakistan',
      isApproved: true,
      isAdmin: true,
    },
  })

  // Create admin subscription
  await prisma.subscription.create({
    data: {
      userId: adminUser.id,
      planType: SubscriptionPlan.PREMIUM,
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      status: SubscriptionStatus.ACTIVE,
      amount: 0,
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
      isAdmin: false,
    },
  })

  // Create seller subscription
  await prisma.subscription.create({
    data: {
      userId: sellerUser.id,
      planType: SubscriptionPlan.STANDARD,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      status: SubscriptionStatus.ACTIVE,
      amount: 5000,
    },
  })

  console.log('✅ Seller user created: seller@marketplace.com / seller123')

  // 3. Approved Buyer User
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
      isApproved: true,
      isAdmin: false,
    },
  })

  console.log('✅ Buyer user created: buyer@marketplace.com / buyer123')

  // 4. Both Buyer and Seller User (Approved)
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
      isAdmin: false,
    },
  })

  // Create subscription for both user
  await prisma.subscription.create({
    data: {
      userId: bothUser.id,
      planType: SubscriptionPlan.BASIC,
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year free
      status: SubscriptionStatus.ACTIVE,
      amount: 0,
    },
  })

  console.log('✅ Both user created: both@marketplace.com / both123')

  // 5. Pending Seller User
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
      isAdmin: false,
    },
  })

  console.log('✅ Pending seller created: pending@marketplace.com / pending123')

  // 6. Pending Buyer User
  const pendingBuyer = await prisma.user.create({
    data: {
      email: 'pendingbuyer@marketplace.com',
      phone: '0300-6666666',
      name: 'Ayesha Malik',
      passwordHash: await hashPassword('pending123'),
      roles: UserRole.BUYER,
      companyName: 'Tech Solutions',
      address: 'IT Park, Lahore',
      city: 'Lahore',
      country: 'Pakistan',
      isApproved: false, // Pending approval
      isAdmin: false,
    },
  })

  console.log('✅ Pending buyer created: pendingbuyer@marketplace.com / pending123')

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
  console.log('')
  console.log('👤 BUYER USER:')
  console.log('   Email: buyer@marketplace.com')
  console.log('   Password: buyer123')
  console.log('   Role: Buyer (Approved)')
  console.log('')
  console.log('👤 BOTH USER:')
  console.log('   Email: both@marketplace.com')
  console.log('   Password: both123')
  console.log('   Role: Both Buyer & Seller (Approved)')
  console.log('')
  console.log('👤 PENDING SELLER:')
  console.log('   Email: pending@marketplace.com')
  console.log('   Password: pending123')
  console.log('   Role: Seller (Pending Approval)')
  console.log('')
  console.log('👤 PENDING BUYER:')
  console.log('   Email: pendingbuyer@marketplace.com')
  console.log('   Password: pending123')
  console.log('   Role: Buyer (Pending Approval)')
  console.log('')
  console.log('📊 SAMPLE DATA:')
  console.log('- 4 Products created')
  console.log('- 2 RFQs created')
  console.log('- 2 Transactions created')
  console.log('- Subscriptions for approved users')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })