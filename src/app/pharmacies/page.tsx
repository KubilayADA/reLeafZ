'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { MessageCircle, Settings, Rocket, Mail, Phone, User, Calendar } from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Intersection-Observer fade-in hook                                 */
/* ------------------------------------------------------------------ */
function useFadeIn<T extends HTMLElement>(): React.RefObject<T | null> {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('partners-visible')
          io.unobserve(el)
        }
      },
      { threshold: 0.12 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return ref
}

function FadeIn({
  children,
  className = '',
  delay = 0,
  as: Tag = 'div',
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  as?: React.ElementType
}) {
  const ref = useFadeIn<HTMLDivElement>()
  return (
    <Tag
      ref={ref}
      className={`partners-fade ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  )
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function PharmaciesPage() {
  const [scrolled, setScrolled] = useState(false)
  const pricingRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const html = document.documentElement
    const body = document.body
    const prevH = html.style.background
    const prevB = body.style.background
    html.style.background = '#080b0f'
    body.style.background = '#080b0f'
    return () => {
      html.style.background = prevH
      body.style.background = prevB
    }
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToPricing = () => {
    pricingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  /* ---- shared style tokens (match partners exactly) ---- */
  const syne = '"Syne", sans-serif'
  const dm = '"DM Sans", sans-serif'
  const bg = '#080b0f'
  const cyan = '#22d3ee'
  const green = '#10b981'

  return (
    <div
      className="partners-page min-h-screen relative"
      style={{ background: bg, fontFamily: dm, color: '#fff' }}
    >
      {/* Noise texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[1]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
        }}
      />

      {/* 1. NAVBAR */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(8,11,15,0.8)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px) saturate(1.4)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px) saturate(1.4)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/pharmacies">
            <img src="/logo1.png" alt="releafZ" className="h-8 w-auto" style={{ filter: 'brightness(1.1)' }} />
          </Link>
          <div className="flex items-center gap-6 text-sm" style={{ fontFamily: dm }}>
            <button
              type="button"
              onClick={scrollToPricing}
              className="hidden sm:block text-white/60 hover:text-white transition-colors"
            >
              Preise
            </button>
            <a href="#wie-es-funktioniert" className="hidden sm:block text-white/60 hover:text-white transition-colors">
              Ablauf
            </a>
            <a href="#kontakt" className="hidden sm:block text-white/60 hover:text-white transition-colors">
              Kontakt
            </a>
            <Link href="/partners" className="hidden sm:block text-white/60 hover:text-white transition-colors">
              Für Ärzte & Partner
            </Link>
            <Link
              href="/"
              className="flex items-center gap-1.5 text-white/50 hover:text-white transition-colors"
            >
              <span>←</span>
              <span>Patienten-Seite</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. HERO */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 px-6 overflow-hidden">
        <div
          className="absolute pointer-events-none"
          style={{
            top: '-10%',
            right: '-15%',
            width: '70vw',
            height: '70vw',
            maxWidth: '900px',
            maxHeight: '900px',
            background: `radial-gradient(ellipse at center, rgba(34,211,238,0.08) 0%, rgba(16,185,129,0.04) 40%, transparent 70%)`,
          }}
        />
        <div className="max-w-5xl mx-auto relative z-10">
          <FadeIn>
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-wide mb-8"
              style={{
                fontFamily: dm,
                background: 'rgba(16,185,129,0.1)',
                border: '1px solid rgba(16,185,129,0.25)',
                color: green,
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: green }} />
              FÜR APOTHEKEN
            </span>
          </FadeIn>
          <FadeIn delay={80}>
            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-6"
              style={{ fontFamily: syne }}
            >
              Partner mit releafZ
            </h1>
          </FadeIn>
          <FadeIn delay={160}>
            <p
              className="text-base sm:text-lg md:text-xl leading-relaxed max-w-3xl mb-10"
              style={{ color: 'rgba(255,255,255,0.65)' }}
            >
              Erreiche Berlins junge, digitale Cannabis-Patienten — von der Online-Konsultation bis zur Lieferung. Ohne Marketingaufwand, ohne Setup-Kosten.
            </p>
          </FadeIn>
          <FadeIn delay={240}>
            <button
              type="button"
              onClick={scrollToPricing}
              className="inline-flex items-center px-7 py-3.5 rounded-lg text-sm font-semibold text-black transition-all hover:brightness-110 hover:shadow-lg"
              style={{
                fontFamily: dm,
                background: `linear-gradient(135deg, ${cyan}, ${green})`,
                boxShadow: `0 0 24px rgba(34,211,238,0.25)`,
              }}
            >
              Jetzt Partner werden
            </button>
          </FadeIn>
        </div>
      </section>

      {/* 3. SECTION 1 — Was ist releafZ? */}
      <section className="relative px-6 py-20 md:py-28">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 tracking-tight"
              style={{ fontFamily: syne }}
            >
              Was ist <span style={{ color: cyan }}>releafZ</span>?
            </h2>
          </FadeIn>
          <FadeIn delay={80}>
            <div
              className="partners-card rounded-xl p-6 md:p-8"
              style={{
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <p className="text-base md:text-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
                releafZ ist eine vollständig digitale Plattform für medizinisches Cannabis in Deutschland. Patienten durchlaufen die gesamte Patient Journey auf releafZ — von der Online-Konsultation mit einem lizenzierten Arzt über die digitale Rezeptausstellung bis hin zur Bestellung bei einer Partnerapotheke mit Botendienst-Lieferung.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 4. SECTION 2 — Warum releafZ? (3 cards) */}
      <section className="relative px-6 py-20 md:py-28">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-14 tracking-tight"
              style={{ fontFamily: syne }}
            >
              Warum <span style={{ color: cyan }}>releafZ</span>?
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                title: 'Patienten, die du nicht erreichst',
                desc: 'Wir fokussieren uns auf junge, digital-native Nutzer, die bisher illegale Quellen nutzten. Die meisten Apotheken haben keinen Marketingkanal zu dieser Zielgruppe — wir schon.',
              },
              {
                title: 'Technologie hält Kosten niedrig',
                desc: 'Unsere Plattform ist auf Performance-Marketing und Tech für diese Zielgruppe optimiert. Diese Effizienz ermöglicht uns unsere Preisgestaltung.',
              },
              {
                title: 'Echter Zusatzumsatz',
                desc: 'Die Patienten, die wir bringen, sind überwiegend solche, die deine Apotheke über traditionelle Kanäle nicht erreichen würde — also echter zusätzlicher Umsatz.',
              },
            ].map((card, i) => (
              <FadeIn key={card.title} delay={i * 100}>
                <div
                  className="partners-card rounded-xl p-6 h-full"
                  style={{
                    background: 'rgba(255,255,255,0.025)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderTop: `2px solid ${cyan}`,
                  }}
                >
                  <h3 className="text-base font-semibold mb-3" style={{ fontFamily: syne }}>{card.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{card.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 5. SECTION 3 — Wie es funktioniert (5 steps horizontal) */}
      <section id="wie-es-funktioniert" className="relative px-6 py-20 md:py-28 scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-14 tracking-tight"
              style={{ fontFamily: syne }}
            >
              Wie es <span style={{ color: cyan }}>funktioniert</span>
            </h2>
          </FadeIn>
          <FadeIn delay={80}>
            <div className="relative flex flex-col md:flex-row md:items-stretch gap-4 md:gap-0">
              {/* Connecting line (desktop) */}
              <div
                className="hidden md:block absolute top-10 left-0 right-0 h-0.5 z-0"
                style={{ background: 'linear-gradient(90deg, rgba(34,211,238,0.4), rgba(16,185,129,0.3))', left: '10%', right: '10%' }}
              />
              {[
                { n: 1, title: 'Patient registriert sich auf releafZ' },
                { n: 2, title: 'Online-Konsultation mit lizenziertem Arzt über unsere Plattform' },
                { n: 3, title: 'Rezept wird digital ausgestellt — alles innerhalb von releafZ' },
                { n: 4, title: 'Patient durchstöbert Partnerapotheken & Live-Bestand in seiner Nähe' },
                { n: 5, title: 'Apotheke übernimmt Abgabe & Botendienst-Lieferung' },
              ].map((step, i) => (
                <div key={step.n} className="relative z-10 flex-1 flex flex-col items-center text-center md:px-2">
                  <span
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold mb-4 shrink-0"
                    style={{ background: `${cyan}20`, color: cyan, fontFamily: dm, border: `2px solid ${cyan}` }}
                  >
                    {step.n}
                  </span>
                  <p className="text-sm font-medium leading-snug" style={{ color: 'rgba(255,255,255,0.85)' }}>{step.title}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 6. SECTION 4 — Vorteile für Apotheken */}
      <section className="relative px-6 py-20 md:py-28">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-10 tracking-tight"
              style={{ fontFamily: syne }}
            >
              Vorteile für <span style={{ color: cyan }}>Apotheken</span>
            </h2>
          </FadeIn>
          <FadeIn delay={80}>
            <div
              className="partners-card rounded-xl p-6 md:p-8"
              style={{
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <ul className="space-y-4">
                {[
                  'Zusätzliche Bestellungen von jungem, digitalem Publikum',
                  'Keine Marketingkosten — wir bringen Patienten zu dir',
                  'Fokus auf lokale Berliner Nachfrage, nationale Expansion geplant',
                  'Botendienst-Lieferung in jedem Tier integriert',
                  'Optionale Cannaleo / WaWi API-Synchronisation',
                  'Keine Einrichtungsgebühren — sofort starten, jederzeit kündigen',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm md:text-base" style={{ color: 'rgba(255,255,255,0.75)' }}>
                    <span style={{ color: green }} className="text-lg shrink-0">✦</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 7. SECTION 5 — Preismodell (B2B SaaS style) */}
      <section
        ref={pricingRef}
        className="relative py-20 md:py-28 scroll-mt-20 w-full"
        style={{ background: '#050608' }}
      >
        <div className="w-full max-w-6xl mx-auto px-6">
          <FadeIn>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-10 tracking-tight text-center"
              style={{ fontFamily: syne, color: '#fff' }}
            >
              Transparente Preise, keine versteckten Kosten
            </h2>
          </FadeIn>

          {/* Base fee banner — full-width, dark, monospace price */}
          <FadeIn delay={80}>
            <div
              className="w-full py-4 md:py-5 mb-12 text-center border-y border-white/[0.06]"
              style={{ background: 'rgba(0,0,0,0.3)' }}
            >
              <p className="text-sm md:text-base text-white/60 mb-1" style={{ fontFamily: dm }}>
                Plattform-Grundgebühr für alle Apotheken
              </p>
              <p
                className="text-2xl md:text-3xl font-semibold tracking-tight text-white"
                style={{ fontFamily: '"JetBrains Mono", "SF Mono", "Fira Code", monospace' }}
              >
                €50 <span className="text-white/50 font-normal">/ Monat</span>
              </p>
            </div>
          </FadeIn>

          {/* Tier cards — sharp borders, no rounded, horizontal row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px">
            {[
              {
                name: 'STARTER',
                price: '50',
                sub: 'Grundgebühr',
                features: [
                  'Listing auf der Plattform',
                  'Inventar-Dashboard',
                  'Bestellverwaltung',
                  'Botendienst-Integration',
                  'E-Mail-Benachrichtigungen',
                ],
                recommended: false,
              },
              {
                name: 'PRO',
                price: '129',
                sub: '€50 + €79',
                features: [
                  'Alles aus Starter',
                  'Cannaleo / WaWi Auto-Sync',
                  'Live-Bestand in Echtzeit',
                  'Analytics & Berichte',
                  'Priorisiertes Listing',
                ],
                recommended: true,
              },
              {
                name: 'ENTERPRISE',
                price: '199',
                sub: '€50 + €149',
                features: [
                  'Alles aus Pro',
                  'Öffentlicher API-Schlüssel',
                  'Multi-Plattform-Inventar',
                  'Dedizierter Support',
                ],
                recommended: false,
              },
            ].map((tier, i) => (
              <FadeIn key={tier.name} delay={120 + i * 80}>
                <div
                  className={`pharmacies-tier-card h-full flex flex-col relative border border-white/[0.06] bg-[#080a0d] p-6 md:p-8 transition-[border-color,background-color] duration-200 ${
                    tier.recommended ? 'pharmacies-tier-card--recommended border-t-[3px] md:border-y-[1px] md:border-t-[3px]' : ''
                  }`}
                  style={{
                    borderTopColor: tier.recommended ? cyan : undefined,
                  }}
                >
                  {tier.recommended && (
                    <span
                      className="absolute top-0 right-0 px-3 py-1 text-[10px] font-semibold tracking-widest uppercase"
                      style={{ background: cyan, color: '#050608' }}
                    >
                      Empfohlen
                    </span>
                  )}
                  <p
                    className="text-xs font-semibold tracking-[0.2em] uppercase mb-6 mt-0"
                    style={{ fontFamily: dm, color: 'rgba(255,255,255,0.5)' }}
                  >
                    {tier.name}
                  </p>
                  <p
                    className="text-4xl md:text-5xl font-bold tracking-tight mb-1"
                    style={{ fontFamily: '"JetBrains Mono", "SF Mono", monospace', color: '#fff' }}
                  >
                    €{tier.price}
                  </p>
                  <p className="text-xs mb-8" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    {tier.sub} · monatlich
                  </p>
                  <ul className="space-y-3 flex-1">
                    {tier.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
                        <span className="text-white/70 shrink-0" aria-hidden>✓</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={400}>
            <p
              className="text-[11px] md:text-xs mt-10 max-w-2xl mx-auto text-center leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.35)', fontFamily: dm }}
            >
              Pauschales Monatsgebührenmodell validiert durch BGH I ZR 46/24 (Bundesgerichtshof, Feb. 2025). Keine Provisions- oder Verschreibungsgebühren. Jederzeit kündbar.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* 8. SECTION 6 — Onboarding in 3 Schritten */}
      <section className="relative px-6 py-20 md:py-28">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-14 tracking-tight"
              style={{ fontFamily: syne }}
            >
              Onboarding in <span style={{ color: cyan }}>3 Schritten</span>
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                icon: MessageCircle,
                title: 'Kontakt aufnehmen',
                desc: 'Schreib uns oder ruf an — wir melden uns innerhalb von 24 Stunden.',
              },
              {
                icon: Settings,
                title: 'Setup & Integration',
                desc: 'Wir richten dein Listing ein. Optional: Cannaleo oder WaWi-Anbindung für automatische Bestandssynchronisation.',
              },
              {
                icon: Rocket,
                title: 'Go Live',
                desc: 'Deine Apotheke ist live auf releafZ. Patienten in deiner Nähe sehen deinen Bestand und können direkt kontaktieren.',
              },
            ].map((step, i) => (
              <FadeIn key={step.title} delay={i * 100}>
                <div
                  className="partners-card rounded-xl p-6 h-full"
                  style={{
                    background: 'rgba(255,255,255,0.025)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <span
                    className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4"
                    style={{ background: `${cyan}20`, color: cyan }}
                  >
                    <step.icon className="w-6 h-6" />
                  </span>
                  <h3 className="text-base font-semibold mb-2" style={{ fontFamily: syne }}>{step.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{step.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 9. SECTION 7 — CTA / Contact */}
      <section id="kontakt" className="relative px-6 py-20 md:py-28 scroll-mt-20">
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: '-20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60vw',
            height: '40vw',
            maxWidth: '800px',
            maxHeight: '500px',
            background: `radial-gradient(ellipse at center, rgba(34,211,238,0.06) 0%, transparent 70%)`,
          }}
        />
        <div className="max-w-xl mx-auto relative z-10">
          <FadeIn>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 tracking-tight"
              style={{ fontFamily: syne }}
            >
              Bereit loszulegen?
            </h2>
          </FadeIn>
          <FadeIn delay={60}>
            <p className="text-sm md:text-base mb-8" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Sprich direkt mit unserem Partnership-Lead.
            </p>
          </FadeIn>
          <FadeIn delay={120}>
            <div
              className="partners-card rounded-xl p-8"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: `${cyan}20`, color: cyan }}
                >
                  <User className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-lg font-bold" style={{ fontFamily: syne }}>Daniel Kang</p>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Partnership Lead</p>
                </div>
              </div>
              <div className="space-y-3 mb-8">
                <a
                  href="mailto:daniel.kang@releafz.de"
                  className="flex items-center gap-3 text-sm hover:text-cyan transition-colors"
                  style={{ color: 'rgba(255,255,255,0.8)' }}
                >
                  <Mail className="w-4 h-4 shrink-0" style={{ color: cyan }} />
                  daniel.kang@releafz.de
                </a>
                <a
                  href="tel:+4915251492433"
                  className="flex items-center gap-3 text-sm hover:text-cyan transition-colors"
                  style={{ color: 'rgba(255,255,255,0.8)' }}
                >
                  <Phone className="w-4 h-4 shrink-0" style={{ color: cyan }} />
                  +49 152 51492433
                </a>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={process.env.NEXT_PUBLIC_DANIEL_CALENDAR_URL || 'mailto:daniel.kang@releafz.de?subject=Demo-Call%20anfragen'}
                  target={process.env.NEXT_PUBLIC_DANIEL_CALENDAR_URL ? '_blank' : undefined}
                  rel={process.env.NEXT_PUBLIC_DANIEL_CALENDAR_URL ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 rounded-lg text-sm font-semibold text-black transition-all hover:brightness-110 hover:shadow-lg"
                  style={{
                    fontFamily: dm,
                    background: `linear-gradient(135deg, ${cyan}, ${green})`,
                    boxShadow: `0 0 24px rgba(34,211,238,0.2)`,
                  }}
                >
                  <Calendar className="w-4 h-4" />
                  Demo-Call buchen
                </a>
                <a
                  href="mailto:daniel.kang@releafz.de"
                  className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-3.5 rounded-lg text-sm font-medium transition-all hover:bg-white/5 border border-white/15"
                  style={{ fontFamily: dm, color: 'rgba(255,255,255,0.85)' }}
                >
                  Jetzt Partner werden
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 10. FOOTER */}
      <footer
        className="relative px-6 py-10"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
          <img src="/logo1.png" alt="releafZ" className="h-6 w-auto opacity-30" />
          <span>© 2025 releafZ. Alle Rechte vorbehalten. Berlin, Deutschland.</span>
          <Link href="/" className="hover:text-white/60 transition-colors">
            ← Zur Patienten-Seite
          </Link>
        </div>
      </footer>

      {/* Global styles (match partners) */}
      <style jsx global>{`
        .partners-fade {
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .partners-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .partners-card {
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
                      box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1),
                      border-color 0.3s ease,
                      background 0.3s ease;
        }
        .partners-card:hover {
          transform: translateY(-3px);
          background: rgba(255,255,255,0.045) !important;
          border-color: rgba(34, 211, 238, 0.2) !important;
          box-shadow: 0 8px 30px rgba(34, 211, 238, 0.06), 0 0 1px rgba(34, 211, 238, 0.3);
        }

        .pharmacies-tier-card:not(.pharmacies-tier-card--recommended):hover {
          border-color: rgba(255,255,255,0.12);
          background: #0a0c10;
        }
      `}</style>
    </div>
  )
}
