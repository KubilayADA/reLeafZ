'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, ArrowDown, ListCheck, MousePointer, ZapIcon, Sparkles, Brain, Users, Shield, Clock, MapPin, ChevronRight, ChevronDown, Star, BikeIcon, LucideBike, Hospital, HospitalIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import MashallahForm from '@/form/mashallah'
import words from '@/constants/index'
import Header from './header'
import CookieBanner from '@/components/ui/cookie'
import '@/components/ui/Hero/Words-Sliding-Smooth.css' 
import ComingSoon from '@/components/ComingSoon'
import How from '@/components/ui/funktioniert/how'
import { API_BASE } from '@/lib/api'
import { APIProvider, useMapsLibrary } from '@vis.gl/react-google-maps'

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
            <div className="text-xs text-gray-600">Weedo found the perfect strain for your sleep schedule</div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface AddressAutocompleteProps {
  onAddressSelect: (address: string, plz: string, street: string, houseNumber: string, city: string) => void
  onInputChange: (value: string) => void
}

function AddressAutocomplete({ onAddressSelect, onInputChange }: AddressAutocompleteProps) {
  const [inputValue, setInputValue] = useState('')
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const placesLib = useMapsLibrary('places')
  const autocompleteService = React.useRef<google.maps.places.AutocompleteService | null>(null)
  const geocoderRef = React.useRef<google.maps.Geocoder | null>(null)
  const debounceTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!placesLib) return
    autocompleteService.current = new placesLib.AutocompleteService()
    geocoderRef.current = new google.maps.Geocoder()
  }, [placesLib])

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = () => setShowSuggestions(false)
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const handleInput = (value: string) => {
    // Sanitize input — strip HTML tags and limit length
    const sanitized = value.replace(/<[^>]*>/g, '').slice(0, 200)
    setInputValue(sanitized)
    onInputChange(sanitized)
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    if (!autocompleteService.current || sanitized.length < 3) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }
    debounceTimer.current = setTimeout(() => {
      setIsLoading(true)
      autocompleteService.current!.getPlacePredictions(
        {
          input: sanitized,
          componentRestrictions: { country: 'de' },
          types: ['address'],
        },
        (predictions, status) => {
          setIsLoading(false)
          if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
            setSuggestions(predictions.slice(0, 5))
            setShowSuggestions(true)
          } else {
            setSuggestions([])
          }
        }
      )
    }, 300)
  }

  const handleSelect = (prediction: google.maps.places.AutocompletePrediction) => {
    const safeDescription = prediction.description.replace(/<[^>]*>/g, '').slice(0, 300)
    setInputValue(safeDescription)
    onInputChange(safeDescription)
    setShowSuggestions(false)
    setSuggestions([])
    if (!geocoderRef.current) return
    geocoderRef.current.geocode({ placeId: prediction.place_id }, (results, status) => {
      if (status !== google.maps.GeocoderStatus.OK || !results || results.length === 0) return
      const result = results[0]
      const components = result.address_components
      const get = (type: string) => components.find(c => c.types.includes(type))?.long_name ?? ''
      const getShort = (type: string) => components.find(c => c.types.includes(type))?.short_name ?? ''
      const plz = getShort('postal_code')
      const street = get('route')
      const houseNumber = get('street_number')
      const city = get('locality') || get('administrative_area_level_1') || ''
      // Still call callback even if no PLZ found for street-only results
      // so fields populate and user sees what's missing
      // Only block if PLZ exists but is clearly invalid (not a partial result)
      // Street-only results may return partial PLZ like '13' — still populate fields
      const validPlz = /^\d{5}$/.test(plz) ? plz : ''
      onAddressSelect(safeDescription, validPlz, street, houseNumber, city)
    })
  }

  return (
    <div className="relative w-full" onClick={(e) => e.stopPropagation()}>
      <input
        type="text"
        placeholder="Straße, Hausnummer, Stadt"
        value={inputValue}
        onChange={(e) => handleInput(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg inconsolata text-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
        autoComplete="off"
        maxLength={200}
        aria-label="Adresse eingeben"
        aria-autocomplete="list"
        aria-expanded={showSuggestions}
      />
      {isLoading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs inconsolata">
          Suche...
        </div>
      )}
      {showSuggestions && suggestions.length > 0 && (
        <ul
          role="listbox"
          className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((s) => (
            <li
              key={s.place_id}
              role="option"
              aria-selected={false}
              onClick={() => handleSelect(s)}
              className="px-4 py-3 cursor-pointer hover:bg-gray-50 inconsolata text-sm border-b border-gray-100 last:border-0"
            >
              {s.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function LandingPage() {
  const router = useRouter()
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
  const [selectedAddress, setSelectedAddress] = useState('')
  const [selectedPlz, setSelectedPlz] = useState('')
  const [streetName, setStreetName] = useState('')
  const [houseNumber, setHouseNumber] = useState('')
  const [cityName, setCityName] = useState('')
  const [addressInputValue, setAddressInputValue] = useState('')
  const [isPreview, setIsPreview] = useState(false)

  useEffect(() => {
    const cookie = document.cookie
      .split('; ')
      .find(r => r.startsWith('preview_token='))
      ?.split('=')[1]
    setIsPreview(!!cookie)
  }, [])

  useEffect(() => {
    if (!houseNumber || !streetName || !cityName) return
    if (!window.google?.maps?.Geocoder) return

    const timer = setTimeout(() => {
      const geocoder = new window.google.maps.Geocoder()
      const fullAddress = `${streetName} ${houseNumber}, ${cityName}, Germany`
      geocoder.geocode({ address: fullAddress }, (results, status) => {
        if (status !== window.google.maps.GeocoderStatus.OK || !results || results.length === 0) return
        const plzComponent = results[0].address_components.find(
          (c: google.maps.GeocoderAddressComponent) => c.types.includes('postal_code')
        )
        const newPlz = plzComponent?.short_name ?? ''
        if (/^\d{5}$/.test(newPlz)) {
          setSelectedPlz(newPlz)
        }
      })
    }, 500)

    return () => clearTimeout(timer)
  }, [houseNumber, streetName, cityName])

  if (COMING_SOON_MODE && !isPreview) return <ComingSoon />;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Berlin postcode validation (10115-14199)
  const isValidBerlinPostcode = (postcode: string): boolean => {
    if (!/^\d{5}$/.test(postcode)) return false
    const zip = parseInt(postcode, 10)
    return zip >= 10000 && zip <= 14999
  }
  
  const handlePostcodeSubmit = () => {
    if (!selectedPlz || !isValidBerlinPostcode(selectedPlz)) return
    const safeAddress = selectedAddress.replace(/<[^>]*>/g, '').slice(0, 300)
    const safePlz = selectedPlz.replace(/\D/g, '').slice(0, 5)
    const safeStreet = streetName.replace(/<[^>]*>/g, '').slice(0, 100)
    const safeHouseNumber = houseNumber.replace(/<[^>]*>/g, '').slice(0, 20)
    const safeCity = cityName.replace(/<[^>]*>/g, '').slice(0, 100)
    setFormData(prev => ({ ...prev, zip: safePlz }))
    setDialogOpen(false)
    router.push(`/form?postcode=${safePlz}&address=${encodeURIComponent(safeAddress)}&street=${encodeURIComponent(safeStreet)}&houseNumber=${encodeURIComponent(safeHouseNumber)}&city=${encodeURIComponent(safeCity)}`)
  }
  
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
  
  // Show form if valid Berlin postcode was entered
  if (showForm) {
    return (
      <MashallahForm
        postcode={zipInput}
        street={streetName}
        houseNumber={houseNumber}
        city={cityName}
        onBack={handleBackToMain}
      />
    )
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
      />

      {/* Main hero area */}
      <section className="hero-section relative pt-20 pb-32 overflow-hidden"
      
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
                    className="behandlung-button-hero px-8 py-3 flex items-center justify-center min-w-64 w-auto"
                  >
                    BEHANDLUNG ANFRAGEN
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="inconsolata text-xl font-bold">
                      Ihre Adresse eingeben
                    </DialogTitle>
                    <DialogDescription className="inconsolata text-gray-600">
                      Bitte geben Sie Ihre Adresse ein, damit wir die nächste Apotheke für Sie finden können.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4 space-y-3">
                    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''}>
                      <AddressAutocomplete
                        onInputChange={(val) => setAddressInputValue(val)}
                        onAddressSelect={(address, plz, street, houseNumber, city) => {
                          setSelectedAddress(address)
                          setSelectedPlz(plz)
                          setStreetName(street)
                          setHouseNumber(houseNumber)
                          setCityName(city)
                        }}
                      />
                    </APIProvider>

                    {selectedAddress && !selectedPlz && (
                      <p className="text-sm text-gray-500 inconsolata">
                        Bitte wählen Sie eine vollständige Adresse mit Hausnummer.
                      </p>
                    )}

                    {addressInputValue.length > 2 && (
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={streetName}
                          onChange={(e) => setStreetName(e.target.value.replace(/<[^>]*>/g, '').slice(0, 100))}
                          placeholder="Straße"
                          className="col-span-2 p-2.5 border border-gray-300 rounded-lg inconsolata text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        />
                        <input
                          type="text"
                          value={houseNumber}
                          onChange={(e) => setHouseNumber(e.target.value.replace(/<[^>]*>/g, '').slice(0, 20))}
                          placeholder="Nr."
                          className={`p-2.5 border rounded-lg inconsolata text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${
                            selectedPlz && !houseNumber
                              ? 'border-red-400 bg-red-50'
                              : 'border-gray-300'
                          }`}
                        />
                      </div>
                    )}

                    {addressInputValue.length > 2 && (
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={selectedPlz}
                          readOnly
                          placeholder="PLZ"
                          className="p-2.5 border border-gray-200 rounded-lg inconsolata text-sm bg-gray-50 text-gray-600 outline-none"
                        />
                        <input
                          type="text"
                          value={cityName}
                          onChange={(e) => setCityName(e.target.value.replace(/<[^>]*>/g, '').slice(0, 100))}
                          placeholder="Stadt"
                          className="p-2.5 border border-gray-300 rounded-lg inconsolata text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        />
                      </div>
                    )}

                    {selectedPlz && !isValidBerlinPostcode(selectedPlz) && (
                      <p className="text-sm text-red-500 inconsolata">
                        Wir sind derzeit nicht in Ihrer Region verfügbar. Aktuell liefern wir in Berlin.
                      </p>
                    )}
                    {selectedPlz && isValidBerlinPostcode(selectedPlz) && (
                      <p className="text-sm text-emerald-600 inconsolata">
                        ✓ Adresse erkannt — {streetName} {houseNumber}, {selectedPlz} {cityName}
                      </p>
                    )}
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={handlePostcodeSubmit}
                      disabled={!selectedPlz || !isValidBerlinPostcode(selectedPlz) || !houseNumber}
                      className={`w-full inconsolata text-white font-medium py-3 ${
                        !selectedPlz || !isValidBerlinPostcode(selectedPlz) || !houseNumber
                          ? 'opacity-50 cursor-not-allowed bg-gray-400'
                          : 'animated-button'
                      }`}
                    >
                      Weiter
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <button
                type="button"
                onClick={() => router.push('/verify-prescription')}
                className="inconsolata px-8 py-3 flex items-center justify-center min-w-64 w-auto box-border text-[14px] leading-[24px] font-[550] bg-transparent text-black border-[1.1px] border-black shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] transition-all hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] hover:-translate-y-px active:translate-y-0 active:shadow-[0_2px_4px_-1px_rgba(0,0,0,0.1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-black/25 focus-visible:ring-offset-2"
              >
                Ich habe ein Rezept
              </button>
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
                <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700">
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
              src="https://maps.google.com/maps?q=Apotheke+in+Berlin&t=&z=11&ie=UTF8&iwloc=&output=embed"
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
                Germany&apos;s fastest, safest, and coolest medical cannabis platform.
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
                <li><a href="/impressum" className="hover:text-white transition-colors">Impressum</a></li>
                <li><a href="/datenschutz" className="hover:text-white transition-colors">Datenschutzerklärung</a></li>
                <li><a href="/agb" className="hover:text-white transition-colors">AGB</a></li>
                <li><a href="/datenschutz" className="hover:text-white transition-colors">DSGVO</a></li>
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