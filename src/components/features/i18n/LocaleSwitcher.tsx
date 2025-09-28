'use client'

import { useCallback, useTransition } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import { locales, type Locale, localeNames, localeFlags } from '@/i18n/config'
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
  className?: string
  showLabel?: boolean
  size?: 'sm' | 'default' | 'lg'
}

function LocaleSwitcherContent({
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
        // Standard next-intl navigation - preserve search params
        const url = new URL(window.location.href)
        router.replace(
          {
            pathname,
            query: Object.fromEntries(url.searchParams.entries()),
          },
          { locale: newLocale }
        )
      })
    },
    [router, pathname, currentLocale]
  )

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
            className={cn('gap-2', isPending && 'opacity-50')}
            aria-label={t('switchLanguage')}
          >
            <Globe className='h-4 w-4' />
            <span className='hidden sm:inline'>
              {localeFlags[currentLocale]} {localeNames[currentLocale]}
            </span>
            <span className='sm:hidden'>{localeFlags[currentLocale]}</span>
            <Languages className='h-3 w-3 opacity-50' />
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

export function LocaleSwitcher(props: LocaleSwitcherProps) {
  return (
    <SectionErrorBoundary
      componentName='LocaleSwitcher'
      title='Language Switcher Error'
      description='The language switcher encountered an error.'
    >
      <LocaleSwitcherContent {...props} />
    </SectionErrorBoundary>
  )
}
