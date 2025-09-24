'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { locales, type Locale } from '@/i18n/config'
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

interface LocaleSwitcherProps {
  variant?: 'select' | 'dropdown' | 'buttons'
  className?: string
  showLabel?: boolean
  size?: 'sm' | 'default' | 'lg'
}

const localeNames: Record<Locale, string> = {
  en: 'English',
  zh: '中文简体',
  ms: 'Bahasa Melayu',
}

const localeFlags: Record<Locale, string> = {
  en: '🇺🇸',
  zh: '🇨🇳',
  ms: '🇲🇾',
}

export function LocaleSwitcher({
  variant = 'dropdown',
  className,
  showLabel = false,
  size = 'default',
}: LocaleSwitcherProps) {
  const t = useTranslations('common.language')
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()

  const handleLocaleChange = (newLocale: Locale) => {
    // Remove the current locale from pathname and add the new one
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '') || '/'
    const newPath = `/${newLocale}${pathWithoutLocale}`
    router.push(newPath)
  }

  if (variant === 'select') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        {showLabel && (
          <span className='text-sm font-medium text-muted-foreground'>
            {t('switchLanguage')}
          </span>
        )}
        <Select value={locale} onValueChange={handleLocaleChange}>
          <SelectTrigger
            className={cn(
              'w-auto min-w-[120px]',
              size === 'sm' && 'h-8 text-xs',
              size === 'lg' && 'h-12 text-base'
            )}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {locales.map(loc => (
              <SelectItem key={loc} value={loc}>
                <div className='flex items-center gap-2'>
                  <span>{localeFlags[loc]}</span>
                  <span>{localeNames[loc]}</span>
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
        {locales.map(loc => (
          <Button
            key={loc}
            variant={locale === loc ? 'default' : 'outline'}
            size={size}
            onClick={() => handleLocaleChange(loc)}
            className={cn(
              'min-w-[80px]',
              size === 'sm' && 'h-7 px-2 text-xs',
              size === 'lg' && 'h-12 px-4 text-base'
            )}
          >
            <span className='mr-1'>{localeFlags[loc]}</span>
            {localeNames[loc]}
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
            className={cn(
              'gap-2',
              size === 'sm' && 'h-8 px-2 text-xs',
              size === 'lg' && 'h-12 px-4 text-base'
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
              {localeFlags[locale]} {localeNames[locale]}
            </span>
            <span className='sm:hidden'>{localeFlags[locale]}</span>
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
          {locales.map(loc => (
            <DropdownMenuItem
              key={loc}
              onClick={() => handleLocaleChange(loc)}
              className={cn(
                'flex items-center gap-2 cursor-pointer',
                locale === loc && 'bg-accent'
              )}
            >
              <span>{localeFlags[loc]}</span>
              <span>{localeNames[loc]}</span>
              {locale === loc && (
                <span className='ml-auto text-xs text-muted-foreground'>✓</span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
