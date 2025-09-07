'use client'

import { useState } from 'react'
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
import type { LoginRequest } from '@/types/api/auth'

interface LoginFormProps {
  onSuccess?: () => void
  className?: string
}

export default function LoginForm({ onSuccess, className }: LoginFormProps) {
  const { login, isLoading, error } = useAuth()
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
    remember: false,
  })
  const [showDemo] = useState(true)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await login(formData)
      onSuccess?.()
    } catch {
      // Error is already handled by the hook
    }
  }

  const handleDemoLogin = () => {
    setFormData({
      email: 'demo@example.com',
      password: 'password',
      remember: false,
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {showDemo && (
          <div className='mb-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-md'>
            <p className='text-sm text-blue-700 dark:text-blue-300 mb-2'>
              Demo credentials:
            </p>
            <ul className='text-xs text-blue-600 dark:text-blue-400 space-y-1'>
              <li>Email: demo@example.com</li>
              <li>Password: password</li>
            </ul>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={handleDemoLogin}
              className='mt-2 text-blue-600 dark:text-blue-400'
            >
              Use Demo Credentials
            </Button>
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='email'>Email *</Label>
            <Input
              id='email'
              name='email'
              type='email'
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              placeholder='Enter your email'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='password'>Password *</Label>
            <Input
              id='password'
              name='password'
              type='password'
              value={formData.password}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              placeholder='Enter your password'
            />
          </div>

          <div className='flex items-center space-x-2'>
            <Checkbox
              id='remember'
              checked={formData.remember}
              onCheckedChange={checked =>
                setFormData(prev => ({ ...prev, remember: Boolean(checked) }))
              }
              disabled={isLoading}
            />
            <Label htmlFor='remember'>Remember me</Label>
          </div>

          {error && (
            <Alert variant='destructive'>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type='submit'
            disabled={isLoading || !formData.email || !formData.password}
            className='w-full'
          >
            {isLoading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
