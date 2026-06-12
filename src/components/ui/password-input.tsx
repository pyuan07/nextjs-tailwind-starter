'use client'

import * as React from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

/**
 * Password field with a show/hide reveal toggle.
 *
 * Wraps the base <Input> and adds an accessible button that switches the input
 * between `password` and `text`. The toggle reduces login/registration failures
 * — especially on mobile, where typos are common and hidden.
 */
function PasswordInput({
  className,
  ...props
}: Omit<React.ComponentProps<'input'>, 'type'>) {
  const [visible, setVisible] = React.useState(false)
  const t = useTranslations('common.actions')

  return (
    <div className='relative'>
      <Input
        type={visible ? 'text' : 'password'}
        className={cn('pr-11', className)}
        {...props}
      />
      <button
        type='button'
        onClick={() => setVisible(v => !v)}
        disabled={props.disabled}
        aria-label={visible ? t('hidePassword') : t('showPassword')}
        aria-pressed={visible}
        className='absolute right-0 top-0 flex h-full min-h-11 w-11 items-center justify-center text-muted-foreground hover:text-foreground transition-colors disabled:pointer-events-none disabled:opacity-50 touch-manipulation'
        tabIndex={-1}
      >
        {visible ? (
          <EyeOff className='h-4 w-4' aria-hidden='true' />
        ) : (
          <Eye className='h-4 w-4' aria-hidden='true' />
        )}
      </button>
    </div>
  )
}

export { PasswordInput }
