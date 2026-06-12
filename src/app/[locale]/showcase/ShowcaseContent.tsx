'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { AuthGuard } from '@/components/features'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Input,
  Label,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'
import { Icon } from '@/lib/icons'

function ShowcaseContent() {
  const { toast } = useToast()
  const t = useTranslations()
  const tShowcase = useTranslations('pages.showcase')
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    priority: '',
  })

  const handleLoadingDemo = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
    toast.success(tShowcase('toast.loadingCompleted'))
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success(tShowcase('toast.formSubmitted'))
    setFormData({ name: '', email: '', message: '', priority: '' })
  }

  return (
    <div className='relative min-h-screen bg-background text-foreground'>
      {/* Ambient background */}
      <div
        className='fixed inset-0 bg-mesh pointer-events-none'
        aria-hidden='true'
      />
      <div
        className='fixed inset-0 grid-dots pointer-events-none opacity-30'
        aria-hidden='true'
      />

      <main className='relative container mx-auto px-4 py-10 max-w-5xl'>
        <div className='space-y-8'>
          {/* Welcome Section */}
          <div className='space-y-3'>
            <div className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-subtle border border-brand/20 text-brand text-xs font-semibold'>
              <Icon name='component' size='sm' />
              {tShowcase('subtitle')}
            </div>
            <h1 className='font-display text-4xl font-bold tracking-tight'>
              {tShowcase('title')}
            </h1>
          </div>

          {/* Button Components */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Icon name='component' size='md' />
                {tShowcase('components.buttons.title')}
              </CardTitle>
              <CardDescription>
                {tShowcase('components.buttons.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div>
                <h4 className='text-sm font-medium mb-3'>
                  {tShowcase('components.buttons.variants')}
                </h4>
                <div className='flex flex-wrap gap-3'>
                  <Button variant='default'>
                    {tShowcase('components.buttons.default')}
                  </Button>
                  <Button variant='destructive'>
                    {tShowcase('components.buttons.destructive')}
                  </Button>
                  <Button variant='outline'>
                    {tShowcase('components.buttons.outline')}
                  </Button>
                  <Button variant='secondary'>
                    {tShowcase('components.buttons.secondary')}
                  </Button>
                  <Button variant='ghost'>
                    {tShowcase('components.buttons.ghost')}
                  </Button>
                  <Button variant='link'>
                    {tShowcase('components.buttons.link')}
                  </Button>
                </div>
              </div>

              <div>
                <h4 className='text-sm font-medium mb-3'>
                  {tShowcase('components.buttons.sizes')}
                </h4>
                <div className='flex flex-wrap items-center gap-3'>
                  <Button size='sm'>
                    {tShowcase('components.buttons.small')}
                  </Button>
                  <Button size='default'>
                    {tShowcase('components.buttons.default')}
                  </Button>
                  <Button size='lg'>
                    {tShowcase('components.buttons.large')}
                  </Button>
                  <Button size='icon'>
                    <Icon name='feature' size='sm' />
                  </Button>
                </div>
              </div>

              <div>
                <h4 className='text-sm font-medium mb-3'>
                  {tShowcase('components.buttons.states')}
                </h4>
                <div className='flex flex-wrap gap-3'>
                  <Button onClick={handleLoadingDemo} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        {tShowcase('components.buttons.loading')}
                      </>
                    ) : (
                      tShowcase('components.buttons.loadingDemo')
                    )}
                  </Button>
                  <Button disabled>
                    {tShowcase('components.buttons.disabled')}
                  </Button>
                  <Button
                    onClick={() =>
                      toast.success(
                        tShowcase('components.buttons.buttonClicked')
                      )
                    }
                  >
                    {tShowcase('components.buttons.showToast')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Badge Components */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Icon name='component' size='md' />
                {tShowcase('components.badges.title')}
              </CardTitle>
              <CardDescription>
                {tShowcase('components.badges.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='flex flex-wrap gap-2'>
                <Badge>{tShowcase('components.badges.default')}</Badge>
                <Badge variant='secondary'>
                  {tShowcase('components.badges.secondary')}
                </Badge>
                <Badge variant='destructive'>
                  {tShowcase('components.badges.destructive')}
                </Badge>
                <Badge variant='outline'>
                  {tShowcase('components.badges.outline')}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Form Components */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Icon name='component' size='md' />
                {tShowcase('components.forms.title')}
              </CardTitle>
              <CardDescription>
                {tShowcase('components.forms.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='space-y-4'>
                    <div>
                      <Label htmlFor='name'>
                        {tShowcase('components.forms.name')}
                      </Label>
                      <Input
                        id='name'
                        name='name'
                        placeholder={tShowcase(
                          'components.forms.namePlaceholder'
                        )}
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div>
                      <Label htmlFor='email'>
                        {tShowcase('components.forms.email')}
                      </Label>
                      <Input
                        id='email'
                        name='email'
                        type='email'
                        placeholder={tShowcase(
                          'components.forms.emailPlaceholder'
                        )}
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div>
                      <Label htmlFor='priority'>
                        {tShowcase('components.forms.priority')}
                      </Label>
                      <Select
                        value={formData.priority}
                        onValueChange={value =>
                          setFormData(prev => ({ ...prev, priority: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={tShowcase(
                              'components.forms.priorityPlaceholder'
                            )}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='low'>
                            {tShowcase('components.forms.priorityLow')}
                          </SelectItem>
                          <SelectItem value='medium'>
                            {tShowcase('components.forms.priorityMedium')}
                          </SelectItem>
                          <SelectItem value='high'>
                            {tShowcase('components.forms.priorityHigh')}
                          </SelectItem>
                          <SelectItem value='critical'>
                            {tShowcase('components.forms.priorityCritical')}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className='space-y-4'>
                    <div>
                      <Label htmlFor='message'>
                        {tShowcase('components.forms.message')}
                      </Label>
                      <Textarea
                        id='message'
                        name='message'
                        placeholder={tShowcase(
                          'components.forms.messagePlaceholder'
                        )}
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={8}
                      />
                    </div>
                  </div>
                </div>

                <div className='flex justify-end'>
                  <Button type='submit'>{t('common.actions.submit')}</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export function ShowcasePage() {
  return (
    <AuthGuard>
      <ShowcaseContent />
    </AuthGuard>
  )
}
