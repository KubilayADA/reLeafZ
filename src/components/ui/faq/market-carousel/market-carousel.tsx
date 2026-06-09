'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Sprout } from 'lucide-react'
import '@/app/main.css'
import SectionParticlesBackground from '@/components/ui/SectionParticlesBackground'
import { getStrainImage } from '@/lib/strains'
import { API_BASE, type Product } from '@/lib/api'
import {
  ProductStrainCard,
  type Fulfillment,
  type ProductStrainCardData,
} from './product-strain-card'
import './market-carousel.css'

const LANDING_STRAIN_COUNT = 4

// Representative location used to query the live marketplace for the public
// landing showcase (our partner pharmacies operate in Berlin).
const SHOWCASE_CITY = 'Berlin'
const SHOWCASE_ZIP = '10115'

type ShowcaseStrain = ProductStrainCardData & { id: string }

// Shape returned by the live marketplace endpoint (mirrors src/app/marketplace).
type MarketplaceDeliveryOption = {
  method: 'BOTENDIENST_NEARBY' | 'BOTENDIENST_FAR' | 'PICKUP'
  available: boolean
}

type MarketplacePharmacy = {
  pharmacy: { id: number; name: string; zip: string; city: string }
  deliveryOptions: MarketplaceDeliveryOption[]
  products: Product[]
}

// Derive the fulfillment badge from a pharmacy's real delivery options.
function fulfillmentFromOptions(options: MarketplaceDeliveryOption[]): Fulfillment {
  const hasDelivery = options.some((o) => o.available && o.method.startsWith('BOTENDIENST'))
  const hasPickup = options.some((o) => o.available && o.method === 'PICKUP')
  if (hasDelivery && hasPickup) return 'both'
  if (hasPickup) return 'pickup'
  return 'delivery'
}

// Flatten the live marketplace response into showcase cards, keeping the real
// pharmacy name/city and delivery options from the backend.
function marketplaceToStrains(data: MarketplacePharmacy[]): ShowcaseStrain[] {
  const flowers: ShowcaseStrain[] = []
  const others: ShowcaseStrain[] = []

  for (const entry of data) {
    const pharmacy = {
      name: entry.pharmacy.name,
      city: entry.pharmacy.city,
    }
    const fulfillment = fulfillmentFromOptions(entry.deliveryOptions)

    for (const product of entry.products) {
      if (product.stock <= 0) continue
      const strain: ShowcaseStrain = {
        id: String(product.id),
        name: product.name,
        thc: product.thcPercent,
        cbd: product.cbdPercent,
        price: product.price,
        pharmacy,
        fulfillment,
        image: getStrainImage(product.name, product.imageUrl),
      }
      if (product.form === 'FLOWER') flowers.push(strain)
      else others.push(strain)
    }
  }

  return flowers.length > 0 ? flowers : others
}

function CarouselNavIcon({ direction }: { direction: 'prev' | 'next' }) {
  return (
    <svg className="market-carousel__nav-icon" viewBox="0 0 16 16" fill="none" aria-hidden>
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
  )
}

const SHOWCASE_STRAINS: ShowcaseStrain[] = [
  {
    id: 'white-widow',
    name: 'White Widow',
    thc: 22,
    cbd: 1,
    price: 9.9,
    pharmacy: { name: 'Partnerapotheke', city: 'Berlin' },
    fulfillment: 'both',
    image: '/strains/white-widow-cheese.jpg',
  },
  {
    id: 'lemon-skunk',
    name: 'Lemon Skunk',
    thc: 18,
    cbd: 1,
    price: 8.4,
    pharmacy: { name: 'Partnerapotheke', city: 'Berlin' },
    fulfillment: 'delivery',
    image: '/strains/medical-saints-lemon-skunk.jpg',
  },
  {
    id: 'mac-driver',
    name: 'Mac Driver',
    thc: 24,
    cbd: 0.5,
    price: 10.5,
    pharmacy: { name: 'Partnerapotheke', city: 'Berlin' },
    fulfillment: 'both',
    image: '/strains/mac-driver.webp',
  },
  {
    id: 'slurricane',
    name: 'Slurricane',
    thc: 26,
    cbd: 0.5,
    price: 11.2,
    pharmacy: { name: 'Partnerapotheke', city: 'Berlin' },
    fulfillment: 'pickup',
    image: '/strains/slurricane.webp',
  },
  {
    id: 'black-cherry-punch',
    name: 'Black Cherry Punch',
    thc: 20,
    cbd: 1,
    price: 9.5,
    pharmacy: { name: 'Partnerapotheke', city: 'Berlin' },
    fulfillment: 'delivery',
    image: '/strains/black-cherry-punch.webp',
  },
  {
    id: 'granddaddy-og',
    name: 'Granddaddy OG',
    thc: 23,
    cbd: 0.5,
    price: 10.8,
    pharmacy: { name: 'Partnerapotheke', city: 'Berlin' },
    fulfillment: 'both',
    image: '/strains/madrecan-granddaddy-og.webp',
  },
  {
    id: 'mint-chocolate',
    name: 'Mint Chocolate',
    thc: 19,
    cbd: 1,
    price: 9.8,
    pharmacy: { name: 'Partnerapotheke', city: 'Berlin' },
    fulfillment: 'pickup',
    image: '/strains/organic-sweetgrass-mint-chocolate.webp',
  },
  {
    id: 'space-rider',
    name: 'Space Rider',
    thc: 25,
    cbd: 0.5,
    price: 11.5,
    pharmacy: { name: 'Partnerapotheke', city: 'Berlin' },
    fulfillment: 'both',
    image: '/strains/zoiks-space-rider.webp',
  },
]

