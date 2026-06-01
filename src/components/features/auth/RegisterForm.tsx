'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { useAuth } from '@/hooks'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Checkbox,
  Alert,
  AlertDescription,
} from '@/components/ui'
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
import { registerSchema, type RegisterFormData } from '@/lib/validations/auth'

interface RegisterFormProps {
  onSuccess?: () => void
  className?: string
}

function RegisterFormContent({ onSuccess, className }: RegisterFormProps) {
  const { register: registerUser, isLoading, error } = useAuth()
  const tRegister = useTranslations('auth.register')
  const tValidation = useTranslations('validation')

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      })
      onSuccess?.()
    } catch {
      // Error is already handled by the hook and surfaced via error
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{tRegister('title')}</CardTitle>
        <CardDescription>{tRegister('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tRegister('name')}</FormLabel>
                  <FormControl>
                    <Input
                      type='text'
                      autoComplete='name'
                      placeholder={tRegister('namePlaceholder')}
                      disabled={isLoading}
                      className='min-h-11 text-base'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.name?.message
                      ? tValidation(
                          form.formState.errors.name.message as Parameters<
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
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tRegister('email')}</FormLabel>
                  <FormControl>
                    <Input
                      type='email'
                      inputMode='email'
                      autoComplete='email'
                      placeholder={tRegister('emailPlaceholder')}
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
                  <FormLabel>{tRegister('password')}</FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      autoComplete='new-password'
                      placeholder={tRegister('passwordPlaceholder')}
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
              name='confirmPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tRegister('confirmPassword')}</FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      autoComplete='new-password'
                      placeholder={tRegister('passwordPlaceholder')}
                      disabled={isLoading}
                      className='min-h-11 text-base'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.confirmPassword?.message
                      ? tValidation(
                          form.formState.errors.confirmPassword
                            .message as Parameters<typeof tValidation>[0]
                        )
                      : null}
                  </FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='acceptTerms'
              render={({ field }) => (
                <FormItem className='flex items-start space-x-2 space-y-0'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading}
                      className='mt-0.5'
                    />
                  </FormControl>
                  <div className='grid gap-1.5 leading-none'>
                    <FormLabel className='font-normal cursor-pointer text-sm'>
                      {tRegister('agreeTerms')}
                    </FormLabel>
                    <FormMessage>
                      {form.formState.errors.acceptTerms?.message
                        ? tValidation(
                            form.formState.errors.acceptTerms
                              .message as Parameters<typeof tValidation>[0]
                          )
                        : null}
                    </FormMessage>
                  </div>
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
              className='w-full min-h-11 touch-manipulation'
            >
              {isLoading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  {tRegister('creatingAccount')}
                </>
              ) : (
                tRegister('createAccount')
              )}
            </Button>

            <p className='text-center text-sm text-muted-foreground'>
              {tRegister('hasAccount')}{' '}
              <Link
                href='/login'
                className='font-medium text-primary hover:underline'
              >
                {tRegister('signIn')}
              </Link>
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default function RegisterForm(props: RegisterFormProps) {
  return (
    <SectionErrorBoundary
      componentName='RegisterForm'
      title='Register Error'
      description='The registration form encountered an error. Please refresh the page and try again.'
    >
      <RegisterFormContent {...props} />
    </SectionErrorBoundary>
  )
}
