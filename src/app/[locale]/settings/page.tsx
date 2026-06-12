'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
import { useAuthStore } from '@/stores'

const profileSchema = z.object({
  name: z.string().min(2, { message: 'nameMinLength' }),
  email: z.string().email({ message: 'emailInvalid' }),
})

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, { message: 'passwordRequired' }),
    newPassword: z.string().min(8, { message: 'passwordTooShort' }),
    confirmPassword: z.string(),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'passwordMismatch',
    path: ['confirmPassword'],
  })

type ProfileFormData = z.infer<typeof profileSchema>
type PasswordFormData = z.infer<typeof passwordSchema>
type ErrorKey =
  | 'nameMinLength'
  | 'emailInvalid'
  | 'passwordRequired'
  | 'passwordTooShort'
  | 'passwordMismatch'

export default function SettingsPage() {
  const t = useTranslations('pages.settings')
  const tErrors = useTranslations('auth.errors')
  const { user, updateProfile, isLoading } = useAuthStore()
  const [passwordLoading, setPasswordLoading] = useState(false)

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name ?? '', email: user?.email ?? '' },
  })

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  async function onProfileSubmit(data: ProfileFormData) {
    try {
      await updateProfile(data)
      toast.success(t('profileSaved'))
    } catch {
      toast.error(t('profileSaveError'))
    }
  }

  async function onPasswordSubmit(_data: PasswordFormData) {
    setPasswordLoading(true)
    try {
      // Wire to real API when USE_REAL_API=true
      await new Promise(resolve => setTimeout(resolve, 500))
      toast.success(t('passwordChanged'))
      passwordForm.reset()
    } catch {
      toast.error(t('passwordChangeError'))
    } finally {
      setPasswordLoading(false)
    }
  }

  return (
    <div className='relative min-h-screen'>
      {/* Ambient background */}
      <div
        className='fixed inset-0 bg-mesh pointer-events-none'
        aria-hidden='true'
      />
      <div
        className='fixed inset-0 grid-dots pointer-events-none opacity-30'
        aria-hidden='true'
      />

      <main
        id='main-content'
        className='relative container mx-auto px-4 py-10 max-w-2xl'
      >
        <div className='mb-8'>
          <h1 className='font-display text-3xl font-bold tracking-tight'>
            {t('title')}
          </h1>
          <p className='text-muted-foreground mt-1'>{t('description')}</p>
        </div>

        <div className='space-y-6'>
          {/* Profile */}
          <Card className='rounded-2xl'>
            <CardHeader>
              <CardTitle className='font-display'>
                {t('profileSection')}
              </CardTitle>
              <CardDescription>{t('profileSectionDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                className='space-y-4'
              >
                <div className='space-y-2'>
                  <Label htmlFor='name'>{t('name')}</Label>
                  <Input
                    id='name'
                    {...profileForm.register('name')}
                    className='text-base'
                  />
                  {profileForm.formState.errors.name && (
                    <p className='text-sm text-destructive'>
                      {tErrors(
                        profileForm.formState.errors.name.message as ErrorKey
                      )}
                    </p>
                  )}
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='email'>{t('email')}</Label>
                  <Input
                    id='email'
                    type='email'
                    inputMode='email'
                    autoComplete='email'
                    {...profileForm.register('email')}
                    className='text-base'
                  />
                  {profileForm.formState.errors.email && (
                    <p className='text-sm text-destructive'>
                      {tErrors(
                        profileForm.formState.errors.email.message as ErrorKey
                      )}
                    </p>
                  )}
                </div>
                <Button type='submit' disabled={isLoading} className='min-h-11'>
                  {isLoading ? t('saving') : t('saveProfile')}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card className='rounded-2xl'>
            <CardHeader>
              <CardTitle className='font-display'>
                {t('passwordSection')}
              </CardTitle>
              <CardDescription>{t('passwordSectionDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                className='space-y-4'
              >
                <div className='space-y-2'>
                  <Label htmlFor='currentPassword'>
                    {t('currentPassword')}
                  </Label>
                  <Input
                    id='currentPassword'
                    type='password'
                    autoComplete='current-password'
                    {...passwordForm.register('currentPassword')}
                    className='text-base'
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='newPassword'>{t('newPassword')}</Label>
                  <Input
                    id='newPassword'
                    type='password'
                    autoComplete='new-password'
                    {...passwordForm.register('newPassword')}
                    className='text-base'
                  />
                  {passwordForm.formState.errors.newPassword && (
                    <p className='text-sm text-destructive'>
                      {tErrors(
                        passwordForm.formState.errors.newPassword
                          .message as ErrorKey
                      )}
                    </p>
                  )}
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='confirmPassword'>
                    {t('confirmPassword')}
                  </Label>
                  <Input
                    id='confirmPassword'
                    type='password'
                    autoComplete='new-password'
                    {...passwordForm.register('confirmPassword')}
                    className='text-base'
                  />
                  {passwordForm.formState.errors.confirmPassword && (
                    <p className='text-sm text-destructive'>
                      {tErrors(
                        passwordForm.formState.errors.confirmPassword
                          .message as ErrorKey
                      )}
                    </p>
                  )}
                </div>
                <Button
                  type='submit'
                  disabled={passwordLoading}
                  className='min-h-11'
                >
                  {passwordLoading ? t('changing') : t('changePassword')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
