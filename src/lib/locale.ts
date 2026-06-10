import { locales, defaultLocale, type Locale } from '@/i18n/config'

/** Extract the active locale from a browser pathname, falling back to the default locale. */
export function getLocaleFromPathname(pathname: string): Locale {
  const segment = pathname.split('/')[1]
  return locales.includes(segment as Locale)
    ? (segment as Locale)
    : defaultLocale
}
