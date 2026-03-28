'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, ArrowDown, ListCheck, MousePointer, ZapIcon, Sparkles, Brain, Users, Shield, Clock, MapPin, ChevronRight, ChevronDown, Star, BikeIcon, LucideBike, Hospital, HospitalIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import MashallahForm from '@/form/mashallah'
import words from '@/constants/index'
import Header from './header/header'
import MobileNavbar from './header/mobile-navbar'
import Hero from './hero'
import CookieBanner from '@/components/ui/cookie'
import '@/components/ui/Hero/Words-Sliding-Smooth.css' 
import ComingSoon from '@/components/ComingSoon'
import How from '@/components/ui/funktioniert/how'
import { API_BASE } from '@/lib/api'

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
      src="/logo1.png"
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

// Fun monkey easter egg - for now I like it lol // had to go sorry boss - for now...
// const FloatingMonkey = () => {
//   const [show, setShow] = useState(false)
//   const [mounted, setMounted] = useState(false)

//   useEffect(() => {
//     setMounted(true)
//     setShow(true)
//     const timer = setInterval(() => setShow(prev => !prev), 8000)
//     return () => clearInterval(timer)
//   }, [])

//   if (!mounted || !show) return null

//   return (
//     <div className="fixed bottom-8 right-8 z-40 transition-opacity duration-1000">
//       <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-emerald-200 max-w-xs">
//         <div className="flex items-center space-x-4">
//           <div className="text-4xl transform rotate-12">🐒💨</div>
//           <div className="flex-1">
//             <div className="text-sm font-semibold text-emerald-700 mb-1">Feeling Relaxed?</div>
//             <div className="text-xs text-gray-600">Weedo found the perfect strain for your sleep schedule</div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

