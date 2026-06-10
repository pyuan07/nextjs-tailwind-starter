import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from 'next-intl/server'
import { notFound } from 'next/navigation'
import { locales, type Locale } from '@/i18n/config'
import { ConditionalNavbar } from '@/components/features/common/ConditionalNavbar'
import { PWAInstallPrompt, OfflineIndicator } from '@/components/features/pwa'

interface LocaleLayoutProps {
  children: ReactNode
  params: Promise<{ locale: string }>
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'common.brand' })
  return {
    title: { default: t('name'), template: `%s | ${t('name')}` },
    description: t('description'),
  }
}

export function generateStaticParams() {
  return locales.map(locale => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params

  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as Locale)) {
    notFound()
  }

  // Enable static rendering for i18n routes
  setRequestLocale(locale)

  // Get messages for the specific locale
  const messages = await getMessages({ locale })

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <a
        href='#main-content'
        className='sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded focus:bg-background focus:px-4 focus:py-2 focus:text-foreground focus:shadow-lg focus:outline-none'
      >
        Skip to main content
      </a>
      <ConditionalNavbar />
      {children}
      <PWAInstallPrompt />
      <OfflineIndicator />
    </NextIntlClientProvider>
  )
}
