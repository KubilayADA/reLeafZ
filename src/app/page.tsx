'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronRight, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import MashallahForm from '@/form/mashallah'
import Header from './header'
import Hero from './hero'
import MobileNavbar from './header/mobile-navbar'
import CookieBanner from '@/components/ui/cookie'
import '@/components/ui/Hero/Words-Sliding-Smooth.css'
import ComingSoon from '@/components/ComingSoon'
import How from '@/components/ui/funktioniert/how'
import PartnerApotheken from '@/components/ui/partnerApotheken/finden'
import { attachLandingBinarySwitch } from '@/lib/scroll'

const COMING_SOON_MODE = true

const inconsolataStyle = {
  fontFamily: '"Inconsolata", monospace',
  fontWeight: 400,
  lineHeight: '35px',
}

const LeafLogo = ({ className = 'w-80 h-40 sm:w-56 sm:h-24 md:w-72 md:h-32' }) => (
  <div className={`relative overflow-hidden ${className}`}>
    <img
      src="/logo1.png"
      alt="reLeafZ Logo"
      className="w-full h-full object-contain"
    />
  </div>
)

const cities = [
  { name: 'Berlin', explanation: 'Mo – So, 09-21 Uhr in fast allen Bezirken\nMo – Fr, 09-19 Uhr in Neukölln, Schöneberg, Sa 9-18Uhr' },
  { name: 'München', explanation: 'Coming soon' },
  { name: 'Hamburg', explanation: 'Coming soon' },
  { name: 'Köln', explanation: 'Coming soon' },
  { name: 'Frankfurt am Main', explanation: 'Coming soon' },
]

export default function LandingPage() {
  const router = useRouter()
  const [openCity, setOpenCity] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [showForm, setShowForm] = useState(false)
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
    if (zipInput.trim() && isValidBerlinPostcode(zipInput)) {
      setDialogOpen(false)
      router.push(`/form?postcode=${zipInput}`)
    }
  }

  const handleBackToMain = () => {
    setShowForm(false)
    setZipInput('')
  }

  if (showForm) {
    return <MashallahForm postcode={zipInput} onBack={handleBackToMain} />
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

          <section id="vorteile" className="py-12 sm:py-16 md:py-24 bg-gradient-to-r-custom section-container">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center md:items-start text-center md:text-left">
              <div className="w-full md:w-1/2 mt-8 md:mt-0 md:pr-12 flex flex-col justify-center">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 md:mb-8 italic bg-gradient-to-r from-green-600 to-purple-600 bg-clip-text text-transparent">
                  TO YOUR DOOR? IN MINUTES.
                </h2>
                <p className="text-sm sm:text-base subtitle-text mb-6">
                  BERLIN in können deine Medikamente in 30-90 minuten geliefert werden, In folgenden Städten ansonsten per DHL in 1-3 Tagen
                </p>
                <div className="mt-6 text-base sm:text-lg subtitle-text">
                  {cities.map(city => (
                    <div key={city.name} className="mb-4 city-dropdown-wrapper">
                      <button
                        type="button"
                        className="w-full text-left text-lg sm:text-xl md:text-2xl tracking-widest bg-gradient-to-r from-green-900 to-purple-800 bg-clip-text text-transparent py-2 px-2 sm:px-4 flex items-center justify-between hover:opacity-80 transition-all duration-200 group cursor-pointer"
                        onClick={() => setOpenCity(openCity === city.name ? null : city.name)}
                      >
                        <span className="italic font-bold">{city.name}</span>
                        <ChevronDown className={`w-5 h-5 text-gray-700 transition-transform duration-300 ${openCity === city.name ? 'rotate-180' : ''}`} />
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openCity === city.name ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="bg-white border border-emerald-200 rounded p-3 sm:p-4 mt-2 subtitle-text whitespace-pre-line text-sm sm:text-base city-dropdown-content">
                          {city.explanation}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-full md:w-1/2 flex gap-x-6 mt-6 md:mt-0">
                <img
                  src="/berlinmap.png"
                  alt="Berlin Service Zones"
                  className="w-full max-w-sm sm:max-w-md rounded-2xl shadow-xl border border-emerald-200"
                  onError={(e) => {
                    e.currentTarget.src = '/map/map-1.png'
                  }}
                />
              </div>
            </div>
          </section>

          <section id="chat" className="py-12 sm:py-16 md:py-24 section-container">
            <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 title-gradient">
                Ready to Transform Your<br className="hidden sm:block" />
                Medical Cannabis Experience?
              </h2>
              <p className="text-lg sm:text-xl subtitle-text mb-8 sm:mb-12 max-w-2xl mx-auto">
                Join thousands of patients who&apos;ve found better care, faster relief, and a supportive community with reLeafZ.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center subtitle-text">
                <Button className="bg-white text-gray-900 hover:bg-gray-50 px-6 sm:px-10 py-4 sm:py-6 rounded-2xl text-base sm:text-lg font-bold shadow-xl hover:shadow-2xl">
                  Start Your Journey Today
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  className="border-2 border-gray-900 text-gray-900 hover:bg-gray-100 px-6 sm:px-10 py-4 sm:py-6 rounded-2xl text-base sm:text-lg font-bold subtitle-text"
                >
                  Speak with Weedo, the best budtender in town
                </Button>
              </div>
              <p className="subtitle-text text-xs sm:text-sm mt-6 sm:mt-8 px-4">
                No commitment required • Speak with licensed doctors • GDPR compliant
              </p>
            </div>
          </section>

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
