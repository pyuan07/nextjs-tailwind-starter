import { redirect } from 'next/navigation'
import { defaultLocale } from '@/i18n/config'

// Bare /terms is unreachable when localePrefix:'always' is set — the intl
// middleware redirects it to /{defaultLocale}/terms automatically. This
// component is a belt-and-suspenders fallback.
export default function TermsRedirect() {
  redirect(`/${defaultLocale}/terms`)
}
