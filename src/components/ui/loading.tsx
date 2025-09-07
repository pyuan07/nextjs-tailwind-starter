import React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
  fullScreen?: boolean
}

/**
 * Reusable loading component with different sizes and states
 */
export function Loading({
  size = 'md',
  text,
  className,
  fullScreen = false,
}: LoadingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  }

  const content = (
    <div
      className={cn(
        'flex items-center justify-center gap-2',
        fullScreen && 'min-h-screen',
        className
      )}
    >
      <Loader2 className={cn('animate-spin', sizeClasses[size])} />
      {text && (
        <span className={cn('text-muted-foreground', textSizeClasses[size])}>
          {text}
        </span>
      )}
    </div>
  )

  return content
}

/**
 * Full screen loading overlay
 */
export function LoadingOverlay({
  text = 'Loading...',
  className,
}: {
  text?: string
  className?: string
}) {
  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm',
        className
      )}
    >
      <Loading size='lg' text={text} />
    </div>
  )
}

/**
 * Page-level loading component
 */
export function PageLoading({
  text = 'Loading page...',
  className,
}: {
  text?: string
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex min-h-[400px] items-center justify-center',
        className
      )}
    >
      <Loading size='lg' text={text} />
    </div>
  )
}

/**
 * Button loading state
 */
export function ButtonLoading({ size = 'sm' }: { size?: 'sm' | 'md' | 'lg' }) {
  return (
    <Loader2
      className={cn('animate-spin', {
        'h-3 w-3': size === 'sm',
        'h-4 w-4': size === 'md',
        'h-5 w-5': size === 'lg',
      })}
    />
  )
}
