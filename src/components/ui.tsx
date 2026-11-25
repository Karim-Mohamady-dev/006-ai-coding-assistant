import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  Check, Globe, List, X, CaretDown, ArrowRight, ArrowLeft,
  PenNib, Sparkle, ChatCircleText, Translate, Code, Bug, BookOpen,
  Image as ImageIcon, FilmStrip, Microphone, ShieldCheck, Clock, Users,
} from '@phosphor-icons/react'
import { useLang } from '../i18n.tsx'

export const ICONS: Record<string, typeof PenNib> = {
  pen: PenNib, sparkle: Sparkle, chat: ChatCircleText, translate: Translate,
  code: Code, bug: Bug, book: BookOpen, image: ImageIcon, film: FilmStrip,
  mic: Microphone, shield: ShieldCheck, clock: Clock, users: Users,
}

export function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) { el.classList.add('is-visible'); io.disconnect() } }) },
      { threshold: 0.12 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>
}

export function TaglineReveal({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) { setOn(true); io.disconnect() } }) },
      { threshold: 0.35 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  const words = text.split(' ')
  return (
    <section aria-label="tagline" className="mx-auto max-w-6xl px-4 py-24 sm:px-8">
      <p ref={ref} className="heading-2 mx-auto max-w-[680px] text-center">
        {words.map((w, i) => (
          <span key={i} className={`tagline-word ${on ? 'is-on' : ''}`} style={{ transitionDelay: on ? `${Math.min(i * 70, 1400)}ms` : '0ms' }}>
            {w}{' '}
          </span>
        ))}
      </p>
    </section>
  )
}

export function SectionHead({ eyebrow, title, sub }: { eyebrow?: string; title: string; sub?: string }) {
  return (
    <Reveal className="mx-auto max-w-[680px] text-center">
      {eyebrow ? <p className="caption-4 mb-4 uppercase tracking-wide opacity-70">{eyebrow}</p> : null}
      <h2 className="heading-3">{title}</h2>
      {sub ? <p className="body-3 mt-4 opacity-80">{sub}</p> : null}
    </Reveal>
  )
}

export function LangSwitch() {
  const { lang, setLang, t } = useLang()
  return (
    <button
      type="button"
      onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
      className="btn-ghost button-sm"
      aria-label={t('common.switchLanguage')}
    >
      <Globe size={16} weight="regular" />
      {lang === 'en' ? 'العربية' : 'English'}
    </button>
  )
}

