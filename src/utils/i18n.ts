import { i18n } from '@lingui/core'
import { LANGUAGE_LOCALSTORAGE_KEY } from '../config/loaclStorage'

export const defaultLocale = 'en'

export function isTestLanguage(locale: string) {
  return locale === 'pseudo'
}

export async function dynamicActivate(locale: string) {
  const { messages } = await import(`@lingui/loader!locales/${locale}/messages.po`)
  if (!isTestLanguage(locale)) {
    localStorage.setItem(LANGUAGE_LOCALSTORAGE_KEY, locale)
  }
  i18n.load(locale, messages)
  i18n.activate(locale)
}
