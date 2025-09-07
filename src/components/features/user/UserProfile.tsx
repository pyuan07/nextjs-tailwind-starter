'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useAuth } from '@/hooks'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Button,
  Skeleton,
} from '@/components/ui'
import { Loader2 } from 'lucide-react'
import LoginForm from '../auth/LoginForm'

const UserProfile = () => {
  const { user, isAuthenticated, isLoading } = useAuth()
  const { logout, isLoading: isLoggingOut } = useAuth()
  const { updateProfile, isLoading: isUpdating } = useAuth()
  const [showLoginForm, setShowLoginForm] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
    } catch (_error) {
      // Error is handled by the hook
    }
  }

  const handleUpdateName = async () => {
    if (user) {
      try {
        await updateProfile({
          name: user.name === 'John Doe' ? 'Jane Doe' : 'John Doe',
        })
        // Optionally refresh the page or update local state
        window.location.reload()
      } catch (_error) {
        // Error is handled by the hook
      }
    }
  }

  const handleShowLogin = () => {
    setShowLoginForm(true)
  }

  const handleLoginSuccess = () => {
    setShowLoginForm(false)
    // The useAuth hook will automatically update with the new user data
  }

  if (isLoading) {
    return (
      <Card className='w-full max-w-md'>
        <CardHeader>
          <Skeleton className='h-4 w-[200px]' />
          <Skeleton className='h-4 w-[150px]' />
        </CardHeader>
        <CardContent>
          <Skeleton className='h-20 w-full' />
        </CardContent>
      </Card>
    )
  }

  // Show login form if requested
  if (showLoginForm) {
    return (
      <div className='w-full max-w-md'>
        <LoginForm onSuccess={handleLoginSuccess} />
        <div className='text-center mt-4'>
          <Button
            variant='ghost'
            onClick={() => setShowLoginForm(false)}
            size='sm'
          >
            Cancel
          </Button>
        </div>
      </div>
    )
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
          <CardDescription>
            Sign in to access your profile and showcase
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='text-sm text-muted-foreground'>
            Demo features available after signing in:
          </div>
          <ul className='text-sm space-y-1 text-muted-foreground'>
            <li>• View and edit your profile</li>
            <li>• Manage your preferences</li>
            <li>• Access protected features</li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button onClick={handleShowLogin} className='w-full'>
            Sign In
          </Button>
        </CardFooter>
      </Card>
    )
  }

  // Show user profile
  return (
    <Card className='w-full max-w-md'>
      <CardHeader>
        <div className='flex items-center space-x-4'>
          {user.avatar && (
            <Image
              src={user.avatar}
              alt={user.name}
              width={48}
              height={48}
              className='w-12 h-12 rounded-full object-cover'
            />
          )}
          <div className='flex-1'>
            <CardTitle className='text-lg'>{user.name}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
            {user.role && (
              <span className='inline-block px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded-full mt-1'>
                {user.role}
              </span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardFooter className='flex gap-2'>
        <Button
          onClick={handleUpdateName}
          variant='outline'
          size='sm'
          disabled={isUpdating}
        >
          {isUpdating ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Updating...
            </>
          ) : (
            'Toggle Name'
          )}
        </Button>
        <Button
          onClick={handleLogout}
          variant='destructive'
          size='sm'
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Signing out...
            </>
          ) : (
            'Sign Out'
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default UserProfile
