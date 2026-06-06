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
const MAP_ZOOM_START = 11
const PHARMACY_ZOOM = 15

function getMapZoomProgress(mapEl: HTMLElement) {
  const rect = mapEl.getBoundingClientRect()
  const vh = window.innerHeight
  const startY = vh * 0.9
  const endY = vh * 0.35
  return Math.min(1, Math.max(0, (startY - rect.top) / (startY - endY)))
}

function MapScrollZoom({ progress }: { progress: number }) {
  const map = useMap()

  useEffect(() => {
    if (!map) return

    const zoom = MAP_ZOOM_START + (PHARMACY_ZOOM - MAP_ZOOM_START) * progress
    map.setCenter({ lat: PHARMACY.lat, lng: PHARMACY.lng })
    map.setZoom(zoom)
  }, [map, progress])

  return null
}

function AsavitaStory({ pharmacy }: { pharmacy: Pharmacy }) {
  return (
    <article className="partner-apotheken-story">
      <header className="partner-apotheken-story-header">
        <p className="partner-apotheken-story-kicker">Unsere Partnerapotheke</p>
        <h3 className="partner-apotheken-story-title">{pharmacy.name}</h3>
      </header>

      <p className="partner-apotheken-story-lead">
        Zertifizierte Partnerapotheke in Berlin. Nach deinem Rezept übernimmt {pharmacy.name} diskret
        Lieferung oder Versand — in Berlin und deutschlandweit.
      </p>

      <div className="partner-apotheken-story-points">
        <p>
          <span className="partner-apotheken-story-term">Berlin, 90 Min.</span>
          Lieferung innerhalb von 90 Minuten direkt nach Hause.
        </p>
        <p>
          <span className="partner-apotheken-story-term">Abholung</span>
          Persönlich in der Apotheke, Mo–Fr 10–18 Uhr.
        </p>
        <p>
          <span className="partner-apotheken-story-term">Deutschlandweit</span>
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
        <p>
          <a href={`tel:${pharmacy.phone.replace(/\s/g, '')}`}>{pharmacy.phone}</a>
          <span aria-hidden> · </span>
          <a href={`mailto:${pharmacy.email}`}>{pharmacy.email}</a>
        </p>
        <p className="partner-apotheken-story-links">
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
  zoomProgress,
}: {
  landingTheme: LandingTheme
  zoomProgress: number
}) {
  const colorScheme = landingTheme === 'dark' ? ColorScheme.DARK : ColorScheme.LIGHT

  return (
    <APIProvider apiKey={MAPS_API_KEY} libraries={['marker']}>
      <Map
        mapId={MAP_ID}
        defaultCenter={{ lat: PHARMACY.lat, lng: PHARMACY.lng }}
        defaultZoom={MAP_ZOOM_START}
        colorScheme={colorScheme}
        disableDefaultUI
        clickableIcons={false}
        gestureHandling="cooperative"
        className="partner-apotheken-map"
        style={{ width: '100%', height: '100%' }}
      >
        <MapScrollZoom progress={zoomProgress} />
        <AdvancedMarker position={{ lat: PHARMACY.lat, lng: PHARMACY.lng }} title={PHARMACY.name} />
      </Map>
    </APIProvider>
  )
}

function PartnerApothekenMapMount({
  landingTheme,
  zoomProgress,
}: {
  landingTheme: LandingTheme
  zoomProgress: number
}) {
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <div className="partner-apotheken-map-placeholder" aria-hidden />
  }

  return <PartnerApothekenMap landingTheme={landingTheme} zoomProgress={zoomProgress} />
}

const PartnerApotheken = () => {
  const sectionRef = useRef<HTMLElement | null>(null)
  const mapWrapRef = useRef<HTMLDivElement | null>(null)
  const [isInView, setIsInView] = useState(false)
  const [zoomProgress, setZoomProgress] = useState(0)
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
      setZoomProgress(1)
      return
    }

    let rafId = 0

    const updateZoomProgress = () => {
      const mapEl = mapWrapRef.current
      if (!mapEl) return
      setZoomProgress(getMapZoomProgress(mapEl))
    }

    const onScrollOrResize = () => {
      if (rafId) return
      rafId = window.requestAnimationFrame(() => {
        rafId = 0
        updateZoomProgress()
      })
    }

    updateZoomProgress()
    window.addEventListener('scroll', onScrollOrResize, { passive: true })
    window.addEventListener('resize', onScrollOrResize, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScrollOrResize)
      window.removeEventListener('resize', onScrollOrResize)
      if (rafId) window.cancelAnimationFrame(rafId)
    }
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
        <div className="partner-apotheken-heading">
          <p className="partner-apotheken-kicker partner-apotheken-reveal">Partner-Apotheken</p>
          <h2 className="partner-apotheken-reveal">Finde deine Apotheke in der Nähe</h2>
          <p className="partner-apotheken-subtitle partner-apotheken-reveal">
            Standort auf der Karte — Lieferung, Abholung und Kontakt zu unserer Partnerapotheke in Berlin.
          </p>
        </div>

        <div className="partner-apotheken-layout">
          <div
            ref={mapWrapRef}
            className="partner-apotheken-map-wrap partner-apotheken-reveal partner-apotheken-reveal--from-left"
          >
            <div className="partner-apotheken-google-map" aria-label="Berlin Karte mit Partner-Apotheken">
              {isInView ? (
                <PartnerApothekenMapMount landingTheme={landingTheme} zoomProgress={zoomProgress} />
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
