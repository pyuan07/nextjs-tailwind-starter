import type { Metadata } from 'next'
// Using system fonts and web-safe alternatives for commercial use
import { Toaster } from '@/components/ui/sonner'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { AuthInitializer } from '@/components/providers/auth-initializer'
import { ConditionalNavbar } from '@/components/features/common/ConditionalNavbar'
import {
  generateMetadata as generateSEOMetadata,
  generateViewport as generateSEOViewport,
  structuredDataGenerators,
} from '@/lib/seo'
import { env } from '@/config/env'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { locales, type Locale } from '@/i18n/config'
import { notFound } from 'next/navigation'
import '../globals.css'

// System fonts are defined in globals.css for better performance and commercial safety

// Generate structured data JSON-LD
function generateStructuredDataScript() {
  const baseUrl = env.isDevelopment
    ? 'http://localhost:3000'
    : process.env.NEXT_PUBLIC_APP_URL || 'https://example.com'

  const structuredData = [
    structuredDataGenerators.website({
      name: env.APP_NAME,
      url: baseUrl,
      description:
        'A production-ready Next.js 15 starter template with TypeScript, Tailwind CSS v4, and modern best practices.',
    }),
    structuredDataGenerators.organization({
      name: env.APP_NAME,
      url: baseUrl,
      logo: `${baseUrl}/icon-512.png`,
      description:
        'Modern web development tools and templates for building scalable applications.',
      sameAs: ['https://github.com/yourusername/nextjs-tailwind-starter'],
    }),
  ]

  return JSON.stringify(structuredData)
}

// Comprehensive SEO metadata with all optimizations
export const metadata: Metadata = {
  ...generateSEOMetadata({
    title: 'React Tailwind Starter - Modern Next.js Boilerplate',
    description:
      'A production-ready Next.js 15 starter template with TypeScript, Tailwind CSS v4, shadcn/ui, authentication, and modern best practices. Build fast, secure, and scalable web applications.',
    keywords: [
      'Next.js 15',
      'React 19',
      'TypeScript',
      'Tailwind CSS v4',
      'shadcn/ui',
      'Modern Web Development',
      'Production Ready',
      'Boilerplate',
      'Starter Template',
      'Authentication',
      'Security',
      'Performance',
      'Accessibility',
      'Full Stack',
    ],
    author: 'React Tailwind Starter Team',
    type: 'website',
  }),
  other: {
    'application/ld+json': generateStructuredDataScript(),
  },
}

export function generateStaticParams() {
  return locales.map(locale => ({ locale }))
}

// Generate viewport configuration for Next.js 15+ compliance
export const viewport = generateSEOViewport()

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as Locale)) {
    notFound()
  }

  // Get messages for the locale
  const messages = await getMessages()
  const baseUrl = env.isDevelopment
    ? 'http://localhost:3000'
    : process.env.NEXT_PUBLIC_APP_URL || 'https://example.com'

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Structured Data moved to metadata export - see below */}

        {/* Additional meta tags for enhanced SEO */}
        <meta name='format-detection' content='telephone=no' />
        <meta name='mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-status-bar-style' content='default' />
        <meta name='apple-mobile-web-app-title' content={env.APP_NAME} />

        {/* No external font dependencies - using system fonts for better performance and commercial safety */}

        {/* Alternate languages */}
        {locales.map(loc => (
          <link
            key={loc}
            rel='alternate'
            hrefLang={loc}
            href={`${baseUrl}/${loc}`}
          />
        ))}

        {/* RSS Feed (add if applicable) */}
        {/* <link rel="alternate" type="application/rss+xml" title="RSS Feed" href={`${baseUrl}/feed.xml`} /> */}
      </head>
      <body className='antialiased bg-background text-foreground font-sans'>
        <ErrorBoundary componentName='LocaleLayout'>
          <NextIntlClientProvider messages={messages}>
            <ThemeProvider
              attribute='class'
              defaultTheme='system'
              enableSystem
              disableTransitionOnChange
            >
              <AuthInitializer>
                <ConditionalNavbar />
                {children}
                <Toaster />
              </AuthInitializer>
            </ThemeProvider>
          </NextIntlClientProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
