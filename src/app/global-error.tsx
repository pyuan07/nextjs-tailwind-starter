'use client'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html>
      <body className='flex min-h-screen items-center justify-center p-4'>
        <div className='text-center space-y-4 max-w-md'>
          <h1 className='text-2xl font-bold'>Something went wrong</h1>
          <p className='text-muted-foreground text-sm'>
            A critical error occurred. Please try again.
          </p>
          {error.digest && (
            <p className='text-xs text-muted-foreground font-mono'>
              Error ID: {error.digest}
            </p>
          )}
          <div className='flex gap-3 justify-center'>
            <Button onClick={reset}>Try Again</Button>
            <Button
              variant='outline'
              onClick={() => (window.location.href = '/')}
            >
              Go Home
            </Button>
          </div>
        </div>
      </body>
    </html>
  )
}
