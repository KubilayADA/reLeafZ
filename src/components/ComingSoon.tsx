'use client'

import Link from 'next/link'
import { useMemo, useRef, useState } from 'react'
import type { ISourceOptions } from '@tsparticles/engine'
import { Button } from '@/components/ui/button'
import words from '@/constants/index'
import SectionParticlesBackground from '@/components/ui/SectionParticlesBackground'
import '@/components/ui/Hero/Words-Sliding-Smooth.css'
import './ComingSoon.css'

const comingSoonParticlesOptions: ISourceOptions = {
  fullScreen: { enable: false },
  background: { color: { value: 'transparent' } },
  fpsLimit: 60,
  detectRetina: true,
  particles: {
    number: { value: 190, density: { enable: false } },
    color: { value: ['#a7c79a', '#72906f', '#cfe8c4', '#ffffff'] },
    shape: { type: 'circle' },
    opacity: {
      value: { min: 0.2, max: 0.65 },
      animation: { enable: true, speed: 0.6, sync: false },
    },
    size: {
      value: { min: 0.3, max: 3.2 },
      animation: { enable: true, speed: 2, sync: false, startValue: 'random' },
    },
    links: { enable: false },
    move: {
      enable: true,
      random: true,
      speed: 0.9,
      direction: 'top',
      straight: false,
      outModes: { default: 'out' },
    },
  },
  interactivity: {
    detectsOn: 'window',
    events: {
      onHover: { enable: true, mode: 'bubble' },
      onClick: { enable: true, mode: 'repulse' },
    },
    modes: {
      bubble: { distance: 220, duration: 2, size: 5, opacity: 0.9 },
      repulse: { distance: 360, duration: 1.2 },
    },
  },
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const steps = [
  { num: '01', title: 'FRAGEBOGEN', body: 'Medizinischer Fragebogen in 2 Minuten ausgefüllt.' },
  { num: '02', title: 'ARZT PRÜFT', body: 'Approbierter Deutscher Arzt prüft innerhalb 24h.' },
  { num: '03', title: 'LIEFERUNG', body: 'Berliner Partnerapotheke liefert in 30–90 Min.' },
]

const badges = [
  'DSGVO-konform',
  'Deutsche Ärzte',
  'CanG 2024 legal',
  'Berliner Apotheken',
]

type Star = {
  left: number
  top: number
  size: number
  duration: number
  delay: number
  rotate: number
}

function buildStars(count: number): Star[] {
  const stars: Star[] = []
  for (let i = 0; i < count; i++) {
    const left = ((i * 7919) % 10000) / 100
    const top = ((i * 6151 + 17) % 10000) / 100
    const sizes = [9, 10, 11, 13, 16]
    const size = sizes[i % sizes.length]
    const duration = 2 + (i % 6)
    const delay = ((i * 131) % 100) / 25
    const rotate = ((i * 53) % 40) - 20
    stars.push({ left, top, size, duration, delay, rotate })
  }
  return stars
}

export default function ComingSoon() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const stars = useMemo(() => buildStars(200), [])
  const starsLayerRef = useRef<HTMLDivElement | null>(null)

  const handleStarBurst = (e: React.MouseEvent<HTMLDivElement>) => {
    const layer = starsLayerRef.current
    if (!layer) return
    const rect = layer.getBoundingClientRect()
    const cx = e.clientX - rect.left
    const cy = e.clientY - rect.top
    const radius = 260
    const maxPush = 120

    const nodes = layer.querySelectorAll<HTMLSpanElement>('.cs-star')
    nodes.forEach((node) => {
      const nx = node.offsetLeft + node.offsetWidth / 2
      const ny = node.offsetTop + node.offsetHeight / 2
      const dx = nx - cx
      const dy = ny - cy
      const dist = Math.hypot(dx, dy) || 1
      if (dist > radius) return

      const falloff = 1 - dist / radius
      const pushX = (dx / dist) * maxPush * falloff
      const pushY = (dy / dist) * maxPush * falloff

      node.style.transition = 'translate 520ms cubic-bezier(0.2, 0.8, 0.2, 1)'
      node.style.translate = `${pushX}px ${pushY}px`

      window.setTimeout(() => {
        node.style.transition = 'translate 900ms cubic-bezier(0.2, 0.8, 0.2, 1)'
        node.style.translate = '0px 0px'
      }, 520)
    })
  }

  const hoverAudioRef = useRef<HTMLAudioElement | null>(null)
  const playHoverSound = () => {
    const src = '/auto.mp3'
    if (!hoverAudioRef.current) {
      hoverAudioRef.current = new Audio(src)
      hoverAudioRef.current.preload = 'auto'
      hoverAudioRef.current.volume = 0.6
    }
    const expected = new URL(src, window.location.origin).href
    if (hoverAudioRef.current.src !== expected) {
      hoverAudioRef.current.src = src
      hoverAudioRef.current.load()
    }
    hoverAudioRef.current.currentTime = 0
    void hoverAudioRef.current.play().catch(() => {})
  }
  const stopHoverSound = () => {
    if (!hoverAudioRef.current) return
    hoverAudioRef.current.pause()
    hoverAudioRef.current.currentTime = 0
  }

  const handleSubmit = async () => {
    setError('')
    const fn = firstName.trim()
    const ln = lastName.trim()
    const em = email.trim()

    if (!fn || !ln) {
      setError('Bitte Vor- und Nachnamen eingeben.')
      return
    }
    if (!EMAIL_RE.test(em)) {
      setError('Bitte gültige E-Mail-Adresse eingeben.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName: fn, lastName: ln, email: em }),
      })

      let data:
        | {
            success?: boolean
            message?: string
            error?: string
            alreadyRegistered?: boolean
            reason?: string
          }
        | null = null
      try {
        data = await res.json()
      } catch {
        data = null
      }

      const backendMsg = data?.message || data?.error
      const isDuplicate =
        data?.alreadyRegistered === true ||
        (typeof backendMsg === 'string' && /already|bereits|duplicate/i.test(backendMsg))

      if (!res.ok) {
        console.error('[waitlist] request failed', { status: res.status, data })
        let msg: string
        if (res.status === 429) {
          msg = backendMsg
            ? 'Zu viele Anfragen. Bitte in ca. 15 Minuten erneut versuchen.'
            : 'Zu viele Anfragen. Bitte kurz warten und erneut versuchen.'
        } else if (res.status === 502) {
          msg = 'Server nicht erreichbar. Bitte in einer Minute erneut versuchen.'
        } else if (isDuplicate) {
          msg = 'Diese E-Mail ist bereits auf der Liste.'
        } else if (backendMsg) {
          msg = backendMsg
        } else {
          msg = `Etwas ist schiefgelaufen (Status ${res.status}). Bitte erneut versuchen.`
        }
        setError(msg)
      } else if (data?.success === false || isDuplicate) {
        setError(isDuplicate ? 'Diese E-Mail ist bereits auf der Liste.' : backendMsg || 'Etwas ist schiefgelaufen. Bitte erneut versuchen.')
      } else {
        setSubmitted(true)
        setFirstName('')
        setLastName('')
        setEmail('')
      }
    } catch (err) {
      console.error('[waitlist] network error', err)
      setError('Netzwerkfehler. Bitte Internetverbindung prüfen und erneut versuchen.')
    } finally {
      setLoading(false)
    }
  }

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="cs-root" onClick={handleStarBurst}>
        <div className="cs-bg" aria-hidden>
          <SectionParticlesBackground
            className="cs-particles"
            options={comingSoonParticlesOptions}
          />
        </div>
        <div className="cs-stars" aria-hidden ref={starsLayerRef}>
          {stars.map((s, i) => (
            <span
              key={i}
              className={`cs-star${i % 4 === 0 ? ' cs-star-green' : i % 9 === 0 ? ' cs-star-green-soft' : ''}`}
              style={{
                left: `${s.left}%`,
                top: `${s.top}%`,
                fontSize: `${s.size}px`,
                transform: `rotate(${s.rotate}deg)`,
                animationDuration: `${s.duration}s`,
                animationDelay: `${s.delay}s`,
              }}
            >
              z
            </span>
          ))}
        </div>
        <div className="cs-orb" aria-hidden />
        <div className="cs-orb-2" aria-hidden />

        <div className="cs-page">
          <nav className="cs-nav cs-fade">
            <div className="cs-logo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo1.png" alt="releafZ" className="cs-logo-img" />
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Link href="/pharmacies" className="cs-nav-btn">
                FÜR APOTHEKEN <span aria-hidden>→</span>
              </Link>
              <Link href="/partners" className="cs-nav-btn">
                FÜR ÄRZTE <span aria-hidden>→</span>
              </Link>
            </div>
          </nav>

          <main className="cs-main">
            <section className="cs-hero">
              <div className="cs-eyebrow cs-fade cs-d1">
                MEDIZINAL CANNABIS · BERLIN · 2025
              </div>
              <h1 className="cs-headline cs-fade cs-d2">
                MEDIZINAL CANNABIS
              </h1>
              <div
                className="cs-rotator animated-words-container cs-fade cs-d2"
                aria-live="polite"
              >
                <div className="words-wrapper">
                  {words.map((word, i) => (
                    <div key={i} className="word-item cs-word">
                      {word}
                    </div>
                  ))}
                </div>
              </div>
              <p className="cs-sub cs-fade cs-d3">
                Ihr Rezept, Ihre Apotheke, in 60 Minuten. Verschrieben von approbierten
                Deutschen Ärzten. Geliefert von Berliner Partnerapotheken.
              </p>
            </section>

            {submitted ? (
              <div className="cs-fade cs-d4">
                <div className="cs-success" role="status" aria-live="polite">
                  <span className="cs-success-mark" aria-hidden>✓</span>
                  Sie sind auf der Liste.
                </div>
              </div>
            ) : (
              <>
                <div className="cs-form-row cs-fade cs-d4">
                  <input
                    type="text"
                    className="cs-input"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    onKeyDown={onKey}
                    placeholder="Vorname"
                    aria-label="Vorname"
                    autoComplete="given-name"
                    maxLength={80}
                  />
                  <input
                    type="text"
                    className="cs-input"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    onKeyDown={onKey}
                    placeholder="Nachname"
                    aria-label="Nachname"
                    autoComplete="family-name"
                    maxLength={80}
                  />
                  <input
                    type="email"
                    className="cs-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={onKey}
                    placeholder="E-Mail-Adresse"
                    aria-label="E-Mail-Adresse"
                    autoComplete="email"
                    maxLength={200}
                  />
                  <Button
                    type="button"
                    variant="button2"
                    className="cs-submit-btn2"
                    style={{ "--c-color": "#000000", color: "#000000" } as React.CSSProperties}
                    onClick={handleSubmit}
                    onMouseEnter={playHoverSound}
                    onMouseLeave={stopHoverSound}
                    disabled={loading}
                  >
                    {loading ? 'SENDEN…' : 'JETZT ANMELDEN →'}
                  </Button>
                </div>
                <div className="cs-fade cs-d5">
                  {error ? (
                    <p className="cs-error" role="alert">{error}</p>
                  ) : (
                    <p className="cs-note">KEIN SPAM · WIR MELDEN UNS, WENN WIR STARTEN</p>
                  )}
                </div>
              </>
            )}

            <div className="cs-steps cs-fade cs-d6">
              {steps.map((s) => (
                <div key={s.num} className="cs-step">
                  <div className="cs-step-num">{s.num}</div>
                  <h3 className="cs-step-title">{s.title}</h3>
                  <p className="cs-step-body">{s.body}</p>
                </div>
              ))}
            </div>

            <div className="cs-badges cs-fade cs-d7">
              {badges.map((b) => (
                <span key={b} className="cs-badge">
                  <span className="cs-badge-dot" aria-hidden />
                  {b}
                </span>
              ))}
            </div>
          </main>

          <footer className="cs-footer">
            <div>
              © 2025 releafZ
              <span className="sep">·</span>
              SC CODE UG
              <span className="sep">·</span>
              <Link href="/impressum">Impressum</Link>
              <span className="sep">·</span>
              <Link href="/datenschutz">Datenschutz</Link>
            </div>
          </footer>
        </div>
      </div>
  )
}
