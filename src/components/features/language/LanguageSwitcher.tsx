'use client'

import React from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Globe } from 'lucide-react'

interface LanguageSwitcherProps {
  variant?: 'select' | 'buttons'
  size?: 'sm' | 'md'
  showIcon?: boolean
}

export function LanguageSwitcher({
  variant = 'select',
  size = 'md',
  showIcon = true,
}: LanguageSwitcherProps) {
  const { language, setLanguage, languages } = useLanguage()

  if (variant === 'buttons') {
    return (
      <div className='flex items-center gap-2'>
        {showIcon && <Globe className='h-4 w-4' />}
        <div className='flex gap-1'>
          {Object.entries(languages).map(([code, name]) => (
            <Button
              key={code}
              variant={language === code ? 'default' : 'outline'}
              size={size}
              onClick={() => setLanguage(code as any)}
              className='min-w-[60px]'
            >
              {name}
            </Button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className='flex items-center gap-2'>
      {showIcon && <Globe className='h-4 w-4' />}
      <Select
        value={language}
        onValueChange={value => setLanguage(value as any)}
      >
        <SelectTrigger
          className={size === 'sm' ? 'h-8 w-[120px]' : 'w-[140px]'}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(languages).map(([code, name]) => (
            <SelectItem key={code} value={code}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
