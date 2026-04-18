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
import { useLandingTheme } from '@/lib/use-landing-theme'
import { useLandingThemeInitial } from './providers'
import { APIProvider, useMapsLibrary } from '@vis.gl/react-google-maps'

const COMING_SOON_MODE = false;

const inconsolataStyle = {
  fontFamily: '"Inconsolata", monospace',
  fontWeight: 400,
  lineHeight: '35px',
}

const dialogInputStyle: React.CSSProperties = {
  fontFamily: '"Helvetica Neue", sans-serif',
  borderTop: '2.5px solid #333',
  borderLeft: '2.5px solid #333',
  borderRight: '4px solid #333',
  borderBottom: '4px solid #333',
}

const dialogInputClass =
  'w-full h-10 sm:h-11 p-2.5 rounded-lg text-sm sm:text-base outline-none'

interface AddressAutocompleteProps {
  onAddressSelect: (address: string, plz: string, street: string, houseNumber: string, city: string) => void
  onInputChange: (value: string) => void
  onInputFocus?: () => void
  onInputBlur?: () => void
}

function AddressAutocomplete({ onAddressSelect, onInputChange, onInputFocus, onInputBlur }: AddressAutocompleteProps) {
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
        onFocus={onInputFocus}
        onBlur={onInputBlur}
        className={`${dialogInputClass} border-0`}
        style={dialogInputStyle}
        autoComplete="off"
        maxLength={200}
        aria-label="Adresse eingeben"
        aria-autocomplete="list"
        aria-expanded={showSuggestions}
      />
      {isLoading && (
        <div
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"
          style={{ fontFamily: '"Helvetica Neue", sans-serif' }}
        >
          Suche...
        </div>
      )}
      {showSuggestions && suggestions.length > 0 && (
        <ul
          role="listbox"
          className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-lg max-h-60 overflow-y-auto"
          style={{ fontFamily: '"Helvetica Neue", sans-serif' }}
        >
          {suggestions.map((s) => (
            <li
              key={s.place_id}
              role="option"
              aria-selected={false}
              onClick={() => handleSelect(s)}
              className="px-4 py-3 cursor-pointer hover:bg-gray-50 text-sm border-b border-gray-100 last:border-0"
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
  const [dialogOpen, setDialogOpen] = useState(false)
  const [showHeader, setShowHeader] = useState(false)
  const [dialogFieldFocused, setDialogFieldFocused] = useState(false)
  const initialLandingTheme = useLandingThemeInitial()
  const [landingTheme, setLandingTheme] = useLandingTheme(initialLandingTheme)

  const [selectedAddress, setSelectedAddress] = useState('')
  const [selectedPlz, setSelectedPlz] = useState('')
  const [streetName, setStreetName] = useState('')
  const [houseNumber, setHouseNumber] = useState('')
  const [cityName, setCityName] = useState('')
  const [addressInputValue, setAddressInputValue] = useState('')

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

  if (COMING_SOON_MODE) {
    return <ComingSoon />
  }

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
    setDialogOpen(false)
    router.push(
      `/form?postcode=${safePlz}&address=${encodeURIComponent(safeAddress)}&street=${encodeURIComponent(safeStreet)}&houseNumber=${encodeURIComponent(safeHouseNumber)}&city=${encodeURIComponent(safeCity)}`
    )
  }

  const postcodeSubmitDisabled =
    !selectedPlz || !isValidBerlinPostcode(selectedPlz) || !houseNumber

  const postcodeDialogSection = (
    <div className="py-2 sm:py-3 space-y-3">
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''}>
        <AddressAutocomplete
          onInputFocus={() => setDialogFieldFocused(true)}
          onInputBlur={() => setDialogFieldFocused(false)}
          onInputChange={(val) => setAddressInputValue(val)}
          onAddressSelect={(address, plz, street, hn, city) => {
            setSelectedAddress(address)
            setSelectedPlz(plz)
            setStreetName(street)
            setHouseNumber(hn)
            setCityName(city)
          }}
        />
      </APIProvider>

      {selectedAddress && !selectedPlz && (
        <p
          className="text-xs sm:text-sm text-gray-600"
          style={{ fontFamily: '"Helvetica Neue", sans-serif' }}
        >
          Bitte wählen Sie eine vollständige Adresse mit Hausnummer.
        </p>
      )}

      {addressInputValue.length > 2 && (
        <div className="grid grid-cols-3 gap-2">
          <input
            type="text"
            value={streetName}
            onChange={(e) => setStreetName(e.target.value.replace(/<[^>]*>/g, '').slice(0, 100))}
            onFocus={() => setDialogFieldFocused(true)}
            onBlur={() => setDialogFieldFocused(false)}
            placeholder="Straße"
            className={`col-span-2 ${dialogInputClass}`}
            style={dialogInputStyle}
          />
          <input
            type="text"
            value={houseNumber}
            onChange={(e) => setHouseNumber(e.target.value.replace(/<[^>]*>/g, '').slice(0, 20))}
            onFocus={() => setDialogFieldFocused(true)}
            onBlur={() => setDialogFieldFocused(false)}
            placeholder="Nr."
            className={`${dialogInputClass} ${selectedPlz && !houseNumber ? 'bg-red-50' : ''}`}
            style={dialogInputStyle}
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
            className={`${dialogInputClass} bg-gray-50 text-gray-600`}
            style={dialogInputStyle}
          />
          <input
            type="text"
            value={cityName}
            onChange={(e) => setCityName(e.target.value.replace(/<[^>]*>/g, '').slice(0, 100))}
            onFocus={() => setDialogFieldFocused(true)}
            onBlur={() => setDialogFieldFocused(false)}
            placeholder="Stadt"
            className={dialogInputClass}
            style={dialogInputStyle}
          />
        </div>
      )}

      {selectedPlz && !isValidBerlinPostcode(selectedPlz) && (
        <p
          className="text-xs sm:text-sm text-red-600"
          style={{ fontFamily: '"Helvetica Neue", sans-serif' }}
        >
          Wir sind derzeit nicht in Ihrer Region verfügbar. Aktuell liefern wir in Berlin.
        </p>
      )}
      {selectedPlz && isValidBerlinPostcode(selectedPlz) && (
        <p
          className="text-xs sm:text-sm text-emerald-700"
          style={{ fontFamily: '"Helvetica Neue", sans-serif' }}
        >
          ✓ Adresse erkannt — {streetName} {houseNumber}, {selectedPlz} {cityName}
        </p>
      )}
    </div>
  )

  return (
    <>
      <CookieBanner />
      <div className="landing-page landing-snap-scroll min-h-screen bg-beige inconsolata" style={inconsolataStyle}>
        <Header
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          handlePostcodeSubmit={handlePostcodeSubmit}
          postcodeDialogSection={postcodeDialogSection}
          postcodeSubmitDisabled={postcodeSubmitDisabled}
          dialogFieldFocused={dialogFieldFocused}
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
          suppressHydrationWarning
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
