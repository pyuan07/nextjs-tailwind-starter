'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { X, Download, Smartphone } from 'lucide-react'
import { logger } from '@/lib/logger'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean
}

export function PWAInstallPrompt() {
  const t = useTranslations('common.pwa')
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Check if running on iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    setIsIOS(iOS)

    // Check if running in standalone mode (already installed)
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as NavigatorWithStandalone).standalone ||
      document.referrer.includes('android-app://')
    setIsStandalone(standalone)

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)

      // Show the prompt after a delay (better UX)
      setTimeout(() => {
        if (!standalone) {
          setShowPrompt(true)
        }
      }, 3000)
    }

    // Listen for app installed event
    const handleAppInstalled = () => {
      setShowPrompt(false)
      setDeferredPrompt(null)
      logger.info('PWA was installed', { type: 'pwa_installed' })
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      )
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === 'accepted') {
        logger.info('User accepted the install prompt', {
          type: 'pwa_install_accepted',
        })
      } else {
        logger.info('User dismissed the install prompt', {
          type: 'pwa_install_dismissed',
        })
      }

      setDeferredPrompt(null)
      setShowPrompt(false)
    } catch (error) {
      logger.error(
        'Error showing install prompt',
        error instanceof Error ? error : new Error(String(error)),
        { type: 'pwa_install_error' }
      )
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    // Remember user dismissed for this session
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('pwa-prompt-dismissed', 'true')
    }
  }

  // Don't show if already installed, dismissed, or no install prompt available
  if (
    isStandalone ||
    (typeof window !== 'undefined' &&
      sessionStorage.getItem('pwa-prompt-dismissed')) ||
    (!deferredPrompt && !isIOS) ||
    !showPrompt
  ) {
    return null
  }

  return (
    <div className='fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-80'>
      <div className='bg-background border border-border rounded-lg shadow-lg p-4 backdrop-blur-sm bg-background/95'>
        <div className='flex items-start gap-3'>
          <div className='flex-shrink-0'>
            <Smartphone className='h-6 w-6 text-primary' />
          </div>

          <div className='flex-1 min-w-0'>
            <h3 className='text-sm font-semibold text-foreground'>
              {isIOS ? t('addToHomeScreen') : t('install')}
            </h3>
            <p className='text-xs text-muted-foreground mt-1'>
              {isIOS ? t('iosInstructions') : t('installPrompt')}
            </p>

            <div className='flex gap-2 mt-3'>
              {!isIOS && deferredPrompt && (
                <Button
                  size='sm'
                  onClick={handleInstallClick}
                  className='text-xs h-8'
                >
                  <Download className='h-3 w-3 mr-1' />
                  {t('install')}
                </Button>
              )}
              <Button
                size='sm'
                variant='outline'
                onClick={handleDismiss}
                className='text-xs h-8'
              >
                {t('notNow')}
              </Button>
            </div>
          </div>

          <Button
            size='sm'
            variant='ghost'
            onClick={handleDismiss}
            className='flex-shrink-0 h-6 w-6 p-0'
          >
            <X className='h-3 w-3' />
          </Button>
        </div>
      </div>
    </div>
  )
}
