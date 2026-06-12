'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useAuth } from '@/hooks'
import {
  Button,
  Input,
  PasswordInput,
  Checkbox,
  Alert,
  AlertDescription,
} from '@/components/ui'
import { cn } from '@/lib/utils'
import { USE_REAL_API_CLIENT } from '@/constants/config'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { SectionErrorBoundary } from '@/components/ui/error-boundary'
import { Loader2 } from 'lucide-react'
import { loginSchema, type LoginFormData } from '@/lib/validations/auth'

interface LoginFormProps {
  onSuccess?: () => void
  className?: string
}

function LoginFormContent({ onSuccess, className }: LoginFormProps) {
  const { login, isLoading, error } = useAuth()
  const t = useTranslations('auth.login')
  const tValidation = useTranslations('validation')

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', remember: false },
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login({
        email: data.email,
        password: data.password,
        ...(data.remember !== undefined ? { remember: data.remember } : {}),
      })
      onSuccess?.()
    } catch {
      // Error is already handled by the hook and surfaced via `error`
    }
  }

  const handleDemoLogin = () => {
    form.setValue('email', 'demo@example.com')
    form.setValue('password', 'password')
  }

  return (
    <div className={cn('space-y-5', className)}>
      {/* Demo credentials only make sense against the built-in mock auth.
          Hide them when the app is wired to a real API backend. */}
      {!USE_REAL_API_CLIENT && (
        <div className='rounded-xl border border-brand/20 bg-brand-subtle/40 p-4'>
          <p className='text-sm font-medium text-foreground mb-1.5'>
            {t('demoCredentials')}
          </p>
          <ul className='text-xs text-muted-foreground font-mono space-y-0.5'>
            <li>demo@example.com</li>
            <li>password</li>
          </ul>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={handleDemoLogin}
            className='mt-2 -ml-2 h-8 text-brand hover:text-brand hover:bg-brand-subtle'
          >
            {t('clickUseDemoCredentials')} →
          </Button>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('email')}</FormLabel>
                <FormControl>
                  <Input
                    type='email'
                    inputMode='email'
                    autoComplete='email'
                    placeholder={t('enterYourEmail')}
                    disabled={isLoading}
                    className='min-h-11 text-base'
                    {...field}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.email?.message
                    ? tValidation(
                        form.formState.errors.email.message as Parameters<
                          typeof tValidation
                        >[0]
                      )
                    : null}
                </FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('password')}</FormLabel>
                <FormControl>
                  <PasswordInput
                    autoComplete='current-password'
                    placeholder={t('enterYourPassword')}
                    disabled={isLoading}
                    className='min-h-11 text-base'
                    {...field}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.password?.message
                    ? tValidation(
                        form.formState.errors.password.message as Parameters<
                          typeof tValidation
                        >[0]
                      )
                    : null}
                </FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='remember'
            render={({ field }) => (
              <FormItem className='flex items-center space-x-2 space-y-0'>
                <FormControl>
                  <Checkbox
                    checked={field.value ?? false}
                    onCheckedChange={field.onChange}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormLabel className='font-normal cursor-pointer'>
                  {t('rememberMe')}
                </FormLabel>
              </FormItem>
            )}
          />

          {error && (
            <Alert variant='destructive'>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type='submit'
            disabled={isLoading}
            className='w-full min-h-11'
          >
            {isLoading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                {t('signingIn')}
              </>
            ) : (
              t('signIn')
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default function LoginForm(props: LoginFormProps) {
  const tErrors = useTranslations('common.errors')
  return (
    <SectionErrorBoundary
      componentName='LoginForm'
      title={tErrors('loginError')}
      description={tErrors('formErrorDesc')}
    >
      <LoginFormContent {...props} />
    </SectionErrorBoundary>
  )
}
