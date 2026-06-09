'use client'

import React from 'react'
import { Truck, Store, Check, Info } from 'lucide-react'
import { getStrainType, getStrainImage } from '@/lib/strains'
import './market-carousel.css'

const THC_ICON = '/placholder-market-thc.png'
const CBD_ICON = '/placholder-market-cbd.png'

export type Fulfillment = 'delivery' | 'pickup' | 'both'

export type ProductStrainCardData = {
  name: string
  thc: number
  cbd: number
  price: number
  pharmacy: { name: string; city?: string }
  fulfillment: Fulfillment
  image?: string
}

export type ProductStrainCardProps = {
  strain: ProductStrainCardData
  /** Blur product image (landing showcase teaser). */
  blurImage?: boolean
  className?: string
  mediaOverlay?: React.ReactNode
  footer?: React.ReactNode
  onImageError?: () => void
}

function getThcLevel(thc: number): 1 | 2 | 3 {
  if (thc >= 22) return 3
  if (thc >= 15) return 2
  return 1
}

function getDominant(thc: number, cbd: number): 'thc' | 'cbd' {
  return cbd > thc ? 'cbd' : 'thc'
}

export function fulfillmentFromDeliveryMethod(
  method: 'BOTENDIENST_NEARBY' | 'BOTENDIENST_FAR' | 'PICKUP' | null | undefined
): Fulfillment {
  if (method === 'PICKUP') return 'pickup'
  if (method === 'BOTENDIENST_NEARBY' || method === 'BOTENDIENST_FAR') return 'delivery'
  return 'both'
}

export function ProductStrainCard({
  strain,
  blurImage = false,
  className,
  mediaOverlay,
  footer,
  onImageError,
}: ProductStrainCardProps): React.JSX.Element {
  const strainInfo = getStrainType(strain.name)
  const thcLevel = getThcLevel(strain.thc)
  const dominant = getDominant(strain.thc, strain.cbd)
  const dominantIcon = dominant === 'cbd' ? CBD_ICON : THC_ICON
  const dominantLabel = dominant === 'cbd' ? 'CBD-dominant' : 'THC-dominant'
  const imageSrc = getStrainImage(strain.name, strain.image)

  return (
    <article className={['mc-prod', className].filter(Boolean).join(' ')}>
      <div className="mc-prod__media">
        {mediaOverlay}
        <span className={`mc-prod__tag mc-prod__tag--${strainInfo.variant}`}>
          {strainInfo.type}
        </span>
        <img
          src={imageSrc}
          alt="reLeafz Cannabis Blüte"
          className={`mc-prod__img${blurImage ? ' mc-prod__img--blur' : ''}`}
          loading="lazy"
          decoding="async"
          onError={onImageError}
        />
        {blurImage && <span className="mc-prod__media-veil" aria-hidden />}
      </div>

      <div className="mc-prod__body">
        <div className="mc-prod__headline">
          <h3 className="mc-prod__name">{strain.name}</h3>
          <span className="mc-prod__potency" title={`THC-Gehalt: ${strain.thc}%`}>
            <span className="mc-prod__bars" aria-hidden>
              <i className={thcLevel >= 1 ? 'is-on' : ''} />
              <i className={thcLevel >= 2 ? 'is-on' : ''} />
              <i className={thcLevel >= 3 ? 'is-on' : ''} />
            </span>
            <span className="mc-prod__potency-label">THC</span>
          </span>
        </div>

        <p className="mc-prod__brand">{strain.pharmacy.name}</p>

        <div className="mc-prod__cannabinoid">
          <img
            src={dominantIcon}
            alt={dominantLabel}
            className="mc-prod__cb-icon"
            loading="lazy"
            decoding="async"
          />
          <span className="mc-prod__cb-sep" aria-hidden>
            |
          </span>
          <span className="mc-prod__cb-text">{dominantLabel}</span>
        </div>

        <span className="mc-prod__values">
          THC {strain.thc}% · CBD {strain.cbd}%
        </span>

        <div className="mc-prod__price-row">
          <span className="mc-prod__price">€{strain.price.toFixed(2)}</span>
          <span className="mc-prod__price-unit">/ g</span>
        </div>

        <div className="mc-prod__fulfill">
          {(strain.fulfillment === 'delivery' || strain.fulfillment === 'both') && (
            <div className="mc-prod__fulfill-item">
              <div className="mc-prod__fulfill-head">
                <span className="mc-prod__fulfill-check" aria-hidden>
                  <Check />
                </span>
                <span className="mc-prod__fulfill-label">Lieferung verfügbar</span>
                <span className="mc-prod__fulfill-info" tabIndex={0}>
                  <Info aria-hidden />
                  <span className="mc-prod__tooltip" role="tooltip">
                    Diskreter Versand per DHL — deutschlandweit in 1–3 Werktagen.
                  </span>
                </span>
              </div>
              <div className="mc-prod__fulfill-mode">
                <span className="mc-prod__fulfill-mode-icon" aria-hidden>
                  <Truck />
                </span>
                <span className="mc-prod__fulfill-mode-text">Versand nach Hause</span>
              </div>
            </div>
          )}

          {strain.fulfillment === 'both' && <div className="mc-prod__fulfill-divider" />}

          {(strain.fulfillment === 'pickup' || strain.fulfillment === 'both') && (
            <div className="mc-prod__fulfill-item">
              <div className="mc-prod__fulfill-head">
                <span className="mc-prod__fulfill-check" aria-hidden>
                  <Check />
                </span>
                <span className="mc-prod__fulfill-label">Abholung möglich</span>
                <span className="mc-prod__fulfill-info" tabIndex={0}>
                  <Info aria-hidden />
                  <span className="mc-prod__tooltip" role="tooltip">
                    Persönliche Abholung in der Partnerapotheke {strain.pharmacy.name}
                    {strain.pharmacy.city ? `, ${strain.pharmacy.city}` : ''}.
                  </span>
                </span>
              </div>
              <div className="mc-prod__fulfill-mode">
                <span className="mc-prod__fulfill-mode-icon" aria-hidden>
                  <Store />
                </span>
                <span className="mc-prod__fulfill-mode-text">In der Apotheke</span>
              </div>
            </div>
          )}
        </div>

        {footer}
      </div>
    </article>
  )
}
