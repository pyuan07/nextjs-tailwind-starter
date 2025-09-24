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
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'
import { Icon } from '@/lib/icons'
import { User, Settings, HelpCircle, LogOut } from 'lucide-react'

function ShowcaseContent() {
  const { toast } = useToast()
  const t = useTranslations('pages.showcase')
  const [loadingStates, setLoadingStates] = useState({
    button1: false,
    button2: false,
    button3: false,
  })
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    priority: '',
  })

  const handleLoadingDemo = async (button: keyof typeof loadingStates) => {
    setLoadingStates(prev => ({ ...prev, [button]: true }))
    await new Promise(resolve => setTimeout(resolve, 2000))
    setLoadingStates(prev => ({ ...prev, [button]: false }))
    toast.success(t('toasts.loadingCompleted'))
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className='min-h-screen bg-background text-foreground'>
      {/* Main Content */}
      <main className='container mx-auto px-4 py-8'>
        <div className='space-y-8'>
          {/* Welcome Section */}
          <div className='space-y-2'>
            <h1 className='text-3xl font-bold flex items-center gap-3'>
              <Icon name='component' size='xl' />
              {t('title')}
            </h1>
            <p className='text-muted-foreground'>{t('subtitle')}</p>
          </div>

          {/* Button Components */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Icon name='component' size='md' />
                {t('buttons.title')}
              </CardTitle>
              <CardDescription>{t('buttons.description')}</CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              {/* Button Variants */}
              <div>
                <h4 className='text-sm font-medium mb-3'>
                  {t('buttons.variants')}
                </h4>
                <div className='flex flex-wrap gap-3'>
                  <Button variant='default'>{t('buttons.default')}</Button>
                  <Button variant='destructive'>
                    {t('buttons.destructive')}
                  </Button>
                  <Button variant='outline'>{t('buttons.outline')}</Button>
                  <Button variant='secondary'>{t('buttons.secondary')}</Button>
                  <Button variant='ghost'>{t('buttons.ghost')}</Button>
                  <Button variant='link'>{t('buttons.link')}</Button>
                </div>
              </div>

              {/* Button Sizes */}
              <div>
                <h4 className='text-sm font-medium mb-3'>
                  {t('buttons.sizes')}
                </h4>
                <div className='flex flex-wrap items-center gap-3'>
                  <Button size='sm'>{t('buttons.small')}</Button>
                  <Button size='default'>{t('buttons.default')}</Button>
                  <Button size='lg'>{t('buttons.large')}</Button>
                  <Button size='icon'>
                    <Icon name='feature' size='sm' />
                  </Button>
                </div>
              </div>

              {/* Interactive States */}
              <div>
                <h4 className='text-sm font-medium mb-3'>
                  {t('buttons.interactiveStates')}
                </h4>
                <div className='flex flex-wrap gap-3'>
                  <Button
                    onClick={() => handleLoadingDemo('button1')}
                    disabled={loadingStates.button1}
                  >
                    {loadingStates.button1 ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        {t('buttons.loading')}
                      </>
                    ) : (
                      t('buttons.clickForLoading')
                    )}
                  </Button>
                  <Button disabled>{t('buttons.disabled')}</Button>
                  <Button
                    onClick={() => toast.success(t('toasts.buttonClicked'))}
                  >
                    {t('buttons.showToast')}
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
                {t('badges.title')}
              </CardTitle>
              <CardDescription>{t('badges.description')}</CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div>
                <h4 className='text-sm font-medium mb-3'>
                  {t('buttons.variants')}
                </h4>
                <div className='flex flex-wrap gap-2'>
                  <Badge>{t('buttons.default')}</Badge>
                  <Badge variant='secondary'>{t('buttons.secondary')}</Badge>
                  <Badge variant='destructive'>
                    {t('buttons.destructive')}
                  </Badge>
                  <Badge variant='outline'>{t('buttons.outline')}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Components */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Icon name='component' size='md' />
                {t('forms.title')}
              </CardTitle>
              <CardDescription>{t('forms.description')}</CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-4'>
                  <div>
                    <Label htmlFor='name'>{t('forms.name')}</Label>
                    <Input
                      id='name'
                      name='name'
                      placeholder={t('forms.placeholders.name')}
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor='email'>{t('forms.email')}</Label>
                    <Input
                      id='email'
                      name='email'
                      type='email'
                      placeholder={t('forms.placeholders.email')}
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor='priority'>{t('forms.priority')}</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={value =>
                        setFormData(prev => ({ ...prev, priority: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t('forms.placeholders.selectPriority')}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='low'>
                          {t('forms.priorities.low')}
                        </SelectItem>
                        <SelectItem value='medium'>
                          {t('forms.priorities.medium')}
                        </SelectItem>
                        <SelectItem value='high'>
                          {t('forms.priorities.high')}
                        </SelectItem>
                        <SelectItem value='critical'>
                          {t('forms.priorities.critical')}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className='space-y-4'>
                  <div>
                    <Label htmlFor='message'>{t('forms.message')}</Label>
                    <Textarea
                      id='message'
                      name='message'
                      placeholder={t('forms.placeholders.message')}
                      value={formData.message}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dropdown Components */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Icon name='component' size='md' />
                {t('dropdowns.title')}
              </CardTitle>
              <CardDescription>{t('dropdowns.description')}</CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='flex flex-wrap gap-4'>
                <div>
                  <Label>{t('dropdowns.simpleDropdown')}</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='outline'>
                        {t('dropdowns.selectOption')}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() =>
                          toast.info(
                            t('toasts.optionSelected', {
                              option: t('dropdowns.options.option1'),
                            })
                          )
                        }
                      >
                        {t('dropdowns.options.option1')}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          toast.info(
                            t('toasts.optionSelected', {
                              option: t('dropdowns.options.option2'),
                            })
                          )
                        }
                      >
                        {t('dropdowns.options.option2')}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() =>
                          toast.info(
                            t('toasts.optionSelected', {
                              option: t('dropdowns.options.option3'),
                            })
                          )
                        }
                      >
                        {t('dropdowns.options.option3')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div>
                  <Label>{t('dropdowns.userMenu')}</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='outline'>
                        <User className='h-4 w-4 mr-2' />
                        {t('dropdowns.demoUser')}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>
                        {t('dropdowns.myAccount')}
                      </DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Settings className='h-4 w-4 mr-2' />
                        {t('dropdowns.settings')}
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <HelpCircle className='h-4 w-4 mr-2' />
                        {t('dropdowns.support')}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className='text-red-600'>
                        <LogOut className='h-4 w-4 mr-2' />
                        {t('dropdowns.signOut')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dialog/Modal Components */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Icon name='component' size='md' />
                {t('dialogs.title')}
              </CardTitle>
              <CardDescription>{t('dialogs.description')}</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex flex-wrap gap-3'>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant='outline'>
                      {t('dialogs.simple.trigger')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t('dialogs.simple.title')}</DialogTitle>
                      <DialogDescription>
                        {t('dialogs.simple.description')}
                      </DialogDescription>
                    </DialogHeader>
                    <div className='py-4'>
                      <p className='text-sm text-muted-foreground'>
                        {t('dialogs.simple.content')}
                      </p>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant='outline'>
                      {t('dialogs.confirmation.trigger')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {t('dialogs.confirmation.title')}
                      </DialogTitle>
                      <DialogDescription>
                        {t('dialogs.confirmation.description')}
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant='outline'>
                        {t('dialogs.confirmation.cancel')}
                      </Button>
                      <Button
                        variant='destructive'
                        onClick={() =>
                          toast.success(t('toasts.actionConfirmed'))
                        }
                      >
                        {t('dialogs.confirmation.continue')}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant='outline'>
                      {t('dialogs.form.trigger')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t('dialogs.form.title')}</DialogTitle>
                      <DialogDescription>
                        {t('dialogs.form.description')}
                      </DialogDescription>
                    </DialogHeader>
                    <div className='space-y-4 py-4'>
                      <div>
                        <Label htmlFor='dialog-name'>{t('forms.name')}</Label>
                        <Input
                          id='dialog-name'
                          placeholder={t('forms.placeholders.name')}
                        />
                      </div>
                      <div>
                        <Label htmlFor='dialog-email'>{t('forms.email')}</Label>
                        <Input
                          id='dialog-email'
                          type='email'
                          placeholder={t('forms.placeholders.email')}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant='outline'>
                        {t('dialogs.confirmation.cancel')}
                      </Button>
                      <Button
                        onClick={() => toast.success(t('toasts.profileSaved'))}
                      >
                        {t('dialogs.form.saveChanges')}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
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
