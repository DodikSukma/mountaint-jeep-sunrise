import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'id', 'zh'],
  defaultLocale: 'en',
  // 'always' keeps every language on its own crawlable URL (/en, /id, /zh),
  // which is what the hreflang tags in the layout point at.
  localePrefix: 'always',
  // Persists the visitor's choice so a return visit lands on the same language.
  localeCookie: {
    name: 'NEXT_LOCALE',
    maxAge: 60 * 60 * 24 * 365,
  },
})

/** Maps our locale codes to the BCP-47 tags used by OG / hreflang. */
export const localeMeta = {
  en: { htmlLang: 'en', ogLocale: 'en_US', label: 'English', short: 'EN' },
  id: { htmlLang: 'id', ogLocale: 'id_ID', label: 'Bahasa Indonesia', short: 'ID' },
  zh: { htmlLang: 'zh-Hans', ogLocale: 'zh_CN', label: '简体中文', short: 'ZH' },
}
