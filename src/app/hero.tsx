'use client'

import React from 'react'
import {
  Check,
  FileText, Scale, CircleDot,
  UserCheck, Stethoscope,
  Lock, Wifi,
  PhoneCall, Store, HeartHandshake,
} from 'lucide-react'
import { scrollToLandingTop } from '@/lib/scroll'
import { heroParticlesOptions } from '@/constants/particles'
import SectionParticlesBackground from '@/components/ui/SectionParticlesBackground'
import { HeroImageCarousel } from './hero-carousel'
import './header.css'
import './hero-mobile.css'

interface HeroProps {
  setDialogOpen: (open: boolean) => void
  /** Scroll to #faq; parent may sync URL with pushState (no overflow lock). */
  onScrollToAblauf: () => void
  landingTheme: 'dark' | 'light'
}

type AccordionRow = 'trust' | 'behandlung' | null

type HeroZStar = {
  left: number
  top: number
  size: number
  duration: number
  delay: number
  rotate: number
}

function buildHeroZStars(count: number): HeroZStar[] {
  const stars: HeroZStar[] = []
  for (let i = 0; i < count; i++) {
    stars.push({
      left: ((i * 7919) % 10000) / 100,
      top: ((i * 6151 + 17) % 10000) / 100,
      size: [9, 10, 11, 13, 16][i % 5],
      duration: 2 + (i % 6),
      delay: ((i * 131) % 100) / 25,
      rotate: ((i * 53) % 40) - 20,
    })
  }
  return stars
}

const HERO_Z_STARS = buildHeroZStars(200)

const HERO_NAV_LINKS = [
  { href: '#faq', label: 'Ablauf', scrollKey: 'faq' as const },
  { href: '#partner-apotheken', label: 'Apotheke in Ihrer Nähe' },
  { href: '#faq', label: 'FAQ' },
  { href: '#chat', label: 'Chat with us!' },
]

function HeroTopNav({ onScrollToAblauf }: { onScrollToAblauf: () => void }) {
  return (
    <nav className="hero-logo-bar__nav header-desktop-nav header-text" aria-label="Hauptnavigation">
      {HERO_NAV_LINKS.map((link) => (
        <a
          key={`${link.href}-${link.label}`}
          href={link.href}
          className="header-nav-link"
          onClick={(e) => {
            if (link.scrollKey === 'faq') {
              e.preventDefault()
              onScrollToAblauf()
            }
          }}
        >
          {link.label}
        </a>
      ))}
    </nav>
  )
}

function HeroAccordionRows({
  setDialogOpen,
  onDiscover,
  scrollAnchorRef,
  onOpenRowChange,
}: {
  setDialogOpen: (open: boolean) => void
  onDiscover?: () => void
  scrollAnchorRef?: React.RefObject<HTMLElement | null>
  onOpenRowChange?: (row: AccordionRow) => void
}) {
  const [openRow, setOpenRow] = React.useState<AccordionRow>(null)

  React.useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const delayMs = prefersReducedMotion ? 0 : 3000

    const timerId = window.setTimeout(() => {
      requestAnimationFrame(() => {
        setOpenRow((prev) => (prev === null ? 'behandlung' : prev))
      })
    }, delayMs)

    return () => window.clearTimeout(timerId)
  }, [])

  React.useEffect(() => {
    onOpenRowChange?.(openRow)
  }, [openRow, onOpenRowChange])

  React.useEffect(() => {
    if (openRow !== null) {
      document.documentElement.dataset.heroAccordionOpen = 'true'
    } else {
      delete document.documentElement.dataset.heroAccordionOpen
    }
    return () => {
      delete document.documentElement.dataset.heroAccordionOpen
    }
  }, [openRow])

  const toggleRow = (row: AccordionRow) => {
    const hadOpenPanel = openRow !== null
    setOpenRow((prev) => (prev === row ? null : row))
    if (hadOpenPanel) {
      scrollAnchorRef?.current?.scrollIntoView({ block: 'start', behavior: 'instant' as ScrollBehavior })
    }
  }

  const handleDiscover = () => {
    if (onDiscover) {
      onDiscover()
      return
    }
    const el = document.getElementById('faq')
    if (!el) return
    const top = Math.max(0, el.getBoundingClientRect().top + window.scrollY + 40)
    window.scrollTo({ top, behavior: 'smooth' })
  }

  return (
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
              src="/payment_badges.svg"
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
          onClick={handleDiscover}
        >
          <span className="mobile-hero__row-label">ENTDECKEN</span>
          <span className="mobile-hero__row-hint">↓ Mehr erfahren</span>
        </button>
      </div>
    </div>
  )
}

