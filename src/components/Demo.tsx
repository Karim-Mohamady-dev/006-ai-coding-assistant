import { useEffect, useRef, useState } from 'react'
import { Play, Copy, Check, Code, Bug, BookOpen, Terminal } from '@phosphor-icons/react'
import { useLang } from '../i18n.tsx'
import { Reveal, SectionHead } from './ui.tsx'

type Mode = 'generate' | 'debug' | 'explain'

export function HeroDemo() {
  const { t, ta } = useLang()
  const modes = ta<{ id: Mode; label: string; code: string; output: string }>('demo.modes')
  const [active, setActive] = useState<Mode>('generate')
  const [running, setRunning] = useState(false)
  const [typed, setTyped] = useState('')
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | null>(null)
  useEffect(() => () => { if (timer.current) window.clearInterval(timer.current) }, [])
  const current = modes.find((m) => m.id === active) ?? modes[0]
  if (!current) return null
  const run = () => {
    if (timer.current) window.clearInterval(timer.current)
    setRunning(true); setTyped('')
    let i = 0
    timer.current = window.setInterval(() => {
      i += 3
      setTyped(current.output.slice(0, i))
      if (i >= current.output.length) { if (timer.current) window.clearInterval(timer.current); setRunning(false) }
    }, 24)
  }
  const copy = async () => {
    try { await navigator.clipboard.writeText(current.code); setCopied(true); window.setTimeout(() => setCopied(false), 2000) } catch { /* clipboard unavailable */ }
  }
  const icons: Record<Mode, typeof Code> = { generate: Code, debug: Bug, explain: BookOpen }
  return (
    <div className="overflow-hidden rounded-2xl border text-start" style={{ borderColor: 'var(--color-muted)', background: '#181818' }}>
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 p-4" role="tablist" aria-label={t('demo.modeLabel')}>
        {modes.map((m) => {
          const Icon = icons[m.id]
          return (
            <button key={m.id} type="button" role="tab" aria-selected={active === m.id} onClick={() => { setActive(m.id); setTyped('') }} className="button-sm flex items-center gap-2 rounded-full border px-4 py-2 text-white" style={{ borderColor: 'rgba(255,255,255,0.2)', background: active === m.id ? 'var(--color-accent)' : 'transparent' }}>
              <Icon size={16} />{m.label}
            </button>
          )
        })}
        <span className="ms-auto flex gap-2">
          <button type="button" onClick={copy} className="button-sm flex items-center gap-2 rounded-full border px-4 py-2 text-white" style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
            {copied ? <Check size={16} /> : <Copy size={16} />}{copied ? t('demo.copied') : t('demo.copy')}
          </button>
          <button type="button" onClick={run} disabled={running} className="btn-primary button-sm">
            <Play size={16} />{running ? t('demo.running') : t('demo.run')}
          </button>
        </span>
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-6 text-white/90" dir="ltr" style={{ fontFamily: 'var(--font-mono)' }}><code>{current.code}</code></pre>
      <div className="border-t border-white/10 p-4" style={{ background: '#1F1F1F' }}>
        <p className="caption-4 mb-2 flex items-center gap-2 text-white/60"><Terminal size={14} />{t('demo.outputLabel')}</p>
        {typed ? (
          <p className="whitespace-pre-wrap text-sm leading-6 text-white/90" dir="ltr" style={{ fontFamily: 'var(--font-mono)' }}>{typed}<span className="anim-caret">▍</span></p>
        ) : (
          <p className="body-6 text-white/50">{t('demo.outputEmpty')}</p>
        )}
      </div>
    </div>
  )
}

export function Examples() {
  const { t, ta } = useLang()
  const tools = ta<{ name: string; desc: string }>('examples.tools')
  const langs = ta<string>('examples.langs')
  return (
    <section id="examples" aria-labelledby="examples-title" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-8">
      <SectionHead eyebrow={t('examples.eyebrow')} title={t('examples.title')} sub={t('examples.sub')} />
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool, i) => (
          <Reveal key={i}>
            <article className="h-full rounded-2xl border p-8" style={{ borderColor: 'var(--color-muted)', background: 'var(--color-surface)' }}>
              <Code size={22} className="mb-4" style={{ color: 'var(--color-accent)' }} />
              <h3 className="title-1">{tool.name}</h3>
              <p className="body-6 mt-4 opacity-80">{tool.desc}</p>
            </article>
          </Reveal>
        ))}
      </div>
      <h3 className="heading-5 mt-16 text-center">{t('examples.langTitle')}</h3>
      <ul className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-2">
        {langs.map((l) => (
          <li key={l} className="button-sm rounded-full border px-4 py-2" style={{ borderColor: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>{l}</li>
        ))}
      </ul>
    </section>
  )
}
