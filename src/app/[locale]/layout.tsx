import type { ReactNode } from 'react'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { locales, type Locale } from '@/i18n/config'
import { ConditionalNavbar } from '@/components/features/common/ConditionalNavbar'
import { PWAInstallPrompt, OfflineIndicator } from '@/components/features/pwa'

interface LocaleLayoutProps {
  children: ReactNode
  params: Promise<{ locale: string }>
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
      <ConditionalNavbar />
      {children}
      <PWAInstallPrompt />
      <OfflineIndicator />
    </NextIntlClientProvider>
  )
}
