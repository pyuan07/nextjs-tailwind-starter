import type { Metadata } from 'next'
import { Toaster } from '@/components/ui/sonner'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { AuthInitializer } from '@/components/providers/auth-initializer'
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
    <html suppressHydrationWarning>
      <head>
        {/* Viewport for mobile-first, native app experience */}
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
        />

        {/* PWA Meta Tags */}
        <meta name='mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-status-bar-style' content='default' />
        <meta name='apple-mobile-web-app-title' content='NextJS Starter' />
        <meta name='application-name' content='NextJS Starter' />
        <meta name='msapplication-TileColor' content='#6366f1' />
        <meta name='msapplication-config' content='/browserconfig.xml' />

        {/* Enhanced PWA support */}
        <meta name='format-detection' content='telephone=no' />
        <meta name='mobile-web-app-capable' content='yes' />
        <meta name='apple-touch-fullscreen' content='yes' />

        {/* PWA Icons */}
        <link rel='icon' type='image/x-icon' href='/favicon.ico' />
        <link
          rel='icon'
          type='image/png'
          sizes='16x16'
          href='/favicon-16x16.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='32x32'
          href='/favicon-32x32.png'
        />
        <link
          rel='apple-touch-icon'
          sizes='180x180'
          href='/apple-touch-icon.png'
        />
        <link rel='mask-icon' href='/icon-base.svg' color='#6366f1' />

        {/* iOS Splash Screens */}
        <link
          rel='apple-touch-startup-image'
          href='/iphone-5-splash.png'
          media='(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)'
        />
        <link
          rel='apple-touch-startup-image'
          href='/iphone-6-splash.png'
          media='(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)'
        />
        <link
          rel='apple-touch-startup-image'
          href='/iphone-6-plus-splash.png'
          media='(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3)'
        />
        <link
          rel='apple-touch-startup-image'
          href='/iphone-x-splash.png'
          media='(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)'
        />
        <link
          rel='apple-touch-startup-image'
          href='/iphone-xr-splash.png'
          media='(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)'
        />
        <link
          rel='apple-touch-startup-image'
          href='/iphone-xs-max-splash.png'
          media='(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)'
        />
        <link
          rel='apple-touch-startup-image'
          href='/iphone-12-splash.png'
          media='(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)'
        />
        <link
          rel='apple-touch-startup-image'
          href='/iphone-12-pro-max-splash.png'
          media='(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3)'
        />
        <link
          rel='apple-touch-startup-image'
          href='/ipad-splash.png'
          media='(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)'
        />
        <link
          rel='apple-touch-startup-image'
          href='/ipad-pro-10-splash.png'
          media='(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2)'
        />
        <link
          rel='apple-touch-startup-image'
          href='/ipad-pro-12-splash.png'
          media='(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)'
        />

        {/* PWA Manifest */}
        <link rel='manifest' href='/manifest.json' />
        <meta name='theme-color' content='#6366f1' />
        <meta
          name='theme-color'
          content='#ffffff'
          media='(prefers-color-scheme: light)'
        />
        <meta
          name='theme-color'
          content='#1f2937'
          media='(prefers-color-scheme: dark)'
        />
      </head>
      <body className='antialiased bg-background text-foreground font-sans'>
        <ErrorBoundary componentName='RootLayout'>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            <AuthInitializer>
              {children}
              <Toaster />
            </AuthInitializer>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
