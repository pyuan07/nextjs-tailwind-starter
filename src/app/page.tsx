'use client'

import Link from 'next/link'
import { useTranslation } from '@/contexts/LanguageContext'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui'

export default function Home() {
  const t = useTranslation()

  const techStack = [
    { name: 'Next.js 15', desc: 'React framework with App Router & Turbopack' },
    {
      name: 'Tailwind CSS v4',
      desc: 'Utility-first CSS with new CSS-first config',
    },
    {
      name: 'TypeScript',
      desc: 'Type-safe development with modern JavaScript',
    },
    {
      name: 'Backoffice Ready',
      desc: 'Optimized for internal tools and dashboards',
    },
  ]

  return (
    <div className='min-h-screen bg-background text-foreground'>
      {/* Main Content */}
      <main className='container mx-auto px-4 py-16'>
        {/* Hero Section */}
        <div className='text-center mb-16'>
          <h2 className='text-4xl font-bold mb-4'>
            Simplified Backoffice Starter
          </h2>
          <p className='text-xl text-muted-foreground mb-8 max-w-2xl mx-auto'>
            A streamlined Next.js template optimized for internal tools, admin
            panels, and ERP systems. Fast, simple, and efficient.
          </p>
          <div className='flex gap-4 justify-center'>
            <Link href='/showcase'>
              <Button size='lg'>Get Started →</Button>
            </Link>
            <Link href='/login'>
              <Button variant='outline' size='lg'>
                {t('auth.login')}
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className='mb-16'>
          <h3 className='text-2xl font-semibold text-center mb-8'>
            Optimized for Internal Tools
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

        {/* Backoffice Benefits */}
        <div className='mb-16'>
          <h3 className='text-2xl font-semibold text-center mb-8'>
            Why This Approach?
          </h3>
          <div className='grid md:grid-cols-2 gap-8'>
            <Card className='p-6'>
              <h4 className='text-lg font-semibold mb-4 text-green-600'>
                ✅ Simplified
              </h4>
              <ul className='space-y-2 text-sm text-muted-foreground'>
                <li>• No complex URL routing</li>
                <li>• Simple localStorage language switching</li>
                <li>• Reduced bundle size</li>
                <li>• Faster initial load</li>
              </ul>
            </Card>
            <Card className='p-6'>
              <h4 className='text-lg font-semibold mb-4 text-blue-600'>
                🎯 Optimized for Internal Use
              </h4>
              <ul className='space-y-2 text-sm text-muted-foreground'>
                <li>• No SEO overhead</li>
                <li>• Focused on functionality</li>
                <li>• Easy maintenance</li>
                <li>• Perfect for admin panels</li>
              </ul>
            </Card>
          </div>
        </div>
      </main>

      {/* Simplified Footer */}
      <footer className='border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-16'>
        <div className='container mx-auto px-4 py-6'>
          <div className='text-center'>
            <p className='text-sm text-muted-foreground'>
              Simplified Next.js starter for backoffice tools and internal
              applications
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
