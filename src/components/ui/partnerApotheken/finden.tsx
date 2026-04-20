'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import '@/app/main.css'
import './finden.css'

type Particle = {
  id: number
  size: number
  left: number
  top: number
  duration: number
  delay: number
}

type Pharmacy = {
  id: string
  name: string
  address: string
  hours: string
  mapsUrl: string
  x: number
  y: number
}

const PHARMACIES: Pharmacy[] = [
  {
    id: 'apotheke-1',
    name: 'Partner Apotheke Mitte',
    address: 'Invalidenstr. 100, 10115 Berlin',
    hours: 'Mo-Sa, 08:00-20:00',
    mapsUrl: 'https://maps.google.com/?q=52.5321,13.3849',
    x: 22,
    y: 30,
  },
  {
    id: 'apotheke-2',
    name: 'Partner Apotheke Kreuzberg',
    address: 'Oranienstr. 55, 10969 Berlin',
    hours: 'Mo-Fr, 09:00-19:30',
    mapsUrl: 'https://maps.google.com/?q=52.5037,13.4182',
    x: 38,
    y: 56,
  },
  {
    id: 'apotheke-3',
    name: 'Partner Apotheke Prenzlauer Berg',
    address: 'Schonhauser Allee 88, 10439 Berlin',
    hours: 'Mo-Sa, 08:30-20:00',
    mapsUrl: 'https://maps.google.com/?q=52.5484,13.4127',
    x: 48,
    y: 25,
  },
  {
    id: 'apotheke-4',
    name: 'Partner Apotheke Friedrichshain',
    address: 'Warschauer Str. 22, 10243 Berlin',
    hours: 'Mo-Fr, 08:00-19:00',
    mapsUrl: 'https://maps.google.com/?q=52.5077,13.4508',
    x: 62,
    y: 46,
  },
  {
    id: 'apotheke-5',
    name: 'Partner Apotheke Charlottenburg',
    address: 'Kantstr. 120, 10625 Berlin',
    hours: 'Mo-Sa, 09:00-20:00',
    mapsUrl: 'https://maps.google.com/?q=52.5073,13.3049',
    x: 74,
    y: 65,
  },
]

