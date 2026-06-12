import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

interface AuthLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'auth' })
  return {
    title: t('login.title'),
    description: t('login.description'),
  }
}

export default async function AuthLayout({
  children,
  params,
}: AuthLayoutProps) {
  const { locale } = await params
  const tAuth = await getTranslations({ locale, namespace: 'auth' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })

  const year = new Date().getFullYear()

  return (
    <div className='min-h-screen flex bg-background'>
      {/* ── Left brand panel — desktop only ─────────────────── */}
      <div className='hidden lg:flex lg:w-[42%] xl:w-[38%] relative overflow-hidden bg-primary text-primary-foreground flex-col justify-between p-12'>
        {/* Ambient glows */}
        <div
          className='absolute inset-0 pointer-events-none'
          style={{
            background:
              'radial-gradient(ellipse at 30% 25%, oklch(0.78 0.18 275 / 0.3) 0%, transparent 60%), radial-gradient(ellipse at 75% 80%, oklch(0.72 0.17 200 / 0.2) 0%, transparent 55%)',
          }}
          aria-hidden='true'
        />
        <div
          className='absolute inset-0 pointer-events-none opacity-[0.05]'
          style={{
            backgroundImage:
              'radial-gradient(oklch(1 0 0 / 0.8) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
          aria-hidden='true'
        />

        {/* Logo / back link */}
        <Link
          href='/'
          className='relative z-10 flex items-center gap-2 text-base font-semibold opacity-80 hover:opacity-100 transition-opacity'
        >
          ← {tCommon('brand.name')}
        </Link>

        {/* Center content */}
        <div className='relative z-10 space-y-8'>
          <p className='font-display text-4xl xl:text-[2.75rem] font-bold leading-[1.1] tracking-tight'>
            {tAuth('layout.tagline')}
          </p>
          <div className='flex gap-10'>
            <div className='space-y-1'>
              <div className='text-3xl font-bold tabular-nums'>3</div>
              <div className='text-sm opacity-70'>
                {tAuth('layout.statsLanguages')}
              </div>
            </div>
            <div className='space-y-1'>
              <div className='text-3xl font-bold tabular-nums'>15+</div>
              <div className='text-sm opacity-70'>
                {tAuth('layout.statsComponents')}
              </div>
            </div>
            <div className='space-y-1'>
              <div className='text-3xl font-bold tabular-nums'>A+</div>
              <div className='text-sm opacity-70'>
                {tAuth('layout.statsSecurity')}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className='relative z-10 text-xs opacity-40'>
          {tCommon('brand.name')} © {year}
        </p>
      </div>

      {/* ── Right form panel ────────────────────────────────── */}
      <div className='flex-1 flex flex-col min-w-0'>
        {/* Mobile header */}
        <header className='lg:hidden flex items-center justify-between px-4 py-4 border-b border-border/60'>
          <Link
            href='/'
            className='text-sm text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors'
          >
            ← {tCommon('actions.back')}
          </Link>
          <span className='font-semibold text-sm'>{tCommon('brand.name')}</span>
        </header>

        {/* Form area */}
        <main className='flex-1 flex items-center justify-center px-6 py-12'>
          <div className='w-full max-w-md'>{children}</div>
        </main>

        <footer className='px-6 py-4 text-center text-xs text-muted-foreground border-t border-border/30'>
          <Link href='/' className='hover:text-foreground transition-colors'>
            {tCommon('brand.name')}
          </Link>
        </footer>
      </div>
    </div>
  )
}
