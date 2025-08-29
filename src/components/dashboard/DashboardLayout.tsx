'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/simple-auth'
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu, Bell, LogOut, ChevronLeft, ChevronRight } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

interface DashboardLayoutProps {
  children: React.ReactNode
  user: any
  subscription?: any
  title?: string
  subtitle?: string
}

export function DashboardLayout({ children, user, subscription, title, subtitle }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  const pageTitle = title || (user.roles === 'ADMIN' ? 'Admin Dashboard' : `${user.roles} Dashboard`)
  const pageSubtitle = subtitle || `Welcome back, ${user.name}!`

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className={`hidden lg:block ${sidebarCollapsed ? 'w-16' : 'w-64'} flex-shrink-0 transition-all duration-300`}>
        <DashboardSidebar 
          user={user} 
          subscription={subscription} 
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <DashboardSidebar user={user} subscription={subscription} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                  <DashboardSidebar user={user} subscription={subscription} />
                </SheetContent>
              </Sheet>

              <div className="min-w-0">
                <h1 className="text-lg lg:text-xl font-semibold text-gray-900 truncate">
                  {pageTitle}
                </h1>
                <p className="text-sm text-gray-600 truncate">
                  {pageSubtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 lg:gap-4">
              {/* Notifications */}
              <Button variant="outline" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  3
                </span>
              </Button>

              {/* User Profile */}
              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right min-w-0">
                  <div className="font-medium text-gray-900 truncate">{user.name}</div>
                  <div className="text-sm text-gray-600 truncate">{user.email}</div>
                </div>
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback className="text-xs">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}