export function Nav() {
  const { t, ta } = useLang()
  const [open, setOpen] = useState(false)
  const items = ta<{ label: string; href: string }>('nav.items')
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-black">
        {t('common.skip')}
      </a>
      <header className="fixed inset-x-4 top-4 z-50 mx-auto max-w-6xl">
        <nav aria-label="primary" className="flex items-center justify-between gap-4 rounded-2xl border px-4 py-2 backdrop-blur-md" style={{ background: 'color-mix(in srgb, var(--color-paper) 82%, transparent)', borderColor: 'var(--color-muted)' }}>
          <a href="#top" className="title-1 flex items-center gap-2 font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg text-white" style={{ background: 'var(--color-accent)' }} aria-hidden="true">
              {t('brandMark')}
            </span>
            {t('brand')}
          </a>
          <ul className="hidden items-center gap-8 md:flex">
            {items.map((it) => (
              <li key={it.href}>
                <a href={it.href} className="title-3 opacity-80 transition-opacity duration-300 hover:opacity-100">{it.label}</a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <div className="hidden sm:block"><LangSwitch /></div>
            <a href="#signup" className="btn-primary button-sm hidden sm:inline-flex">{t('nav.cta')}</a>
            <button type="button" className="btn-ghost p-2 md:hidden" aria-expanded={open} aria-label={t('common.menu')} onClick={() => setOpen(!open)}>
              <span className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                {open ? <X size={20} /> : <List size={20} />}
              </span>
            </button>
          </div>
        </nav>
      </header>
      {open ? (
        <div className="fixed inset-0 z-40 flex flex-col justify-center px-8 backdrop-blur-xl md:hidden" style={{ background: 'color-mix(in srgb, var(--color-paper) 92%, transparent)' }} role="dialog" aria-label={t('common.menu')}>
          <ul className="flex flex-col gap-6">
            {items.map((it, i) => (
              <li key={it.href} className="reveal is-visible" style={{ animationDelay: `${i * 60}ms` }}>
                <a href={it.href} onClick={() => setOpen(false)} className="heading-4 block">{it.label}</a>
              </li>
            ))}
            <li>
              <a href="#signup" onClick={() => setOpen(false)} className="btn-primary button-md mt-4">{t('nav.cta')}</a>
            </li>
            <li><LangSwitch /></li>
          </ul>
        </div>
      ) : null}
    </>
  )
}

export function Faq() {
  const { t, ta } = useLang()
  const [openIdx, setOpenIdx] = useState<number | null>(0)
  const items = ta<{ q: string; a: string }>('faq.items')
  return (
    <section id="faq" aria-labelledby="faq-title" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-8">
      <SectionHead title={t('faq.title')} />
      <div className="mx-auto mt-12 max-w-3xl">
        {items.map((it, i) => (
          <div key={i} className="mb-4 rounded-2xl border" style={{ borderColor: 'var(--color-muted)' }}>
            <button type="button" className="flex w-full items-center justify-between gap-4 px-4 py-4 text-start" aria-expanded={openIdx === i} onClick={() => setOpenIdx(openIdx === i ? null : i)}>
              <span className="title-2">{it.q}</span>
              <span className="shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" style={{ transform: openIdx === i ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                <CaretDown size={18} />
              </span>
            </button>
            {openIdx === i ? <p className="body-3 px-4 pb-4 opacity-80">{it.a}</p> : null}
          </div>
        ))}
      </div>
    </section>
  )
}

export function SignupForm({ compact = false }: { compact?: boolean }) {
  const { t } = useLang()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({})
  const [done, setDone] = useState(false)
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const next: typeof errors = {}
    if (!name.trim()) next.name = t('form.nameError')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = t('form.emailError')
    setErrors(next)
    if (Object.keys(next).length === 0) {
      try { localStorage.setItem(`signup-${t('brand')}`, JSON.stringify({ name: name.trim(), email: email.trim(), at: new Date().toISOString() })) } catch { /* ignore */ }
      setDone(true)
    }
  }
  if (done) {
    return (
      <div className="rounded-2xl border p-8 text-center" style={{ borderColor: 'var(--color-muted)', background: 'var(--color-surface)' }} role="status">
        <Check size={28} className="mx-auto mb-4" style={{ color: 'var(--color-accent)' }} />
        <p className="title-1">{t('form.success')}</p>
      </div>
    )
  }
  return (
    <form onSubmit={submit} noValidate className={compact ? 'mx-auto flex max-w-xl flex-col gap-4 sm:flex-row' : 'mx-auto flex max-w-xl flex-col gap-4'}>
      <div className="flex-1">
        <label htmlFor="signup-name" className="caption-4 mb-2 block">{t('form.name')}</label>
        <input id="signup-name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={t('form.namePlaceholder')} className="w-full rounded-xl border bg-transparent px-4 py-2" style={{ borderColor: 'var(--color-muted)' }} aria-invalid={!!errors.name} />
        {errors.name ? <p className="caption-2 mt-2 text-red-500" role="alert">{errors.name}</p> : null}
      </div>
      <div className="flex-1">
        <label htmlFor="signup-email" className="caption-4 mb-2 block">{t('form.email')}</label>
        <input id="signup-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('form.emailPlaceholder')} className="w-full rounded-xl border bg-transparent px-4 py-2" style={{ borderColor: 'var(--color-muted)' }} aria-invalid={!!errors.email} />
        {errors.email ? <p className="caption-2 mt-2 text-red-500" role="alert">{errors.email}</p> : null}
      </div>
      <button type="submit" className="btn-primary button-md self-end whitespace-nowrap">{t('form.submit')}</button>
    </form>
  )
}

export function LegalModal({ kind, onClose }: { kind: 'privacy' | 'terms' | null; onClose: () => void }) {
  const { t } = useLang()
  if (!kind) return null
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={t(`footer.${kind}`)}>
      <button type="button" aria-label={t('common.close')} onClick={onClose} className="absolute inset-0 bg-black/60" />
      <div className="relative max-h-[80vh] w-full max-w-xl overflow-auto rounded-2xl p-8" style={{ background: 'var(--color-paper)' }}>
        <div className="flex items-center justify-between gap-4">
          <h2 className="heading-5">{t(`footer.${kind}`)}</h2>
          <button type="button" onClick={onClose} aria-label={t('common.close')} className="btn-ghost p-2"><X size={18} /></button>
        </div>
        <p className="body-3 mt-4 opacity-80">{t(`footer.${kind}Text`)}</p>
        <button type="button" onClick={onClose} className="btn-primary button-sm mt-8">{t('common.close')}</button>
      </div>
    </div>
  )
}

export function CookieBanner() {
  const { t } = useLang()
  const [show, setShow] = useState(false)
  useEffect(() => {
    try { if (!localStorage.getItem('cookie-consent')) setShow(true) } catch { setShow(true) }
  }, [])
  if (!show) return null
  const accept = () => { try { localStorage.setItem('cookie-consent', 'accepted') } catch { /* ignore */ } setShow(false) }
  return (
    <div className="fixed inset-x-4 bottom-4 z-[60] mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl border p-4 shadow-lg sm:flex-row sm:items-center" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-muted)' }} role="region" aria-label={t('common.cookieTitle')}>
      <p className="body-6 flex-1">{t('common.cookie')}</p>
      <button type="button" onClick={accept} className="btn-primary button-sm shrink-0">{t('common.cookieAccept')}</button>
    </div>
  )
}

export function Footer() {
  const { t, ta } = useLang()
  const [legal, setLegal] = useState<'privacy' | 'terms' | null>(null)
  const items = ta<{ label: string; href: string }>('nav.items')
  const { lang } = useLang()
  return (
    <footer className="border-t px-4 py-12 sm:px-8" style={{ borderColor: 'var(--color-muted)' }}>
      <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xs">
          <p className="title-1 font-semibold">{t('brand')}</p>
          <p className="body-6 mt-4 opacity-70">{t('footer.tagline')}</p>
        </div>
        <nav aria-label="footer">
          <ul className="flex flex-col gap-4">
            {items.map((it) => (
              <li key={it.href}><a href={it.href} className="body-5 opacity-80 hover:opacity-100">{it.label}</a></li>
            ))}
          </ul>
        </nav>
        <div className="flex flex-col gap-4">
          <button type="button" onClick={() => setLegal('privacy')} className="body-5 text-start opacity-80 hover:opacity-100">{t('footer.privacy')}</button>
          <button type="button" onClick={() => setLegal('terms')} className="body-5 text-start opacity-80 hover:opacity-100">{t('footer.terms')}</button>
          <a href="#top" className="body-5 opacity-80 hover:opacity-100">{t('footer.back')}</a>
        </div>
      </div>
      <p className="caption-2 mx-auto mt-12 max-w-6xl opacity-60">{t('footer.rights')}</p>
      <LegalModal kind={legal} onClose={() => setLegal(null)} />
    </footer>
  )
}

export function NotFound() {
  const { t } = useLang()
  return (
    <main id="main" className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-4 text-center">
      <p className="heading-1">404</p>
      <h1 className="heading-3 mt-8">{t('common.notFoundTitle')}</h1>
      <p className="body-3 mt-4 opacity-80">{t('common.notFoundText')}</p>
      <a href="#top" className="btn-primary button-md mt-8">
        {t('common.notFoundBack')}
      </a>
    </main>
  )
}

export function Arrow() {
  const { lang } = useLang()
  return lang === 'ar' ? <ArrowLeft size={18} /> : <ArrowRight size={18} />
}
