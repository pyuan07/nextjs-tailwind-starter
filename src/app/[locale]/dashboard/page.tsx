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

  const stats: Array<{
    label: string
    value: string
    trend: string
    up: boolean
    icon: string
    colorVar: string
  }> = [
    {
      label: t('stats.totalUsers'),
      value: '1,024',
      trend: '+12.5%',
      up: true,
      icon: '👥',
      colorVar: 'var(--chart-1)',
    },
    {
      label: t('stats.activeToday'),
      value: '128',
      trend: '+8.2%',
      up: true,
      icon: '⚡',
      colorVar: 'var(--chart-2)',
    },
    {
      label: t('stats.revenue'),
      value: '$4,250',
      trend: '+23.1%',
      up: true,
      icon: '💰',
      colorVar: 'var(--chart-3)',
    },
    {
      label: t('stats.openTickets'),
      value: '7',
      trend: '−3',
      up: false,
      icon: '🎫',
      colorVar: 'var(--chart-5)',
    },
  ]

  return (
    <main id='main-content' className='container mx-auto px-4 py-8 max-w-6xl'>
      {/* Header */}
      <div className='mb-10 space-y-1'>
        <h1 className='font-display text-3xl font-bold'>{t('title')}</h1>
        <p className='text-muted-foreground'>{t('description')}</p>
      </div>

      {/* Stats grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
        {stats.map(stat => (
          <div
            key={stat.label}
            className='relative bg-card border border-border rounded-2xl p-5 overflow-hidden hover:border-border/80 transition-colors duration-200'
          >
            {/* Top accent line */}
            <div
              className='absolute top-0 left-0 right-0 h-[3px]'
              style={{ background: stat.colorVar }}
              aria-hidden='true'
            />

            <div className='flex items-start justify-between mb-4 pt-1'>
              {/* Icon badge */}
              <div
                className='w-10 h-10 rounded-xl flex items-center justify-center text-lg'
                style={{
                  background: `color-mix(in oklch, ${stat.colorVar} 12%, transparent)`,
                }}
                aria-hidden='true'
              >
                {stat.icon}
              </div>
              {/* Trend badge */}
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  stat.up
                    ? 'bg-chart-3/10 text-chart-3'
                    : 'bg-chart-5/10 text-chart-5'
                }`}
              >
                {stat.up ? '↑' : '↓'} {stat.trend}
              </span>
            </div>

            <p className='text-3xl font-bold tabular-nums tracking-tight mb-1'>
              {stat.value}
            </p>
            <p className='text-sm text-muted-foreground'>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <Card className='rounded-2xl'>
        <CardHeader>
          <CardTitle className='font-display'>{t('recentActivity')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col items-center justify-center py-12 text-center space-y-3'>
            <div
              className='w-12 h-12 rounded-full bg-muted flex items-center justify-center text-2xl'
              aria-hidden='true'
            >
              📋
            </div>
            <p className='text-muted-foreground text-sm'>{t('noActivity')}</p>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
