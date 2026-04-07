'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Menu } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import './header-mobile.css'
import { isLandingPastHero, scrollLandingToAblauf } from '@/lib/scroll'

interface MobileNavbarProps {
  dialogOpen: boolean
  setDialogOpen: (open: boolean) => void
  zipInput: string
  setZipInput: (input: string) => void
  handlePostcodeSubmit: () => void
  isValidBerlinPostcode: (postcode: string) => boolean
  landingTheme: 'dark' | 'light'
  onThemeToggle: () => void
}

const NAV_LINKS = [
  { href: '#ablauf', label: 'Ablauf' },
  { href: '#partner-apotheken', label: 'Apotheke in Ihrer Nähe' },
  { href: '#vorteile', label: 'Vorteile' },
  { href: '#chat', label: 'Chat with us!' },
]

export default function MobileNavbar({
  dialogOpen,
  setDialogOpen,
  zipInput,
  setZipInput,
  handlePostcodeSubmit,
  isValidBerlinPostcode,
  landingTheme,
  onThemeToggle,
}: MobileNavbarProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const isOpenRef = useRef(false)
  const savedScrollRef = useRef(0)

  // Keep ref in sync so scroll/touch handlers can read current value without stale closure
  useEffect(() => { isOpenRef.current = isOpen }, [isOpen])

  useEffect(() => {
    const checkVisibility = () => {
      setIsVisible(isLandingPastHero())
    }

    const handleScroll = () => {
      checkVisibility()
      // Close menu if user manually scrolls away from where they opened it
      if (isOpenRef.current && Math.abs(window.scrollY - savedScrollRef.current) > 12) {
        setIsOpen(false)
      }
    }

    const handleTouchOutside = (e: TouchEvent) => {
      if (isOpenRef.current && containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    checkVisibility()
    window.addEventListener('scroll', handleScroll, { passive: true })
    document.addEventListener('touchstart', handleTouchOutside, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
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
              src="/logo2.png"
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
          <span className="mnav__theme-label">Theme</span>
          <button
            type="button"
            onClick={onThemeToggle}
            className={`mnav__theme-toggle ${landingTheme === 'light' ? 'is-light' : ''}`}
            aria-pressed={landingTheme === 'light'}
            aria-label={`Switch to ${landingTheme === 'dark' ? 'light' : 'dark'} mode`}
          >
            <span className="mnav__theme-thumb" aria-hidden />
            <span className={`mnav__theme-state ${landingTheme === 'dark' ? 'is-active' : ''}`}>Dark</span>
            <span className={`mnav__theme-state ${landingTheme === 'light' ? 'is-active' : ''}`}>Light</span>
          </button>
        </div>

        <div className="mnav__cta-wrap">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="button2"
                className="w-full shadow-[0_10px_24px_rgba(0,0,0,0.26)]"
                onClick={() => setIsOpen(false)}
              >
                BEHANDLUNG ANFRAGEN
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md border border-white/20 bg-white/10 backdrop-blur-md">
              <DialogHeader>
                <DialogTitle className="inconsolata text-xl font-bold">
                  Postleitzahl eingeben
                </DialogTitle>
                <DialogDescription className="inconsolata text-gray-600">
                  Bitte geben Sie Ihre Postleitzahl ein, um zu prüfen, ob wir in Ihrer Region liefern können.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <input
                  type="text"
                  name="zip"
                  placeholder="z.B. 10115"
                  value={zipInput}
                  onChange={(e) => setZipInput(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg inconsolata text-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  maxLength={5}
                />
              </div>
              <DialogFooter>
                <Button
                  onClick={handlePostcodeSubmit}
                  disabled={!zipInput.trim() || !isValidBerlinPostcode(zipInput)}
                  className="w-full btn-primary font-medium py-3"
                >
                  Weiter
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
