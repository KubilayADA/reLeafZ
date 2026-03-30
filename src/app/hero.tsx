'use client'

import React from 'react'
import { ChevronRight, Shield, Clock, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import words from '@/constants/index'
import { scrollToLandingTop } from '@/lib/scroll'

interface HeroProps {
  dialogOpen: boolean
  setDialogOpen: (open: boolean) => void
  zipInput: string
  setZipInput: (value: string) => void
  handlePostcodeSubmit: () => void
  isValidBerlinPostcode: (postcode: string) => boolean
  /** Scroll to #ablauf; parent may sync URL with pushState (no overflow lock). */
  onScrollToAblauf: () => void
}

export default function Hero({
  dialogOpen,
  setDialogOpen,
  zipInput,
  setZipInput,
  handlePostcodeSubmit,
  isValidBerlinPostcode,
  onScrollToAblauf,
}: HeroProps) {
  return (
    <section
      id="hero"
      className="hero-section hero-section--fixed pointer-events-none fixed inset-0 z-0 flex w-full min-h-[100dvh] flex-col overflow-hidden pt-16 pb-28 sm:pt-20 sm:pb-32"
    >
      {/* Background — no hit target so wheel/touch scrolls the page to the next section */}
      <div className="pointer-events-none absolute inset-0 w-full overflow-hidden">
         <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/hero-vibe.mp4"
          preload="auto"
          autoPlay
          muted
          loop
          playsInline
        /> 

        {/* idée mettre map et faire pop des petit leaf the cannabis on the map as a neuro link  */}
    
        {/* <img src="/map/map-1.png" alt="hero-ma" className="absolute inset-0 w-full h-full object-cover" /> */}
        
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* reLeafZ logo — top left (back to hero) */}
      <a
        href="#hero"
        className="pointer-events-auto absolute top-5 left-1/2 -translate-x-1/2 sm:left-8 sm:translate-x-0 sm:top-8 md:top-12 md:left-14 md:scale-150 z-10 flex items-center gap-2 no-underline text-inherit hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.preventDefault()
          scrollToLandingTop()
        }}
      >
        <img
          src="/logo2.png"
          alt="reLeafZ Logo"
          className="logo-hero"
        />
      </a>

      {/* CTA: go to next view */}
      <a
        href="#ablauf"
        className="hero-scroll-cta pointer-events-auto"
        onClick={(e) => {
          e.preventDefault()
          onScrollToAblauf()
        }}
      >
        <span className="hero-scroll-cta-text">Entdecke wie es funktioniert</span>
        <div className="hero-scroll-cta-icon" aria-hidden>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </a>

      {/* `pointer-events-none` so wheel/touch reaches `.hero-scroll-spacer` under the fixed hero; only interactive chunks use `pointer-events-auto`. */}
      <div className="pointer-events-none relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 overflow-visible w-full">
        <div className="text-center overflow-visible w-full max-w-full">
          {/* Main heading */}
          <h1 className="title-gradient-hero">
            MEDIZINAL CANNABIS
          </h1>
          <div className="animated-words-container">
            <div className="words-wrapper">
              {words.map((word, index) => (
                <div
                  key={index}
                  className="word-item text-base sm:text-5xl md:text-7xl font-bold title-gradient-hero leading-tight italic"
                >
                  {word}
                </div>
              ))}
            </div>
          </div>

          {/* <div className="subtitle-text-hero">
            Lieferung in 30-90 Minuten in Berlin<br />
            Ganz Deutschland in 1-2 Tagen<br /><br />
          </div> */}

          {/* Trust badges */}
          {/* <div className="trust-badges">
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
          </div> */}

          {/* payy png */}

          {/* <img src="/payy.png" alt="payy" className="w-88 h-10 object-contain mx-auto mb-4 sm:mb-6 md:mb-10" /> */}

          {/* CTA: button above, then text+arrow block below */}
          <div className="hero-cta-wrap">
            <div className="hero-cta-center pointer-events-auto">
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="behandlung-button-hero px-5 py-2 sm:px-7 sm:py-2.5 md:scale-125 lg:scale-150 md:px-8 md:py-3 flex items-center justify-center min-w-44 sm:min-w-56 md:min-w-64 w-auto"
                  >
                    BEHANDLUNG ANFRAGEN
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="inconsolata text-xl font-bold">Postleitzahl eingeben</DialogTitle>
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
                      className={`w-full inconsolata text-white font-medium py-3 ${
                        !zipInput.trim() || !isValidBerlinPostcode(zipInput)
                          ? 'opacity-50 cursor-not-allowed bg-gray-400'
                          : 'animated-button'
                      }`}
                    >
                      Weiter
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Trust badges */}
          <div className="trust-badges">
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

          <div className="subtitle-text-hero">
            Lieferung in 30-90 Minuten in Berlin<br />
            Ganz Deutschland in 1-2 Tagen<br /><br />
          </div>

            <div className="hero-cta-text-block">
              <span className="hero-cta-text">Weißt du schon was du willst? Worauf wartest du noch ;)</span>
            </div>
            <div className="hero-cta-arrow-block">
              <img
                src="/arrow-down.png"
                alt=""
                className="w-15 h-15 object-contain drop-shadow-md"
                style={{ transform: 'rotate(75deg)' }}
                aria-hidden
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

