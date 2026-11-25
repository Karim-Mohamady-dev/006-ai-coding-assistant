import { useEffect, useState } from 'react'
import { Check } from '@phosphor-icons/react'
import { useLang } from './i18n.tsx'
import { Nav, Footer, Faq, SignupForm, SectionHead, Reveal, TaglineReveal, CookieBanner, NotFound, Arrow, ICONS } from './components/ui.tsx'
import { HeroDemo, Examples } from './components/Demo.tsx'

export default function App() {
  const { t, ta, has } = useLang()
  const [notFound, setNotFound] = useState(() => window.location.hash === '#/not-found')
  useEffect(() => {
    const onHash = () => setNotFound(window.location.hash === '#/not-found')
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  if (notFound) return (<><Nav /><NotFound /><Footer /><CookieBanner /></>)

  const benefits = ta<{ icon: string; title: string; text: string }>('benefits.items')
  const steps = ta<{ title: string; text: string }>('how.steps')
  const proof = ta<{ quote: string; name: string; role: string }>('proof.items')
  const tiers = has('pricing.title') ? ta<{ name: string; price: string; per: string; features: string[]; cta: string }>('pricing.tiers') : []

  return (
    <div id="top" className="min-h-screen">
      <Nav />
      <main id="main">
        <section aria-labelledby="hero-title" className="mx-auto max-w-6xl px-4 pb-16 pt-32 sm:px-8 sm:pt-40">
          <div className="mx-auto max-w-[680px] text-center">
            <p className="caption-4 mb-4 inline-block rounded-full border px-4 py-2" style={{ borderColor: 'var(--color-muted)' }}>{t('hero.eyebrow')}</p>
            <h1 id="hero-title" className="heading-1">
              {t('hero.titleA')}{' '}
              <span className="hero-gradient-text">{t('hero.titleB')}</span>
            </h1>
            <p className="body-2 mx-auto mt-8 max-w-[680px] opacity-80">{t('hero.sub')}</p>
            <div className="mt-8 flex flex-col items-center gap-4">
              <a href="#signup" className="btn-primary button-md">{t('hero.cta')}<Arrow /></a>
              <p className="caption-2 opacity-70">{t('hero.proof')}</p>
            </div>
          </div>
          <Reveal className="mx-auto mt-16 max-w-4xl">
            <HeroDemo />
          </Reveal>
        </section>

        <TaglineReveal text={t('tagline')} />

        <section id="features" aria-labelledby="features-title" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-8">
          <SectionHead eyebrow={t('benefits.eyebrow')} title={t('benefits.title')} sub={t('benefits.sub')} />
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b, i) => {
              const Icon = ICONS[b.icon] || ICONS.sparkle
              return (
                <Reveal key={i}>
                  <article className="h-full rounded-2xl border p-8" style={{ borderColor: 'var(--color-muted)', background: 'var(--color-surface)' }}>
                    <span className="mb-4 inline-flex rounded-xl p-2 text-white" style={{ background: 'var(--color-accent)' }}><Icon size={22} /></span>
                    <h3 className="title-1">{b.title}</h3>
                    <p className="body-6 mt-4 opacity-80">{b.text}</p>
                  </article>
                </Reveal>
              )
            })}
          </div>
        </section>

        <section id="how" aria-labelledby="how-title" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-8">
          <SectionHead eyebrow={t('how.eyebrow')} title={t('how.title')} sub={t('how.sub')} />
          <ol className="mx-auto mt-12 grid max-w-4xl gap-8 md:grid-cols-3">
            {steps.map((s, i) => (
              <Reveal key={i}>
                <li className="rounded-2xl border p-8 text-center" style={{ borderColor: 'var(--color-muted)' }}>
                  <span className="heading-3 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full text-white" style={{ background: 'var(--color-accent)' }}>{i + 1}</span>
                  <h3 className="title-1">{s.title}</h3>
                  <p className="body-6 mt-4 opacity-80">{s.text}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </section>

        <Examples />

        <section id="proof" aria-labelledby="proof-title" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-8">
          <SectionHead eyebrow={t('proof.eyebrow')} title={t('proof.title')} sub={t('proof.sub')} />
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {proof.map((p, i) => (
              <Reveal key={i}>
                <figure className="flex h-full flex-col rounded-2xl border p-8" style={{ borderColor: 'var(--color-muted)', background: 'var(--color-surface)' }}>
                  <blockquote className="body-3 flex-1">“{p.quote}”</blockquote>
                  <figcaption className="mt-8">
                    <p className="title-3">{p.name}</p>
                    <p className="caption-2 mt-2 opacity-70">{p.role}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </section>

        {has('pricing.title') ? (
          <section id="pricing" aria-labelledby="pricing-title" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-8">
            <SectionHead eyebrow={t('pricing.eyebrow')} title={t('pricing.title')} sub={t('pricing.sub')} />
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {tiers.map((tier, i) => (
                <Reveal key={i}>
                  <article className="flex h-full flex-col rounded-2xl border p-8" style={{ borderColor: 'var(--color-muted)', background: i === 1 ? 'var(--color-surface)' : 'transparent' }}>
                    <h3 className="title-1">{tier.name}</h3>
                    <p className="heading-3 mt-4">{tier.price}</p>
                    <p className="caption-2 mt-2 opacity-70">{tier.per}</p>
                    <ul className="mt-8 flex flex-1 flex-col gap-4">
                      {tier.features.map((f, j) => (
                        <li key={j} className="body-6 flex items-start gap-2"><Check size={16} className="mt-1 shrink-0" style={{ color: 'var(--color-accent)' }} />{f}</li>
                      ))}
                    </ul>
                    <a href="#signup" className="btn-primary button-md mt-8 w-full">{tier.cta}</a>
                  </article>
                </Reveal>
              ))}
            </div>
            <p className="caption-2 mt-8 text-center opacity-60">{t('pricing.note')}</p>
          </section>
        ) : null}

        <Faq />

        <section id="signup" aria-labelledby="signup-title" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-8">
          <div className="rounded-2xl border p-8 text-center sm:p-16" style={{ borderColor: 'var(--color-muted)', background: 'var(--color-surface)' }}>
            <Reveal>
              <h2 id="signup-title" className="heading-3 mx-auto max-w-[680px]">{t('final.title')}</h2>
              <p className="body-3 mx-auto mt-4 max-w-[680px] opacity-80">{t('final.sub')}</p>
              <div className="mt-8"><SignupForm /></div>
              <p className="caption-2 mt-8 opacity-60">{t('final.note')}</p>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
      <CookieBanner />
    </div>
  )
}
