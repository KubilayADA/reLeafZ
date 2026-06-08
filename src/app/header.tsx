'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
// import { Moon, Sun } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import './header.css'
import { scrollToLandingTop, scrollLandingToAblauf } from '@/lib/scroll'

// logo
const LeafLogo = ({ className = 'logo-header' }) => (
  <div className={`logo-header ${className}`}>
    <img
      src="/logo1.png"
      alt="reLeafZ Logo"
      className="w-full h-full object-contain"
    />
  </div>
)

interface HeaderProps {
  dialogOpen: boolean
  setDialogOpen: (open: boolean) => void
  handlePostcodeSubmit: () => void
  postcodeDialogSection: React.ReactNode
  postcodeSubmitDisabled: boolean
  dialogFieldFocused: boolean
  isVisible: boolean
  landingTheme: 'dark' | 'light'
  onThemeToggle: () => void
}

export default function Header({ 
  dialogOpen, 
  setDialogOpen, 
  handlePostcodeSubmit, 
  postcodeDialogSection,
  postcodeSubmitDisabled,
  isVisible,
  landingTheme,
  onThemeToggle,
}: HeaderProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const dialogCardRef = useRef<HTMLDivElement | null>(null)

  // Keep the address dialog perfectly centered in the *visible* area on every
  // device. The dialog uses `position: fixed; inset: 0; margin: auto;` which
  // auto-centers based on the inset rectangle. We just shrink that rectangle
  // when the mobile keyboard opens so the dialog re-centers above the keyboard.
  //   --rl-vh        : visual viewport height (caps max-height)
  //   --rl-vy        : visual viewport offsetTop (top inset)
  //   --rl-kb-bottom : space taken by the on-screen keyboard (bottom inset)
  useEffect(() => {
    if (!dialogOpen) return
    if (typeof window === 'undefined') return

    const root = document.documentElement
    const vv = window.visualViewport

    const update = () => {
      if (!vv) {
        root.style.setProperty('--rl-vh', `${window.innerHeight}px`)
        root.style.setProperty('--rl-vy', '0px')
        root.style.setProperty('--rl-kb-bottom', '0px')
        return
      }
      const kb = Math.max(0, window.innerHeight - vv.height - vv.offsetTop)
      root.style.setProperty('--rl-vh', `${Math.round(vv.height)}px`)
      root.style.setProperty('--rl-vy', `${Math.round(vv.offsetTop)}px`)
      root.style.setProperty('--rl-kb-bottom', `${Math.round(kb)}px`)
    }

    // Safe defaults the instant the dialog opens (perfectly centered, no offset)
    root.style.setProperty('--rl-vh', `${vv?.height ?? window.innerHeight}px`)
    root.style.setProperty('--rl-vy', '0px')
    root.style.setProperty('--rl-kb-bottom', '0px')
    update()

    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement | null
      if (!target) return
      if (!dialogCardRef.current?.contains(target)) return
      if (!target.matches('input, textarea, select')) return
      window.setTimeout(() => {
        update()
        target.scrollIntoView({ block: 'center', behavior: 'smooth' })
      }, 280)
    }

    vv?.addEventListener('resize', update)
    vv?.addEventListener('scroll', update)
    document.addEventListener('focusin', handleFocusIn)

    return () => {
      vv?.removeEventListener('resize', update)
      vv?.removeEventListener('scroll', update)
      document.removeEventListener('focusin', handleFocusIn)
      root.style.setProperty('--rl-vy', '0px')
      root.style.setProperty('--rl-kb-bottom', '0px')
      root.style.removeProperty('--rl-vh')
    }
  }, [dialogOpen])
  // HOVER SOUND BLOCK loving it 
  const hoverAudioRef = useRef<HTMLAudioElement | null>(null)
  const playHoverSound = () => {
    if (landingTheme === 'light') return
    const hoverAudioSrc = '/auto.mp3'

    if (!hoverAudioRef.current) {
      hoverAudioRef.current = new Audio(hoverAudioSrc)
      hoverAudioRef.current.preload = 'auto'
      hoverAudioRef.current.volume = 0.6
    }

    if (hoverAudioRef.current.src !== new URL(hoverAudioSrc, window.location.origin).href) {
      hoverAudioRef.current.src = hoverAudioSrc
      hoverAudioRef.current.load()
    }

    hoverAudioRef.current.currentTime = 0
    void hoverAudioRef.current.play().catch(() => {
      // Ignore autoplay/gesture policy errors on some browsers
    })
  }

  const stopHoverSound = () => {
    if (!hoverAudioRef.current) return
    hoverAudioRef.current.pause()
    hoverAudioRef.current.currentTime = 0
  }
  // END HOVER SOUND BLOCK

  return (
    <>
      <header
        className={`header ${landingTheme === 'light' ? 'header--light' : ''} ${
          isVisible ? 'header--visible' : 'header--hidden'
        }`}
        style={
          {
            '--header-nav-color': landingTheme === 'light' ? '#0f172a' : '#ffffff',
            '--header-nav-hover-color': landingTheme === 'light' ? 'rgba(15, 23, 42, 0.82)' : 'rgba(255, 255, 255, 0.92)',
          } as React.CSSProperties
        }
      >
        {/* Moving information banner */}
        {/* <div className="bg-transparent text-black py-0.5 overflow-hidden border-b border-black">
        <div className="moving-text">
          <span>Card payment accepted</span>
          <span>|</span>
          <span>Delivery within 90 min</span>
          <span>|</span>
          <span>Medical Cannabis good shit</span>
          <span className="spacer px-100"></span>
          <span>Card payment accepted</span>
          <span>|</span>
          <span>Delivery within 90 min</span>
          <span>|</span>
          <span>Medical Cannabis good shit</span>
          <span className="spacer px-100"></span>
        </div>
      </div> */}
      
      <div className="header-row-wrap relative w-full h-[56px]">
        <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 h-full">
          <div className="header-main-row">
            <div className="header-side header-side--left">
            <button
              type="button"
              className="header-logo-slot flex items-center h-full overflow-visible"
              onClick={() => {
                scrollToLandingTop()
              }}
              aria-label="Zurück zum Seitenanfang"
            >
              <LeafLogo className="w-45 h-52 transform translate-y-0" />
            </button>
            </div>
            
            {/* Desktop Nav */}
            <div className="header-center-controls hidden md:flex">
              <nav className="header-desktop-nav header-text">
                <a
                  href="#faq"
                  className="header-nav-link text-mg md:text-xl leading-relaxed"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollLandingToAblauf()
                  }}
                >
                  Ablauf
                </a>
                <a href="#partner-apotheken" className="header-nav-link text-mg md:text-xl leading-relaxed">Apotheke in Ihrer Nähe</a>
                <a href="#faq" className="header-nav-link text-mg md:text-xl leading-relaxed">FAQ</a>
                <a href="#chat" className="header-nav-link text-lg md:text-xl leading-relaxed">Chat with us!</a>
              </nav>

              {/* Theme toggle — temporarily disabled
              <button
                type="button"
                onClick={onThemeToggle}
                className={`header-theme-icon-toggle ${landingTheme === 'light' ? 'is-light' : ''}`}
                aria-pressed={landingTheme === 'light'}
                aria-label={`Switch to ${landingTheme === 'dark' ? 'light' : 'dark'} mode`}
              >
                <Moon className={`header-theme-icon ${landingTheme === 'dark' ? 'is-active' : ''}`} size={13} />
                <Sun className={`header-theme-icon ${landingTheme === 'light' ? 'is-active' : ''}`} size={13} />
              </button>
              */}
            </div>
            
            {/* Desktop Button - Hidden on mobile, only in hamburger menu wish i believe is better let me know if you see this UwUwuu*/}
            <div className="header-side header-side--right">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <div className="header-cta-wrap hidden md:flex shrink-0 items-center">
              <DialogTrigger asChild>
                <Button
                  className="header-button lg:!ml-0 !font-bold"
                  variant={landingTheme === 'dark' ? 'button2' : undefined}
                  style={
                    landingTheme === 'dark'
                      ? ({
                          minHeight: '38px',
                          paddingTop: '0.45rem',
                          paddingBottom: '0.45rem',
                          fontSize: '0.75rem',
                          borderTop: '2.5px solid #fff',
                          borderLeft: '2.5px solid #fff',
                          borderRight: '4px solid #fff',
                          borderBottom: '4px solid #fff',
                          borderRadius: '8px',
                        } as React.CSSProperties)
                      : ({
                          background: '#ffffff',
                          color: '#0f172a',
                          minHeight: '38px',
                          paddingTop: '0.45rem',
                          paddingBottom: '0.45rem',
                          fontSize: '0.75rem',
                          borderTop: '2.5px solid #333',
                          borderLeft: '2.5px solid #333',
                          borderRight: '4px solid #333',
                          borderBottom: '4px solid #333',
                          borderRadius: '8px',
                        } as React.CSSProperties)
                  }
                  onMouseEnter={playHoverSound}
                  onMouseLeave={stopHoverSound}
                >
                  BEHANDLUNG ANFRAGEN 
                </Button>
              </DialogTrigger>
            </div>
            {/* Hamburger for mobile only */}
            <button
              className="md:hidden ml-4 p-2 rounded focus:outline-none"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              aria-label="Open menu"
            >
              {mobileNavOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
            <DialogContent
              ref={dialogCardRef}
              className="releafz-dialog bg-white/95"
            >
              <div className="mb-1 shrink-0">
                <img
                  src="/logo1.png"
                  alt="reLeafZ"
                  className="h-7 w-auto object-contain sm:h-8"
                />
              </div>
              <DialogHeader className="shrink-0">
                <DialogTitle className="text-base sm:text-lg font-bold" style={{ fontFamily: '"Helvetica Neue", sans-serif' }}>
                  Ihre Adresse eingeben
                </DialogTitle>
                <DialogDescription
                  className="text-xs sm:text-sm text-gray-600"
                  style={{ fontFamily: '"Helvetica Neue", sans-serif' }}
                >
                  Bitte geben Sie Ihre Adresse ein, damit wir die nächste Apotheke für Sie finden können.
                </DialogDescription>
              </DialogHeader>
              <div className="releafz-dialog__body">
                {postcodeDialogSection}
              </div>
              <DialogFooter>
                <Button
                  onClick={handlePostcodeSubmit}
                  disabled={postcodeSubmitDisabled}
                  className="w-full h-12 rounded-lg bg-[#72906F] text-white font-medium py-2.5 hover:bg-[#5f795d] disabled:opacity-50"
                  style={{ fontFamily: '"Helvetica Neue", sans-serif' }}
                >
                  Weiter
                </Button>
              </DialogFooter>
            </DialogContent>
            </Dialog>
            </div>
          </div>
        </div>
      </div>
        
        {/* Mobile Nav Drawer */}
        {mobileNavOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-emerald-200 z-50">
            <nav className="flex flex-col items-center py-6 space-y-6">
              <a
                href="#faq"
                className="text-xl text-black-800 inconsolata"
                onClick={(e) => {
                  e.preventDefault()
                  setMobileNavOpen(false)
                  scrollLandingToAblauf()
                }}
              >
                Ablauf
              </a>
              <a
                href="#partner-apotheken"
                className="text-xl text-black-800 inconsolata"
                onClick={() => setMobileNavOpen(false)}
              >
                Apotheke in Ihrer Nähe
              </a>
              <a href="#faq" className="text-xl text-black-800 inconsolata" onClick={() => setMobileNavOpen(false)}>FAQ</a>
              <a href="#vorteile" className="text-xl text-black-800 inconsolata" onClick={() => setMobileNavOpen(false)}>Vorteile</a>
              <a href="#chat" className="text-xl text-black-800 inconsolata" onClick={() => setMobileNavOpen(false)}>Chat with us!</a>
              <div className="w-full px-4">
                <Button
                  className="behandlung-button2 w-full px-6 py-3 flex items-center justify-center"
                  onClick={() => setDialogOpen(true)}
                  style={{
                    borderTop: `2.5px solid ${landingTheme === 'dark' ? '#fff' : '#000'}`,
                    borderLeft: `2.5px solid ${landingTheme === 'dark' ? '#fff' : '#000'}`,
                    borderRight: `4px solid ${landingTheme === 'dark' ? '#fff' : '#000'}`,
                    borderBottom: `4px solid ${landingTheme === 'dark' ? '#fff' : '#000'}`,
                    borderRadius: '12px',
                  }}
                >
                  BEHANDLUNG ANFRAGEN →
                </Button>
              </div>
            </nav>
          </div>
        )}
    </header>
    </>
  )
}
