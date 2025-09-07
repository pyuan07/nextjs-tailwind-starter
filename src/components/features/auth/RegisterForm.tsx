'use client'

import { useState } from 'react'
import Link from 'next/link'
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
import { Loader2 } from 'lucide-react'

interface RegisterFormProps {
  onSuccess?: () => void
  className?: string
}

export default function RegisterForm({
  onSuccess,
  className,
}: RegisterFormProps) {
  const { register: registerUser, isLoading, error } = useAuth()
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

    if (!formData.name.trim()) errors.name = 'Name is required'
    if (!formData.email.trim()) errors.email = 'Email is required'
    if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid'
    if (!formData.password) errors.password = 'Password is required'
    if (formData.password.length < 6)
      errors.password = 'Password must be at least 6 characters'
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }
    if (!formData.acceptTerms) {
      errors.acceptTerms =
        'You must accept the Terms of Service and Privacy Policy'
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
        <CardTitle>Create Account</CardTitle>
        <CardDescription>
          Join us to get started with your projects
        </CardDescription>
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
              <Label htmlFor='name'>Full Name</Label>
              <Input
                id='name'
                type='text'
                value={formData.name}
                onChange={handleChange('name')}
                placeholder='John Doe'
                disabled={isLoading}
              />
              {formErrors.name && (
                <p className='text-sm text-destructive mt-1'>
                  {formErrors.name}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                value={formData.email}
                onChange={handleChange('email')}
                placeholder='john@example.com'
                disabled={isLoading}
              />
              {formErrors.email && (
                <p className='text-sm text-destructive mt-1'>
                  {formErrors.email}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                type='password'
                value={formData.password}
                onChange={handleChange('password')}
                placeholder='••••••••'
                disabled={isLoading}
              />
              {formErrors.password && (
                <p className='text-sm text-destructive mt-1'>
                  {formErrors.password}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='confirmPassword'>Confirm Password</Label>
              <Input
                id='confirmPassword'
                type='password'
                value={formData.confirmPassword}
                onChange={handleChange('confirmPassword')}
                placeholder='••••••••'
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
            <div className='flex items-start space-x-3'>
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
                className='mt-1'
              />
              <Label
                htmlFor='acceptTerms'
                className='text-sm text-muted-foreground leading-relaxed'
              >
                I agree to the{' '}
                <Link
                  href='/terms'
                  className='text-primary hover:underline'
                  target='_blank'
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  href='/privacy'
                  className='text-primary hover:underline'
                  target='_blank'
                >
                  Privacy Policy
                </Link>
              </Label>
            </div>
            {formErrors.acceptTerms && (
              <p className='text-sm text-destructive'>
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
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
