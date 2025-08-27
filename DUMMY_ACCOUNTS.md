# Dummy Accounts for Testing

This file contains all the dummy accounts created for testing the Industry Marketplace application.

## Account List

### 1. Admin Account
- **Email:** admin@example.com
- **Password:** admin123
- **Role:** Admin (Buyer & Seller)
- **Status:** Approved
- **Company:** Admin Company
- **Usage:** Access admin dashboard, approve users, view all data

### 2. Buyer Account
- **Email:** buyer@example.com
- **Password:** buyer123
- **Role:** Buyer
- **Status:** Approved
- **Company:** Buyer Corp
- **Usage:** Test buyer features, create RFQs, browse products

### 3. Seller Account
- **Email:** seller@example.com
- **Password:** seller123
- **Role:** Seller
- **Status:** Approved
- **Company:** Seller Industries
- **Usage:** Test seller features, list products, respond to RFQs

### 4. Both (Buyer & Seller) Account
- **Email:** both@example.com
- **Password:** both123
- **Role:** Both Buyer & Seller
- **Status:** Approved
- **Company:** Both Enterprises
- **Usage:** Test both buyer and seller features

### 5. Pending Account
- **Email:** pending@example.com
- **Password:** pending123
- **Role:** Buyer
- **Status:** Pending Approval
- **Company:** Pending Corp
- **Usage:** Test pending approval flow, will show approval message

### 6. Seller with Subscription
- **Email:** subscription@example.com
- **Password:** subscription123
- **Role:** Seller
- **Status:** Approved
- **Company:** Subscription Ltd
- **Subscription:** STANDARD (30 days)
- **Usage:** Test subscription features and premium seller tools

### 7. Demo Buyer
- **Email:** demo@example.com
- **Password:** demo123
- **Role:** Buyer
- **Status:** Approved
- **Company:** Demo Corp
- **Usage:** General buyer testing

### 8. Company Seller
- **Email:** company@example.com
- **Password:** company123
- **Role:** Seller
- **Status:** Approved
- **Company:** Test Company Pvt Ltd
- **Usage:** Test company seller features

### 9. Test User (Legacy)
- **Email:** test@example.com
- **Password:** password123
- **Role:** Buyer
- **Status:** Approved
- **Company:** N/A
- **Usage:** Legacy test account

## Testing Scenarios

### 🔐 Admin Testing
1. Login with admin@example.com
2. Access admin dashboard at /admin
3. Approve pending users (pending@example.com)
4. View all transactions and user statistics

### 👥 Buyer Testing
1. Login with buyer@example.com or demo@example.com
2. Access dashboard at /dashboard
3. Create RFQs (Request for Quotations)
4. Browse products and contact sellers

### 🏪 Seller Testing
1. Login with seller@example.com or company@example.com
2. Access seller dashboard at /seller-dashboard
3. List products and manage inventory
4. Respond to RFQs from buyers

### 🔄 Both Role Testing
1. Login with both@example.com
2. Access both buyer and seller features
3. Test role switching and full functionality

### ⏳ Pending Approval Testing
1. Try to login with pending@example.com
2. Verify "Account pending approval" message appears
3. Use admin account to approve this user
4. Test login after approval

### 💳 Subscription Testing
1. Login with subscription@example.com
2. Verify subscription features are available
3. Test subscription management and expiration

## Environment Configuration

The `.env` file is located in the project root directory and contains:

```env
DATABASE_URL=file:/home/z/my-project/db/custom.db

# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Note:** The `.env` file is hidden by default. To view it, use:
```bash
ls -la
```

## Email Setup

To enable email functionality, update the `.env` file with your Gmail credentials:
1. Replace `your-email@gmail.com` with your Gmail address
2. Replace `your-app-password` with your Gmail app password
   - Enable 2-factor authentication on your Google account
   - Generate an app password from Google Account settings

## Database

The application uses SQLite database located at:
- Path: `/home/z/my-project/db/custom.db`

## Getting Started

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Access the application at:
   - Main site: http://localhost:3000
   - Sign in: http://localhost:3000/auth/signin
   - Sign up: http://localhost:3000/auth/signup
   - Admin: http://localhost:3000/admin

3. Use any of the dummy accounts above to test different features

## Common Testing Workflows

### 1. User Registration Flow
1. Go to /auth/signup
2. Fill registration form
3. Verify success page appears
4. Check if welcome email is sent (if email is configured)

### 2. User Approval Flow
1. Login as admin (admin@example.com)
2. Go to admin dashboard
3. Find pending users
4. Approve pending@example.com
5. Check if approval email is sent

### 3. Login Flow
1. Try different accounts
2. Verify error messages for invalid credentials
3. Test pending approval message
4. Verify successful redirects

### 4. Role-based Access
1. Test different roles (buyer, seller, both, admin)
2. Verify appropriate features are available
3. Test access restrictions