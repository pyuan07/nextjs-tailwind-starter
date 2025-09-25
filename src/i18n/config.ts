// Shared configuration constants that can be used by both client and server
export const locales = ['en', 'zh', 'ms'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'

export const localeNames: Record<Locale, string> = {
  en: 'English',
  zh: '中文',
  ms: 'Bahasa Melayu',
}

export const localeFlags: Record<Locale, string> = {
  en: '🇺🇸',
  zh: '🇨🇳',
  ms: '🇲🇾',
}

// Client-side locale management
export function getClientLocale(): Locale {
  if (typeof window === 'undefined') return defaultLocale

  const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith('locale='))
    ?.split('=')[1] as Locale

  return locales.includes(cookieValue) ? cookieValue : defaultLocale
}

export function setClientLocale(locale: Locale): void {
  if (typeof window === 'undefined') return

  // Set cookie with 1 year expiry
  document.cookie = `locale=${locale}; path=/; max-age=${365 * 24 * 60 * 60}`

  // Reload to apply server-side locale changes
  window.location.reload()
}
