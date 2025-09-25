'use client'

import { useState } from 'react'
import { useTranslation } from '@/contexts/LanguageContext'
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
  const t = useTranslation()
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
    toast.success('Loading completed successfully!')
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Form submitted successfully!')
    setFormData({ name: '', email: '', message: '', priority: '' })
  }

  return (
    <div className='min-h-screen bg-background text-foreground'>
      <main className='container mx-auto px-4 py-8'>
        <div className='space-y-8'>
          {/* Welcome Section */}
          <div className='space-y-2'>
            <h1 className='text-3xl font-bold flex items-center gap-3'>
              <Icon name='component' size='xl' />
              {t('nav.showcase')} Demo
            </h1>
            <p className='text-muted-foreground'>
              Explore our UI components and features in this interactive
              showcase.
            </p>
          </div>

          {/* Button Components */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Icon name='component' size='md' />
                Button Components
              </CardTitle>
              <CardDescription>
                Various button styles and states
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div>
                <h4 className='text-sm font-medium mb-3'>Button Variants</h4>
                <div className='flex flex-wrap gap-3'>
                  <Button variant='default'>Default</Button>
                  <Button variant='destructive'>Destructive</Button>
                  <Button variant='outline'>Outline</Button>
                  <Button variant='secondary'>Secondary</Button>
                  <Button variant='ghost'>Ghost</Button>
                  <Button variant='link'>Link</Button>
                </div>
              </div>

              <div>
                <h4 className='text-sm font-medium mb-3'>Button Sizes</h4>
                <div className='flex flex-wrap items-center gap-3'>
                  <Button size='sm'>Small</Button>
                  <Button size='default'>Default</Button>
                  <Button size='lg'>Large</Button>
                  <Button size='icon'>
                    <Icon name='feature' size='sm' />
                  </Button>
                </div>
              </div>

              <div>
                <h4 className='text-sm font-medium mb-3'>Interactive States</h4>
                <div className='flex flex-wrap gap-3'>
                  <Button onClick={handleLoadingDemo} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Loading...
                      </>
                    ) : (
                      'Click for Loading Demo'
                    )}
                  </Button>
                  <Button disabled>Disabled</Button>
                  <Button onClick={() => toast.success('Button clicked!')}>
                    Show Toast
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
                Badge Components
              </CardTitle>
              <CardDescription>Status indicators and labels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='flex flex-wrap gap-2'>
                <Badge>Default</Badge>
                <Badge variant='secondary'>Secondary</Badge>
                <Badge variant='destructive'>Destructive</Badge>
                <Badge variant='outline'>Outline</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Form Components */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Icon name='component' size='md' />
                Form Components
              </CardTitle>
              <CardDescription>Input fields and form controls</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='space-y-4'>
                    <div>
                      <Label htmlFor='name'>Name</Label>
                      <Input
                        id='name'
                        name='name'
                        placeholder='Enter your name'
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div>
                      <Label htmlFor='email'>{t('auth.email')}</Label>
                      <Input
                        id='email'
                        name='email'
                        type='email'
                        placeholder='Enter your email'
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div>
                      <Label htmlFor='priority'>Priority</Label>
                      <Select
                        value={formData.priority}
                        onValueChange={value =>
                          setFormData(prev => ({ ...prev, priority: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Select priority' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='low'>Low</SelectItem>
                          <SelectItem value='medium'>Medium</SelectItem>
                          <SelectItem value='high'>High</SelectItem>
                          <SelectItem value='critical'>Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className='space-y-4'>
                    <div>
                      <Label htmlFor='message'>Message</Label>
                      <Textarea
                        id='message'
                        name='message'
                        placeholder='Enter your message'
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={8}
                      />
                    </div>
                  </div>
                </div>

                <div className='flex justify-end'>
                  <Button type='submit'>{t('form.submit')}</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default function ShowcasePage() {
  return (
    <AuthGuard>
      <ShowcaseContent />
    </AuthGuard>
  )
}
