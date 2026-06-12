'use client'
import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { AlertTriangle } from 'lucide-react'

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations('common.errors')

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className='relative flex min-h-[70vh] items-center justify-center p-4 overflow-hidden'>
      {/* Ambient background */}
      <div
        className='absolute inset-0 bg-mesh pointer-events-none'
        aria-hidden='true'
      />

      <Card className='relative max-w-md w-full rounded-2xl border-border/60'>
        <CardHeader className='text-center'>
          <div className='w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-3'>
            <AlertTriangle className='h-7 w-7 text-destructive' />
          </div>
          <CardTitle className='font-display'>{t('somethingWrong')}</CardTitle>
          <CardDescription>{t('unexpectedError')}</CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col gap-4'>
          {error.digest && (
            <p className='text-xs text-muted-foreground font-mono text-center bg-muted/50 rounded-lg py-2'>
              ID: {error.digest}
            </p>
          )}
          <div className='flex gap-3 justify-center'>
            <Button onClick={reset} className='min-h-11'>
              {t('tryAgain')}
            </Button>
            <Button
              variant='outline'
              onClick={() => window.location.reload()}
              className='min-h-11'
            >
              {t('reloadPage')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
