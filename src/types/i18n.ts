import type en from '../../messages/en.json'

type Messages = typeof en

// Translation value types (string, number, or React node for interpolation)
export type TranslationValue = string | number | React.ReactNode

// Translation interpolation values
export type TranslationValues = Record<string, TranslationValue>

// Utility type to check if an object has string values (for translation objects)
type IsTranslationObject<T> =
  T extends Record<string, unknown>
    ? T extends Record<string, string | Record<string, unknown>>
      ? true
      : false
    : false

// Extract nested translation keys with proper type constraints
type NestedKeys<T, P extends string = ''> = {
  [K in keyof T]: T[K] extends Record<string, unknown>
    ? IsTranslationObject<T[K]> extends true
      ? NestedKeys<T[K], P extends '' ? `${string & K}` : `${P}.${string & K}`>
      : P extends ''
        ? `${string & K}`
        : `${P}.${string & K}`
    : P extends ''
      ? `${string & K}`
      : `${P}.${string & K}`
}[keyof T]

// Translation keys type
export type TranslationKeys = NestedKeys<Messages>

// Translation namespaces
export type TranslationNamespace = keyof Messages

// Locale type (updated to match actual implementation)
export type Locale = 'en' | 'zh' | 'ms'

// Translation function type with proper typing
export type TFunction = (
  key: TranslationKeys,
  values?: TranslationValues
) => string

// Namespace-specific translation function types
export type CommonTFunction = (
  key: NestedKeys<Messages['common']>,
  values?: TranslationValues
) => string
export type AuthTFunction = (
  key: NestedKeys<Messages['auth']>,
  values?: TranslationValues
) => string
export type PagesTFunction = (
  key: NestedKeys<Messages['pages']>,
  values?: TranslationValues
) => string
