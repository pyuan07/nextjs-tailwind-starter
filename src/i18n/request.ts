import { getRequestConfig } from 'next-intl/server'
import { locales, defaultLocale, type Locale } from './config'

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locale || !locales.includes(locale as Locale)) {
    return {
      locale: defaultLocale,
      messages: (await import(`../../messages/${defaultLocale}.json`)).default,
    }
  }

  const messages = (await import(`../../messages/${locale}.json`)).default

  return {
    locale,
    messages,
  }
})
