'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth, useLogout } from '@/hooks'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
} from '@/components/ui'
import { Icon } from '@/lib/icons'

export default function ProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const { logout } = useLogout()

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center'>
        <Card className='w-full max-w-md'>
          <CardHeader>
            <Skeleton className='h-4 w-[200px]' />
            <Skeleton className='h-4 w-[150px]' />
          </CardHeader>
          <CardContent>
            <Skeleton className='h-20 w-full' />
          </CardContent>
        </Card>
      </div>
    )
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated || !user) {
    return null
  }

  const _handleLogout = async () => {
    try {
      await logout()
    } catch (_error) {
      // Error is handled by the hook
    }
  }

  return (
    <div className='min-h-screen bg-background'>
      <main className='container mx-auto px-4 py-8 max-w-4xl'>
        <div className='space-y-8'>
          <div>
            <h1 className='text-3xl font-bold'>Profile Settings</h1>
            <p className='text-muted-foreground'>
              Manage your account settings
            </p>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Icon name='user' size='md' />
                  Profile
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

                <div className='space-y-3'>
                  <div>
                    <label className='text-sm font-medium'>Name</label>
                    <input
                      type='text'
                      className='w-full px-3 py-2 border rounded-md'
                      defaultValue={user.name}
                    />
                  </div>
                  <div>
                    <label className='text-sm font-medium'>Email</label>
                    <input
                      type='email'
                      className='w-full px-3 py-2 border rounded-md'
                      defaultValue={user.email}
                    />
                  </div>
                  <Button className='w-full flex items-center gap-2'>
                    <Icon name='save' size='sm' />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Icon name='security' size='md' />
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex justify-between items-center p-3 border rounded'>
                  <span>Password</span>
                  <Button variant='outline' size='sm'>
                    Change
                  </Button>
                </div>

                <div className='flex justify-between items-center p-3 border rounded'>
                  <span>Two-Factor Auth</span>
                  <Button variant='outline' size='sm'>
                    Enable
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Icon name='settings' size='md' />
                  Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex justify-between items-center'>
                  <span>Email Notifications</span>
                  <input type='checkbox' defaultChecked />
                </div>
                <div className='flex justify-between items-center'>
                  <span>Marketing Emails</span>
                  <input type='checkbox' />
                </div>
              </CardContent>
            </Card>

            <Card className='border-red-200'>
              <CardHeader>
                <CardTitle className='text-red-600 flex items-center gap-2'>
                  <Icon name='warning' size='md' />
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant='destructive' size='sm'>
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
