'use client'

import { useState } from 'react'
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
  Label,
  Checkbox,
  Alert,
  AlertDescription,
} from '@/components/ui'
import { SectionErrorBoundary } from '@/components/ui/error-boundary'
import { Loader2 } from 'lucide-react'

interface RegisterFormProps {
  onSuccess?: () => void
  className?: string
}

function RegisterFormContent({ onSuccess, className }: RegisterFormProps) {
  const { register: registerUser, isLoading, error } = useAuth()
  const tRegister = useTranslations('auth.register')
  const tErrors = useTranslations('auth.errors')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!formData.name.trim()) errors.name = tErrors('nameRequired')
    if (!formData.email.trim()) errors.email = tErrors('emailRequired')
    if (!/\S+@\S+\.\S+/.test(formData.email))
      errors.email = tErrors('emailInvalid')
    if (!formData.password) errors.password = tErrors('passwordRequired')
    if (formData.password.length < 8)
      errors.password = tErrors('passwordTooShort')
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = tErrors('passwordMismatch')
    }
    if (!formData.acceptTerms) {
      errors.acceptTerms = tErrors('termsRequired')
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      await registerUser(formData)
      onSuccess?.()
    } catch (_err) {
      // Error handled by hook
    }
  }

  const handleChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = field === 'acceptTerms' ? e.target.checked : e.target.value
      setFormData(prev => ({ ...prev, [field]: value }))
      if (formErrors[field]) {
        setFormErrors(prev => ({ ...prev, [field]: '' }))
      }
    }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{tRegister('title')}</CardTitle>
        <CardDescription>{tRegister('joinDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-4'>
          {error && (
            <Alert variant='destructive'>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='name'>{tRegister('name')}</Label>
              <Input
                id='name'
                type='text'
                value={formData.name}
                onChange={handleChange('name')}
                placeholder={tRegister('namePlaceholder')}
                disabled={isLoading}
              />
              {formErrors.name && (
                <p className='text-sm text-destructive mt-1'>
                  {formErrors.name}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='email'>{tRegister('email')}</Label>
              <Input
                id='email'
                type='email'
                value={formData.email}
                onChange={handleChange('email')}
                placeholder={tRegister('emailPlaceholder')}
                disabled={isLoading}
              />
              {formErrors.email && (
                <p className='text-sm text-destructive mt-1'>
                  {formErrors.email}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='password'>{tRegister('password')}</Label>
              <Input
                id='password'
                type='password'
                value={formData.password}
                onChange={handleChange('password')}
                placeholder={tRegister('passwordPlaceholder')}
                disabled={isLoading}
              />
              {formErrors.password && (
                <p className='text-sm text-destructive mt-1'>
                  {formErrors.password}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='confirmPassword'>
                {tRegister('confirmPassword')}
              </Label>
              <Input
                id='confirmPassword'
                type='password'
                value={formData.confirmPassword}
                onChange={handleChange('confirmPassword')}
                placeholder={tRegister('passwordPlaceholder')}
                disabled={isLoading}
              />
              {formErrors.confirmPassword && (
                <p className='text-sm text-destructive mt-1'>
                  {formErrors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          <div className='space-y-3'>
            <div className='flex items-center space-x-3'>
              <Checkbox
                id='acceptTerms'
                checked={formData.acceptTerms}
                onCheckedChange={checked =>
                  setFormData(prev => ({
                    ...prev,
                    acceptTerms: Boolean(checked),
                  }))
                }
                disabled={isLoading}
                className='flex-shrink-0'
              />
              <Label
                htmlFor='acceptTerms'
                className='text-sm text-muted-foreground leading-normal cursor-pointer flex-1'
              >
                I agree to the{' '}
                <Link
                  href='/terms'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-primary hover:underline font-medium'
                >
                  {tRegister('termsOfService')}
                </Link>{' '}
                and{' '}
                <Link
                  href='/privacy'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-primary hover:underline font-medium'
                >
                  {tRegister('privacyPolicy')}
                </Link>
              </Label>
            </div>
            {formErrors.acceptTerms && (
              <p className='text-sm text-destructive mt-1 ml-6'>
                {formErrors.acceptTerms}
              </p>
            )}
          </div>

          <Button
            type='submit'
            className='w-full'
            disabled={isLoading || !formData.acceptTerms}
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
        </form>
      </CardContent>
    </Card>
  )
}

export default function RegisterForm(props: RegisterFormProps) {
  return (
    <SectionErrorBoundary
      componentName='RegisterForm'
      title='Registration Error'
      description='The registration form encountered an error. Please refresh the page and try again.'
    >
      <RegisterFormContent {...props} />
    </SectionErrorBoundary>
  )
}
