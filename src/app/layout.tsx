import type { Metadata } from 'next'
import { Toaster } from '@/components/ui/sonner'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { AuthInitializer } from '@/components/providers/auth-initializer'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { ConditionalNavbar } from '@/components/features/common/ConditionalNavbar'
import { env } from '@/config/env'
import './globals.css'

// Simplified metadata for backoffice/internal tools
export const metadata: Metadata = {
  title: {
    default: `${env.APP_NAME} - Backoffice`,
    template: `%s | ${env.APP_NAME}`,
  },
  description: 'Internal management dashboard and backoffice tools',
  robots: {
    index: false, // Don't index internal backoffice tools
    follow: false,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        {/* Minimal meta tags for internal tools */}
        <meta name='format-detection' content='telephone=no' />
        <meta name='robots' content='noindex,nofollow' />
      </head>
      <body className='antialiased bg-background text-foreground font-sans'>
        <ErrorBoundary componentName='RootLayout'>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            <LanguageProvider>
              <AuthInitializer>
                <ConditionalNavbar />
                {children}
                <Toaster />
              </AuthInitializer>
            </LanguageProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
