# Database Seed Instructions

This document explains how to use the database seed functionality to create dummy credentials and sample data for the B2B Industrial Marketplace application.

## 🌱 What is Seeding?

Seeding is the process of populating your database with initial data. This is useful for:
- Development and testing
- Creating demo accounts
- Setting up initial application data

## 📋 Available Commands

### Run Seed Only
```bash
npm run db:seed
```
This will run the seed script without modifying the database schema.

### Setup Database and Seed
```bash
npm run db:setup
```
This will:
1. Push the latest schema to the database (`prisma db push`)
2. Run the seed script to populate data

### Reset Database and Seed
```bash
npm run db:reset
```
This will:
1. Drop the database
2. Recreate it with the latest schema
3. Run the seed script automatically

## 👤 Dummy Credentials

The seed script creates the following users:

### Admin User
- **Email**: `admin@marketplace.com`
- **Password**: `admin123`
- **Role**: Admin (Approved)
- **Company**: Marketplace Admin
- **Subscription**: Premium (1 year free)

### Seller User
- **Email**: `seller@marketplace.com`
- **Password**: `seller123`
- **Role**: Seller (Approved)
- **Company**: Steel Industries Ltd
- **Subscription**: Standard (30 days)

### Buyer User
- **Email**: `buyer@marketplace.com`
- **Password**: `buyer123`
- **Role**: Buyer (Approved)
- **Company**: Textile Mills
- **Subscription**: None (Buyers don't need subscriptions)

### Both User (Buyer & Seller)
- **Email**: `both@marketplace.com`
- **Password**: `both123`
- **Role**: Both Buyer & Seller (Approved)
- **Company**: Construction Co.
- **Subscription**: Basic (1 year free)

### Pending Seller
- **Email**: `pending@marketplace.com`
- **Password**: `pending123`
- **Role**: Seller (Pending Approval)
- **Company**: Startup Manufacturing
- **Status**: Awaiting admin approval

### Pending Buyer
- **Email**: `pendingbuyer@marketplace.com`
- **Password**: `pending123`
- **Role**: Buyer (Pending Approval)
- **Company**: Tech Solutions
- **Status**: Awaiting admin approval

## 📊 Sample Data Created

The seed script also creates:

### Products (4 items)
1. **High-Quality Steel Rods** - ₹85,000/ton (Construction Materials)
2. **Industrial Cotton Yarn** - ₹1,200/kg (Textiles)
3. **Cement Bags (50kg)** - ₹650/bag (Construction Materials)
4. **Electrical Wiring** - ₹450/meter (Electrical)

### RFQs (2 requests)
1. **Steel Rods for Construction Project** - Budget: ₹500,000
2. **Cotton Yarn for Textile Production** - Budget: ₹600,000

### Transactions (2 completed)
1. Steel Rods purchase - ₹425,000 (Completed)
2. Cement Bags purchase - ₹65,000 (Paid)

## 🚀 Quick Start

1. **First time setup**:
   ```bash
   npm run db:setup
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Test with dummy credentials**:
   - Admin: `admin@marketplace.com` / `admin123`
   - Seller: `seller@marketplace.com` / `seller123`
   - Buyer: `buyer@marketplace.com` / `buyer123`

## 🔄 Resetting Data

If you want to clear all data and start fresh:
```bash
npm run db:reset
```

⚠️ **Warning**: This will delete all existing data in the database!

## 🛠️ Customizing the Seed

To modify the seed data:
1. Edit `prisma/seed.ts`
2. Add/modify users, products, RFQs, etc.
3. Run `npm run db:seed` to apply changes

## 📝 Notes

- All passwords are hashed using bcrypt
- Users are created with realistic company information
- Subscriptions are created for approved users
- Sample data includes realistic products and RFQs
- Pending users can be approved through the admin dashboard

## 🔧 Troubleshooting

If you encounter issues:

1. **Database connection errors**: Make sure your `.env` file has the correct `DATABASE_URL`
2. **Permission errors**: Ensure the database file and directory have proper permissions
3. **Seed script fails**: Check that all dependencies are installed (`npm install`)

## 📱 Testing the Application

Use the dummy credentials to test:
- User registration and login
- Admin dashboard (use admin credentials)
- Seller dashboard (use seller credentials)
- Buyer functionality (use buyer credentials)
- RFQ creation and management
- Product listing and management