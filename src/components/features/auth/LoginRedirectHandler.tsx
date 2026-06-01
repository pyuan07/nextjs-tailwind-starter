'use client'

import { useRouter } from '@/i18n/navigation'
import { useCallback } from 'react'
import { locales } from '@/i18n/config'
import { validateRedirectUrl } from '@/utils/security'
import LoginForm from './LoginForm'

interface LoginRedirectHandlerProps {
  redirectParam?: string
}

const DEFAULT_REDIRECT = '/showcase'

function getPathWithoutLocale(path: string): string {
  const segments = path.split('/').filter(Boolean)
  if (locales.includes(segments[0] as (typeof locales)[number])) {
    return `/${segments.slice(1).join('/')}`
  }
  return path
}

export default function LoginRedirectHandler({
  redirectParam,
}: LoginRedirectHandlerProps) {
  const router = useRouter()

  const redirectTo = redirectParam
    ? getPathWithoutLocale(redirectParam)
    : DEFAULT_REDIRECT

  const handleSuccess = useCallback(() => {
    const isValidRedirect =
      validateRedirectUrl(redirectTo) && redirectTo.startsWith('/')
    router.push(isValidRedirect ? redirectTo : DEFAULT_REDIRECT)
  }, [redirectTo, router])

  return <LoginForm onSuccess={handleSuccess} />
}
