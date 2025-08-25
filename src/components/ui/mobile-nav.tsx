'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu, X, Home, Package, ShoppingCart, User, Settings, LogOut } from 'lucide-react'

interface MobileNavProps {
  userRole?: 'buyer' | 'seller' | 'both' | 'admin'
  onNavigate?: (path: string) => void
}

export default function MobileNav({ userRole = 'buyer', onNavigate }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)

  const getNavItems = () => {
    const baseItems = [
      { icon: Home, label: 'Home', path: '/' },
      { icon: User, label: 'Profile', path: '/profile' },
      { icon: Settings, label: 'Settings', path: '/settings' },
    ]

    if (userRole === 'buyer' || userRole === 'both') {
      baseItems.splice(1, 0, { icon: ShoppingCart, label: 'Dashboard', path: '/dashboard' })
    }
    
    if (userRole === 'seller' || userRole === 'both') {
      baseItems.splice(1, 0, { icon: Package, label: 'Seller Dashboard', path: '/seller-dashboard' })
    }
    
    if (userRole === 'admin') {
      baseItems.splice(1, 0, { icon: Settings, label: 'Admin Panel', path: '/admin' })
    }

    return baseItems
  }

  const handleNavigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path)
    }
    setIsOpen(false)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Menu</h2>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {getNavItems().map((item) => (
                <Button
                  key={item.path}
                  variant="ghost"
                  className="w-full justify-start h-12"
                  onClick={() => handleNavigate(item.path)}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.label}
                </Button>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t">
              <Button
                variant="ghost"
                className="w-full justify-start h-12 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => handleNavigate('/logout')}
              >
                <LogOut className="h-5 w-5 mr-3" />
                Logout
              </Button>
            </div>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}