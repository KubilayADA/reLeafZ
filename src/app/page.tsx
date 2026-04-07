'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from './header'
import Hero from './hero'
import MobileNavbar from './header/mobile-navbar'
import CookieBanner from '@/components/ui/cookie'
import '@/components/ui/Hero/Words-Sliding-Smooth.css'
import ComingSoon from '@/components/ComingSoon'
import How from '@/components/ui/funktioniert/how'
import PartnerApotheken from '@/components/ui/partnerApotheken/finden'
import { attachLandingBinarySwitch } from '@/lib/scroll'

const COMING_SOON_MODE = false

const inconsolataStyle = {
  fontFamily: '"Inconsolata", monospace',
  fontWeight: 400,
  lineHeight: '35px',
}

const LeafLogo = ({ className = 'w-80 h-40 sm:w-56 sm:h-24 md:w-72 md:h-32' }) => (
  <div className={`relative overflow-hidden ${className}`}>
    <img
      src="/logo2.png"
      alt="reLeafZ Logo"
      className="w-full h-full object-contain"
    />
  </div>
)

export default function LandingPage() {
  const router = useRouter()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [showHeader, setShowHeader] = useState(false)
  const [zipInput, setZipInput] = useState('')

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
        />
        <MobileNavbar
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          zipInput={zipInput}
          setZipInput={setZipInput}
          handlePostcodeSubmit={handlePostcodeSubmit}
          isValidBerlinPostcode={isValidBerlinPostcode}
        />

        <Hero
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          zipInput={zipInput}
          setZipInput={setZipInput}
          handlePostcodeSubmit={handlePostcodeSubmit}
          isValidBerlinPostcode={isValidBerlinPostcode}
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
        <div id="landing-main" className="landing-main landing-snap-target">
          <How />
          <PartnerApotheken />

          <footer className="bg-gray-900 text-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid md:grid-cols-4 gap-8">
                <div>
                  <div className="flex items-center space-x-3 mb-15">
                    <LeafLogo />
                  </div>
                  <p className="text-gray-400 mb-4 subtitle-text">
                    Germany&apos;s fastest, safest, and coolest medical cannabis platform.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold mb-4">For Patients</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li><a href="#" className="hover:text-white transition-colors">How it Works</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Strain Library</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Treatment Tracking</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-4">For Professionals</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li><a href="#" className="hover:text-white transition-colors">For Doctors</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">For Pharmacies</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Partner with Us</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-4">Legal & Support</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">GDPR Compliance</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
                <p>© 2026 reLeafZ. All rights reserved. Licensed medical cannabis platform serving Berlin.</p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  )
}
