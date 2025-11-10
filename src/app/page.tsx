'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, ArrowDown, ListCheck, MousePointer, ZapIcon, Sparkles, Brain, Users, Shield, Clock, MapPin, ChevronRight, ChevronDown, Star, BikeIcon, LucideBike, Hospital, HospitalIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import MashallahForm from '@/form/mashallah'
import words from '@/constants/index'
import Header from './header'
import '@/components/ui/Hero/Words-Sliding-Smooth.css' 
import ComingSoon from '@/components/ComingSoon'  

const COMING_SOON_MODE = true;

// Font setup - using Inconsolata
const inconsolataStyle = {
  fontFamily: '"Inconsolata", monospace',
  fontWeight: 400,
  lineHeight: '35px',
}

// logo component for footer
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
  const [show, setShow] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setShow(true)
    const timer = setInterval(() => setShow(prev => !prev), 8000)
    return () => clearInterval(timer)
  }, [])

  if (!mounted || !show) return null

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
  const [openCity, setOpenCity] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [showForm, setShowForm] = useState(false)
  // --- Begin zip code state and form state ---
  const [zipEntered, setZipEntered] = useState(false);
  const [zipInput, setZipInput] = useState('');
  const [formData, setFormData] = useState({
    zip: '',
    fullName: '',
    email: '',
    phone: '',
    city: '',
    symptoms: '',
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Berlin postcode validation (10115-14199)
  const isValidBerlinPostcode = (postcode: string) => {
    const zip = parseInt(postcode);
    return zip >= 10115 && zip <= 14199;
  };
  
  const handlePostcodeSubmit = () => {
    if (zipInput.trim() && isValidBerlinPostcode(zipInput)) {
      setFormData(prev => ({ ...prev, zip: zipInput }));
      setDialogOpen(false);
      // Valid Berlin postcode - navigate to form page
      router.push(`/form?postcode=${zipInput}`);
    }
  };
  
  const handleBackToMain = () => {
    setShowForm(false);
    setZipInput('');
    setFormData(prev => ({ ...prev, zip: '' }));
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Add this at the top of the file
      const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
      const response = await fetch(`${API_BASE}/api/treatment/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Request submitted successfully!');
        console.log(result.data); // optional
        // Reset form
        setFormData({
          zip: '',
          fullName: '',
          email: '',
          phone: '',
          city: '',
          symptoms: '',
        });
        setZipEntered(false);
        setZipInput('');
      } else {
        alert(result.message || 'Submission failed.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred.');
    }
  };
  // --- End zip code state and form state ---
  
  // Show form if valid Berlin postcode was entered
  if (showForm) {
    return <MashallahForm postcode={zipInput} onBack={handleBackToMain} />
  }
  
  return (
    <>
      <div className="min-h-screen inconsolata" style={inconsolataStyle}>
      {/* Header */}
      <Header 
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        zipInput={zipInput}
        setZipInput={setZipInput}
        handlePostcodeSubmit={handlePostcodeSubmit}
        isValidBerlinPostcode={isValidBerlinPostcode}
      />

      {/* Main hero area */}
      <section className="relative pt-20 pb-32 overflow-hidden"
      
      >
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          {/* <div className="absolute top-40 left-20 w-72 h-72 bg-purple-500/40 -full blur-3xl" />
          <div className="absolute top-60 right-20 w-96 h-96 bg-green-500/30 -full blur-3xl" />
          <div className="absolute bottom-20 left-1/2 w-90 h-80 bg-green-600/35 -full blur-3xl" /> */}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r-custom mb-8">
              <Sparkles className="w-4 h-4 mr-5" />
              <span className="text-sm font-medium subtitle-text">
                AI-Powered, Ultra fast Medical Cannabis Service
              </span>
            </div>

            {/* Main heading */}
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold title-gradient mb-5 leading-tight italic">
              MEDIZINAL CANNABIS
            </h1>
            <div className="animated-words-container">
                <div className="words-wrapper">
                    {words.map((word, index) => (
                        <div 
                            key={index} 
                            className="word-item text-3xl sm:text-5xl md:text-7xl font-bold title-gradient leading-tight italic"
                        >
                            {word}
                        </div>
                    ))}
                </div>
            </div>

            {/* - messy HTML */}
            <div className="text-sm sm:text-base md:text-lg subtitle-text inconsolata mb-6 max-w-4xl mx-auto leading-relaxed px-4">
              BER | HAM | MUC | COL | DUS | FFM <br />Lieferung in 30-90 Minuten in Berlin<br />
              Ganz Deutschland in 1-2 Tagen<br /><br />
              </div>
            <div className="text-sm sm:text-base md:text-lg subtitle-text inconsolata mb-6 max-w-4xl mx-auto leading-relaxed font-thin px-4">
              ✓ Blüten ab 4,99€*<br />
              ✓ Rezept digital austellen lassen<br />
              ✓ Medikamente aus der Apotheke abholen oder liefern lassen<br />
            </div>

            {/* CTA button - Visible on all devices */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="behandlung-button px-8 py-3 flex items-center justify-center min-w-64 w-auto"
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
                      className="w-full btn-primary font-medium py-3"
                    >
                      Weiter
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* --- Zip code entry & form conditional rendering --- */}
            {/* COMMENTED OUT - Survey/Form Elements
            {zipEntered && !formData.zip && (
              <div className="max-w-md mx-auto mt-6 bg-white p-4 shadow rounded">
                <input
                  type="text"
                  name="zip"
                  placeholder="Enter your ZIP code"
                  value={zipInput}
                  onChange={(e) => setZipInput(e.target.value)}
                  className="w-full p-2 border rounded"
                />
                <button
                  onClick={() => {
                    if (zipInput.trim()) {
                      setFormData(prev => ({ ...prev, zip: zipInput }));
                    }
                  }}
                  className="mt-2 bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
                >
                  Continue
                </button>
              </div>
            )}
            {zipEntered && formData.zip && (
              <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded shadow-md space-y-4 mt-4">
                <input type="text" name="fullName" placeholder="Full Name" onChange={handleChange} required className="w-full p-2 border rounded" />
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="w-full p-2 border rounded" />
                <input type="tel" name="phone" placeholder="Phone Number" onChange={handleChange} required className="w-full p-2 border rounded" />
                <input type="text" name="city" placeholder="City" onChange={handleChange} required className="w-full p-2 border rounded" />
                <textarea name="symptoms" placeholder="Describe your symptoms..." onChange={handleChange} required className="w-full p-2 border rounded" />
                <button type="submit" className="btn-secondary px-4 py-2 rounded">
                  Submit Request
                </button>
              </form>
            )}
            */}

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center">
                <Shield className="w-5 h-5 text-green-700 mr-2" />
                GDPR Compliant
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-green-700 mr-2" />
                Licensed Doctors
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-green-700 mr-2" />
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
      <section className="section-container">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 px-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold title-gradient mb-4 italic">SO FUNKTIONIERT'S</h2>
            <p className="text-lg sm:text-xl subtitle-text max-w-2xl mx-auto inconsolata font-thin">
              Jetzt loslegen und Cannabis auf Rezept blitzschnell erhalten.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 - removed all the fancy hover stuff, was too much */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto icon-container">
                <ListCheck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold title-gradient mb-4 italic">FRAGENBOGEN AUSFULLEN</h3>
              <p className="text-base sm:text-lg subtitle-text inconsolata font-thin px-4">
                Fülle unseren medizinischen Fragebogen aus – easy von der Couch aus.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto icon-container">
                <Hospital className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold title-gradient mb-4 italic">BEHANDLUNG ERHALTEN</h3>
              <p className="text-base sm:text-lg subtitle-text inconsolata font-thin px-4">
                Ein Arzt prüft deine Angaben und stellt dir bei Eignung ein Rezept aus.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto icon-container">
                <LucideBike className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold title-gradient mb-4 italic">EXPRESSLIEFERUNG ERHALTEN</h3>
              <p className="text-base sm:text-lg subtitle-text mb-4 inconsolata font-thin px-4">
                Medikamente in Berlin in max. 90 Min. geliefert oder in 15–30 Min. selbst in der Apotheke abholen.
              </p>
              <div className="text-gray-700 font-semibold italic px-4">Powered by Wolt & Uber →</div>
            </div>
          </div>
        </div>
      </section>

     <section className="py-12 sm:py-16 md:py-24 bg-gradient-to-r-custom section-container">
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center md:items-start text-center md:text-left">
    {/* city descr. on the left */}
    <div className="w-full md:w-1/2 mt-8 md:mt-0 md:pr-12 flex flex-col justify-center">
    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 md:mb-8 italic bg-gradient-to-r from-green-600 to-purple-600 bg-clip-text text-transparent">
      TO YOUR DOOR? IN MINUTES. </h2>
    <p className="text-sm sm:text-base subtitle-text mb-6">BERLIN in können deine Medikamente in 30-90 minuten geliefert werden, In folgenden Städten ansonsten per DHL in 1-3 Tagen 
    </p>

    
    <div className="mt-6 text-base sm:text-lg subtitle-text">
        {cities.map(city => (
                <div key={city.name} className="mb-4 city-dropdown-wrapper">
                  <button
                  className="w-full text-left text-lg sm:text-xl md:text-2xl tracking-widest bg-gradient-to-r from-green-900 to-purple-800 bg-clip-text text-transparent py-2 px-2 sm:px-4 flex items-center justify-between hover:opacity-80 transition-all duration-200 group cursor-pointer"
                  onClick={() => setOpenCity(openCity === city.name ? null : city.name)}
                  >
                    <span className="italic font-bold">{city.name}</span>
                    <ChevronDown className={`w-5 h-5 text-gray-700 transition-transform duration-300 ${openCity === city.name ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openCity === city.name ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <div className="bg-white border border-emerald-200 rounded p-3 sm:p-4 mt-2 subtitle-text whitespace-pre-line text-sm sm:text-base city-dropdown-content">
                      {city.explanation}
                    </div>
                  </div>
                </div>
        ))}
      </div>
    </div>
    {/* Map on the right, half width */}
    <div className="w-full md:w-1/2 flex gap-x-6 mt-6 md:mt-0">
      <img
        src="/berlinmap.png"
        alt="Berlin Service Zones"
        className="w-full max-w-sm sm:max-w-md rounded-2xl shadow-xl border border-emerald-200"
      />
    </div>
  </div>
</section>

      {/* Bottom CTA section */}
      <section className="py-12 sm:py-16 md:py-24 section-container">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 title-gradient">
            Ready to Transform Your<br className="hidden sm:block" />Medical Cannabis Experience?
          </h2>
          <p className="text-lg sm:text-xl subtitle-text mb-8 sm:mb-12 max-w-2xl mx-auto">
            Join thousands of patients who've found better care, faster relief, and a supportive community with reLeafZ.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center subtitle-text">
            <Button className="btn-outline px-6 sm:px-10 py-4 sm:py-6 rounded-2xl text-base sm:text-lg font-bold">
              Start Your Journey Today
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              className="btn-outline px-6 sm:px-10 py-4 sm:py-6 rounded-2xl text-base sm:text-lg font-bold"
            >
              Speak with Luna
            </Button>
          </div>

          <p className="subtitle-text text-xs sm:text-sm mt-6 sm:mt-8 px-4">
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
              <p className="text-gray-400 mb-4 subtitle-text">
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