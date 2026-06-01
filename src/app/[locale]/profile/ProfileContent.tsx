'use client'

import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@/hooks'
import { AuthGuard } from '@/components/features'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Icon } from '@/lib/icons'
import { useToast } from '@/hooks/use-toast'
import {
  profileUpdateSchema,
  type ProfileUpdateData,
} from '@/lib/validations/auth'

function ProfileContent() {
  const { user, logout, updateProfile } = useAuth()
  const t = useTranslations('pages.profile')
  const { toast } = useToast()

  const form = useForm<ProfileUpdateData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
    },
  })

  const handleLogout = async () => {
    try {
      await logout()
    } catch (_error) {
      // Error is handled by the hook
    }
  }

  const onSubmit = async (data: ProfileUpdateData) => {
    try {
      await updateProfile(data)
      toast.success(t('saveChanges'))
    } catch (_error) {
      // Error is handled by the store
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className='min-h-screen bg-background'>
      <main className='container mx-auto px-4 py-8 max-w-4xl'>
        <div className='space-y-8'>
          <div>
            <h1 className='text-3xl font-bold'>{t('pageTitle')}</h1>
            <p className='text-muted-foreground'>{t('pageDescription')}</p>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Icon name='user' size='md' />
                  {t('title')}
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='text-center'>
                  <div className='w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl'>
                    {user.name.charAt(0)}
                  </div>
                  <h3 className='font-semibold'>{user.name}</h3>
                  <p className='text-sm text-muted-foreground'>{user.email}</p>
                </div>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-3'
                  >
                    <FormField
                      control={form.control}
                      name='name'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('name')}</FormLabel>
                          <FormControl>
                            <Input {...field} type='text' />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='email'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('email')}</FormLabel>
                          <FormControl>
                            <Input {...field} type='email' inputMode='email' />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type='submit'
                      className='w-full flex items-center gap-2'
                      disabled={form.formState.isSubmitting}
                    >
                      <Icon name='save' size='sm' />
                      {form.formState.isSubmitting ? '...' : t('saveChanges')}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Icon name='security' size='md' />
                  {t('security')}
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex justify-between items-center p-3 border rounded'>
                  <span>{t('password')}</span>
                  <Button variant='outline' size='sm'>
                    {t('changePassword')}
                  </Button>
                </div>

                <div className='flex justify-between items-center p-3 border rounded'>
                  <span>{t('twoFactorAuth')}</span>
                  <Button variant='outline' size='sm'>
                    {t('enableTwoFactor')}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Icon name='settings' size='md' />
                  {t('preferences')}
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex justify-between items-center'>
                  <span>{t('emailNotifications')}</span>
                  <input type='checkbox' defaultChecked />
                </div>
                <div className='flex justify-between items-center'>
                  <span>{t('marketingEmails')}</span>
                  <input type='checkbox' />
                </div>
              </CardContent>
            </Card>

            <Card className='border-red-200'>
              <CardHeader>
                <CardTitle className='text-red-600 flex items-center gap-2'>
                  <Icon name='warning' size='md' />
                  {t('dangerZone')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant='destructive' size='sm' onClick={handleLogout}>
                  {t('logout')}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

export function ProfilePage() {
  return (
    <AuthGuard>
      <ProfileContent />
    </AuthGuard>
  )
}
