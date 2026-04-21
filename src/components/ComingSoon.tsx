'use client'

import Link from 'next/link'
import { useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import words from '@/constants/index'
import '@/components/ui/Hero/Words-Sliding-Smooth.css'

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

  const hoverAudioRef = useRef<HTMLAudioElement | null>(null)
  const playHoverSound = () => {
    const src = '/tekkkk.mp3'
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
      const data = await res.json().catch(() => null)

      if (!res.ok) {
        setError(data?.error || 'Etwas ist schiefgelaufen. Bitte erneut versuchen.')
      } else if (data?.alreadyRegistered) {
        setError('Diese E-Mail ist bereits auf der Liste.')
      } else {
        setSubmitted(true)
        setFirstName('')
        setLastName('')
        setEmail('')
      }
    } catch {
      setError('Etwas ist schiefgelaufen. Bitte erneut versuchen.')
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
    <>
      <style>{`
        .cs-root {
          font-family: "Inconsolata", monospace;
          color: #ffffff;
          background: #050d1a;
          width: 100%;
          position: relative;
          overflow: hidden;
        }
        .cs-root * { box-sizing: border-box; }

        .cs-stars { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
        .cs-star {
          position: absolute;
          color: rgba(255,255,255,0.55);
          font-family: "Inconsolata", monospace;
          font-weight: 400;
          line-height: 1;
          letter-spacing: 0;
          user-select: none;
          text-shadow: 0 0 3px rgba(255,255,255,0.15);
          animation-name: cs-twinkle;
          animation-iteration-count: infinite;
          animation-direction: alternate;
          animation-timing-function: ease-in-out;
        }
        .cs-star.cs-star-green {
          color: rgba(74,222,128,0.5);
          text-shadow: 0 0 4px rgba(74,222,128,0.2);
        }
        @keyframes cs-twinkle {
          0%   { opacity: 0.08; }
          100% { opacity: 0.5; }
        }

        .cs-orb {
          position: absolute;
          width: 600px; height: 600px;
          left: 50%; top: 50%;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, rgba(74,222,128,0.08) 0%, rgba(74,222,128,0.03) 35%, transparent 70%);
          animation: cs-float 20s ease-in-out infinite;
          pointer-events: none;
          z-index: 0;
          filter: blur(8px);
        }
        .cs-orb-2 {
          position: absolute;
          width: 500px; height: 500px;
          right: -120px; top: -120px;
          background: radial-gradient(circle, rgba(34,211,238,0.05) 0%, transparent 70%);
          animation: cs-float 26s ease-in-out infinite reverse;
          pointer-events: none;
          z-index: 0;
          filter: blur(10px);
        }
        @keyframes cs-float {
          0%, 100% { transform: translate(-50%, calc(-50% - 30px)); }
          50%      { transform: translate(-50%, calc(-50% + 30px)); }
        }

        .cs-input::placeholder { color: rgba(255,255,255,0.4); }
        .cs-input:focus {
          outline: none;
          border-color: #4ade80;
          box-shadow: 0 0 0 2px rgba(74,222,128,0.4), 0 0 24px rgba(74,222,128,0.15);
        }
        .cs-input:-webkit-autofill {
          -webkit-text-fill-color: #ffffff;
          -webkit-box-shadow: 0 0 0 1000px #050d1a inset, 0 0 0 2px rgba(74,222,128,0.25);
          caret-color: #ffffff;
        }

        .cs-fade { opacity: 0; transform: translateY(12px); animation: cs-in 800ms ease-out forwards; }
        .cs-d1 { animation-delay: 80ms; }
        .cs-d2 { animation-delay: 180ms; }
        .cs-d3 { animation-delay: 280ms; }
        .cs-d4 { animation-delay: 380ms; }
        .cs-d5 { animation-delay: 480ms; }
        .cs-d6 { animation-delay: 580ms; }
        .cs-d7 { animation-delay: 680ms; }
        @keyframes cs-in { to { opacity: 1; transform: translateY(0); } }

        .cs-logo {
          position: relative;
          display: inline-flex;
          align-items: center;
          line-height: 1;
          isolation: isolate;
        }
        .cs-logo::before {
          content: "";
          position: absolute;
          inset: -20% -100%;
          z-index: -1;
          background:
            radial-gradient(ellipse at center,
              rgba(74,222,128,0.22) 0%,
              rgba(74,222,128,0.10) 35%,
              transparent 70%);
          filter: blur(10px);
          animation: cs-logo-pulse 4.8s ease-in-out infinite;
          pointer-events: none;
        }
        .cs-logo-img {
          height: 36px;
          width: auto;
          display: block;
          position: relative;
          z-index: 1;
          filter:
            brightness(1.08)
            drop-shadow(0 0 4px rgba(74,222,128,0.35))
            drop-shadow(0 0 10px rgba(74,222,128,0.18));
        }
        @keyframes cs-logo-pulse {
          0%, 100% { opacity: 0.75; transform: scale(1); }
          50%      { opacity: 0.95; transform: scale(1.02); }
        }
        @media (max-width: 767px) {
          .cs-logo-img { height: 30px; }
          .cs-logo::before { filter: blur(8px); }
        }

        .cs-nav-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 8px 16px;
          background: transparent;
          color: #ffffff;
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 6px;
          font-family: "Inconsolata", monospace;
          font-size: 13px;
          letter-spacing: 0.05em;
          line-height: 1;
          cursor: pointer;
          text-decoration: none;
          transition: background-color 180ms ease, border-color 180ms ease;
        }
        .cs-nav-btn:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.4);
        }

        .cs-eyebrow {
          font-family: "Inconsolata", monospace;
          font-size: 12px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #4ade80;
          text-shadow: 0 0 20px rgba(74,222,128,0.5);
        }
        .cs-headline {
          font-family: "Inconsolata", monospace;
          font-weight: 700;
          font-size: clamp(36px, 6vw, 72px);
          line-height: 1.02;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #ffffff;
          text-shadow: 0 0 40px rgba(255,255,255,0.3);
          margin: 0;
        }
        .cs-headline-accent { color: #4ade80; text-shadow: 0 0 40px rgba(74,222,128,0.5); }

        /* Rotating tagline — same slider as landing hero, restyled for space theme */
        .cs-rotator {
          --word-h: clamp(42px, 6.4vw, 78px);
          height: var(--word-h);
          width: 100%;
          max-width: 880px;
          overflow: hidden;
          display: flex;
          justify-content: flex-start;
          align-items: flex-start;
          margin: 2px 0 0;
          padding: 0;
        }
        .cs-rotator .words-wrapper {
          display: flex;
          flex-direction: column;
          animation: wordSlider 24s infinite ease-in-out;
          height: auto;
          width: 100%;
        }
        .cs-rotator .word-item {
          font-family: "Inconsolata", monospace;
          font-weight: 700;
          font-size: clamp(34px, 5.6vw, 68px);
          line-height: 1;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: #4ade80;
          text-shadow: 0 0 40px rgba(74,222,128,0.45), 0 0 80px rgba(74,222,128,0.18);
          height: var(--word-h);
          min-height: var(--word-h);
          padding: 0;
          justify-content: flex-start;
          text-align: left;
          white-space: nowrap;
          width: 100%;
        }
        @media (max-width: 767px) {
          .cs-rotator {
            --word-h: clamp(36px, 10vw, 52px);
          }
          .cs-rotator .word-item {
            font-size: clamp(26px, 8vw, 42px);
          }
        }
        .cs-sub {
          font-family: "Inconsolata", monospace;
          font-size: 15px;
          line-height: 1.5;
          color: rgba(255,255,255,0.65);
          max-width: 640px;
          margin: 0;
        }

        .cs-input {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 8px;
          color: #ffffff;
          font-family: "Inconsolata", monospace;
          font-size: 15px;
          padding: 12px 16px;
          width: 100%;
          transition: border-color 160ms ease, box-shadow 160ms ease;
        }

        .cs-submit-btn2 { align-self: center; font-family: "Inconsolata", monospace; }
        .cs-submit-btn2 .wrapper > span:first-child { letter-spacing: 0.04em; }

        .cs-step {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          -webkit-backdrop-filter: blur(10px);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          padding: 18px 22px;
          min-height: 0;
        }
        .cs-step-num {
          font-family: "Inconsolata", monospace;
          font-weight: 700;
          font-size: 13px;
          color: #4ade80;
          letter-spacing: 0.15em;
          margin-bottom: 8px;
          text-shadow: 0 0 16px rgba(74,222,128,0.4);
        }
        .cs-step-title {
          font-family: "Inconsolata", monospace;
          font-weight: 700;
          font-size: 16px;
          letter-spacing: 0.06em;
          color: #ffffff;
          margin: 0 0 6px;
          line-height: 1.2;
        }
        .cs-step-body {
          font-family: "Inconsolata", monospace;
          font-size: 13px;
          color: rgba(255,255,255,0.6);
          margin: 0;
          line-height: 1.4;
        }

        .cs-badge {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 7px 14px;
          border: 1px solid rgba(74,222,128,0.4);
          border-radius: 999px;
          color: #ffffff;
          font-family: "Inconsolata", monospace;
          font-size: 12px;
          letter-spacing: 0.04em;
          background: rgba(74,222,128,0.04);
          -webkit-backdrop-filter: blur(10px);
          backdrop-filter: blur(10px);
        }
        .cs-badge-dot {
          width: 6px; height: 6px; border-radius: 999px;
          background: #4ade80;
          box-shadow: 0 0 8px rgba(74,222,128,0.8);
        }

        .cs-success {
          display: inline-flex; align-items: center; gap: 12px;
          padding: 14px 20px;
          background: rgba(74,222,128,0.08);
          border: 1px solid rgba(74,222,128,0.4);
          border-radius: 12px;
          -webkit-backdrop-filter: blur(10px);
          backdrop-filter: blur(10px);
          color: #ffffff;
          font-family: "Inconsolata", monospace;
          font-size: 15px;
        }
        .cs-success-mark {
          display: inline-flex; align-items: center; justify-content: center;
          width: 24px; height: 24px; border-radius: 999px;
          background: #4ade80; color: #050d1a;
          font-size: 13px; font-weight: 700;
          box-shadow: 0 0 16px rgba(74,222,128,0.6);
        }
        .cs-note { font-family: "Inconsolata", monospace; font-size: 12px; color: rgba(255,255,255,0.5); margin: 0; letter-spacing: 0.04em; }
        .cs-error { font-family: "Inconsolata", monospace; font-size: 12px; color: #fca5a5; margin: 0; letter-spacing: 0.04em; }

        .cs-footer a { color: rgba(255,255,255,0.55); text-decoration: none; transition: color 160ms ease; }
        .cs-footer a:hover { color: #ffffff; }
        .cs-footer span.sep { margin: 0 8px; opacity: 0.4; }

        /* Desktop: single viewport, no scroll */
        @media (min-width: 768px) {
          .cs-page {
            position: relative; z-index: 1;
            height: 100dvh;
            overflow: hidden;
            display: grid;
            grid-template-rows: 64px minmax(0, 1fr) 48px;
            padding: 0 48px;
          }
          .cs-nav {
            display: flex; align-items: center; justify-content: space-between;
          }
          .cs-main {
            display: flex; flex-direction: column;
            justify-content: center;
            gap: 22px;
            padding: 12px 0;
            min-height: 0;
          }
          .cs-hero { display: flex; flex-direction: column; gap: 14px; max-width: 860px; }
          .cs-form-row {
            display: grid;
            grid-template-columns: minmax(140px, 180px) minmax(140px, 180px) minmax(200px, 1fr) auto;
            gap: 10px;
            max-width: 840px;
            align-items: stretch;
          }
          .cs-steps {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 14px;
            max-width: 980px;
          }
          .cs-badges {
            display: flex; flex-wrap: wrap; gap: 10px;
          }
          .cs-footer {
            display: flex; align-items: center; justify-content: center;
            font-size: 11px; color: rgba(255,255,255,0.45);
            letter-spacing: 0.04em;
          }
        }

        /* Mobile: stack vertically, scroll allowed */
        @media (max-width: 767px) {
          .cs-page {
            position: relative; z-index: 1;
            min-height: 100dvh;
            padding: 16px 20px 28px;
            display: flex;
            flex-direction: column;
            gap: 24px;
          }
          .cs-nav {
            display: flex; align-items: center; justify-content: space-between;
            flex-wrap: wrap; gap: 10px;
          }
          .cs-main { display: flex; flex-direction: column; gap: 22px; }
          .cs-hero { display: flex; flex-direction: column; gap: 14px; }
          .cs-form-row { display: flex; flex-direction: column; gap: 10px; }
          .cs-steps { display: grid; grid-template-columns: 1fr; gap: 12px; }
          .cs-badges { display: flex; flex-wrap: wrap; gap: 8px; }
          .cs-footer {
            font-size: 11px; color: rgba(255,255,255,0.5);
            text-align: center;
            letter-spacing: 0.04em;
            padding-top: 8px;
          }
          .cs-sub { font-size: 14px; }
        }
      `}</style>

      <div className="cs-root">
        <div className="cs-stars" aria-hidden>
          {stars.map((s, i) => (
            <span
              key={i}
              className={`cs-star${i % 11 === 0 ? ' cs-star-green' : ''}`}
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
    </>
  )
}
