import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className='container mx-auto px-4 py-10 max-w-6xl space-y-8'>
      {/* Header */}
      <div className='space-y-2'>
        <Skeleton className='h-9 w-56 rounded-lg' />
        <Skeleton className='h-4 w-72 rounded' />
      </div>

      {/* Stat cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className='rounded-2xl border border-border/60 p-5 space-y-4'
          >
            <div className='flex items-center justify-between'>
              <Skeleton className='h-10 w-10 rounded-xl' />
              <Skeleton className='h-5 w-14 rounded-full' />
            </div>
            <Skeleton className='h-8 w-24 rounded' />
            <Skeleton className='h-3 w-20 rounded' />
          </div>
        ))}
      </div>

      {/* Content block */}
      <div className='rounded-2xl border border-border/60 p-6 space-y-4'>
        <Skeleton className='h-6 w-40 rounded' />
        <Skeleton className='h-24 w-full rounded-xl' />
      </div>
    </div>
  )
}
