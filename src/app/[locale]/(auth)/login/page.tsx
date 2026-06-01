import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import LoginRedirectHandler from '@/components/features/auth/LoginRedirectHandler'

interface LoginPageProps {
  searchParams: Promise<{ redirect?: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { redirect } = await searchParams
  const t = await getTranslations('auth.login')
  const tAuth = await getTranslations('auth')

  return (
    <div className='space-y-6'>
      {/* Welcome Header */}
      <div className='text-center space-y-2'>
        <h1 className='text-3xl font-bold'>{tAuth('welcome')}</h1>
        <p className='text-muted-foreground'>
          {redirect ? t('signInToAccess') : t('signInToContinue')}
        </p>
      </div>

      {/* Redirect Notice */}
      {redirect && (
        <div className='p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg'>
          <p className='text-sm text-amber-700 dark:text-amber-300'>
            {t('needSignInAccess')}{' '}
            <span className='font-medium'>{redirect}</span>
          </p>
        </div>
      )}

      {/* Login Form — handles credential state, validation, and submission */}
      <Suspense
        fallback={
          <div className='flex items-center justify-center min-h-[200px]'>
            Loading...
          </div>
        }
      >
        <LoginRedirectHandler
          {...(redirect !== undefined ? { redirectParam: redirect } : {})}
        />
      </Suspense>

      {/* Links */}
      <div className='text-center text-sm'>
        <div className='flex items-center justify-center space-x-1'>
          <span className='text-muted-foreground'>{t('dontHaveAccount')}</span>
          <Link
            href='/register'
            className='font-medium text-primary hover:underline'
          >
            {t('createOneHere')}
          </Link>
        </div>
        <div className='mt-2'>
          <Link
            href='/forgot-password'
            className='text-primary hover:underline'
          >
            {t('forgotYourPassword')}
          </Link>
        </div>
      </div>
    </div>
  )
}
