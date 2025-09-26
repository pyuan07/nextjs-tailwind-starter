import { getRequestConfig } from 'next-intl/server'
import { headers } from 'next/headers'
import { locales, defaultLocale, type Locale } from './config'

export default getRequestConfig(async () => {
  // Get locale from cookie header, fallback to default
  const headersList = await headers()
  const cookieHeader = headersList.get('cookie') || ''

  const localeMatch = cookieHeader.match(/locale=([^;]+)/)
  const locale = (localeMatch?.[1] as Locale) || defaultLocale

  // Ensure locale is valid
  const validLocale = locales.includes(locale as Locale)
    ? locale
    : defaultLocale

  return {
    locale: validLocale,
    messages: (await import(`../../messages/${validLocale}/index.ts`)).default,
  }
})
