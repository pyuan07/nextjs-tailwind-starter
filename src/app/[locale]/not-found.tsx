import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  const t = useTranslations('pages.notFound')

  return (
    <div className='relative flex min-h-[80vh] flex-col items-center justify-center gap-6 text-center p-4 overflow-hidden'>
      {/* Ambient background */}
      <div
        className='absolute inset-0 bg-mesh pointer-events-none'
        aria-hidden='true'
      />
      <div
        className='absolute inset-0 grid-dots pointer-events-none opacity-40'
        aria-hidden='true'
      />

      <div className='relative space-y-6'>
        <p
          className='font-display text-[7rem] sm:text-[9rem] font-bold leading-none tracking-tighter text-gradient-brand select-none'
          aria-hidden='true'
        >
          404
        </p>
        <div className='space-y-2'>
          <h1 className='font-display text-2xl font-bold'>{t('title')}</h1>
          <p className='text-muted-foreground max-w-sm mx-auto'>
            {t('description')}
          </p>
        </div>
        <Button asChild size='lg' className='min-h-12 px-8 font-semibold'>
          <Link href='/'>{t('backHome')} →</Link>
        </Button>
      </div>
    </div>
  )
}
