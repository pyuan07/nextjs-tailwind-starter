'use client'

import { useEffect } from 'react'
import { useRouter } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { useAuth } from '@/hooks'
import { Card, CardContent } from '@/components/ui'
import { useToast } from '@/hooks/use-toast'
import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'

const RegisterForm = dynamic(
  () => import('@/components/features/auth/RegisterForm'),
  {
    loading: () => (
      <Card>
        <CardContent className='p-6 space-y-4'>
          <div className='space-y-2'>
            <Skeleton className='h-6 w-32' />
            <Skeleton className='h-4 w-48' />
          </div>
          <div className='space-y-4'>
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className='h-10 w-full' />
            ))}
          </div>
          <Skeleton className='h-10 w-full' />
        </CardContent>
      </Card>
    ),
  }
)

export default function RegisterPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()
  const { toast } = useToast()
  const t = useTranslations('auth.register')

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/showcase')
    }
  }, [isAuthenticated, isLoading, router])

  // Show loading while checking auth status
  if (isLoading) {
    return (
      <Card>
        <CardContent className='flex items-center justify-center py-12'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
        </CardContent>
      </Card>
    )
  }

  // Don't render if authenticated (will redirect)
  if (isAuthenticated) {
    return null
  }

  const handleRegisterSuccess = () => {
    toast.success(t('successMessage'))
    router.push('/showcase')
  }

  return (
    <div className='space-y-6'>
      {/* Welcome Header */}
      <div className='text-center space-y-2'>
        <h1 className='text-3xl font-bold'>{t('pageTitle')}</h1>
        <p className='text-muted-foreground'>{t('pageDescription')}</p>
      </div>

      {/* Register Form */}
      <RegisterForm onSuccess={handleRegisterSuccess} />

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