export function MobileHero({ setDialogOpen }: { setDialogOpen: (open: boolean) => void }) {
  const heroRef = React.useRef<HTMLElement>(null)

  const [mobileParticles, setMobileParticles] = React.useState<
    Array<{
      id: number
      size: number
      left: number
      top: number
      duration: number
      delay: number
    }>
  >([])

  React.useEffect(() => {
    setMobileParticles(
      Array.from({ length: 6 }, (_, i) => ({
        id: i,
        size: Math.random() * 4 + 2,
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: Math.random() * 10 + 10,
        delay: Math.random() * 5,
      }))
    )
  }, [])

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

      <HeroAccordionRows setDialogOpen={setDialogOpen} scrollAnchorRef={heroRef} />
    </section>
  )
}

export default function Hero({
  setDialogOpen,
  onScrollToAblauf,
  landingTheme,
}: HeroProps) {
  const [openAccordionRow, setOpenAccordionRow] = React.useState<AccordionRow>(null)
  const isHeroExpanded = openAccordionRow === 'trust'

  return (
    <section
      id="hero"
      className={`hero-section hero-section--${landingTheme} pointer-events-none z-0 flex w-full min-h-[100dvh] flex-col pt-16 pb-28 sm:pt-20 sm:pb-32 ${
        isHeroExpanded
          ? 'hero-section--expanded relative overflow-visible'
          : 'hero-section--fixed fixed inset-0 overflow-hidden'
      }`}
      style={
        {
          '--header-nav-color': landingTheme === 'light' ? '#0f172a' : '#ffffff',
          '--header-nav-hover-color':
            landingTheme === 'light' ? 'rgba(15, 23, 42, 0.82)' : 'rgba(255, 255, 255, 0.92)',
        } as React.CSSProperties
      }
    >
        <div className="hero-section__backdrop pointer-events-none absolute inset-0 min-h-full w-full overflow-hidden">
          {/* <video
            className="absolute inset-0 w-full h-full object-cover"
            src={heroVideoSrc}
            preload="auto"
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="absolute inset-0 bg-black/20" /> */}
          <div
            className={`hero-section__bg-base absolute inset-0 ${landingTheme === 'dark' ? 'bg-black' : 'bg-white'}`}
            aria-hidden
          />
          <SectionParticlesBackground
            className="hero-section__particles"
            options={heroParticlesOptions}
          />
          <div className="hero-section__z-stars" aria-hidden>
            {HERO_Z_STARS.map((star, i) => (
              <span
                key={i}
                className={`hero-section__z-star${
                  i % 4 === 0
                    ? ' hero-section__z-star--cyan'
                    : i % 9 === 0
                      ? ' hero-section__z-star--soft'
                      : ''
                }`}
                style={{
                  left: `${star.left}%`,
                  top: `${star.top}%`,
                  fontSize: `${star.size}px`,
                  transform: `rotate(${star.rotate}deg)`,
                  animationDuration: `${star.duration}s`,
                  animationDelay: `${star.delay}s`,
                }}
              >
                z
              </span>
            ))}
          </div>
        </div>

        <button
          type="button"
          aria-label="Go to next section"
          className="hero-scroll-overlay pointer-events-auto absolute inset-0 z-[1] bg-transparent"
          onClick={onScrollToAblauf}
        />

        <div className="hero-logo-bar pointer-events-none absolute top-5 right-0 left-0 z-20 sm:top-8">
          <div className="hero-logo-bar__row">
            <a
              href="#hero"
              className="hero-logo-link pointer-events-auto flex shrink-0 items-center no-underline text-inherit hover:opacity-90 transition-opacity"
              onClick={(e) => {
                e.preventDefault()
                scrollToLandingTop()
              }}
            >
              <img src="/logo1.png" alt="reLeafZ Logo" className="logo-hero" />
            </a>
            <HeroTopNav onScrollToAblauf={onScrollToAblauf} />
          </div>
          <div className="hero-logo-divider" aria-hidden />
        </div>

        <a
          href="#faq"
          className="hero-scroll-cta pointer-events-auto"
          onClick={(e) => {
            e.preventDefault()
            onScrollToAblauf()
          }}
        >
        </a>

        <div className="hero-layout">
          <div
            className="hero-layout__content hero-accordion pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <HeroAccordionRows
              setDialogOpen={setDialogOpen}
              onDiscover={onScrollToAblauf}
              onOpenRowChange={setOpenAccordionRow}
            />
          </div>

          <div className="hero-layout__media">
            <HeroImageCarousel />
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