const PartnerApotheken = () => {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [particles, setParticles] = useState<Particle[]>([])
  const [isInView, setIsInView] = useState(false)
  const [visibleCount, setVisibleCount] = useState(0)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [mobileCardPharmacy, setMobileCardPharmacy] = useState<Pharmacy | null>(null)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    setParticles(
      Array.from({ length: 6 }, (_, i) => ({
        id: i,
        size: Math.random() * 4 + 2,
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: Math.random() * 10 + 10,
        delay: Math.random() * 5,
      }))
    )
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const touchMedia = window.matchMedia('(hover: none), (pointer: coarse)')
    const motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)')

    const updateTouch = () => setIsTouchDevice(touchMedia.matches)
    const updateMotion = () => setPrefersReducedMotion(motionMedia.matches)

    updateTouch()
    updateMotion()

    touchMedia.addEventListener('change', updateTouch)
    motionMedia.addEventListener('change', updateMotion)

    return () => {
      touchMedia.removeEventListener('change', updateTouch)
      motionMedia.removeEventListener('change', updateMotion)
    }
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      entries => {
        const [entry] = entries
        if (!entry) return
        setIsInView(entry.isIntersecting)
        if (!entry.isIntersecting) {
          setSelectedId(null)
        }
      },
      { threshold: 0.35 }
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isInView) return

    if (prefersReducedMotion) {
      setVisibleCount(PHARMACIES.length)
      return
    }

    let index = 0
    const interval = window.setInterval(() => {
      index += 1
      setVisibleCount(index)
      if (index >= PHARMACIES.length) {
        window.clearInterval(interval)
      }
    }, 260)

    return () => window.clearInterval(interval)
  }, [isInView, prefersReducedMotion])

  useEffect(() => {
    if (!selectedId || !isTouchDevice) return

    const handlePointerDownOutside = (event: PointerEvent) => {
      const target = event.target as Node | null
      if (!target) return

      const clickedInsideCard = target instanceof Element && Boolean(target.closest('.partner-apotheken-mobile-card-content'))
      const clickedMarker = target instanceof Element && Boolean(target.closest('.partner-apotheken-marker-trigger'))

      if (clickedInsideCard || clickedMarker) return

      setSelectedId(null)
    }

    document.addEventListener('pointerdown', handlePointerDownOutside)
    return () => document.removeEventListener('pointerdown', handlePointerDownOutside)
  }, [selectedId, isTouchDevice])

  const selectedPharmacy = useMemo(
    () => PHARMACIES.find(pharmacy => pharmacy.id === selectedId) ?? null,
    [selectedId]
  )

  useEffect(() => {
    if (selectedPharmacy) {
      setMobileCardPharmacy(selectedPharmacy)
    }
  }, [selectedPharmacy])

  const handleMarkerClick = (id: string) => {
    if (!isTouchDevice) return
    setSelectedId(previous => (previous === id ? null : id))
  }

  return (
    <section
      ref={sectionRef}
      id="partner-apotheken"
      className="partner-apotheken-section"
      aria-label="Partner Apotheken Karte"
    >
      <div className="partner-apotheken__bg" aria-hidden>
        <div className="partner-apotheken__bg-base" />
        <div className="partner-apotheken__glow-line" />
        <div className="partner-apotheken__glow-radial" />
        <div className="partner-apotheken__grid" />
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="partner-apotheken__particle"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animation: `floatParticle ${particle.duration}s ease-in-out infinite`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="partner-apotheken-inner partner-apotheken__shell">
        <div className="partner-apotheken-heading">
          <p className="partner-apotheken-kicker">Partner-Apotheken</p>
          <h2>Finde deine Apotheke in der Nähe</h2>
          <p className="partner-apotheken-subtitle">
            Sobald du diesen Bereich erreichst, wachsen unsere Partnerpunkte nacheinander ins Netz.
            Fahre mit der Maus uber ein Blatt oder tippe mobil auf einen Marker.
          </p>
        </div>

        <div className="partner-apotheken-map-wrap">
          <img
            className="partner-apotheken-map partner-apotheken-map--dark"
            src="/dark-map.png"
            alt="Berlin Karte mit Partner-Apotheken"
            loading="lazy"
          />
          <img
            className="partner-apotheken-map partner-apotheken-map--light"
            src="/light-map.png"
            alt="Berlin Karte mit Partner-Apotheken"
            loading="lazy"
          />

          <div className="partner-apotheken-grid-overlay" aria-hidden />

          {PHARMACIES.map((pharmacy, index) => {
            const isVisible = visibleCount > index
            return (
              <div
                key={pharmacy.id}
                className={`partner-apotheken-marker ${isVisible ? 'is-visible' : ''} ${
                  selectedId === pharmacy.id ? 'is-selected' : ''
                }`}
                style={
                  {
                    '--x': `${pharmacy.x}%`,
                    '--y': `${pharmacy.y}%`,
                    '--delay': `${index * 140}ms`,
                  } as React.CSSProperties
                }
              >
                <button
                  type="button"
                  className="partner-apotheken-marker-trigger"
                  onClick={() => handleMarkerClick(pharmacy.id)}
                  aria-label={`${pharmacy.name} anzeigen`}
                  aria-expanded={selectedId === pharmacy.id}
                >
                  <img src="/map/leafs.png" alt="" aria-hidden className="partner-apotheken-marker-image" />
                  <span className="partner-apotheken-pulse" aria-hidden />
                </button>
                <span className="partner-apotheken-tooltip" role="tooltip">
                  <strong>{pharmacy.name}</strong>
                  <span>{pharmacy.address}</span>
                  <span>{pharmacy.hours}</span>
                  <a href={pharmacy.mapsUrl} target="_blank" rel="noreferrer">
                    Navigation starten
                  </a>
                </span>
              </div>
            )
          })}

        </div>

        <div className={`partner-apotheken-mobile-card ${selectedPharmacy ? 'is-open' : ''}`} aria-hidden={!selectedPharmacy}>
          <article className="partner-apotheken-mobile-card-content" aria-live="polite">
            <h3>{mobileCardPharmacy?.name ?? ''}</h3>
            <p>{mobileCardPharmacy?.address ?? ''}</p>
            <p>{mobileCardPharmacy?.hours ?? ''}</p>
            {mobileCardPharmacy && (
              <a href={mobileCardPharmacy.mapsUrl} target="_blank" rel="noreferrer">
                Route in Google Maps
              </a>
            )}
          </article>
        </div>
      </div>
    </section>
  )
}

export default PartnerApotheken
