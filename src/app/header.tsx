'use client'

import React, { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, Moon, Sun, X } from 'lucide-react'
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
  dialogFieldFocused,
  isVisible,
  landingTheme,
  onThemeToggle,
}: HeaderProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const dialogCardRef = useRef<HTMLDivElement | null>(null)
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
      
      <div className="header-row-wrap relative w-full h-[84px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between items-center h-full">
            {/* Logo geniş, navbar sabit yükseklikte - your turkish is not friendly to me*/}
            <button
              type="button"
              className="flex items-center h-full overflow-visible"
              onClick={() => {
                scrollToLandingTop()
              }}
              aria-label="Zurück zum Seitenanfang"
            >
              <LeafLogo className="w-45 h-52 transform translate-y-0" />
            </button>
            
            {/* Desktop Nav */}
            <div className="header-center-controls hidden md:flex">
              <nav className="header-desktop-nav header-text w-full justify-center">
                <a href="#partner-apotheken" className="header-nav-link text-mg md:text-xl leading-relaxed">Apotheke in Ihrer Nähe</a>
                <a
                  href="#ablauf"
                  className="header-nav-link text-mg md:text-xl leading-relaxed"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollLandingToAblauf()
                  }}
                >
                  Ablauf
                </a>
                <a href="#chat" className="header-nav-link text-lg md:text-xl leading-relaxed">Chat with us!</a>
              </nav>

              <button
                type="button"
                onClick={onThemeToggle}
                className={`header-theme-icon-toggle ${landingTheme === 'light' ? 'is-light' : ''}`}
                aria-pressed={landingTheme === 'light'}
                aria-label={`Switch to ${landingTheme === 'dark' ? 'light' : 'dark'} mode`}
              >
                <Moon className={`header-theme-icon ${landingTheme === 'dark' ? 'is-active' : ''}`} size={15} />
                <Sun className={`header-theme-icon ${landingTheme === 'light' ? 'is-active' : ''}`} size={15} />
              </button>
            </div>
            
            {/* Desktop Button - Hidden on mobile, only in hamburger menu wish i believe is better let me know if you see this UwUwuu*/}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <div className="hidden lg:block text-black lg:mr-[-8px]">
              <DialogTrigger asChild>
                <Button
                  className="header-button lg:!ml-0 !font-bold"
                  variant={landingTheme === 'dark' ? 'button2' : undefined}
                  style={
                    landingTheme === 'dark'
                      ? ({
                          minHeight: '54px',
                          paddingTop: '0.7rem',
                          paddingBottom: '0.7rem',
                          borderTop: '2.5px solid #333',
                          borderLeft: '2.5px solid #333',
                          borderRight: '4px solid #333',
                          borderBottom: '4px solid #333',
                          borderRadius: '12px',
                        } as React.CSSProperties)
                      : ({
                          background: '#ffffff',
                          color: '#0f172a',
                          minHeight: '54px',
                          paddingTop: '0.7rem',
                          paddingBottom: '0.7rem',
                          borderTop: '2.5px solid #333',
                          borderLeft: '2.5px solid #333',
                          borderRight: '4px solid #333',
                          borderBottom: '4px solid #333',
                          borderRadius: '12px',
                        } as React.CSSProperties)
                  }
                  onMouseEnter={playHoverSound}
                  onMouseLeave={stopHoverSound}
                >
                  BEHANDLUNG ANFRAGEN 
                </Button>
              </DialogTrigger>
            </div>
            {/* Hamburger for mobile and tablet */}
            <button
              className="lg:hidden ml-4 p-2 rounded focus:outline-none"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              aria-label="Open menu"
            >
              {mobileNavOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
            <DialogContent
              ref={dialogCardRef}
              className={`left-1/2 -translate-x-1/2 w-[calc(100vw-1.5rem)] max-w-[24rem] max-h-[calc(100dvh-1.5rem)] overflow-y-auto rounded-xl bg-white/95 p-3 border-0 transition-[top,transform] duration-300 ${
                dialogFieldFocused
                  ? 'top-[max(0.75rem,env(safe-area-inset-top))] translate-y-0'
                  : 'top-1/2 -translate-y-1/2'
              } sm:top-[50%] sm:max-h-none sm:-translate-y-1/2 sm:p-4`}
              style={{
                borderTop: '2.5px solid #333',
                borderLeft: '2.5px solid #333',
                borderRight: '4px solid #333',
                borderBottom: '4px solid #333',
              }}
            >
              <div className="mb-1">
                <img
                  src="/logo1.png"
                  alt="reLeafZ"
                  className="h-7 w-auto object-contain sm:h-8"
                />
              </div>
              <DialogHeader>
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
              {postcodeDialogSection}
              <DialogFooter>
                <Button
                  onClick={handlePostcodeSubmit}
                  disabled={postcodeSubmitDisabled}
                  className="w-full h-10 sm:h-11 rounded-lg bg-[#72906F] text-white font-medium py-2.5 hover:bg-[#5f795d] disabled:opacity-50"
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
        
        {/* Mobile Nav Drawer */}
        {mobileNavOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-emerald-200 z-50">
            <nav className="flex flex-col items-center py-6 space-y-6">
              <a
                href="#ablauf"
                className="text-xl text-black-800 inconsolata"
                onClick={(e) => {
                  e.preventDefault()
                  setMobileNavOpen(false)
                  scrollLandingToAblauf()
                }}
              >
                Ablauf
              </a>
              <a href="#partner-apotheken" className="text-xl text-black-800 inconsolata" onClick={() => setMobileNavOpen(false)}>Apotheke in Ihrer Nähe</a>
              <a href="#vorteile" className="text-xl text-black-800 inconsolata" onClick={() => setMobileNavOpen(false)}>Vorteile</a>
              <a href="#chat" className="text-xl text-black-800 inconsolata" onClick={() => setMobileNavOpen(false)}>Chat with us!</a>
              <div className="w-full px-4">
                <Button
                  className="behandlung-button2 w-full px-6 py-3 flex items-center justify-center"
                  onClick={() => setDialogOpen(true)}
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