function BoutiqueCtaCard({ onRequest }: { onRequest: () => void }) {
  return (
    <div className="market-carousel__card mc-cta">
      <div className="mc-cta__content">
        <span className="mc-cta__icon" aria-hidden>
          <Sprout />
        </span>
        <h3 className="mc-cta__title">Entdecke das volle Sortiment</h3>
        <p className="mc-cta__text">
          Stelle deine Behandlungsanfrage und erhalte Zugang zur kompletten Boutique.
        </p>
        <button type="button" className="mc-cta__btn" onClick={onRequest}>
          Jetzt anfragen &rarr;
        </button>
      </div>
    </div>
  )
}

export default function MarketCarousel({
  setDialogOpen,
}: {
  setDialogOpen?: (open: boolean) => void
} = {}): React.JSX.Element {
  const trackRef = useRef<HTMLDivElement | null>(null)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(true)
  const [strains, setStrains] = useState<ShowcaseStrain[]>(SHOWCASE_STRAINS)

  useEffect(() => {
    let active = true
    // Pull live products straight from the marketplace backend so the showcase
    // reflects the real pharmacies, their products and delivery options.
    // TODO: swap for a dedicated best-sellers endpoint once available.
    const url = `${API_BASE}/api/marketplace?city=${encodeURIComponent(
      SHOWCASE_CITY
    )}&patientZip=${encodeURIComponent(SHOWCASE_ZIP)}`
    fetch(url, { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('Marketplace request failed'))))
      .then((json: { data?: MarketplacePharmacy[] }) => {
        if (!active) return
        const mapped = marketplaceToStrains(json.data ?? [])
        if (mapped.length === 0) return
        setStrains(mapped)
      })
      .catch(() => {
        // Keep the fallback showcase strains if the backend is unavailable.
      })
    return () => {
      active = false
    }
  }, [])

  const getScrollStep = useCallback(() => {
    const track = trackRef.current
    if (!track) return 0
    const slide = track.querySelector<HTMLElement>('.market-carousel__slide')
    if (!slide) return 0
    const gap = parseFloat(getComputedStyle(track).gap) || 16
    return slide.offsetWidth + gap
  }, [])

  const updateScrollState = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const { scrollLeft, scrollWidth, clientWidth } = track
    setCanScrollPrev(scrollLeft > 4)
    setCanScrollNext(scrollLeft + clientWidth < scrollWidth - 4)
  }, [])

  const scrollByCard = useCallback(
    (direction: 'prev' | 'next') => {
      const track = trackRef.current
      if (!track) return

      const distance = getScrollStep()
      if (!distance) return

      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const maxScroll = track.scrollWidth - track.clientWidth

      if (direction === 'next' && track.scrollLeft >= maxScroll - 4) {
        track.scrollTo({ left: 0, behavior: prefersReduced ? 'auto' : 'smooth' })
        return
      }

      if (direction === 'prev' && track.scrollLeft <= 4) {
        track.scrollTo({ left: maxScroll, behavior: prefersReduced ? 'auto' : 'smooth' })
        return
      }

      track.scrollBy({
        left: direction === 'next' ? distance : -distance,
        behavior: prefersReduced ? 'auto' : 'smooth',
      })
    },
    [getScrollStep]
  )

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    updateScrollState()
    track.addEventListener('scroll', updateScrollState, { passive: true })
    window.addEventListener('resize', updateScrollState)

    return () => {
      track.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
    }
  }, [updateScrollState, strains])

  return (
    <section
      id="sortiment"
      className="market-carousel-section"
      aria-label="Medizinisches Cannabis Sortiment"
    >
      <div className="market-carousel__bg" aria-hidden>
        <div className="market-carousel__bg-base" />
        <SectionParticlesBackground className="market-carousel__particles" />
        <div className="market-carousel__glow-radial" />
        <div className="market-carousel__grid" />
      </div>

      <div className="market-carousel__shell">
        <div className="market-carousel__intro">
          <span className="market-carousel__pill">Unser Sortiment</span>
          <h2 className="market-carousel__title">Blüten aus unserer Partnerapotheke</h2>
          <p className="market-carousel__subtitle">
            Ausgewählte medizinische Cannabis-Sorten — verfügbar über unsere Partnerapotheke in
            Berlin.
          </p>
        </div>

        <div className="market-carousel__controls">
          <button
            type="button"
            className="market-carousel__nav-btn"
            aria-label="Vorherige Sorte"
            onClick={() => scrollByCard('prev')}
            disabled={!canScrollPrev}
          >
            <CarouselNavIcon direction="prev" />
          </button>
          <button
            type="button"
            className="market-carousel__nav-btn"
            aria-label="Nächste Sorte"
            onClick={() => scrollByCard('next')}
            disabled={!canScrollNext}
          >
            <CarouselNavIcon direction="next" />
          </button>
        </div>

        <div className="market-carousel__viewport">
          <div
            ref={trackRef}
            className="market-carousel__track"
            role="list"
            aria-label="Cannabis Sorten Karussell"
          >
            {strains.slice(0, LANDING_STRAIN_COUNT).map((strain) => (
              <div key={strain.id} className="market-carousel__slide" role="listitem">
                <div className="market-carousel__card">
                  <ProductStrainCard strain={strain} blurImage />
                </div>
              </div>
            ))}
            <div className="market-carousel__slide" role="listitem">
              <BoutiqueCtaCard onRequest={() => setDialogOpen?.(true)} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
