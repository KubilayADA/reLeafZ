'use client'

import React, { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { APIProvider, AdvancedMarker, Map, ColorScheme, useMap } from '@vis.gl/react-google-maps'
import '@/app/main.css'
import './finden.css'
import SectionParticlesBackground from '@/components/ui/SectionParticlesBackground'
import {
  getLandingThemeClientSnapshot,
  subscribeLandingTheme,
  type LandingTheme,
} from '@/lib/landing-theme'

type Pharmacy = {
  id: string
  name: string
  address: string
  hours: string
  phone: string
  email: string
  website: string
  mapsUrl: string
  lat: number
  lng: number
}

const PHARMACY: Pharmacy = {
  id: 'asavita',
  name: 'Asavita',
  address: 'Frankfurter Allee 241, 10365 Berlin',
  hours: 'Mo–Fr, 10:00–18:00',
  phone: '030 58758499',
  email: 'rezept@asavita.de',
  website: 'https://asavita.de/',
  mapsUrl: 'https://maps.google.com/?q=Frankfurter+Allee+241,+10365+Berlin',
  lat: 52.5148,
  lng: 13.4733,
}

const MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID ?? 'DEMO_MAP_ID'
const MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''
const PHARMACY_ZOOM = 15
const MAP_REVEAL_DELAY_MS = 1000

function MapContainerFit({
  containerRef,
  isReady,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>
  isReady: boolean
}) {
  const map = useMap()

  useEffect(() => {
    const container = containerRef.current
    if (!map || !container || !isReady) return

    const fitMap = () => {
      window.google?.maps.event.trigger(map, 'resize')
      map.setCenter({ lat: PHARMACY.lat, lng: PHARMACY.lng })
      map.setZoom(PHARMACY_ZOOM)
    }

    fitMap()

    const observer = new ResizeObserver(() => {
      window.requestAnimationFrame(fitMap)
    })
    observer.observe(container)

    const delayedFit = window.setTimeout(fitMap, 400)
    const delayedFitLate = window.setTimeout(fitMap, 1100)

    return () => {
      observer.disconnect()
      window.clearTimeout(delayedFit)
      window.clearTimeout(delayedFitLate)
    }
  }, [map, containerRef, isReady])

  return null
}

function StoryNavButton({
  direction,
  label,
  disabled = true,
  onClick,
}: {
  direction: 'prev' | 'next'
  label: string
  disabled?: boolean
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      className="partner-apotheken-story-nav-btn"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
    >
      <svg
        className="partner-apotheken-story-nav-icon"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden
      >
        {direction === 'prev' ? (
          <path
            d="M10 3L5 8l5 5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M6 3l5 5-5 5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </button>
  )
}

function AsavitaStory({ pharmacy }: { pharmacy: Pharmacy }) {
  return (
    <article className="partner-apotheken-story">
      <div className="partner-apotheken-story-nav" aria-label="Apotheke wechseln">
        <StoryNavButton direction="prev" label="Vorherige Apotheke" />
        <StoryNavButton direction="next" label="Nächste Apotheke" />
      </div>

      <header className="partner-apotheken-story-header">
        <h3 className="partner-apotheken-story-title">{pharmacy.name}</h3>
      </header>

      <p className="partner-apotheken-story-lead">
        Zertifizierte Partnerapotheke in Berlin. Nach deinem Rezept übernimmt {pharmacy.name} diskret
        Lieferung oder Versand — in Berlin und deutschlandweit.
      </p>

      <div className="partner-apotheken-story-points">
        <p>
          <span className="partner-apotheken-story-term">Berlin, 90 Min.</span>
          {' — '}
          Lieferung innerhalb von 90 Minuten direkt nach Hause.
        </p>
        <p>
          <span className="partner-apotheken-story-term">Abholung</span>
          {' — '}
          Persönlich in der Apotheke, Mo–Fr 10–18 Uhr.
        </p>
        <p>
          <span className="partner-apotheken-story-term">Deutschlandweit</span>
          {' — '}
          Versand per DHL, sicher und diskret in 1–3 Werktagen.
        </p>
      </div>

      <p className="partner-apotheken-story-note">
        Dein Rezept geht direkt von uns an {pharmacy.name}. Du musst nichts weiter tun.
      </p>

      <footer className="partner-apotheken-story-meta">
        <p>
          {pharmacy.address}
          <span aria-hidden> · </span>
          {pharmacy.hours}
        </p>
        <p className="partner-apotheken-story-meta-line">
          <a href={`tel:${pharmacy.phone.replace(/\s/g, '')}`}>{pharmacy.phone}</a>
          <span aria-hidden> · </span>
          <a href={`mailto:${pharmacy.email}`}>{pharmacy.email}</a>
          <span aria-hidden> · </span>
          <a href={pharmacy.website} target="_blank" rel="noreferrer">
            asavita.de
          </a>
          <span aria-hidden> · </span>
          <a href={pharmacy.mapsUrl} target="_blank" rel="noreferrer">
            Navigation
          </a>
        </p>
      </footer>
    </article>
  )
}

function PartnerApothekenMap({
  landingTheme,
  containerRef,
  isReady,
  showMarker,
}: {
  landingTheme: LandingTheme
  containerRef: React.RefObject<HTMLDivElement | null>
  isReady: boolean
  showMarker: boolean
}) {
  const colorScheme = landingTheme === 'dark' ? ColorScheme.DARK : ColorScheme.LIGHT

  return (
    <Map
      mapId={MAP_ID}
      defaultCenter={{ lat: PHARMACY.lat, lng: PHARMACY.lng }}
      defaultZoom={PHARMACY_ZOOM}
      colorScheme={colorScheme}
      disableDefaultUI
      clickableIcons={false}
      gestureHandling="cooperative"
      className="partner-apotheken-map"
      style={{ width: '100%', height: '100%' }}
    >
      <MapContainerFit containerRef={containerRef} isReady={isReady} />
      {showMarker ? (
        <AdvancedMarker position={{ lat: PHARMACY.lat, lng: PHARMACY.lng }} title={PHARMACY.name} />
      ) : null}
    </Map>
  )
}

function PartnerApothekenMapMount({
  landingTheme,
  containerRef,
  isReady,
  showMarker,
}: {
  landingTheme: LandingTheme
  containerRef: React.RefObject<HTMLDivElement | null>
  isReady: boolean
  showMarker: boolean
}) {
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <div className="partner-apotheken-map-placeholder" aria-hidden />
  }

  return (
    <div className="partner-apotheken-map-slot">
      <APIProvider apiKey={MAPS_API_KEY} libraries={['marker']}>
        <PartnerApothekenMap
          landingTheme={landingTheme}
          containerRef={containerRef}
          isReady={isReady}
          showMarker={showMarker}
        />
      </APIProvider>
    </div>
  )
}

const PartnerApotheken = () => {
  const sectionRef = useRef<HTMLElement | null>(null)
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const [isInView, setIsInView] = useState(false)
  const [mapRevealed, setMapRevealed] = useState(false)
  const landingTheme = useSyncExternalStore(
    subscribeLandingTheme,
    getLandingThemeClientSnapshot,
    () => 'light' as LandingTheme
  )

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (motionMedia.matches) {
      setIsInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setIsInView(true)
        observer.disconnect()
      },
      { threshold: 0.2, rootMargin: '0px 0px -6% 0px' }
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isInView) return

    const motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (motionMedia.matches) {
      setMapRevealed(true)
      return
    }

    const revealTimer = window.setTimeout(() => setMapRevealed(true), MAP_REVEAL_DELAY_MS)
    return () => window.clearTimeout(revealTimer)
  }, [isInView])

  return (
    <section
      ref={sectionRef}
      id="partner-apotheken"
      className={`partner-apotheken-section${isInView ? ' is-in-view' : ''}`}
      aria-label="Partner Apotheken Karte"
    >
      <div className="partner-apotheken__bg" aria-hidden>
        <div className="partner-apotheken__bg-base" />
        <SectionParticlesBackground className="partner-apotheken__particles" />
        <div className="partner-apotheken__glow-radial" />
        <div className="partner-apotheken__grid" />
      </div>

      <div className="partner-apotheken-inner partner-apotheken__shell">
        <div className="partner-apotheken-intro-row">
          <span className="partner-apotheken-story-pill partner-apotheken-reveal">
            Unsere Partnerapotheke
          </span>
          <h2 className="partner-apotheken-title partner-apotheken-reveal">
            <span className="partner-apotheken-title-line">Deine Apotheke.</span>
            <span className="partner-apotheken-title-line">Überall in Deutschland.</span>
          </h2>
        </div>

        <div className="partner-apotheken-layout">
          <div
            className={`partner-apotheken-map-wrap partner-apotheken-reveal partner-apotheken-reveal--from-left${mapRevealed ? ' is-map-revealed' : ''}`}
          >
            <div
              ref={mapContainerRef}
              className="partner-apotheken-google-map"
              aria-label="Berlin Karte mit Partner-Apotheken"
            >
              {isInView ? (
                <PartnerApothekenMapMount
                  landingTheme={landingTheme}
                  containerRef={mapContainerRef}
                  isReady={isInView}
                  showMarker={mapRevealed}
                />
              ) : (
                <div className="partner-apotheken-map-placeholder" aria-hidden />
              )}
            </div>
          </div>

          <div className="partner-apotheken-info-wrap partner-apotheken-reveal partner-apotheken-reveal--from-right">
            <AsavitaStory pharmacy={PHARMACY} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default PartnerApotheken
