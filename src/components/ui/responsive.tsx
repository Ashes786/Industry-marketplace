'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ResponsiveLayoutProps {
  children: ReactNode
  className?: string
  fullWidth?: boolean
}

export function ResponsiveContainer({ children, className, fullWidth = false }: ResponsiveLayoutProps) {
  return (
    <div className={cn(
      'w-full mx-auto px-4 sm:px-6 lg:px-8',
      fullWidth ? 'max-w-full' : 'max-w-7xl',
      className
    )}>
      {children}
    </div>
  )
}

interface ResponsiveGridProps {
  children: ReactNode
  className?: string
  cols?: {
    default?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  gap?: number
}

export function ResponsiveGrid({ 
  children, 
  className, 
  cols = { default: 1, sm: 2, md: 3, lg: 4 },
  gap = 4 
}: ResponsiveGridProps) {
  const gridClasses = [
    cols.default && `grid-cols-${cols.default}`,
    cols.sm && `sm:grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`,
    `gap-${gap}`
  ].filter(Boolean).join(' ')

  return (
    <div className={cn('grid', gridClasses, className)}>
      {children}
    </div>
  )
}

interface ResponsiveFlexProps {
  children: ReactNode
  className?: string
  direction?: 'row' | 'col'
  wrap?: boolean
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch'
  gap?: number
}

export function ResponsiveFlex({ 
  children, 
  className,
  direction = 'row',
  wrap = true,
  justify = 'start',
  align = 'start',
  gap = 4
}: ResponsiveFlexProps) {
  const flexClasses = [
    'flex',
    wrap && 'flex-wrap',
    `flex-${direction}`,
    `justify-${justify}`,
    `items-${align}`,
    `gap-${gap}`
  ].filter(Boolean).join(' ')

  return (
    <div className={cn(flexClasses, className)}>
      {children}
    </div>
  )
}

interface ResponsiveTextProps {
  children: ReactNode
  className?: string
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
  weight?: 'normal' | 'medium' | 'semibold' | 'bold'
  responsive?: boolean
}

export function ResponsiveText({ 
  children, 
  className, 
  size = 'base',
  weight = 'normal',
  responsive = true 
}: ResponsiveTextProps) {
  const sizeClasses = responsive ? {
    xs: 'text-xs sm:text-sm',
    sm: 'text-sm sm:text-base',
    base: 'text-base sm:text-lg',
    lg: 'text-lg sm:text-xl lg:text-2xl',
    xl: 'text-xl sm:text-2xl lg:text-3xl',
    '2xl': 'text-2xl sm:text-3xl lg:text-4xl',
    '3xl': 'text-3xl sm:text-4xl lg:text-5xl',
    '4xl': 'text-4xl sm:text-5xl lg:text-6xl'
  }[size] : `text-${size}`

  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  }[weight]

  return (
    <span className={cn(sizeClasses, weightClasses, className)}>
      {children}
    </span>
  )
}

interface ResponsiveCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export function ResponsiveCard({ 
  children, 
  className, 
  hover = true,
  padding = 'md' 
}: ResponsiveCardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-2 sm:p-3',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8'
  }[padding]

  return (
    <div className={cn(
      'bg-white rounded-lg border border-gray-200 shadow-sm',
      paddingClasses,
      hover && 'hover:shadow-md hover:border-gray-300 transition-all duration-200',
      className
    )}>
      {children}
    </div>
  )
}

interface ResponsiveButtonProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  fullWidthMobile?: boolean
}

export function ResponsiveButton({ 
  children, 
  className,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  fullWidthMobile = false 
}: ResponsiveButtonProps) {
  const sizeClasses = {
    sm: 'h-9 px-3 text-xs sm:text-sm',
    md: 'h-10 px-4 text-sm sm:text-base',
    lg: 'h-11 px-6 text-base sm:text-lg'
  }[size]

  const widthClasses = [
    fullWidth && 'w-full',
    fullWidthMobile && 'sm:w-auto w-full'
  ].filter(Boolean).join(' ')

  return (
    <button className={cn(
      'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
      sizeClasses,
      widthClasses,
      {
        'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'default',
        'border border-input bg-background hover:bg-accent hover:text-accent-foreground': variant === 'outline',
        'hover:bg-accent hover:text-accent-foreground': variant === 'ghost',
        'bg-destructive text-destructive-foreground hover:bg-destructive/90': variant === 'destructive'
      },
      className
    )}>
      {children}
    </button>
  )
}