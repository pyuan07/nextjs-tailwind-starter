'use client'

import { useState, useEffect, useRef } from 'react'
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

const DISMISS_STORAGE_KEY = 'pwa-install-dismissed-at'
const DISMISS_COOLDOWN_MS = 30 * 24 * 60 * 60 * 1000 // 30 days

export function PWAInstallPrompt() {
  const t = useTranslations('common.pwa')
  const tActions = useTranslations('common.actions')
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const isStandaloneRef = useRef(false)

  // Keep ref in sync with state to avoid stale closures in setTimeout
  useEffect(() => {
    isStandaloneRef.current = isStandalone
  }, [isStandalone])

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
    isStandaloneRef.current = !!standalone

    // Check 30-day dismiss cooldown
    const dismissedAt = localStorage.getItem(DISMISS_STORAGE_KEY)
    const isDismissed =
      !!dismissedAt && Date.now() - Number(dismissedAt) < DISMISS_COOLDOWN_MS

    if (isDismissed) return

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)

      // Show the prompt after a delay (better UX)
      setTimeout(() => {
        if (!isStandaloneRef.current) {
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
    if (typeof window !== 'undefined') {
      localStorage.setItem(DISMISS_STORAGE_KEY, Date.now().toString())
    }
  }

  // Don't show if already installed, no install prompt available, or not triggered
  if (isStandalone || (!deferredPrompt && !isIOS) || !showPrompt) {
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
            aria-label={tActions('close')}
            className='flex-shrink-0 h-11 w-11 p-2'
          >
            <X className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  )
}
