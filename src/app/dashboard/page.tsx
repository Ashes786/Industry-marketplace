'use client'

import { useState, useEffect } from 'react'
import { useAuth, ProtectedRoute } from '@/lib/simple-auth'
import { BuyerDashboard } from '@/components/dashboard/BuyerDashboard'
import { SellerDashboard } from '@/components/dashboard/SellerDashboard'
import { AdminDashboard } from '@/components/dashboard/AdminDashboard'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Loader2 } from 'lucide-react'

function DashboardContent() {
  const { user, logout, isAuthenticated } = useAuth()

  // Show loading if user is not available yet
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Render appropriate dashboard based on user role
  const renderDashboard = () => {
    if (user.roles === 'ADMIN') {
      return <AdminDashboard user={user} />
    } else if (user.roles === 'BUYER') {
      return <BuyerDashboard user={user} />
    } else if (user.roles === 'SELLER') {
      return <SellerDashboard user={user} subscription={user.subscription} />
    } else if (user.roles === 'BOTH') {
      return (
        <div className="space-y-6">
          <BuyerDashboard user={user} />
          <SellerDashboard user={user} subscription={user.subscription} />
        </div>
      )
    }
    return <div>Unknown user role</div>
  }

  // Only pass subscription if user is SELLER or BOTH
  const getSubscription = () => {
    if (user.roles === 'SELLER' || user.roles === 'BOTH') {
      return user.subscription
    }
    return undefined
  }

  return (
    <DashboardLayout user={user} subscription={getSubscription()}>
      {renderDashboard()}
    </DashboardLayout>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}