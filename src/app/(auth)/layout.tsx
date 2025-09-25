import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Authentication - React Tailwind Starter',
  description: 'Sign in to your account or create a new one',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='min-h-screen bg-gradient-to-br from-background to-muted/20'>
      {/* Header */}
      <header className='absolute top-0 left-0 right-0 z-50'>
        <div className='container mx-auto px-4 py-6'>
          <div className='flex items-center justify-between'>
            <Link
              href='/'
              className='text-lg font-semibold text-foreground hover:text-foreground/80 transition-colors flex items-center gap-2'
            >
              <span>←</span>
              <span>Back to Home</span>
            </Link>
            <Link
              href='/'
              className='text-xl font-bold text-foreground hover:text-foreground/80 transition-colors'
            >
              React Tailwind Starter
            </Link>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className='flex items-center justify-center min-h-screen px-4'>
        <div className='w-full max-w-md'>{children}</div>
      </main>
      {/* Footer */}
      <footer className='absolute bottom-0 left-0 right-0 text-center py-6 text-sm text-muted-foreground'>
        <p>
          Built with{' '}
          <Link href='/' className='hover:underline'>
            React Tailwind Starter
          </Link>
        </p>
      </footer>
    </div>
  )
}
