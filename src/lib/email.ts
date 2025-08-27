import nodemailer from 'nodemailer'

// Create a transporter using Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

export interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('Email credentials not configured. Skipping email send.')
      return false
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || 'Please view this email in an HTML-enabled email client.'
    }

    await transporter.sendMail(mailOptions)
    console.log('Email sent successfully to:', options.to)
    return true
  } catch (error) {
    console.error('Error sending email:', error)
    return false
  }
}

export function generateWelcomeEmail(name: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Industry Marketplace Pakistan</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background: #f9f9f9;
          padding: 30px;
          border-radius: 0 0 10px 10px;
        }
        .button {
          display: inline-block;
          background: #667eea;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Welcome to Industry Marketplace Pakistan!</h1>
      </div>
      <div class="content">
        <p>Dear ${name},</p>
        <p>Thank you for registering with Pakistan's premier B2B industrial marketplace!</p>
        
        <h3>What's Next?</h3>
        <ul>
          <li>Your account is currently pending admin approval</li>
          <li>You will receive another email once your account is approved</li>
          <li>Account approval typically takes 1-2 business days</li>
        </ul>
        
        <p>Once approved, you'll be able to:</p>
        <ul>
          <li>Post and browse industrial products</li>
          <li>Create and respond to RFQs (Request for Quotations)</li>
          <li>Connect with verified buyers and sellers</li>
          <li>Manage your business transactions securely</li>
        </ul>
        
        <p>If you have any questions, feel free to contact our support team.</p>
        
        <p>Best regards,<br>
        The Industry Marketplace Pakistan Team</p>
      </div>
      <div class="footer">
        <p>&copy; 2024 Industry Marketplace Pakistan. All rights reserved.</p>
        <p>This is an automated message. Please do not reply to this email.</p>
      </div>
    </body>
    </html>
  `
}

export function generateApprovalEmail(name: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Account Has Been Approved!</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background: #f9f9f9;
          padding: 30px;
          border-radius: 0 0 10px 10px;
        }
        .button {
          display: inline-block;
          background: #28a745;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Your Account Has Been Approved! 🎉</h1>
      </div>
      <div class="content">
        <p>Dear ${name},</p>
        <p>Great news! Your account has been approved and you can now start using Industry Marketplace Pakistan.</p>
        
        <h3>You Can Now:</h3>
        <ul>
          <li>Sign in to your account</li>
          <li>Access your dashboard</li>
          <li>Start listing products or posting RFQs</li>
          <li>Connect with other businesses</li>
        </ul>
        
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/auth/signin" class="button">Sign In Now</a>
        
        <p>If you have any questions or need assistance getting started, please don't hesitate to contact our support team.</p>
        
        <p>Welcome aboard!<br>
        The Industry Marketplace Pakistan Team</p>
      </div>
      <div class="footer">
        <p>&copy; 2024 Industry Marketplace Pakistan. All rights reserved.</p>
        <p>This is an automated message. Please do not reply to this email.</p>
      </div>
    </body>
    </html>
  `
}