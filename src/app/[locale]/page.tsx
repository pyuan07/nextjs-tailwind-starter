import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Button } from '@/components/ui'
import { Link } from '@/i18n/navigation'
import { type Locale } from '@/i18n/config'

interface HomeProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({
  params,
}: HomeProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: 'pages.home',
  })
  return {
    title: t('title'),
    description: t('description'),
  }
}

export default async function Home({ params }: HomeProps) {
  const { locale } = await params

  const tNav = await getTranslations({
    locale: locale as Locale,
    namespace: 'common.navigation',
  })
  const tCommon = await getTranslations({
    locale: locale as Locale,
    namespace: 'common',
  })
  const tHome = await getTranslations({
    locale: locale as Locale,
    namespace: 'pages.home',
  })

  const techStack = [
    {
      name: tCommon('techStack.nextjs.name'),
      desc: tCommon('techStack.nextjs.description'),
    },
    {
      name: tCommon('techStack.tailwind.name'),
      desc: tCommon('techStack.tailwind.description'),
    },
    {
      name: tCommon('techStack.typescript.name'),
      desc: tCommon('techStack.typescript.description'),
    },
    {
      name: tCommon('techStack.tooling.name'),
      desc: tCommon('techStack.tooling.description'),
    },
  ]

  return (
    <div className='min-h-screen bg-background text-foreground overflow-hidden'>
      {/* Ambient background layers */}
      <div
        className='fixed inset-0 bg-mesh pointer-events-none'
        aria-hidden='true'
      />
      <div
        className='fixed inset-0 grid-dots pointer-events-none opacity-40'
        aria-hidden='true'
      />

      <main id='main-content' className='relative'>
        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className='container mx-auto px-4 pt-16 pb-20 lg:pt-24 lg:pb-28'>
          <div className='grid lg:grid-cols-[1fr_auto] gap-12 lg:gap-16 items-center max-w-6xl mx-auto'>
            {/* Left: headline + CTAs */}
            <div className='space-y-8 max-w-2xl'>
              <div className='animate-fade-up inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-subtle border border-brand/20 text-brand text-xs font-semibold tracking-wide'>
                <span
                  className='w-1.5 h-1.5 rounded-full bg-brand'
                  aria-hidden='true'
                />
                {tHome('hero.badge')}
              </div>

              <h1 className='space-y-0.5'>
                <span className='animate-fade-up-1 block font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight'>
                  {tHome('hero.tagline1')}
                </span>
                <span className='animate-fade-up-2 block font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight'>
                  {tHome('hero.tagline2')}
                </span>
                <span className='animate-fade-up-3 block font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-gradient-brand'>
                  {tHome('hero.tagline3')}
                </span>
              </h1>

              <p className='animate-fade-up-4 text-lg lg:text-xl text-muted-foreground leading-relaxed'>
                {tCommon('brand.description')}
              </p>

              <div className='animate-fade-up-4 flex flex-wrap gap-3'>
                <Button
                  asChild
                  size='lg'
                  className='min-h-12 px-8 font-semibold text-base'
                >
                  <Link href='/showcase'>{tNav('showcase')} →</Link>
                </Button>
                <Button
                  asChild
                  variant='outline'
                  size='lg'
                  className='min-h-12 px-8 text-base'
                >
                  <Link href='/login'>{tNav('login')}</Link>
                </Button>
              </div>

              <div className='animate-fade-up-4 flex flex-wrap gap-5 text-sm text-muted-foreground pt-1'>
                <span className='flex items-center gap-1.5'>
                  <span className='text-chart-3 font-bold' aria-hidden='true'>
                    ✓
                  </span>
                  {tHome('hero.trustTypescript')}
                </span>
                <span className='flex items-center gap-1.5'>
                  <span className='text-chart-3 font-bold' aria-hidden='true'>
                    ✓
                  </span>
                  {tHome('hero.trustPwa')}
                </span>
                <span className='flex items-center gap-1.5'>
                  <span className='text-chart-3 font-bold' aria-hidden='true'>
                    ✓
                  </span>
                  {tHome('hero.trustI18n')}
                </span>
              </div>
            </div>

            {/* Right: decorative code preview — desktop only */}
            <div className='hidden lg:block relative animate-slide-in-right'>
              {/* Glow behind card */}
              <div
                className='absolute -inset-10 rounded-3xl blur-3xl opacity-25 pointer-events-none'
                style={{
                  background:
                    'radial-gradient(ellipse, var(--brand) 0%, transparent 70%)',
                }}
                aria-hidden='true'
              />

              {/* Floating labels */}
              <div className='absolute -top-5 -right-5 z-20 bg-card border border-border shadow-lg rounded-xl px-3 py-1.5 text-xs font-semibold animate-float-slow'>
                ⚡ Next.js 15
              </div>
              <div
                className='absolute -bottom-4 -left-5 z-20 bg-card border border-border shadow-lg rounded-xl px-3 py-1.5 text-xs font-semibold animate-float'
                style={{ animationDelay: '1.5s' }}
              >
                🔷 TypeScript
              </div>

              {/* Code window */}
              <div className='relative z-10 w-80 bg-card/90 backdrop-blur-sm border border-border/60 rounded-2xl overflow-hidden shadow-2xl'>
                <div className='flex items-center gap-1.5 px-4 py-3 border-b border-border/50 bg-muted/20'>
                  <div className='w-3 h-3 rounded-full bg-chart-5 opacity-75' />
                  <div className='w-3 h-3 rounded-full bg-chart-4 opacity-75' />
                  <div className='w-3 h-3 rounded-full bg-chart-3 opacity-75' />
                  <span className='ml-2 text-xs text-muted-foreground font-mono'>
                    page.tsx
                  </span>
                </div>
                <div className='p-5 font-mono text-[12.5px] leading-relaxed space-y-0.5'>
                  <p>
                    <span className='text-chart-1'>import</span>
                    <span className='text-muted-foreground'>{' { auth }'}</span>
                    <span className='text-chart-1'> from</span>
                    <span className='text-chart-3'>
                      {' '}
                      &apos;@/services&apos;
                    </span>
                  </p>
                  <p className='mt-3'>
                    <span className='text-chart-2'>export default </span>
                    <span className='text-chart-1'>async function</span>
                  </p>
                  <p>
                    <span className='text-brand-light font-semibold'>Page</span>
                    <span className='text-foreground'>() {'{'}</span>
                  </p>
                  <p className='pl-4'>
                    <span className='text-chart-1'>const</span>
                    <span className='text-foreground'> user </span>
                    <span className='text-chart-1'>=</span>
                  </p>
                  <p className='pl-8'>
                    <span className='text-chart-1'>await </span>
                    <span className='text-brand-light font-semibold'>auth</span>
                    <span className='text-foreground'>()</span>
                  </p>
                  <p className='pl-4'>
                    <span className='text-chart-1'>return </span>
                    <span className='text-chart-3'>&lt;</span>
                    <span className='text-brand-light font-semibold'>
                      Dashboard
                    </span>
                  </p>
                  <p className='pl-10'>
                    <span className='text-muted-foreground'>user</span>
                    <span className='text-chart-1'>={'{'}</span>
                    <span className='text-muted-foreground'>user</span>
                    <span className='text-chart-1'>{'}'}</span>
                  </p>
                  <p className='pl-4'>
                    <span className='text-chart-3'>/&gt;</span>
                  </p>
                  <p>
                    <span className='text-foreground'>{'}'}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Tech Stack Strip ──────────────────────────────────── */}
        <section className='border-y border-border/60 bg-muted/20 backdrop-blur-sm'>
          <div className='container mx-auto px-4 py-10'>
            <p className='text-center text-[11px] font-semibold tracking-[0.18em] uppercase text-muted-foreground mb-6'>
              {tHome('hero.poweredBy')}
            </p>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
              {techStack.map(tech => (
                <div
                  key={tech.name}
                  className='group flex flex-col gap-1 p-4 rounded-xl bg-background/80 border border-border/50 hover:border-brand/40 hover:bg-brand-subtle/30 transition-all duration-200 cursor-default'
                >
                  <span className='font-semibold text-sm text-foreground group-hover:text-brand transition-colors duration-200'>
                    {tech.name}
                  </span>
                  <span className='text-xs text-muted-foreground leading-relaxed'>
                    {tech.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Section ───────────────────────────────────────── */}
        <section className='container mx-auto px-4 py-24 lg:py-32'>
          <div className='relative max-w-3xl mx-auto text-center'>
            <div
              className='absolute inset-0 rounded-3xl opacity-15 blur-3xl pointer-events-none'
              style={{
                background:
                  'radial-gradient(ellipse, var(--brand) 0%, transparent 70%)',
              }}
              aria-hidden='true'
            />
            <div className='relative bg-card/70 backdrop-blur-sm border border-border/50 rounded-3xl px-8 py-14 lg:px-14'>
              <h2 className='font-display text-3xl lg:text-4xl font-bold mb-4 leading-tight'>
                {tHome('cta.title')}{' '}
                <span className='text-gradient-brand'>
                  {tHome('cta.highlight')}
                </span>
                {tHome('cta.titleSuffix')}
              </h2>
              <p className='text-muted-foreground mb-8 text-base lg:text-lg max-w-md mx-auto'>
                {tHome('cta.subtitle')}
              </p>
              <Button
                asChild
                size='lg'
                className='min-h-12 px-10 font-semibold text-base'
              >
                <Link href='/login'>{tHome('cta.button')} →</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className='border-t border-border/60'>
        <div className='container mx-auto px-4 py-6'>
          <div className='flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground'>
            <p>{tCommon('footer.builtWith')}</p>
            <div className='flex gap-6'>
              <Link
                href='/terms'
                className='hover:text-foreground transition-colors duration-150'
              >
                {tCommon('footer.termsOfService')}
              </Link>
              <Link
                href='/privacy'
                className='hover:text-foreground transition-colors duration-150'
              >
                {tCommon('footer.privacyPolicy')}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
