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
