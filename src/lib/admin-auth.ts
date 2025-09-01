import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { UserRole } from '@prisma/client'

export async function getAdminUser(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.substring(7)
    
    // Decode the token (simplified - in production use proper JWT verification)
    try {
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString())
      
      if (!decoded.userId || !decoded.email) {
        return null
      }

      // Get the user from database
      const user = await db.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          name: true,
          roles: true,
          isApproved: true
        }
      })

      if (!user || user.roles !== UserRole.ADMIN || !user.isApproved) {
        return null
      }

      return user
    } catch (error) {
      console.error('Error decoding token:', error)
      return null
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return null
  }
}

export async function requireAdmin(request: NextRequest) {
  const adminUser = await getAdminUser(request)
  
  if (!adminUser) {
    throw new Error('Unauthorized')
  }
  
  return adminUser
}