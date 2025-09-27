import { redirect } from 'next/navigation'
import { defaultLocale } from '@/i18n/config'

// Root page that redirects to default locale
// This serves as a backup to the middleware
export default function RootPage() {
  redirect(`/${defaultLocale}`)
}
