'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from '@/components/ui'
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
          <h1 className='text-3xl font-bold'>{t('checkEmailTitle')}</h1>
          <p className='text-muted-foreground'>
            {t('checkEmailDescription')} <strong>{email}</strong>
          </p>
        </div>

        <Card>
          <CardContent className='pt-6 text-center space-y-4'>
            <div className='w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto'>
              ✓
            </div>
            <div>
              <h3 className='font-medium'>{t('emailSentTitle')}</h3>
              <p className='text-sm text-muted-foreground mt-2'>
                {t('emailSentDescription')}
              </p>
            </div>
          </CardContent>
        </Card>

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
        <h1 className='text-3xl font-bold'>{t('pageTitle')}</h1>
        <p className='text-muted-foreground'>{t('pageDescription')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('resetTitle')}</CardTitle>
          <CardDescription>{t('resetDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='email'>{t('emailAddress')}</Label>
              <Input
                id='email'
                type='email'
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={isLoading}
                placeholder={t('emailPlaceholder')}
              />
            </div>

            <Button type='submit' disabled={isLoading} className='w-full'>
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
        </CardContent>
      </Card>

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
