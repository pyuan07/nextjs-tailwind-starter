'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Button, Input, Label } from '@/components/ui'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const { toast } = useToast()
  const t = useTranslations('auth.forgotPassword')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      toast.error(t('enterEmailError'))
      return
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error(t('invalidEmailError'))
      return
    }

    try {
      setIsLoading(true)
      // Simulate API call for demo
      await new Promise(resolve => setTimeout(resolve, 2000))
      setIsSubmitted(true)
      toast.success(t('resetSuccessMessage'))
    } catch (_error) {
      toast.error(t('resetErrorMessage'))
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className='space-y-6'>
        <div className='text-center space-y-2'>
          <h1 className='text-3xl font-display font-bold'>
            {t('checkEmailTitle')}
          </h1>
          <p className='text-muted-foreground'>
            {t('checkEmailDescription')} <strong>{email}</strong>
          </p>
        </div>

        <div className='rounded-2xl border border-border/60 bg-card p-6 text-center space-y-4'>
          <div className='w-14 h-14 rounded-full bg-chart-3/15 text-chart-3 text-2xl flex items-center justify-center mx-auto'>
            ✓
          </div>
          <div>
            <h3 className='font-medium'>{t('emailSentTitle')}</h3>
            <p className='text-sm text-muted-foreground mt-2'>
              {t('emailSentDescription')}
            </p>
          </div>
        </div>

        <div className='text-center text-sm space-y-4'>
          <div>
            <span className='text-muted-foreground'>{t('didntReceive')}</span>
            <button
              onClick={() => setIsSubmitted(false)}
              className='ml-2 font-medium text-primary hover:underline'
            >
              {t('tryAgain')}
            </button>
          </div>

          <Link
            href='/login'
            className='inline-flex items-center gap-2 text-primary hover:underline'
          >
            {t('backToLogin')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div className='text-center space-y-2'>
        <h1 className='text-3xl font-display font-bold'>{t('pageTitle')}</h1>
        <p className='text-muted-foreground'>{t('pageDescription')}</p>
      </div>

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='email'>{t('emailAddress')}</Label>
          <Input
            id='email'
            type='email'
            inputMode='email'
            autoComplete='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={isLoading}
            placeholder={t('emailPlaceholder')}
            className='min-h-11 text-base'
          />
        </div>

        <Button type='submit' disabled={isLoading} className='w-full min-h-11'>
          {isLoading ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              {t('sendingReset')}
            </>
          ) : (
            t('sendReset')
          )}
        </Button>
      </form>

      <div className='text-center text-sm'>
        <Link
          href='/login'
          className='inline-flex items-center gap-2 text-primary hover:underline'
        >
          {t('backToLogin')}
        </Link>
      </div>
    </div>
  )
}
