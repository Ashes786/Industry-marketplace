'use client'

import { useAuth } from '@/lib/simple-auth'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  MessageSquare, 
  FileText, 
  BarChart3,
  Settings,
  CreditCard,
  Users,
  Search,
  Plus,
  LogOut,
  Bell,
  User,
  Building2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

interface DashboardSidebarProps {
  user: any
  subscription?: any
}

export function DashboardSidebar({ user, subscription }: DashboardSidebarProps) {
  const pathname = usePathname()
  const { logout } = useAuth()

  const isBuyer = user.roles === 'BUYER' || user.roles === 'BOTH'
  const isSeller = user.roles === 'SELLER' || user.roles === 'BOTH'
  const isAdmin = user.roles === 'ADMIN'

  const getNavItems = () => {
    const baseItems = [
      {
        title: 'Overview',
        href: '/dashboard',
        icon: LayoutDashboard,
        show: true
      }
    ]

    if (isBuyer) {
      baseItems.push(
        {
          title: 'Create RFQ',
          href: '/dashboard/rfqs/create',
          icon: Plus,
          show: true
        },
        {
          title: 'Browse Products',
          href: '/dashboard/browse',
          icon: Search,
          show: true
        },
        {
          title: 'My RFQs',
          href: '/dashboard/rfqs',
          icon: ShoppingCart,
          show: true
        }
      )
    }

    if (isSeller) {
      baseItems.push(
        {
          title: 'My Products',
          href: '/dashboard/products',
          icon: Package,
          show: true
        },
        {
          title: 'Add Product',
          href: '/dashboard/products/create',
          icon: Plus,
          show: true
        }
      )
    }

    if (isBuyer || isSeller) {
      baseItems.push(
        {
          title: 'Messages',
          href: '/dashboard/chat',
          icon: MessageSquare,
          show: true
        },
        {
          title: 'Transactions',
          href: '/dashboard/transactions',
          icon: FileText,
          show: true
        }
      )
    }

    if (isSeller) {
      baseItems.push(
        {
          title: 'Subscription',
          href: '/dashboard/subscription',
          icon: CreditCard,
          show: true
        }
      )
    }

    if (isAdmin) {
      baseItems.push(
        {
          title: 'Users',
          href: '/dashboard/users',
          icon: Users,
          show: true
        },
        {
          title: 'All Transactions',
          href: '/dashboard/all-transactions',
          icon: FileText,
          show: true
        },
        {
          title: 'Subscriptions',
          href: '/dashboard/subscriptions',
          icon: CreditCard,
          show: true
        }
      )
    }

    baseItems.push(
      {
        title: 'Analytics',
        href: '/dashboard/analytics',
        icon: BarChart3,
        show: true
      },
      {
        title: 'Settings',
        href: '/dashboard/settings',
        icon: Settings,
        show: true
      }
    )

    return baseItems.filter(item => item.show)
  }

  const navItems = getNavItems()

  return (
    <div className="flex flex-col h-full bg-white border-r">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <Building2 className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-lg font-semibold">B2B Marketplace</h1>
            <p className="text-sm text-gray-600">Dashboard</p>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="/placeholder-avatar.jpg" />
            <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{user.name}</p>
            <p className="text-xs text-gray-600 truncate">{user.email}</p>
            <div className="flex items-center gap-1 mt-1">
              <Badge variant="secondary" className="text-xs">
                {user.roles}
              </Badge>
              {user.roles === 'ADMIN' && (
                <Badge variant="outline" className="text-xs">
                  Admin
                </Badge>
              )}
            </div>
          </div>
        </div>
        {subscription && (
          <div className="mt-2 text-xs text-gray-600">
            Plan: {subscription.planType} • {subscription.status}
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.title}
            </Link>
          )
        })}
      </nav>

      {/* Quick Actions */}
      <div className="p-4 border-t">
        <div className="space-y-2">
          {isBuyer && (
            <Link href="/dashboard/rfqs/create">
              <Button className="w-full justify-start" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create RFQ
              </Button>
            </Link>
          )}
          {isSeller && (
            <Link href="/dashboard/products/create">
              <Button className="w-full justify-start" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </Link>
          )}
          <Button variant="outline" className="w-full justify-start" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
        </div>
      </div>

      {/* Logout */}
      <div className="p-4 border-t">
        <Button
          variant="outline"
          className="w-full justify-start"
          size="sm"
          onClick={logout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  )
}