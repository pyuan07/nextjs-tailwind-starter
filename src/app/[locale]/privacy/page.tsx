import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { type Locale } from '@/i18n/config'

interface PrivacyProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({
  params,
}: PrivacyProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: 'pages.legal',
  })
  return {
    title: t('privacyTitle'),
    description: t('privacyDescription'),
    robots: { index: false },
  }
}

export default async function PrivacyPage({ params }: PrivacyProps) {
  const { locale } = await params
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: 'pages.legal',
  })

  const sections = [
    { title: t('dataCollection'), body: t('dataCollectionText') },
    { title: t('dataUse'), body: t('dataUseText') },
    { title: t('cookies'), body: t('cookiesText') },
    { title: t('dataRights'), body: t('dataRightsText') },
    { title: t('contact'), body: t('contactText') },
  ]

  return (
    <div className='relative min-h-screen'>
      {/* Ambient background */}
      <div
        className='fixed inset-0 bg-mesh pointer-events-none'
        aria-hidden='true'
      />

      <main
        id='main-content'
        className='relative container mx-auto px-4 py-12 max-w-3xl'
      >
        <div className='space-y-10 text-foreground'>
          <div className='space-y-3'>
            <h1 className='font-display text-4xl font-bold tracking-tight'>
              {t('privacyTitle')}
            </h1>
            <p className='text-sm text-muted-foreground'>
              {t('lastUpdated')}: {new Date().toLocaleDateString(locale)}
            </p>
            <div className='p-4 rounded-xl border border-brand/20 bg-brand-subtle/40'>
              <p className='text-sm text-muted-foreground'>
                <strong className='text-foreground'>
                  {t('languageNoticeLabel')}:
                </strong>{' '}
                {t('languageNotice')}
              </p>
            </div>
          </div>

          <div className='space-y-8'>
            {sections.map((section, i) => (
              <section key={section.title} className='space-y-3'>
                <h2 className='flex items-center gap-3 text-xl font-semibold'>
                  <span className='flex-shrink-0 w-8 h-8 rounded-lg bg-brand-subtle text-brand text-sm font-display font-bold flex items-center justify-center'>
                    {i + 1}
                  </span>
                  {section.title}
                </h2>
                <p className='text-muted-foreground leading-relaxed pl-11'>
                  {section.body}
                </p>
              </section>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
