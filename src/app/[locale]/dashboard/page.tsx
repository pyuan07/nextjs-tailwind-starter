import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { type Locale } from '@/i18n/config'

interface DashboardProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({
  params,
}: DashboardProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: 'pages.dashboard',
  })
  return {
    title: t('title'),
    description: t('description'),
  }
}

export default async function DashboardPage({ params }: DashboardProps) {
  const { locale } = await params
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: 'pages.dashboard',
  })

  const stats = [
    { label: t('stats.totalUsers'), value: '1,024' },
    { label: t('stats.activeToday'), value: '128' },
    { label: t('stats.revenue'), value: '$4,250' },
    { label: t('stats.openTickets'), value: '7' },
  ]

  return (
    <main id='main-content' className='container mx-auto px-4 py-8'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold'>{t('title')}</h1>
        <p className='text-muted-foreground mt-1'>{t('description')}</p>
      </div>

      {/* Stats grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        {stats.map(stat => (
          <Card key={stat.label}>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium text-muted-foreground'>
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-3xl font-bold'>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent activity placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>{t('recentActivity')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-muted-foreground text-sm'>{t('noActivity')}</p>
        </CardContent>
      </Card>
    </main>
  )
}
