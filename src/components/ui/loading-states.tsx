import { Skeleton } from './skeleton'
import { Card, CardHeader } from './card'

interface LoadingStateProps {
  className?: string
}

/**
 * Standard loading skeleton for auth loading states
 */
export function AuthLoadingSkeleton({ className }: LoadingStateProps) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <Skeleton className='w-16 h-9 rounded' />
      <Skeleton className='w-20 h-9 rounded' />
    </div>
  )
}

/**
 * Loading skeleton for user cards
 */
export function UserCardSkeleton({ className }: LoadingStateProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <div className='flex items-center space-x-3'>
          <Skeleton className='h-10 w-10 rounded-full' />
          <div className='space-y-2'>
            <Skeleton className='h-4 w-[120px]' />
            <Skeleton className='h-3 w-[180px]' />
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}

/**
 * Loading skeleton for user lists
 */
export function UserListSkeleton({
  count = 3,
  className,
}: LoadingStateProps & { count?: number }) {
  return (
    <div className={className}>
      <div className='space-y-4'>
        {Array.from({ length: count }).map((_, i) => (
          <UserCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
