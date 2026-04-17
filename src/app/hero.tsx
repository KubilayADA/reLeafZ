'use client'

import React from 'react'
import {
  Check, Shield, Clock, MapPin,
  FileText, Scale, CircleDot,
  UserCheck, Stethoscope,
  Lock, Wifi,
  PhoneCall, Store, HeartHandshake,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import words from '@/constants/index'
import { scrollToLandingTop } from '@/lib/scroll'
import './hero-mobile.css'

interface HeroProps {
  setDialogOpen: (open: boolean) => void
  /** Scroll to #ablauf; parent may sync URL with pushState (no overflow lock). */
  onScrollToAblauf: () => void
  landingTheme: 'dark' | 'light'
}

type AccordionRow = 'trust' | 'behandlung' | null

export function MobileHero({ setDialogOpen }: { setDialogOpen: (open: boolean) => void }) {
  const [openRow, setOpenRow] = React.useState<AccordionRow>(null)
  const heroRef = React.useRef<HTMLElement>(null)

  const toggleRow = (row: AccordionRow) => {
    const hadOpenPanel = openRow !== null
    setOpenRow((prev) => (prev === row ? null : row))
    if (hadOpenPanel) {
      heroRef.current?.scrollIntoView({ block: 'start', behavior: 'instant' as ScrollBehavior })
    }
  }

  const mobileParticles = React.useMemo(() =>
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      size: Math.random() * 4 + 2,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
    })), []
  )

  return (
    <section className="mobile-hero" ref={heroRef}>
      <div className="mobile-hero__bg" aria-hidden>
        <div className="mobile-hero__bg-base" />
        <div className="mobile-hero__bg-glow-line" />
        <div className="mobile-hero__bg-glow-radial" />
        <div className="mobile-hero__bg-grid" />
        {mobileParticles.map((p) => (
          <div
            key={p.id}
            className="mobile-hero__bg-particle"
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              left: `${p.left}%`,
              top: `${p.top}%`,
              animation: `floatParticleMobile ${p.duration}s ease-in-out infinite`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      <header className="mobile-hero__header">
        <img src="/logo1.png" alt="reLeafZ" className="mobile-hero__logo" />
        <div className="mobile-hero__lang">
          <button type="button" className="mobile-hero__lang-item is-active">DE</button>
          <button type="button" className="mobile-hero__lang-item">EN</button>
        </div>
      </header>

      <div className="mobile-hero__rows">
        <div className={`mobile-hero__row ${openRow === 'trust' ? 'is-open' : ''}`}>
          <button
            type="button"
            className="mobile-hero__row-trigger"
            onClick={() => toggleRow('trust')}
            aria-expanded={openRow === 'trust'}
          >
            <span className="mobile-hero__row-label">ÜBER UNS</span>
            <span className="mobile-hero__row-indicator">+</span>
          </button>
          <div className="mobile-hero__panel">
            <div className="mobile-hero__panel-inner">
              <div className="mobile-hero__trust-group">
                <div className="mobile-hero__trust-group-label">Rechtlich &amp; Regulatorisch</div>
                <TrustCard icon={<FileText />} title="Verschreibung nach §10 BtMG" sub="Rechtssichere Betäubungsmittelverordnung" />
                <TrustCard icon={<Scale />} title="CanG-konform (Cannabis Act 2024)" sub="Vollständig nach aktuellem Recht" />
                <TrustCard icon={<CircleDot />} title="Registriert beim BfArM" sub="Bundesbehörde für Arzneimittel" />
              </div>
              <div className="mobile-hero__trust-group">
                <div className="mobile-hero__trust-group-label">Medizinische Qualität</div>
                <TrustCard icon={<UserCheck />} title="Ausschließlich deutsche Ärzte" sub="Approbiert & in Deutschland lizenziert" />
                <TrustCard icon={<Stethoscope />} title="Medizinisch geprüfte Behandlungen" sub="Kein Rezept ohne medizinische Grundlage" />
              </div>
              <div className="mobile-hero__trust-group">
                <div className="mobile-hero__trust-group-label">Datenschutz</div>
                <TrustCard icon={<Lock />} title="DSGVO-konform & verschlüsselt" sub="Server ausschließlich in Deutschland" />
                <TrustCard icon={<Wifi />} title="Keine Datenweitergabe an Kassen" sub="Strikte ärztliche Schweigepflicht" />
              </div>
              <div className="mobile-hero__trust-group">
                <div className="mobile-hero__trust-group-label">Ablauf &amp; Service</div>
                <TrustCard icon={<PhoneCall />} title="Antwort innerhalb von 24 Stunden" sub="Schnelle ärztliche Erstberatung" />
                <TrustCard icon={<Store />} title="Berliner Partnerapotheken" sub="Direkte Lieferung & Apothekerberatung" />
                <TrustCard icon={<HeartHandshake />} title="Kostenlose Folgeberatungen" sub="Betreuung über die gesamte Behandlung" />
              </div>
            </div>
          </div>
        </div>

        <div className={`mobile-hero__row ${openRow === 'behandlung' ? 'is-open' : ''}`}>
          <button
            type="button"
            className="mobile-hero__row-trigger"
            onClick={() => toggleRow('behandlung')}
            aria-expanded={openRow === 'behandlung'}
          >
            <span className="mobile-hero__row-label">BEHANDLUNG ANFRAGEN</span>
            <span className="mobile-hero__row-indicator">+</span>
          </button>
          <div className="mobile-hero__panel">
            <div className="mobile-hero__panel-inner">
              <p className="mobile-hero__cta-copy">
                Starte jetzt deine Cannabis-Therapie — unkompliziert, legal und von zuhause.
              </p>
              <button
                type="button"
                className="mobile-hero__cta-btn"
                onClick={() => setDialogOpen(true)}
              >
                Jetzt anfragen &rarr;
              </button>
              <img
                src="/payy.png"
                alt="Zahlungsmethoden"
                className="mobile-hero__payment-methods"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        <div className="mobile-hero__row">
          <button
            type="button"
            className="mobile-hero__row-trigger"
            onClick={() => {
              const el = document.getElementById('partner-apotheken')
              if (!el) return
              const top = Math.max(0, el.getBoundingClientRect().top + window.scrollY + 40)
              window.scrollTo({ top, behavior: 'smooth' })
            }}
          >
            <span className="mobile-hero__row-label">ENTDECKEN</span>
            <span className="mobile-hero__row-hint">↓ Mehr erfahren</span>
          </button>
        </div>
      </div>
    </section>
  )
}

export default function Hero({
  setDialogOpen,
  onScrollToAblauf,
  landingTheme,
}: HeroProps) {
  const heroVideoSrc = landingTheme === 'dark'
    ? '/hero-night.mp4'
    : '/bubble-explose.mov'

  const heroChecklistItems = [
    'Lieferung in 30-90 Minuten in Berlin',
    'Ganz Deutschland in 1-2 Tagen',
    '100% Legal & Secure Wallah',
    'i am a banana',
  ]

  return (
    <section
      id="hero"
      className="hero-section hero-section--fixed pointer-events-none fixed inset-0 z-0 flex w-full min-h-[100dvh] flex-col overflow-hidden pt-16 pb-28 sm:pt-20 sm:pb-32"
    >
        <div className="pointer-events-none absolute inset-0 w-full overflow-hidden">
          <video
            className="absolute inset-0 w-full h-full object-cover"
            src={heroVideoSrc}
            preload="auto"
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <button
          type="button"
          aria-label="Go to next section"
          className="pointer-events-auto absolute inset-0 z-[1] bg-transparent"
          onClick={onScrollToAblauf}
        />

        <a
          href="#hero"
          className="pointer-events-auto absolute top-5 left-1/2 -translate-x-1/2 sm:left-8 sm:translate-x-0 sm:top-8 md:top-12 md:left-14 md:scale-150 z-10 flex items-center gap-2 no-underline text-inherit hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.preventDefault()
            scrollToLandingTop()
          }}
        >
          {/* <img src="/logo2.png" alt="reLeafZ Logo" className="logo-hero" /> */}
        </a>

        <a
          href="#ablauf"
          className="hero-scroll-cta pointer-events-auto"
          onClick={(e) => {
            e.preventDefault()
            onScrollToAblauf()
          }}
        >
          <span className="hero-scroll-cta-text">Tap anywhere or click to go to the next section</span>
        </a>

        <div className="pointer-events-none relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 overflow-visible w-full">
          <div className="text-center overflow-visible w-full max-w-full">
            <div className="lg:-ml-[94px] lg:mr-auto lg:w-full lg:max-w-[980px]">
              <img
                src="/payy.png"
                alt="payy"
                className="w-88 h-10 object-contain mx-auto lg:mx-0 mt-8 lg:mt-12 mb-0"
              />
              <h1 className="title-gradient-hero mt-0 !mb-0 lg:!-mb-6 lg:w-full lg:text-left">
                MEDIZINAL CANNABIS
              </h1>
              <div className="animated-words-container -mt-5 lg:-mt-12 lg:!-ml-[33px] lg:!w-full lg:!items-start lg:!justify-start">
                <div className="words-wrapper lg:!w-full lg:!items-start">
                  {words.map((word, index) => (
                    <div
                      key={index}
                      className="word-item font-bold title-gradient-hero leading-tight italic mb-0 lg:!w-full lg:!justify-start lg:!text-left"
                    >
                      {word}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mx-auto mt-6 mb-4 flex w-fit flex-col gap-6 text-left lg:mt-15 lg:mb-6 lg:ml-[-100px] lg:mr-auto scale-100">
              {heroChecklistItems.map((text, index) => (
                <div key={`hero-check-${index}`} className="flex items-center gap-3 text-white">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/90 shadow-[0_0_0_4px_rgba(16,185,129,0.22)]">
                    <Check className="h-4 w-4 text-white" />
                  </span>
                  <span className="text-lg font-bold leading-none">{text}</span>
                </div>
              ))}
            </div>

            <div className="hero-cta-wrap -mt-4 lg:-mt-10 lg:mr-auto lg:ml-[-380px]">
              <div className="hero-cta-center pointer-events-auto">
                <Button
                  variant="button2"
                  className="behandlung-button relative z-20 md:scale-125 lg:scale-150 min-w-44 sm:min-w-56 md:min-w-64 w-auto"
                  onClick={(e) => {
                    e.stopPropagation()
                    setDialogOpen(true)
                  }}
                >
                  BEHANDLUNG ANFRAGEN
                </Button>
              </div>

              <div className="trust-badges -mt-2">
                <div className="trust-badge-item">
                  <Shield className="w-5 h-5 text-black-700 mr-2" />
                  GDPR Compliant
                </div>
                <div className="trust-badge-item">
                  <Clock className="w-5 h-5 text-black-700 mr-2" />
                  Licensed Doctors
                </div>
                <div className="trust-badge-item">
                  <MapPin className="w-5 h-5 text-black-700 mr-2" />
                  Berlin Pharmacies
                </div>
              </div>
            </div>
          </div>
        </div>
    </section>
  )
}

function TrustCard({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) {
  return (
    <div className="mobile-hero__trust-card">
      <span className="mobile-hero__trust-icon">{icon}</span>
      <div className="mobile-hero__trust-text">
        <div className="mobile-hero__trust-title">{title}</div>
        <div className="mobile-hero__trust-sub">{sub}</div>
      </div>
      <span className="mobile-hero__trust-check">
        <Check />
      </span>
    </div>
  )
}
