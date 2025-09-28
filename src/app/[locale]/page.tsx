import { getTranslations } from 'next-intl/server'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui'
import { type Locale } from '@/i18n/config'

interface HomeProps {
  params: Promise<{ locale: string }>
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
  const _tHome = await getTranslations({
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
    <div className='min-h-screen bg-background text-foreground'>
      {/* Main Content */}
      <main className='container mx-auto px-4 py-16'>
        {/* Hero Section */}
        <div className='text-center mb-16'>
          <h2 className='text-4xl font-bold mb-4'>
            {tCommon('brand.welcome')}
          </h2>
          <p className='text-xl text-muted-foreground mb-8 max-w-2xl mx-auto'>
            {tCommon('brand.description')}
          </p>
          <div className='flex gap-4 justify-center'>
            <a href={`/${locale}/showcase`}>
              <Button size='lg'>{tNav('showcase')} →</Button>
            </a>
            <a href={`/${locale}/login`}>
              <Button variant='outline' size='lg'>
                {tNav('login')}
              </Button>
            </a>
          </div>
        </div>

        {/* Tech Stack */}
        <div className='mb-16'>
          <h3 className='text-2xl font-semibold text-center mb-8'>
            {tCommon('techStack.title')}
          </h3>
          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {techStack.map((tech, i) => (
              <Card
                key={i}
                className='text-center hover:shadow-md transition-shadow'
              >
                <CardHeader className='pb-3'>
                  <CardTitle className='text-lg'>{tech.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{tech.desc}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer className='border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-16'>
        <div className='container mx-auto px-4 py-6'>
          <div className='flex flex-col items-center gap-4'>
            <div className='flex gap-6 text-sm'>
              <a
                href='/terms'
                target='_blank'
                rel='noopener noreferrer'
                className='text-muted-foreground hover:text-foreground transition-colors'
              >
                {tCommon('footer.termsOfService')}
              </a>
              <a
                href='/privacy'
                target='_blank'
                rel='noopener noreferrer'
                className='text-muted-foreground hover:text-foreground transition-colors'
              >
                {tCommon('footer.privacyPolicy')}
              </a>
            </div>
            <p className='text-sm text-muted-foreground text-center'>
              {tCommon('footer.builtWith')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
