'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

// Simplified language configuration - only EN and one local language
export const LANGUAGES = {
  en: 'English',
  zh: '中文', // Keep only one additional language for backoffice
} as const

export type Language = keyof typeof LANGUAGES
export const DEFAULT_LANGUAGE: Language = 'en'

// Simple translation interface - no complex nesting
export interface Translations {
  // Navigation
  'nav.home': string
  'nav.profile': string
  'nav.showcase': string
  'nav.settings': string

  // Common actions
  'common.save': string
  'common.cancel': string
  'common.delete': string
  'common.edit': string
  'common.loading': string
  'common.error': string
  'common.success': string

  // Auth
  'auth.login': string
  'auth.logout': string
  'auth.email': string
  'auth.password': string
  'auth.signIn': string
  'auth.welcome': string

  // Forms
  'form.required': string
  'form.invalid': string
  'form.submit': string

  // Dashboard/Backoffice specific
  'dashboard.title': string
  'dashboard.overview': string
  'users.title': string
  'users.add': string
  'settings.title': string
  'settings.language': string
  'settings.theme': string
}

// Simple translation data - flat structure for easy maintenance
const translations: Record<Language, Translations> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.profile': 'Profile',
    'nav.showcase': 'Showcase',
    'nav.settings': 'Settings',

    // Common actions
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',

    // Auth
    'auth.login': 'Login',
    'auth.logout': 'Logout',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.signIn': 'Sign In',
    'auth.welcome': 'Welcome back',

    // Forms
    'form.required': 'This field is required',
    'form.invalid': 'Invalid input',
    'form.submit': 'Submit',

    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.overview': 'Overview',
    'users.title': 'Users',
    'users.add': 'Add User',
    'settings.title': 'Settings',
    'settings.language': 'Language',
    'settings.theme': 'Theme',
  },
  zh: {
    // Navigation
    'nav.home': '首页',
    'nav.profile': '个人资料',
    'nav.showcase': '展示',
    'nav.settings': '设置',

    // Common actions
    'common.save': '保存',
    'common.cancel': '取消',
    'common.delete': '删除',
    'common.edit': '编辑',
    'common.loading': '加载中...',
    'common.error': '错误',
    'common.success': '成功',

    // Auth
    'auth.login': '登录',
    'auth.logout': '退出',
    'auth.email': '邮箱',
    'auth.password': '密码',
    'auth.signIn': '登录',
    'auth.welcome': '欢迎回来',

    // Forms
    'form.required': '此字段为必填项',
    'form.invalid': '输入无效',
    'form.submit': '提交',

    // Dashboard
    'dashboard.title': '仪表板',
    'dashboard.overview': '概览',
    'users.title': '用户',
    'users.add': '添加用户',
    'settings.title': '设置',
    'settings.language': '语言',
    'settings.theme': '主题',
  },
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: keyof Translations) => string
  languages: typeof LANGUAGES
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize language from localStorage on client side
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage && savedLanguage in LANGUAGES) {
      setLanguageState(savedLanguage)
    }
    setIsInitialized(true)
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
  }

  const t = (key: keyof Translations): string => {
    return (
      translations[language][key] || translations[DEFAULT_LANGUAGE][key] || key
    )
  }

  // Show loading state until initialized to avoid hydration mismatch
  if (!isInitialized) {
    return (
      <LanguageContext.Provider
        value={{
          language: DEFAULT_LANGUAGE,
          setLanguage,
          t: key => translations[DEFAULT_LANGUAGE][key] || key,
          languages: LANGUAGES,
        }}
      >
        {children}
      </LanguageContext.Provider>
    )
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        languages: LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

// Simple hook for translations only
export function useTranslation() {
  const { t } = useLanguage()
  return t
}
