import { i18n } from '@lingui/core'
import { messages as enMessages } from '../../locales/en/messages'
import { messages as csMessages } from '../../locales/zh/messages'

export const locales = {
  'en-US': enMessages,
  'zh-CN': csMessages,
}

export async function activateLocale(locale: string) {
  const messages = await locales[locale as keyof typeof locales]
  i18n.load({ [locale]: messages })
  i18n.activate(locale)
}

export const LOCALES = {
  'en-US': 'English',
  'zh-CN': '简体中文',
}
