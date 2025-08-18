'use client'

import React, { useEffect, useState } from 'react'
import { ArrowRight, ArrowDown, ListCheck, MousePointer, ZapIcon, Sparkles, Brain, Users, Shield, Clock, MapPin, ChevronRight, Star, BikeIcon, LucideBike, Hospital, HospitalIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Font setup - tried a few different ways before settling on this
const barlowStyle = {
  fontFamily: '"Barlow Semi Condensed", sans-serif',
  fontWeight: 700,
  lineHeight: '35px',
}

// Simple leaf thing with emoji cause co-pilot reccommend SVG whic was extremely annoying
const LeafLogo = ({ className = 'w-10 h-10' }) => (
  <div className={`${className} relative overflow-visible`}>
    <img
      src="/logo.png"
      alt="reLeafZ Logo"
      className="absolute top-[85%] left-1/2 w-full h-full object-contain scale-[4.5] -translate-x-1/2 -translate-y-1/2"
      style={{ transformOrigin: 'center' }}
    />
    
  </div>
)

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
  // const [videoPlaying, setVideoPlaying] = useState(false) // might use later

  const reviews = [
    {
      name: 'Sarah M.',
      condition: 'Chronic Pain',
      text: 'Finally found relief in under 90 minutes. The AI recommendations were spot on.'
    },
    {
      name: 'Marcus K.',
      condition: 'Anxiety', 
      text: 'The community support and expert guidance made all the difference in my treatment.'
    },
    {
      name: 'Elena R.',
      condition: 'Insomnia',
      text: 'Fast, reliable, and professionally handled. Best medical cannabis service in Berlin.'
    }
  ]

  // Auto cycle through testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIdx(current => (current + 1) % reviews.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [reviews.length])

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Barlow+Semi+Condensed:wght@700&display=swap');`}</style>
      <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-white to-teal-50" style={barlowStyle}>
      {/* Top nav */}
      <header className="relative z-50 bg-white/80 backdrop-blur-md border-b border-emerald-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
             <div className="flex justify-between items-center py-4">
              <LeafLogo />
            </div>
            <nav className="hidden md:flex flex-1 justify-center items-center space-x-5 mx-auto">
              <a href="#how-it-works" className="text-base md:text-lg text-black-600 leading-relaxed">
                Ablauf
              </a>
              <a href="vorteile" className="text-base md:text-lg text-black-600 leading-relaxed">
                Vorteile
              </a>
              <a href="contact" className="text-base md:text-lg text-black-600 leading-relaxed">
                Contact
              </a>
               <a href="faq" className="text-base md:text-lg text-black-600 leading-relaxed">
                FAQ
              </a>
              </nav>
              <div className="hidden md:block ml-6">
              <Button className="bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-emerald-700 hover:to-teal-800 shadow-lg hover:shadow-xl">
                Get Started
              </Button>
              </div>
            
          </div>
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
              <Sparkles className="w-4 h-4 text-white/90 mr-2" />
              <span className="text-sm font-medium text-white/90">
                AI-Powered, Ultra fast Medical Cannabis Service
              </span>
            </div>

            {/* Main heading */}
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight italic">
              MED. CANNABIS<br />
              <span className="bg-gradient-to-r from-green-600 to-purple-700 bg-clip-text text-transparent">
                - IN MINUTEN GELIEFERT -
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

              ✓ Online Behandlung anfragen<br />
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

      {/* Customer testimonials */}
      <section className="py-24 bg-gradient-to-r from-emerald-100 to-teal-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-16">Real Stories from Real Patients</h2>

          <div className="bg-white rounded-3xl p-12 shadow-2xl border border-emerald-200 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-600 to-teal-700" />

            {/* 5 stars */}
            <div className="flex justify-center mb-6">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className="w-6 h-6 text-yellow-400" />
              ))}
            </div>

            <blockquote className="text-2xl text-gray-800 mb-8 leading-relaxed">
              "{reviews[testimonialIdx].text}"
            </blockquote>

            <div className="text-emerald-700 font-semibold text-lg">{reviews[testimonialIdx].name}</div>
            <div className="text-gray-500">{reviews[testimonialIdx].condition} Patient</div>

            {/* Pagination dots */}
            <div className="flex justify-center mt-8 space-x-2">
              {reviews.map((_, idx) => {
                const isActive = idx === testimonialIdx
                return (
                  <div
                    key={idx}
                    className={`h-3 rounded-full transition-all duration-300 ${
                      isActive ? 'bg-emerald-600 w-8' : 'bg-gray-300 w-3'
                    }`}
                  />
                )
              })}
            </div>
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