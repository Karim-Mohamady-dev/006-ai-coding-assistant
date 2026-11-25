import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import en from '../locales/en/common.json'
import ar from '../locales/ar/common.json'

export type Lang = 'en' | 'ar'
type Dict = Record<string, unknown>
const dicts: Record<Lang, Dict> = { en: en as Dict, ar: ar as Dict }
const STORAGE_KEY = 'studio-lang'

function lookup(dict: Dict, key: string): unknown {
  let cur: unknown = dict
  for (const part of key.split('.')) {
    if (cur && typeof cur === 'object') cur = (cur as Dict)[part]
    else return undefined
  }
  return cur
}

interface LangCtx {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: string) => string
  ta: <T>(key: string) => T[]
  has: (key: string) => boolean
}

const Ctx = createContext<LangCtx | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved === 'en' || saved === 'ar') return saved
    } catch { /* storage unavailable */ }
    return 'en'
  })

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, lang) } catch { /* ignore */ }
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }, [lang])

  const value = useMemo<LangCtx>(() => ({
    lang,
    setLang: setLangState,
    t: (key: string) => {
      const v = lookup(dicts[lang], key)
      if (typeof v === 'string') return v
      const fb = lookup(dicts.en, key)
      return typeof fb === 'string' ? fb : key
    },
    ta: <T,>(key: string): T[] => {
      const v = lookup(dicts[lang], key)
      if (Array.isArray(v)) return v as T[]
      const fb = lookup(dicts.en, key)
      return Array.isArray(fb) ? (fb as T[]) : []
    },
    has: (key: string) => lookup(dicts[lang], key) !== undefined,
  }), [lang])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useLang(): LangCtx {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useLang must be used inside LanguageProvider')
  return ctx
}
