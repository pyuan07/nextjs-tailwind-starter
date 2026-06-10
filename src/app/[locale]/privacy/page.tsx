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

  return (
    <main id='main-content' className='container mx-auto px-4 py-8 max-w-4xl'>
      <div className='space-y-8 text-foreground'>
        <div className='space-y-2'>
          <h1 className='text-4xl font-bold'>{t('privacyTitle')}</h1>
          <p className='text-muted-foreground'>
            {t('lastUpdated')}: {new Date().toLocaleDateString(locale)}
          </p>
          <div className='p-4 bg-muted rounded-lg border'>
            <p className='text-sm text-muted-foreground'>
              <strong>{t('languageNoticeLabel')}:</strong> {t('languageNotice')}
            </p>
          </div>
        </div>

        <div className='space-y-6'>
          <section>
            <h2 className='text-2xl font-semibold mb-3'>
              1. {t('dataCollection')}
            </h2>
            <p className='text-muted-foreground'>{t('dataCollectionText')}</p>
          </section>

          <section>
            <h2 className='text-2xl font-semibold mb-3'>2. {t('dataUse')}</h2>
            <p className='text-muted-foreground'>{t('dataUseText')}</p>
          </section>

          <section>
            <h2 className='text-2xl font-semibold mb-3'>3. {t('cookies')}</h2>
            <p className='text-muted-foreground'>{t('cookiesText')}</p>
          </section>

          <section>
            <h2 className='text-2xl font-semibold mb-3'>
              4. {t('dataRights')}
            </h2>
            <p className='text-muted-foreground'>{t('dataRightsText')}</p>
          </section>

          <section>
            <h2 className='text-2xl font-semibold mb-3'>5. {t('contact')}</h2>
            <p className='text-muted-foreground'>{t('contactText')}</p>
          </section>
        </div>
      </div>
    </main>
  )
}
