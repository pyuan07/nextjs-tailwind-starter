'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
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
import { Link } from '@/i18n/navigation'

const resetSchema = z
  .object({
    password: z.string().min(8, { message: 'passwordTooShort' }),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'passwordMismatch',
    path: ['confirmPassword'],
  })

type ResetFormData = z.infer<typeof resetSchema>
type ErrorKey = 'passwordTooShort' | 'passwordMismatch'

export default function ResetPasswordPage() {
  const t = useTranslations('auth.resetPassword')
  const tErrors = useTranslations('auth.errors')
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
  })

  async function onSubmit(_data: ResetFormData) {
    if (!token) return
    setLoading(true)
    try {
      // Wire to real API: POST /api/auth/reset-password with token + _data.password
      await new Promise(resolve => setTimeout(resolve, 500))
      setSuccess(true)
      toast.success(t('successMessage'))
    } catch {
      toast.error(t('errorMessage'))
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <Card className='w-full max-w-md mx-auto mt-16'>
        <CardHeader>
          <CardTitle>{t('invalidToken')}</CardTitle>
          <CardDescription>{t('invalidTokenDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href='/forgot-password'>
            <Button variant='outline' className='w-full min-h-11'>
              {t('requestNewLink')}
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  if (success) {
    return (
      <Card className='w-full max-w-md mx-auto mt-16'>
        <CardHeader>
          <CardTitle>{t('successTitle')}</CardTitle>
          <CardDescription>{t('successDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href='/login'>
            <Button className='w-full min-h-11'>{t('backToLogin')}</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className='w-full max-w-md mx-auto mt-16'>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='password'>{t('newPassword')}</Label>
            <Input
              id='password'
              type='password'
              autoComplete='new-password'
              {...register('password')}
              className='text-base'
            />
            {formState.errors.password && (
              <p className='text-sm text-destructive'>
                {tErrors(formState.errors.password.message as ErrorKey)}
              </p>
            )}
          </div>
          <div className='space-y-2'>
            <Label htmlFor='confirmPassword'>{t('confirmPassword')}</Label>
            <Input
              id='confirmPassword'
              type='password'
              autoComplete='new-password'
              {...register('confirmPassword')}
              className='text-base'
            />
            {formState.errors.confirmPassword && (
              <p className='text-sm text-destructive'>
                {tErrors(formState.errors.confirmPassword.message as ErrorKey)}
              </p>
            )}
          </div>
          <Button type='submit' disabled={loading} className='w-full min-h-11'>
            {loading ? t('resetting') : t('resetButton')}
          </Button>
          <div className='text-center'>
            <Link
              href='/login'
              className='text-sm text-muted-foreground hover:text-foreground transition-colors'
            >
              {t('backToLogin')}
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
