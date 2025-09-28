'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { WifiOff, Wifi } from 'lucide-react'

export function OfflineIndicator() {
  const t = useTranslations('common.pwa')
  const [isOnline, setIsOnline] = useState(true)
  const [showNotification, setShowNotification] = useState(false)

  useEffect(() => {
    // Set initial online status
    setIsOnline(navigator.onLine)

    const handleOnline = () => {
      setIsOnline(true)
      setShowNotification(true)
      // Hide notification after 3 seconds
      setTimeout(() => setShowNotification(false), 3000)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowNotification(true)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (!showNotification && isOnline) return null

  return (
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
        showNotification
          ? 'translate-y-0 opacity-100'
          : '-translate-y-full opacity-0'
      }`}
    >
      <div
        className={`px-4 py-2 rounded-lg shadow-lg backdrop-blur-sm flex items-center gap-2 text-sm font-medium ${
          isOnline ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'
        }`}
      >
        {isOnline ? (
          <>
            <Wifi className='h-4 w-4' />
            {t('backOnline')}
          </>
        ) : (
          <>
            <WifiOff className='h-4 w-4' />
            {t('offline')}
          </>
        )}
      </div>
    </div>
  )
}
