import type en from '../../messages/en/index'

type Messages = typeof en

// Extract nested translation keys
type NestedKeys<T, P extends string = ''> = {
  [K in keyof T]: T[K] extends Record<string, any>
    ? NestedKeys<T[K], P extends '' ? `${string & K}` : `${P}.${string & K}`>
    : P extends ''
      ? `${string & K}`
      : `${P}.${string & K}`
}[keyof T]

// Translation keys type
export type TranslationKeys = NestedKeys<Messages>

// Translation namespaces
export type TranslationNamespace = keyof Messages

// Locale type
export type Locale = 'en' | 'es' | 'fr'

// Translation function type
export type TFunction = (
  key: TranslationKeys,
  values?: Record<string, any>
) => string

// Namespace-specific translation function types
export type CommonTFunction = (
  key: NestedKeys<Messages['common']>,
  values?: Record<string, any>
) => string
export type AuthTFunction = (
  key: NestedKeys<Messages['auth']>,
  values?: Record<string, any>
) => string
export type PagesTFunction = (
  key: NestedKeys<Messages['pages']>,
  values?: Record<string, any>
) => string
