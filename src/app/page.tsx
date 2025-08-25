'use client'

import React, { useEffect, useState } from 'react'
import { ArrowRight, ArrowDown, ListCheck, MousePointer, ZapIcon, Sparkles, Brain, Users, Shield, Clock, MapPin, ChevronRight, Star, BikeIcon, LucideBike, Hospital, HospitalIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react' 

// Font setup - tried a few different ways before settling on this
const barlowStyle = {
  fontFamily: '"Barlow Semi Condensed", sans-serif',
  fontWeight: 700,
  lineHeight: '35px',
}

// logo
const LeafLogo = ({ className = 'w-80 h-40 sm:w-56 sm:h-24 md:w-72 md:h-32' }) => (
  <div className={`relative overflow-hidden ${className}`}>
    <img
      src="/logo.png"
      alt="reLeafZ Logo"
      className="w-full h-full object-contain"
    />
  </div>
)
  const cities = [
    { name: "Berlin", explanation: "Mo – So, 09-21 Uhr in fast allen Bezirken\nMo – Fr, 09-19 Uhr in Neukölln, Schöneberg, Sa 9-18Uhr" },
    { name: "München", explanation: "Coming soon" },
    { name: "Hamburg", explanation: "Coming soon" },
    { name: "Köln", explanation: "Coming soon" },
    { name: "Frankfurt am Main", explanation: "Coming soon" }
  ];
  

// Fun monkey easter egg - for now I like it lol
const FloatingMonkey = () => {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => setShow(prev => !prev), 8000)
    return () => clearInterval(timer)
  }, [])

  if (!show) return null

  return (
    <div className="fixed bottom-8 right-8 z-40 transition-opacity duration-1000">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-emerald-200 max-w-xs">
        <div className="flex items-center space-x-4">
          <div className="text-4xl transform rotate-12">🐒💨</div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-emerald-700 mb-1">Feeling Relaxed?</div>
            <div className="text-xs text-gray-600">Luna found the perfect strain for your sleep schedule</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LandingPage() {
  const [testimonialIdx, setTestimonialIdx] = useState(0)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [openCity, setOpenCity] = useState<string | null>(null)
  // const [videoPlaying, setVideoPlaying] = useState(false) // might use later

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Barlow+Semi+Condensed:wght@700&display=swap');`}</style>
      <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-white to-teal-50" style={barlowStyle}>
      {/* Top nav */}
      
      <header className="relative z-50 bg-white/70 backdrop-blur-md border-b border-emerald-200 h-20">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20">
    <div className="flex justify-between items-center h-20">
      {/* Logo geniş, navbar sabit yükseklikte */}
      <div className="flex items-center h-20 overflow-visible">
        <LeafLogo className="w-40 h-52 transform translate-y-4" />
      </div>
      {/* Desktop Nav */}
      <nav className="hidden md:flex flex-1 justify-center items-center space-x-5 mx-auto">
        <a href="#ablauf" className="text-lg md:text-2xl text-black-600 leading-relaxed">Ablauf</a>
        <a href="vorteile" className="text-lg md:text-2xl text-black-600 leading-relaxed">Vorteile</a>
        <a href="contact" className="text-lg md:text-2xl text-black-600 leading-relaxed">Contact</a>
        <a href="faq" className="text-lg md:text-2xl text-black-600 leading-relaxed">FAQ</a>
      </nav>
      {/* Desktop Button */}
      <div className="hidden md:block ml-6">
        <Button className="text-lg md:text-xl bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-emerald-700 hover:to-teal-800 shadow-lg hover:shadow-xl">
          Get Started
        </Button>
      </div>
      {/* Hamburger for mobile */}
      <button
        className="md:hidden ml-4 p-2 rounded focus:outline-none"
        onClick={() => setMobileNavOpen(!mobileNavOpen)}
        aria-label="Open menu"
      >
        {mobileNavOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
      </button>
    </div>
    {/* Mobile Nav Drawer */}
    {mobileNavOpen && (
      <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-emerald-200 z-50">
        <nav className="flex flex-col items-center py-4 space-y-4">
          <a href="#ablauf" className="text-xl text-black-600" onClick={() => setMobileNavOpen(false)}>Ablauf</a>
          <a href="vorteile" className="text-xl text-black-600" onClick={() => setMobileNavOpen(false)}>Vorteile</a>
          <a href="contact" className="text-xl text-black-600" onClick={() => setMobileNavOpen(false)}>Contact</a>
          <a href="faq" className="text-xl text-black-600" onClick={() => setMobileNavOpen(false)}>FAQ</a>
          <Button className="w-full mt-2 bg-gradient-to-r from-green-600 to-green-700 text-white text-lg">
            Get Started
          </Button>
        </nav>
      </div>
    )}
  </div>
</header>

      {/* Main hero area */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-40 left-20 w-72 h-72 bg-emerald-300/40 rounded-full blur-3xl" />
          <div className="absolute top-60 right-20 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-emerald-200/35 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-purple-600 bg-opacity-70 backdrop-blur-sm rounded-full border border-emerald-300 mb-8">
              <Sparkles className="w-4 h-4 text-white/90 mr-5" />
              <span className="text-sm font-medium text-white/90">
                AI-Powered, Ultra fast Medical Cannabis Service
              </span>
            </div>

            {/* Main heading */}
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-5 leading-tight italic ">
              MED. CANNABIS<br />
              <span className="bg-gradient-to-r from-green-600 to-purple-700 bg-clip-text text-transparent inline-block italic px-2">
              IN MINUTEN GELIEFERT
            </span><br />
              <span className="relative">
                in Berlin
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full" />
              </span>
            </h1>

            {/* - messy HTML */}
            <div className="text-base md:text-lg text-gray-600 mb-6 max-w-4xl mx-auto leading-relaxed">
              Lieferung in 30-90 Minuten in Berlin.<br />
              Abholung in 15 minuten in Berlin<br />
              Ganz Deutschland in 1-2 Tagen<br /><br />

              ✓ Blüten ab 4,99€*<br />
              ✓ Rezept digital austellen lassen<br />
              ✓ Medikamente aus der Apotheke abholen oder liefern lassen<br />
            </div>

            {/* CTA button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-6 rounded-2xl text-lg font-semibold hover:from-emerald-700 hover:to-teal-800 shadow-xl hover:shadow-2xl">
                Rezept anfragen
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center">
                <Shield className="w-5 h-5 text-emerald-600 mr-2" />
                GDPR Compliant
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-emerald-600 mr-2" />
                Licensed Doctors
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-emerald-600 mr-2" />
                Berlin Pharmacies
              </div>
            </div>
          </div>
        </div>
        <img
          src="/payy.png"
          alt="Payy"
          className="absolute bottom-10 left-1/2 -translate-x-1/2 w-90 h-10 opacity-80"
          style={{ zIndex: 10 }}
        />
      </section>

      {/* How it works section */}
      <section className="py-24 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-6xl font-bold text-gray-900 mb-4 italic">Cannabis-Patient werden</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto italic">
              Jetzt loslegen und Cannabis auf Rezept blitzschnell erhalten.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 - removed all the fancy hover stuff, was too much */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <ListCheck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4 italic">Online Anfrage stellen</h3>
              <p className="text-xl text-gray-600 italic">
                Fülle unseren medizinischen Fragebogen aus – easy von der Couch aus.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Hospital className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4 italic">Ärztliche Behandlung erhalten</h3>
              <p className="text-xl text-gray-600 italic">
                Ein Arzt prüft deine Angaben und stellt dir bei Eignung ein Rezept aus.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-800 rounded-2xl flex items-center justify-center mb-6 mx-auto ">
                <LucideBike className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4 italic">Expresslieferung erhalten</h3>
              <p className="text-xl text-gray-600 mb-4 italic">
                Medikamente in Berlin in max. 90 Min. geliefert oder in 15–30 Min. selbst in der Apotheke abholen.
              </p>
              <div className="text-emerald-700 font-semibold italic">Powered by Wolt & Uber →</div>
            </div>
          </div>
        </div>
      </section>

     <section className="py-24 bg-gradient-to-r from-emerald-100 to-teal-100">
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center md:items-start text-center md:text-left">
    {/* city descr. on the lef */}
    <div className="w-full md:w-1/2 mt-8 md:mt-0 md:pr-12 flex flex-col justify-center">
    <h2 className="text-5xl font-bold mb-8 italic bg-gradient-to-r from-green-600 to-purple-600 bg-clip-text text-transparent">
      TO YOUR DOOR? IN MINUTES. </h2>
    <p className="text-light text-gray-500">BERLIN in können deine Medikamente in 30-90 minuten geliefert werden, In folgenden Städten ansonsten per DHL in 1-3 Tagen 
    </p>

    
    <div className="mt-6 text-lg text-gray-700">
        {cities.map(city => (
                <div key={city.name} className="mb-4">
                  <button
                  className="w-full text-left text-2xl tracking-widest bg-gradient-to-r from-green-900 to-purple-800 bg-clip-text text-transparent py-2 px-4 italic-bold"
                  onClick={() => setOpenCity(openCity === city.name ? null : city.name)}
                  >
                    {city.name}
                  </button>
                  {openCity === city.name && (
                    <div className="bg-white border border-emerald-200 rounded p-4 mt-2 text-gray-700 whitespace-pre-line">
                      {city.explanation}
                    </div>
                  )}
                </div>
        ))}
      </div>
    </div>
    {/* Map on the right, half width */}
    <div className="w-full md:w-1/2 flex  gap-x-6">
      <img
        src="/berlinmap.png"
        alt="Berlin Service Zones"
        className="w-full max-w-md rounded-2xl shadow-xl border border-emerald-200"
      />
    </div>
  </div>
</section>

      {/* Bottom CTA section */}
      <section className="py-24 bg-gradient-to-br from-emerald-700 to-teal-800 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl font-bold mb-6">
            Ready to Transform Your<br />Medical Cannabis Experience? .
          </h2>
          <p className="text-xl text-emerald-100 mb-12 max-w-2xl mx-auto">
            Join thousands of patients who've found better care, faster relief, and a supportive community with reLeafZ.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button className="bg-white text-emerald-700 hover:bg-gray-50 px-10 py-6 rounded-2xl text-lg font-bold shadow-xl hover:shadow-2xl">
              Start Your Journey Today
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              className="border-2 border-white/30 text-white hover:border-white hover:bg-white/10 px-10 py-6 rounded-2xl text-lg font-bold"
            >
              Speak with Luna
            </Button>
          </div>

          <p className="text-emerald-200 text-sm mt-8">
            No commitment required • Speak with licensed doctors • GDPR compliant
          </p>
        </div>
      </section>

      {/* Footer stuff */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Company info */}
            <div>
              <div className="flex items-center space-x-3 mb-15">
                <LeafLogo />
                
              </div>
              <p className="text-gray-400 mb-4">
                Germany's fastest, safest, and coolest medical cannabis platform.
              </p>
            </div>

            {/* Patient links */}
            <div>
              <h4 className="font-bold mb-4">For Patients</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">How it Works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Strain Library</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Treatment Tracking</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>

            {/* Professional links */}
            <div>
              <h4 className="font-bold mb-4">For Professionals</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">For Doctors</a></li>
                <li><a href="#" className="hover:text-white transition-colors">For Pharmacies</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Partner with Us</a></li>
              </ul>
            </div>

            {/* Legal stuff */}
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
            <p>© 2025 reLeafZ. All rights reserved. Licensed medical cannabis platform serving Berlin.</p>
          </div>
        </div>
      </footer>

      <FloatingMonkey />
      </div>
    </>
  )
}