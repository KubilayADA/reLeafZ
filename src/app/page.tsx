'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from './header'
import Hero, { MobileHero } from './hero'
import MobileNavbar from './header/mobile-navbar'
import CookieBanner from '@/components/ui/cookie'
import '@/components/ui/Hero/Words-Sliding-Smooth.css'
import ComingSoon from '@/components/ComingSoon'
import How from '@/components/ui/funktioniert/how'
import PartnerApotheken from '@/components/ui/partnerApotheken/finden'
import Footer from '@/components/ui/footer/footer'
import { attachLandingBinarySwitch } from '@/lib/scroll'

const COMING_SOON_MODE = false

const inconsolataStyle = {
  fontFamily: '"Inconsolata", monospace',
  fontWeight: 400,
  lineHeight: '35px',
}

export default function LandingPage() {
  const router = useRouter()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [showHeader, setShowHeader] = useState(false)
  const [zipInput, setZipInput] = useState('')
  const LANDING_THEME_STORAGE_KEY = 'releafz-landing-theme'
  const [landingTheme, setLandingTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window === 'undefined') return 'light'
    const storedTheme = window.localStorage.getItem(LANDING_THEME_STORAGE_KEY)
    if (storedTheme === 'dark' || storedTheme === 'light') return storedTheme
    return 'light'
  })

  useEffect(() => {
    const updateHeaderVisibility = () => {
      const landingMain = document.getElementById('landing-main')
      const mainTop = landingMain?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY
      setShowHeader(mainTop <= 80)
    }

    updateHeaderVisibility()
    window.addEventListener('scroll', updateHeaderVisibility, { passive: true })
    window.addEventListener('resize', updateHeaderVisibility)

    return () => {
      window.removeEventListener('scroll', updateHeaderVisibility)
      window.removeEventListener('resize', updateHeaderVisibility)
    }
  }, [])

  useEffect(() => {
    return attachLandingBinarySwitch()
  }, [])

  useEffect(() => {
    window.localStorage.setItem(LANDING_THEME_STORAGE_KEY, landingTheme)
  }, [landingTheme])

  if (COMING_SOON_MODE) {
    return <ComingSoon />
  }

  const isValidBerlinPostcode = (postcode: string) => {
    const zip = parseInt(postcode, 10)
    return zip >= 10115 && zip <= 14199
  }

  const handlePostcodeSubmit = () => {
    const safePostcode = zipInput.trim().replace(/\D/g, '')
    if (!safePostcode || !isValidBerlinPostcode(safePostcode)) return

    setDialogOpen(false)
    router.push(
      `/form?postcode=${safePostcode}&street=${encodeURIComponent('Unbekannt')}&houseNumber=${encodeURIComponent('1')}&city=${encodeURIComponent('Berlin')}`
    )
  }

  return (
    <>
      <CookieBanner />
      <div className="landing-page landing-snap-scroll min-h-screen bg-beige inconsolata" style={inconsolataStyle}>
        <Header
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          zipInput={zipInput}
          setZipInput={setZipInput}
          handlePostcodeSubmit={handlePostcodeSubmit}
          isValidBerlinPostcode={isValidBerlinPostcode}
          isVisible={showHeader}
          landingTheme={landingTheme}
          onThemeToggle={() => setLandingTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
        />
        <MobileNavbar
          setDialogOpen={setDialogOpen}
          landingTheme={landingTheme}
          onThemeToggle={() => setLandingTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
        />

        <Hero
          setDialogOpen={setDialogOpen}
          landingTheme={landingTheme}
          onScrollToAblauf={() => {
            const landingMain = document.getElementById('landing-main')
            const mainTop =
              landingMain?.getBoundingClientRect().top != null
                ? landingMain.getBoundingClientRect().top + window.scrollY
                : window.innerHeight
            window.scrollTo({ top: mainTop, behavior: 'smooth' })
          }}
        />

        <div className="landing-hero-snap-target" aria-hidden />
        <div
          id="landing-main"
          className="landing-main landing-snap-target"
          data-theme={landingTheme}
        >

          <MobileHero setDialogOpen={setDialogOpen} />
          <PartnerApotheken />
          <How landingTheme={landingTheme} />

          <Footer />
        </div>
      </div>
    </>
  )
}
