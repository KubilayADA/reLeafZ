'use client'

import React from 'react'
import { Check, Shield, Clock, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import words from '@/constants/index'
import { scrollToLandingTop } from '@/lib/scroll'

interface HeroProps {
  setDialogOpen: (open: boolean) => void
  /** Scroll to #ablauf; parent may sync URL with pushState (no overflow lock). */
  onScrollToAblauf: () => void
}

export default function Hero({
  setDialogOpen,
  onScrollToAblauf,
}: HeroProps) {
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
      {/* Background — no hit target so wheel/touch scrolls the page to the next section */}
      <div className="pointer-events-none absolute inset-0 w-full overflow-hidden">
         <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/bubble-explose.mov"
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

      {/* Full-hero tap/click target to advance to next section */}
      <button
        type="button"
        aria-label="Go to next section"
        className="pointer-events-auto absolute inset-0 z-[1] bg-transparent"
        onClick={onScrollToAblauf}
      />

      {/* reLeafZ logo — top left (back to hero) */}
      <a
        href="#hero"
        className="pointer-events-auto absolute top-5 left-1/2 -translate-x-1/2 sm:left-8 sm:translate-x-0 sm:top-8 md:top-12 md:left-14 md:scale-150 z-10 flex items-center gap-2 no-underline text-inherit hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.preventDefault()
          scrollToLandingTop()
        }}
      >
        {/* <img
          src="/logo2.png"
          alt="reLeafZ Logo"
          className="logo-hero"
        /> */}
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
        <span className="hero-scroll-cta-text">Tap anywhere or click to go to the next section</span>
      </a>

      {/* `pointer-events-none` so wheel/touch reaches `.hero-scroll-spacer` under the fixed hero; only interactive chunks use `pointer-events-auto`. */}
      <div className="pointer-events-none relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 overflow-visible w-full">
        <div className="text-center overflow-visible w-full max-w-full">
          <div className="lg:-ml-[94px] lg:mr-auto lg:w-full lg:max-w-[980px]">
            <img
              src="/payy.png"
              alt="payy"
              className="w-88 h-10 object-contain mx-auto lg:mx-0 mt-8 lg:mt-12 mb-0"
            />
            {/* Main heading */}
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

          {/* CTA: button above, then text+arrow block below */}
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

            {/* Trust badges */}
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

          {/* <div className="subtitle-text-hero -mt-8">
            Lieferung in 30-90 Minuten in Berlin<br />
            Ganz Deutschland in 1-2 Tagen<br /><br />
          </div> */}
            </div>
          </div>
        </div>
    </section>
  )
}

