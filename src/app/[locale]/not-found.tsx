import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  const t = useTranslations('pages.notFound')

  return (
    <div className='flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center p-4'>
      <h1 className='text-6xl font-bold text-muted-foreground'>404</h1>
      <div className='space-y-2'>
        <h2 className='text-2xl font-semibold'>{t('title')}</h2>
        <p className='text-muted-foreground max-w-sm'>{t('description')}</p>
      </div>
      <Button asChild>
        <Link href='/'>{t('backHome')}</Link>
      </Button>
    </div>
  )
}
