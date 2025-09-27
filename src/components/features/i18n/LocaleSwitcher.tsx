'use client'

import { memo, useCallback, useTransition } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import { locales, type Locale, localeNames, localeFlags } from '@/i18n/config'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Languages, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SectionErrorBoundary } from '@/components/ui/error-boundary'

interface LocaleSwitcherProps {
  variant?: 'select' | 'dropdown' | 'buttons'
  className?: string
  showLabel?: boolean
  size?: 'sm' | 'default' | 'lg'
}

function LocaleSwitcherContent({
  variant = 'dropdown',
  className,
  showLabel = false,
  size = 'default',
}: LocaleSwitcherProps) {
  const t = useTranslations('common.language')
  const currentLocale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const handleLocaleChange = useCallback(
    (newLocale: Locale) => {
      if (newLocale === currentLocale) return

      startTransition(() => {
        // Standard next-intl navigation - preserve search params and hash
        const url = new URL(window.location.href)
        router.replace(
          {
            pathname,
            query: Object.fromEntries(url.searchParams.entries()),
            hash: url.hash,
          },
          { locale: newLocale }
        )
      })
    },
    [router, pathname, currentLocale]
  )

  if (variant === 'select') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        {showLabel && (
          <span className='text-sm font-medium text-muted-foreground'>
            {t('switchLanguage')}
          </span>
        )}
        <Select
          value={currentLocale}
          onValueChange={handleLocaleChange}
          disabled={isPending}
        >
          <SelectTrigger
            className={cn(
              'w-auto min-w-[120px]',
              size === 'sm' && 'h-8 text-xs',
              size === 'lg' && 'h-12 text-base',
              isPending && 'opacity-50'
            )}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {locales.map(locale => (
              <SelectItem key={locale} value={locale}>
                <div className='flex items-center gap-2'>
                  <span>{localeFlags[locale]}</span>
                  <span>{localeNames[locale]}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  }

  if (variant === 'buttons') {
    return (
      <div className={cn('flex flex-wrap gap-1', className)}>
        {showLabel && (
          <span className='text-sm font-medium text-muted-foreground mr-2'>
            {t('switchLanguage')}:
          </span>
        )}
        {locales.map(locale => (
          <Button
            key={locale}
            variant={currentLocale === locale ? 'default' : 'outline'}
            size={size}
            onClick={() => handleLocaleChange(locale)}
            disabled={isPending}
            className={cn(
              'min-w-[80px]',
              size === 'sm' && 'h-7 px-2 text-xs',
              size === 'lg' && 'h-12 px-4 text-base',
              isPending && 'opacity-50'
            )}
          >
            <span className='mr-1'>{localeFlags[locale]}</span>
            {localeNames[locale]}
          </Button>
        ))}
      </div>
    )
  }

  // Default dropdown variant
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {showLabel && (
        <span className='text-sm font-medium text-muted-foreground'>
          {t('switchLanguage')}
        </span>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='outline'
            size={size}
            disabled={isPending}
            className={cn(
              'gap-2',
              size === 'sm' && 'h-8 px-2 text-xs',
              size === 'lg' && 'h-12 px-4 text-base',
              isPending && 'opacity-50'
            )}
            aria-label={t('switchLanguage')}
          >
            <Globe
              className={cn(
                'h-4 w-4',
                size === 'sm' && 'h-3 w-3',
                size === 'lg' && 'h-5 w-5'
              )}
            />
            <span className='hidden sm:inline'>
              {localeFlags[currentLocale]} {localeNames[currentLocale]}
            </span>
            <span className='sm:hidden'>{localeFlags[currentLocale]}</span>
            <Languages
              className={cn(
                'h-3 w-3 opacity-50',
                size === 'sm' && 'h-2 w-2',
                size === 'lg' && 'h-4 w-4'
              )}
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='min-w-[150px]'>
          {locales.map(locale => (
            <DropdownMenuItem
              key={locale}
              onClick={() => handleLocaleChange(locale)}
              className={cn(
                'flex items-center gap-2 cursor-pointer',
                currentLocale === locale && 'bg-accent'
              )}
            >
              <span>{localeFlags[locale]}</span>
              <span>{localeNames[locale]}</span>
              {currentLocale === locale && (
                <span className='ml-auto text-xs text-muted-foreground'>✓</span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

const MemoizedLocaleSwitcherContent = memo(LocaleSwitcherContent)

export function LocaleSwitcher(props: LocaleSwitcherProps) {
  return (
    <SectionErrorBoundary
      componentName='LocaleSwitcher'
      title='Language Switcher Error'
      description='The language switcher encountered an error.'
    >
      <MemoizedLocaleSwitcherContent {...props} />
    </SectionErrorBoundary>
  )
}
