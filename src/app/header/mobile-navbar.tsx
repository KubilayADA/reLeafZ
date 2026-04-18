'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Menu } from 'lucide-react'

import './header-mobile.css'
import { scrollLandingToAblauf } from '@/lib/scroll'

interface MobileNavbarProps {
  setDialogOpen: (open: boolean) => void
  landingTheme: 'dark' | 'light'
  onThemeToggle: () => void
}

const NAV_LINKS = [
  { href: '#ablauf', label: 'So funktionierts' },
  { href: '#partner-apotheken', label: 'Partner-Apotheken' },
]

export default function MobileNavbar({
  setDialogOpen,
  landingTheme,
  onThemeToggle,
}: MobileNavbarProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const isOpenRef = useRef(false)
  const savedScrollRef = useRef(0)
  const themeSliderValRef = useRef<0 | 1>(landingTheme === 'light' ? 1 : 0)

  // Keep ref in sync so scroll/touch handlers can read current value without stale closure
  useEffect(() => { isOpenRef.current = isOpen }, [isOpen])

  useEffect(() => {
    themeSliderValRef.current = landingTheme === 'light' ? 1 : 0
  }, [landingTheme])

  useEffect(() => {
    const SECTION_IDS = ['partner-apotheken', 'ablauf'] as const
    const SECTION_ACTIVE_OFFSET = 110
    const getTargetSections = () =>
      SECTION_IDS
        .map((id) => document.getElementById(id))
        .filter((el): el is HTMLElement => el !== null)

    const updateVisibility = () => {
      const sections = getTargetSections()
      if (!sections.length) {
        setIsVisible(false)
        return
      }

      const isInTargetSection = sections.some((section) => {
        const rect = section.getBoundingClientRect()
        return rect.top <= SECTION_ACTIVE_OFFSET && rect.bottom > SECTION_ACTIVE_OFFSET
      })

      setIsVisible(isInTargetSection)
    }

    updateVisibility()

    const handleScroll = () => {
      updateVisibility()
      if (isOpenRef.current && Math.abs(window.scrollY - savedScrollRef.current) > 12) {
        setIsOpen(false)
      }
    }

    const handleTouchOutside = (e: TouchEvent) => {
      if (isOpenRef.current && containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', updateVisibility)
    document.addEventListener('touchstart', handleTouchOutside, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', updateVisibility)
      document.removeEventListener('touchstart', handleTouchOutside)
    }
  }, [])

  // When closed → open menu. When open → scroll to hero & close.
  const handleLogoClick = () => {
    if (isOpen) {
      // Sync ref immediately so the scroll handler doesn't re-trigger close
      isOpenRef.current = false
      setIsOpen(false)
      ;(document.scrollingElement || document.documentElement).scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      savedScrollRef.current = window.scrollY
      setIsOpen(true)
    }
  }

  const handleThemeSlider = (raw: number) => {
    const value = raw === 1 ? 1 : 0
    if (value === themeSliderValRef.current) return
    themeSliderValRef.current = value
    onThemeToggle()
  }

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setIsOpen(false)

    if (href === '#ablauf') {
      scrollLandingToAblauf()
      return
    }

    const id = href.replace('#', '')
    const el = document.getElementById(id)
    if (el) {
      const top = el.getBoundingClientRect().top + window.pageYOffset - 70
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  return (
    <div
      ref={containerRef}
      className={`mnav${isVisible ? ' mnav--visible' : ''}${isOpen ? ' mnav--open' : ''}`}
      aria-hidden={!isVisible}
      style={{
        borderTop: '2.5px solid #333',
        borderLeft: '2.5px solid #333',
        borderRight: '4px solid #333',
        borderBottom: '4px solid #333',
      }}
    >
      {/* Header row — always visible when navbar is shown */}
      <div className="mnav__header">
        <button
          className={`mnav__icon-btn${isOpen ? ' mnav__icon-btn--open' : ''}`}
          onClick={handleLogoClick}
          aria-label={isOpen ? 'Zurück zum Seitenanfang' : 'Menü öffnen'}
          aria-expanded={isOpen}
        >
          <div className="mnav__logo-wrap">
            <Menu
              size={24}
              className={`mnav__logo-icon${isOpen ? ' mnav__logo-icon--hidden' : ''}`}
            />
            <img
              src="/logo1.png"
              alt="reLeafZ"
              className={`mnav__logo-full${isOpen ? ' mnav__logo-full--visible' : ''}`}
            />
          </div>
        </button>

      </div>

      {/* Expandable menu */}
      <div className={`mnav__menu${isOpen ? ' mnav__menu--open' : ''}`} aria-hidden={!isOpen}>
        <nav className="mnav__links" aria-label="Hauptnavigation">
          {NAV_LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="mnav__link"
              onClick={(e) => handleNavClick(e, link.href)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="mnav__theme-row">
          <span className="mnav__theme-label" id="mnav-theme-label">
            Theme
          </span>
          <div
            className={`mnav__theme-switch${landingTheme === 'light' ? ' mnav__theme-switch--light' : ''}`}
            role="group"
            aria-labelledby="mnav-theme-label"
          >
            <span className="mnav__theme-end-label" aria-hidden>
              Dark
            </span>
            <input
              type="range"
              className="mnav__theme-range"
              min={0}
              max={1}
              step={1}
              value={landingTheme === 'light' ? 1 : 0}
              onChange={(e) => handleThemeSlider(Number(e.target.value))}
              onInput={(e) => handleThemeSlider(Number(e.currentTarget.value))}
              aria-label="Choose light or dark theme"
              aria-valuetext={landingTheme === 'light' ? 'Light' : 'Dark'}
            />
            <span className="mnav__theme-end-label" aria-hidden>
              Light
            </span>
          </div>
        </div>

        <div className="mnav__cta-wrap">
          <button
            type="button"
            className="btn-cta w-full"
            style={{
              borderTop: '2.5px solid #333',
              borderLeft: '2.5px solid #333',
              borderRight: '4px solid #333',
              borderBottom: '4px solid #333',
              borderRadius: '12px',
            }}
            onClick={() => {
              setIsOpen(false)
              setDialogOpen(true)
            }}
          >
            Jetzt Rezept beantragen →
          </button>
        </div>
      </div>
    </div>
  )
}
