import { redirect } from 'next/navigation'
import { defaultLocale } from '@/i18n/config'

// Bare /privacy is unreachable when localePrefix:'always' is set — the intl
// middleware redirects it to /{defaultLocale}/privacy automatically. This
// component is a belt-and-suspenders fallback.
export default function PrivacyRedirect() {
  redirect(`/${defaultLocale}/privacy`)
}
