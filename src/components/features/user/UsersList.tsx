'use client'

import { useState } from 'react'
import { useApi } from '@/hooks'
import { userService } from '@/services'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Alert,
  AlertDescription,
  Skeleton,
} from '@/components/ui'
import type { User } from '@/types/entities'

interface UsersListProps {
  className?: string
}

export default function UsersList({ className }: UsersListProps) {
  const [showMore, setShowMore] = useState(false)

  // Use the simplified API hook
  const {
    data: users,
    loading,
    error,
  } = useApi<User[]>(() => userService.getUsers())

  if (loading) {
    return (
      <div className={className}>
        <div className='space-y-4'>
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className='flex items-center space-x-3'>
                  <Skeleton className='h-10 w-10 rounded-full' />
                  <div className='space-y-2'>
                    <Skeleton className='h-4 w-[120px]' />
                    <Skeleton className='h-3 w-[180px]' />
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={className}>
        <Alert variant='destructive'>
          <AlertDescription>Failed to load users: {error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  const displayedUsers = showMore ? users || [] : (users || []).slice(0, 3)

  return (
    <div className={className}>
      <div className='space-y-4'>
        {displayedUsers.map(user => (
          <Card key={user.id} className='transition-shadow hover:shadow-md'>
            <CardHeader className='pb-3'>
              <div className='flex items-center space-x-3'>
                <div className='h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center'>
                  <span className='text-sm font-medium'>
                    {user.name
                      .split(' ')
                      .map(n => n[0])
                      .join('')}
                  </span>
                </div>
                <div>
                  <CardTitle className='text-base'>{user.name}</CardTitle>
                  <p className='text-sm text-muted-foreground'>{user.email}</p>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}

        {users && users.length > 3 && (
          <div className='text-center'>
            <Button
              variant='outline'
              onClick={() => setShowMore(!showMore)}
              className='w-full'
            >
              {showMore ? 'Show Less' : `Show More (${users.length - 3} more)`}
            </Button>
          </div>
        )}

        {users && users.length === 0 && (
          <Card>
            <CardContent className='p-6 text-center'>
              <p className='text-muted-foreground'>No users found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
