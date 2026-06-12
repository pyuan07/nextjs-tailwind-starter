import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import RegisterSuccessHandler from '@/components/features/auth/RegisterSuccessHandler'

export default async function RegisterPage() {
  const t = await getTranslations('auth.register')

  return (
    <div className='space-y-6'>
      {/* Welcome Header */}
      <div className='text-center space-y-2'>
        <h1 className='text-3xl font-display font-bold'>{t('pageTitle')}</h1>
        <p className='text-muted-foreground'>{t('pageDescription')}</p>
      </div>

      {/* Register Form — handles credential state, validation, and submission */}
      <Suspense
        fallback={
          <div className='flex items-center justify-center min-h-[200px]'>
            Loading...
          </div>
        }
      >
        <RegisterSuccessHandler />
      </Suspense>

      {/* Links */}
      <div className='text-center text-sm'>
        <div className='flex items-center justify-center space-x-1'>
          <span className='text-muted-foreground'>{t('hasAccount')}</span>
          <Link
            href='/login'
            className='font-medium text-primary hover:underline'
          >
            {t('signIn')}
          </Link>
        </div>
      </div>
    </div>
  )
}
