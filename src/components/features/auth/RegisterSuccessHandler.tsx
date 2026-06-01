'use client'

import { useRouter } from '@/i18n/navigation'
import { useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { useToast } from '@/hooks/use-toast'
import dynamic from 'next/dynamic'
import { Card, CardContent } from '@/components/ui'
import { Skeleton } from '@/components/ui/skeleton'

const RegisterForm = dynamic(() => import('./RegisterForm'), {
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
})

const DEFAULT_REDIRECT = '/showcase'

export default function RegisterSuccessHandler() {
  const router = useRouter()
  const { toast } = useToast()
  const t = useTranslations('auth.register')

  const handleRegisterSuccess = useCallback(() => {
    toast.success(t('successMessage'))
    router.push(DEFAULT_REDIRECT)
  }, [router, toast, t])

  return <RegisterForm onSuccess={handleRegisterSuccess} />
}