export default function LandingPage() {
  const router = useRouter()
  const [testimonialIdx, setTestimonialIdx] = useState(0)
  const [openCity, setOpenCity] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [showHeader, setShowHeader] = useState(false)
  const [inHeroView, setInHeroView] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isLeavingMain, setIsLeavingMain] = useState(false)
  const navigatingRef = useRef(false)
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

  // Show coming soon page if flag is true
  if (COMING_SOON_MODE) {
    return <ComingSoon />;
  }
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
      if (process.env.NODE_ENV === 'development') console.error('Error submitting form:', error);
      alert('An error occurred.');
    }
  };
  // --- End zip code state and form state ---
  
  useEffect(() => {
    if (window.location.hash === '#ablauf') {
      setInHeroView(false);
    }

    const handlePopState = () => {
      setInHeroView(window.location.hash !== '#ablauf');
      window.scrollTo({ top: 0 });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const checkHeaderVisibility = () => {
      const hero = document.querySelector('.hero-section') as HTMLElement | null
      if (hero) {
        setShowHeader(hero.getBoundingClientRect().bottom <= 0)
      } else {
        setShowHeader(true)
      }
    }
    checkHeaderVisibility()
    window.addEventListener('scroll', checkHeaderVisibility, { passive: true })
    return () => window.removeEventListener('scroll', checkHeaderVisibility)
  }, []);

  // Scroll / swipe to switch between Hero and main view
  useEffect(() => {
    const goToMain = () => {
      if (navigatingRef.current || !inHeroView || isTransitioning) return;
      navigatingRef.current = true;
      document.body.style.overflow = 'hidden';
      setIsTransitioning(true);
      window.history.pushState({}, '', '/#ablauf');
      window.requestAnimationFrame(() => window.scrollTo({ top: 0 }));
      setTimeout(() => {
        setInHeroView(false);
        setIsTransitioning(false);
        document.body.style.overflow = '';
        setShowHeader(true);
        window.dispatchEvent(new Event('scroll'));
        navigatingRef.current = false;
      }, 750);
    };

    const goToHero = () => {
      if (navigatingRef.current || inHeroView) return;
      navigatingRef.current = true;
      document.body.style.overflow = 'hidden';
      setIsLeavingMain(true);
      window.history.replaceState(null, '', '/');
      window.scrollTo({ top: 0 });
      setTimeout(() => {
        setInHeroView(true);
        setIsLeavingMain(false);
        setShowHeader(false);
        document.body.style.overflow = '';
        navigatingRef.current = false;
      }, 750);
    };

    const handleWheel = (e: WheelEvent) => {
      if (inHeroView && e.deltaY > 30) {
        goToMain();
      } else if (!inHeroView && e.deltaY < -30 && window.scrollY === 0) {
        goToHero();
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      const dy = touchStartY - e.changedTouches[0].clientY;
      if (inHeroView && dy > 50) {
        goToMain();
      } else if (!inHeroView && dy < -50 && window.scrollY === 0) {
        goToHero();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [inHeroView, isTransitioning]);

  // Show form if valid Berlin postcode was entered
  if (showForm) {
    return <MashallahForm postcode={zipInput} onBack={handleBackToMain} />
  }
  
  return (
    <>
      <CookieBanner />
      <div className="min-h-screen bg-beige inconsolata" style={inconsolataStyle}>
      {/* Header */}
      <Header 
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        zipInput={zipInput}
        setZipInput={setZipInput}
        handlePostcodeSubmit={handlePostcodeSubmit}
        isValidBerlinPostcode={isValidBerlinPostcode}
        isVisible={showHeader}
        onLogoClick={() => {
          if (navigatingRef.current || inHeroView) return;
          navigatingRef.current = true;
          document.body.style.overflow = 'hidden';
          setIsLeavingMain(true);
          window.history.replaceState(null, '', '/');
          window.scrollTo({ top: 0 });
          setTimeout(() => {
            setInHeroView(true);
            setIsLeavingMain(false);
            setShowHeader(false);
            document.body.style.overflow = '';
            navigatingRef.current = false;
          }, 750);
        }}
      />
      <MobileNavbar
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        zipInput={zipInput}
        setZipInput={setZipInput}
        handlePostcodeSubmit={handlePostcodeSubmit}
        isValidBerlinPostcode={isValidBerlinPostcode}
      />

      {(inHeroView || isTransitioning || isLeavingMain) && (
        <Hero
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          zipInput={zipInput}
          setZipInput={setZipInput}
          handlePostcodeSubmit={handlePostcodeSubmit}
          isValidBerlinPostcode={isValidBerlinPostcode}
          onEnterMain={() => {
            document.body.style.overflow = 'hidden';
            setIsTransitioning(true);
            window.history.pushState({}, '', '/#ablauf');
            window.requestAnimationFrame(() => {
              window.scrollTo({ top: 0 });
            });
            setTimeout(() => {
              setInHeroView(false);
              setIsTransitioning(false);
              document.body.style.overflow = '';
              setShowHeader(true);
              window.dispatchEvent(new Event('scroll'));
            }, 750);
          }}
        />
      )}

      {(!inHeroView || isTransitioning || isLeavingMain) && (
        <div className={
          isTransitioning ? 'main-view-enter main-view-transitioning' :
          isLeavingMain   ? 'main-view-exit main-view-transitioning' :
          ''
        }>
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
                <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700">
                  Submit Request
                </button>
              </form>
            )}
            */}

      {/* How to order — right under hero //let's structure this file like this g?*/}
      <How />

      {/* Partner-Apotheken map */}
      <section id="partner-apotheken" className="section-container">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 px-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold title-gradient mb-4 italic">FINDEN SIE UNSERE PARTNER-APOTHEKEN</h2>
            <p className="text-lg sm:text-xl subtitle-text max-w-3xl mx-auto inconsolata font-thin">
            Schneller als Ihre Hausschuhe zu finden – einfach klicken, abholen, fertig!
            </p>
          </div>

          <div className="w-full rounded-2xl overflow-hidden shadow-lg" style={{ height: '500px' }}>
            <iframe
              src="https://www.openstreetmap.org/export/embed.html?bbox=13.2,52.45,13.6,52.58&layer=mapnik&marker=52.52,13.405"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* Vorteile / city delivery section — commented out, replaced by How (how to order) under hero
     <section id="vorteile" className="py-12 sm:py-16 md:py-24 bg-gradient-to-r-custom section-container">
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center md:items-start text-center md:text-left">
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
    <div className="w-full md:w-1/2 flex gap-x-6 mt-6 md:mt-0">
      <img
        src="/berlinmap.png"
        alt="Berlin Service Zones"
        className="w-full max-w-sm sm:max-w-md rounded-2xl shadow-xl border border-emerald-200"
      />
    </div>
  </div>
</section>
      */}

      {/* Bottom CTA section */}
      <section id="chat" className="py-12 sm:py-16 md:py-24 section-container">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 title-gradient">
            Ready to Transform Your<br className="hidden sm:block" />Medical Cannabis Experience?
          </h2>
          <p className="text-lg sm:text-xl subtitle-text mb-8 sm:mb-12 max-w-2xl mx-auto">
            Join thousands of patients who&apos;ve found better care, faster relief, and a supportive community with reLeafZ.
          </p>
          {/* WEEDO needed to go sorry boss */} 
          {/* <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center subtitle-text">
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
          </div> */}

          <p className="subtitle-text text-xs sm:text-sm mt-6 sm:mt-8 px-4">
            No commitment required • Speak with licensed doctors • GDPR compliant
          </p>
        </div>
      </section>

      {/* Footer stuff */}
      <footer className="bg-gray-900 text-white py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {/* Company info */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center mb-6">
                <img src="/logo2.png" alt="reLeafZ Logo" className="w-32 h-auto object-contain scale-180 -translate-x-[-40px]" />
              </div>
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
                <li><a href="/impressum" className="hover:text-white transition-colors">Impressum</a></li>
                <li><a href="/datenschutz" className="hover:text-white transition-colors">Datenschutzerklärung</a></li>
                <li><a href="/agb" className="hover:text-white transition-colors">AGB</a></li>
                <li><a href="/datenschutz" className="hover:text-white transition-colors">DSGVO</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 md:mt-12 pt-8 text-center text-gray-400">
            <p>© 2026 reLeafZ.<span className="hidden md:inline"> All rights reserved. Licensed medical cannabis platform serving Berlin.</span></p>
          </div>
        </div>
      </footer>

      {/* <FloatingMonkey /> */}
      </div>
      )}
      </div>
    </>
  )
}