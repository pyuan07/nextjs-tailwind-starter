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
    <div className='flex min-h-[50vh] items-center justify-center p-4'>
      <Card className='max-w-md w-full'>
        <CardHeader className='text-center'>
          <AlertTriangle className='h-10 w-10 text-destructive mx-auto mb-2' />
          <CardTitle>{t('somethingWrong')}</CardTitle>
          <CardDescription>{t('unexpectedError')}</CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col gap-3'>
          {error.digest && (
            <p className='text-xs text-muted-foreground font-mono text-center'>
              ID: {error.digest}
            </p>
          )}
          <div className='flex gap-3 justify-center'>
            <Button onClick={reset}>{t('tryAgain')}</Button>
            <Button variant='outline' onClick={() => window.location.reload()}>
              {t('reloadPage')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
