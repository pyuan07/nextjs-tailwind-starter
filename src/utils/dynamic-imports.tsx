import dynamic from 'next/dynamic'
import { Card, CardContent } from '@/components/ui'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * Creates consistent loading skeletons for form components
 */
export const createFormSkeleton = (fields: number = 4) => (
  <Card>
    <CardContent className='p-6 space-y-4'>
      <div className='space-y-2'>
        <Skeleton className='h-6 w-32' />
        <Skeleton className='h-4 w-48' />
      </div>
      <div className='space-y-4'>
        {Array.from({ length: fields }).map((_, i) => (
          <Skeleton key={i} className='h-10 w-full' />
        ))}
      </div>
      <Skeleton className='h-10 w-full' />
    </CardContent>
  </Card>
)

/**
 * Factory for creating dynamic imports with consistent loading states
 */
export const createDynamicComponent = <T extends Record<string, unknown>>(
  importFn: () => Promise<{ default: React.ComponentType<T> }>,
  loadingComponent?: React.ReactNode
) =>
  dynamic(importFn, {
    loading: () => loadingComponent || createFormSkeleton(),
  })
